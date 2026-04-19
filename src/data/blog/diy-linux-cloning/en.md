---
title: "Cloning Linux by Hand"
slug: "diy-linux-cloning"
date: 2022-09-12
description: "How to clone Debian Linux by hand, without third-party tools: dd, partprobe, sgdisk, e2fsck, resize2fs, and a bit of Go — for when you wake up stranded on a desert island."
lang: "en"
tags: ["Linux", "Debian", "sysadmin", "backup", "tutorial"]
---

*(Picture: a seasoned sysadmin digging through a file server in search of a four-year-old backup.)*

Here's the setup. Vasya was flying on an airplane. The engine failed and the plane crashed on a deserted island. Vasya was the only survivor. After going through what was left of the luggage, he realized he had a few laptops and a Wi-Fi router. To survive, Vasya decided to spin up a data center. For the data center to work properly, he needs to be able to clone Debian Linux. But there are no cloning tools at hand. Even his old Clone Zilla disc has gone missing somewhere. What is Vasya supposed to do?

Alright, let's start with a few requirements that weren't spelled out in the first paragraph.

We have Debian Linux installed on a QEMU virtual machine, in EFI mode, with a disk attached over LVM. What we want to do is produce a clone of this machine and "stretch" the existing filesystem so it occupies the entire disk space on the new drive.

We'll be working two ways at once. We'll be writing a cloning utility in Go, but in practice that utility will mostly just be calling fairly standard Linux commands. The idea is to automate the process as much as we can. So the reader can either run the commands by hand or write a script that runs them for you.

### Off We Go

*(Picture: junior developers spinning up their first pod in Kubernetes.)*

To start with, let's install Debian Linux on QEMU and attach an LVM disk. Configure Debian itself however your heart desires.

The first stage is to get the original copy of the disk. There are two ways to do this. The first: open a file in Go and just copy the disk into that file with `io.Copy`.

```go
dst, err := os.OpenFile(path, os.O_WRONLY, os.ModeDevice)
if err != nil {
    return err
}
defer dst.Close()

src, err := os.Open(filepath.Join(path, name+".img"))
if err != nil {
    return err
}
defer src.Close()

bw, err := io.Copy(src, dst)
if err != nil {
    return err
}
dst.Close()
src.Close()
```

The second way is much simpler — we can use the most advanced cloning utility in the world: `dd`.

```bash
dd if=/dev/sda of=~/image.img bs=32M
```

Either way, you've now got exactly what the doctor ordered for Vasya — a bit-for-bit clone of the hard drive.

### Restoring

To restore the data, run all the same instructions, just swap the source disk and the file.

Once the clone is ready, we can move on to restoring the system. Honestly, at this point we could just boot whatever we have and it would work. But here's the catch: the new hard drive is bigger than the original one. So we want to do a little wizardry. The first incantation is:

```bash
partprobe
```

Surprisingly, if you clone 5 gigabytes of a hard drive onto an NVMe, running `partprobe` will take longer than the cloning itself. In any case, you've just told your system to scan the existing drives and refresh the configuration of all the system utilities.

At this point, you have two completely identical hard drives in your system. The system can be started, but it won't actually work.

### Fixing EFI with a Lightsaber Strike from Shoulder to…

The first problem is EFI. Here I could use some help from the community, because there might be a better solution. To boot the system, Debian creates two partitions on our hard drive. The first one is small, for the EFI bootloader; the second one is larger, for the system itself.

The thing is, Debian saves its bootloader at `/EFI/debian/shim64.efi`, while QEMU looks for the bootloader at `/EFI/BOOT/BOOTx64.efi`.

There are two options. The first is to reconfigure EFI to look for the file in the right place; the second is to just copy the file to the place EFI expects. I'm still searching for a clean solution down the first path, so I'll suggest the second one.

In that case, let's first figure out what our partitions on the disk are called. And here's the catch. We can't predict the partition name on the hard drive. It all depends on the name of the disk itself. If the disk name ends in a letter, the partitions are called `1` and `2`. If it ends in a digit, they're called `p1` and `p2`, and so on. This approach is very unreliable. I need to actually know what the partitions are called. For that we'll use the wonderful `lsblk` utility.

```bash
lsblk /dev/mapper/diskname -blJ
```

In this state you'll get data on how many partitions are on the drive, where and how they're mounted, and what's going on with them. Plus, `J` lets us see the entire output as a beautifully stuffed pile of JSON.

Let's call this utility from Go. First, let's set up a few constants and types.

```go
// LsblkPart data returned by LSBLK
type LsblkPart struct {
    Name        string
    MajMin      string `json:"maj:min"`
    Removable   bool   `json:"rm"`
    Size        uint64
    RO          bool `json:"ro"`
    Type        LsblkType
    Mountpoints []string
}

// list of all types that lsblk can return. Taken from lsblk source code
type LsblkType string

const (
    LsblkTypePart      = LsblkType("part")
    LsblkTypeLvm       = LsblkType("lvm")
    LsblkTypeCrypt     = LsblkType("crypt")
    LsblkTypeDmRaid    = LsblkType("dmraid")
    LsblkTypeMPath     = LsblkType("mpath")
    LsblkTypePath      = LsblkType("path")
    LsblkTypeDm        = LsblkType("dm")
    LsblkTypeLoop      = LsblkType("loop")
    LsblkTypeMd        = LsblkType("md")
    LsblkTypeLinear    = LsblkType("linear")
    LsblkTypeRaid0     = LsblkType("raid0")
    LsblkTypeRaid1     = LsblkType("raid1")
    LsblkTypeRaid4     = LsblkType("raid4")
    LsblkTypeRaid5     = LsblkType("raid5")
    LsblkTypeRaid10    = LsblkType("raid10")
    LsblkTypeMultipath = LsblkType("multipath")
    LsblkTypeDisk      = LsblkType("disk")
    LsblkTypeTape      = LsblkType("tape")
    LsblkTypePrinter   = LsblkType("printer")
    LsblkTypeProcessor = LsblkType("processor")
    LsblkTypeWorm      = LsblkType("worm")
    LsblkTypeRom       = LsblkType("rom")
    LsblkTypeScanner   = LsblkType("scanner")
    LsblkTypeMoDisk    = LsblkType("mo-disk")
    LsblkTypeChanger   = LsblkType("changer")
    LsblkTypeComm      = LsblkType("comm")
    LsblkTypeRaid      = LsblkType("raid")
    LsblkTypeEnclosure = LsblkType("enclosure")
    LsblkTypeRbc       = LsblkType("rbc")
    LsblkTypeOsd       = LsblkType("osd")
    LsblkTypeNoLun     = LsblkType("no-lun")
)
```

After that, let's write a function that returns data about our partitions:

```go
// LsblkPartitions returns a list of partitons on a specified VD
// This would return only information about partitions.
func LsblkPartitions(virtualDiskID string) ([]LsblkPart, error) {
    out, err := ExecCommString("lsblk", Params("/dev/mapper/%v %v", virtualDiskID, "-blJ"))
    if err != nil {
        return nil, fmt.Errorf("can't extract virtual drive partition info. %w", err)
    }

    var p lsbklOutput

    err = json.Unmarshal([]byte(out), &p)
    if err != nil {
        return nil, fmt.Errorf("can't unmarshall lsblk output %w", err)
    }

    var ret []LsblkPart

    for _, p := range p.Blockdevices {
        if p.Type == LsblkTypePart {
            ret = append(ret, p)
        }
    }

    return ret, nil
}
```

A note for the copy-paste crowd: `ExecCommString` is a function that runs a command on the system and returns the response as a string. `Params` is another function whose job is to return the parameters for `ExecCommString`, so feel free to rewrite them yourself.

So, we're now ready to grab data about the partitions on our hard drive from Go. We have a list of partitions and the correct paths to those partitions. Reminder: our disks are on LVM, so we connect to them through `/dev/mapper/storage/`.

Now we can mount the EFI partition by running `mount`.

```go
err = system.ExecCommNoreturn("mount", system.Params("%v %v", "/dev/mapper/"+vdPartDataName, mountPoint))
```

After which, by way of a gigantic amount of Go code, we can copy all the files from `./EFI/debian` to `./EFI/BOOT` and rename `shimx64.efi` to `BOOTx64.efi`.

Well then — our system now boots on vanilla QEMU.

### Doctor Disk-Fixer

*(Picture: a new developer trying to convince the team lead that editing disks through the console in production is, in fact, the height of good taste.)*

Time to fix the disk itself. At this stage, by the way, you can do additional things — for instance, change the hostname, write the right keys, and so on, into the filesystem on the machine.

After that, you can edit the disk.

What's the problem?

The original image of our system was installed on a disk with 5 gigabytes of space. In that case, such an image can be written to almost any hard drive, and then stretched by hand so that the main partition takes up the whole space on the new disk.

Let's edit the new filesystem.

First things first — unmount everything you mounted in the previous section.

To start, let's run `sgdisk`. This wonderful utility tweaks the GPT partition and stretches the entire partition across the whole disk. But this is not the filesystem — this is just the disk layout.

```go
err = system.ExecCommNoreturn("sgdisk", system.Params("-e %v", system.VirtualDiskPath(vdName)))
```

The next command deletes the second partition from the disk:

```go
err = system.ExecCommNoreturn("sgdisk", system.Params("-d 2 %v", system.VirtualDiskPath(vdName)))
```

And after that, we recreate this second partition, but this time we tell it to occupy the entire existing disk.

```go
err = system.ExecCommNoreturn("sgdisk", system.Params("-N 2 %v", system.VirtualDiskPath(vdName)))
```

Good. To continue, we need to run `partprobe` again to make sure Linux noticed that the disk got fatter and heavier.

### Doctor Aibolit, Filesystem Edition

*(Picture: a sysadmin getting his comeuppance after re-partitioning the database disk.)*

Alright — the disk itself is now laid out properly. All that's left is to deal with the filesystem and "stretch" it across the remaining space on the disk.

Now let's run `e2fsck`.

```go
err = system.ExecCommNoreturn("e2fsck", system.Params("-f -y /dev/mapper/%v", vdPartDataName))
```

Just in case, we'll check whether we had any filesystem issues. From my experience, I've never once seen any problems at this stage, and you can easily skip it. Although, naturally, skipping it is not recommended.

And finally, we can stretch the filesystem itself so it matches the size of the new partition on the disk.

```go
err = system.ExecCommNoreturn("resize2fs", system.Params("/dev/mapper/%v", vdPartDataName))
```

### And That's All!

*(Picture: a sysadmin who managed to recover a damaged disk full of user files.)*

Thank goodness, everything's in order! Vasya can now stitch these snippets together into a proper program and will be able to automatically clone the disks on his laptops. The data center can be brought up, and it'll run fast and reliably. In the next article, we'll talk about ways to actually power a data center on a deserted island.

And to all my readers — I recommend printing this guide out on a piece of paper, so that if you find yourself stranded on a deserted island, you can calmly clone disks with your bare hands.
