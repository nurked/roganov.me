---
title: "Is Everyone Lying? More Adventures in Tormenting NVMe"
slug: "nvme-over-network-part-1"
date: 2022-01-10
description: "NVMe is more than just a fast disk — it's a protocol. Here's how to expose an NVMe drive over the network through plain TCP, using nothing but your stock Linux kernel."
lang: "en"
tags: ["NVMe", "Linux", "sysadmin", "networking"]
series: "nvme-over-network"
seriesOrder: 1
---

While my colleagues wrestle with the joys of server-grade NVMe RAID arrays, I decided to come at the problem from a different angle. NVMe, after all, isn't just a hard drive — it's three or four protocols for moving data around in a hurry.

For most of us, "NVMe" means we just bought a new computer or ultrabook. A drive plugged straight into the PCIe bus cuts latency dramatically and makes everything snappier. NVMe is the secret to a system that boots in three seconds.

But NVMe by itself isn't actually a hard drive standard. NVMe stands for NVM Express. NVM, in turn, is Non-volatile memory. So first and foremost, it's a protocol specification for efficiently accessing data stored in non-volatile memory.

And as we all know, protocols can run over different transports. In this article we're going to torment my Ubuntu Linux 21 laptop by hooking its drive up to various servers. You may sneer that this is a toy exercise, but any decent admin with a switch capable of more than 10 Gb/s should take note. You can get remote access to your NVMe drives over plain TCP/IP — no tricks, no skullduggery.

Off we go.

### A quick intro

Let's start with a tiny bit of homework. There's a 2013 publication that explains what the NVMe protocol is and why it exists. It's actually readable — only five pages of text. The other manuals on nvmexpress.org are less merciful: you'll be slogging through 500-page tomes. Dive in if English doesn't scare you.

For those who can't be bothered, here are the core ideas of the protocol:

- Up to 64K I/O command queues, each holding up to 64K instructions.
- All the information needed to read a 4 KB block fits inside a single 64-bit command. That means random reads of small blocks can be extremely fast.
- Namespace support.
- Support for SR-IOV (Single Root I/O Virtualization) — a technology that virtualizes I/O devices.

These things matter a lot in modern systems, where life without virtualization is barely a thing anymore.

So, let's actually use the NVMe protocol. There's exactly one tutorial out there about how to attach these drives over the network — and unfortunately, every copy you'll find is a copy-paste of the same document. Aside from a couple of errors, it doesn't really tell you anything actionable about getting an NVMe disk to work over the network. So let's start from scratch.

### Preparing the system

First you'll need a fresh kernel. Debian 11 and Ubuntu 21.10 support NVMe out of the box. You may run into trouble on CentOS.

If you happen to have Gentoo in your hands, or you're going to build the kernel yourself, turn on the following flags:

```
CONFIG_NVME_TCP=m
CONFIG_NVME_TARGET_TCP=m
```

Next, install `nvme-cli` to actually manage the drives. There's a more detailed guide at `nvmexpress.org/open-source-nvme-management-utility-nvme-command-line-interface-nvme-cli`.

```bash
apt install nvme-cli
```

Now you can load the kernel modules. The client side needs the `nvme` module — on my laptop it's permanently loaded because that's what runs the local NVMe drive. To "share" an NVMe drive you'll need two more modules:

```bash
modprobe nvmet
modprobe nvmet-tcp
```

### The network stack

`nvmet` stands for nvme-transport. It's the transport-layer driver. Drivers exist for several transports: Loop for moving data within a single host, and TCP and Fabrics for moving it across the network. Fabrics is meant for Fibre Channel setups and isn't particularly accessible for small businesses. Luckily for us, we have TCP.

A small disclaimer: the protocol doesn't actually use TCP/IP sockets to move data. Take a look at the famous diagram floating around the Oracle site. When the connection runs over the TCP/IP stack, the controller does the data transfer directly. The port you bind your device to is essentially handed over to the driver, and once the connection is established you don't have to worry about anything getting in the way of 6 Gb/s. You bypass the Socket API entirely for the actual data path.

Alright, drivers are loaded.

### Subsystems

Onward. You can configure things either through `nvme-cli` or by creating and modifying files under `/sys/kernel/config/`. Let's go the file route.

First we need to create a subsystem. The documentation describes a subsystem as a set of all information of what controller, port, namespace and device to use for a connection.

So we head into:

```bash
cd /sys/kernel/config/nvmet/subsystems
```

And create a folder named after our subsystem. The name is arbitrary, but you'll have to use it on both client and server, so don't get too creative.

```bash
mkdir test
```

Once inside the new directory, we can look around. At this stage there's one file we care about — `attr_allow_any_host`.

```bash
cat attr_allow_any_host
#0
```

By default, nobody can connect to your subsystem unless they're in `allowed_hosts` (see the directory). To keep life simple, you can just allow connections from any host:

```bash
echo -n 1 > attr_allow_any_host
```

(Heads up: the configuration parser is very picky, and stray newlines can break things. Don't forget the `-n` flag on every `echo` command.)

### Namespaces

Now we drop into the `namespaces` directory and start creating namespaces.

```bash
mkdir 1
```

That gets you namespace #1.

Unlike subsystems, namespaces are named by number. Step inside and look around:

```bash
ls -lah
total 0
-rw-r--r-- 1 root root 4.0K Jan   3 09:31 ana_grpid
-rw-r--r-- 1 root root 4.0K Jan   3 09:31 buffered_io
-rw-r--r-- 1 root root 4.0K Jan   3 09:31 device_nguid
-rw-r--r-- 1 root root 4.0K Jan   2 17:36 device_path
-rw-r--r-- 1 root root 4.0K Jan   3 09:31 device_uuid
-rw-r--r-- 1 root root 4.0K Jan   2 17:36 enable
--w------- 1 root root 4.0K Jan   3 09:31 revalidate_size
```

These are the knobs for tuning a particular namespace.

Let's pause for a second and look at the disk on my laptop:

```bash
ls /dev/nvme* -lah
crw------- 1 root root 238, 0 Jan   2 17:31 /dev/nvme0
brw-rw---- 1 root disk 259, 0 Jan   2 17:31 /dev/nvme0n1
brw-rw---- 1 root disk 259, 1 Jan   2 17:31 /dev/nvme0n1p1
brw-rw---- 1 root disk 259, 2 Jan   2 17:31 /dev/nvme0n1p2
brw-rw---- 1 root disk 259, 3 Jan   2 17:31 /dev/nvme0n1p3
brw-rw---- 1 root disk 259, 4 Jan   2 17:31 /dev/nvme0n1p4
brw-rw---- 1 root disk 259, 5 Jan   2 17:31 /dev/nvme0n1p5
brw-rw---- 1 root disk 259, 6 Jan   2 17:31 /dev/nvme0n1p6
```

Ever notice that NVMe devices look nothing like the usual `sda`, `sdb` block devices? There are way too many digits in those `nvme` names.

The first number is the device — the disk itself. That's the subsystem.

The second number (`n`) is the namespace. On my laptop, every partition lives under one namespace.

The third number (`p`) is the familiar partition.

OK, naming sorted. Back to our namespace settings. You point a namespace at one or more disks by writing them into `device_path`:

```bash
echo -n /dev/nvme0 > device_path
```

Now try enabling the namespace:

```bash
echo -n 1 > enabled
```

Either everything will come up, or nothing will. The only way to find out is to comb the logs:

```bash
dmesg | grep nvmet
```

That's also where you'll see the real error messages, if any.

```
[   845.255544] nvmet: creating controller 1 for subsystem c413bb88-69e7-4d38-8d4c
[   912.892151] nvmet: adding nsid 2 to subsystem c413bb88-69e7-4d38-8d4c-081bce31
[   950.873917] nvmet: creating controller 1 for subsystem c413bb88-69e7-4d38-8d4c
[ 1323.410291] nvmet: adding nsid 3 to subsystem c413bb88-69e7-4d38-8d4c-081bce31
```

I created three different namespaces here. (I used a GUID for the subsystem name, so don't worry about that long `c4…` — it's just part of the subsystem name.)

### Ports

Looking good so far. Now we configure a port and attach our subsystem to it. Back to `/sys/kernel/config/nvmet/`, into `ports`.

As usual, create a new port by making a directory. Ports are numbered starting from 1, so you can't give them names.

```bash
mkdir 1
```

Then look around:

```bash
ls -lah
total 0
-rw-r--r-- 1 root root 4.0K Jan     2 17:38 addr_adrfam
-rw-r--r-- 1 root root 4.0K Jan     2 17:37 addr_traddr
-rw-r--r-- 1 root root 4.0K Jan     3 10:07 addr_treq
-rw-r--r-- 1 root root 4.0K Jan     2 17:37 addr_trsvcid
-rw-r--r-- 1 root root 4.0K Jan     2 17:41 addr_trtype
drwxr-xr-x 3 root root      0 Jan   2 17:36 ana_groups
-rw-r--r-- 1 root root 4.0K Jan     3 10:07 param_inline_data_size
-rw-r--r-- 1 root root 4.0K Jan     3 10:07 param_pi_enable
drwxr-xr-x 2 root root      0 Jan   2 17:36 referrals
drwxr-xr-x 2 root root     0 Jan   2 17:45 subsystems
```

Configuration works the same way as for subsystems. With `echo`, push the following parameters into files:

- `addr_traddr` — the address to bind on.
- `addr_trsvcid` — the port to bind to. Usually 4420.
- `addr_trtype` — the protocol type. In our case, `tcp`.
- `addr_adrfam` — the address family. `ipv4`.

Now that we have a configured port, it's time to wire our subsystem up to it. From the port's settings directory, go into `subsystems` and create a symlink to the subsystem we made earlier.

```bash
ln -s ../../../subsystems/test .
```

(The nice part is that the system won't let you do anything destructive here. You can't create a bogus link and toast a drive that way. Just make sure you understand `ln`'s syntax and create the link in the right directory.)

In my case it ends up looking like this:

```bash
ls -lah
lrwxrwxrwx 1 root root 0 Jan   2 17:45 c413bb88-69e7-4d38-8d4c-081bce31ca47 -> ../
```

OK, good. Let's confirm everything's up. In `dmesg` you'll see something like:

```
[   570.105916] nvmet_tcp: enabling port 1 (10.10.1.42:4420)
```

If it's not working, the error will tell you why — go fix the config files. The errors are usually obvious. Wrong protocol type, wrong address.

### The client

(Don't forget `modprobe nvme` and `modprobe nvme-tcp` on the client, or drop them into `/etc/modules`.)

All that's left is to connect to the drive from the client. The client, by the way, is running Debian 11. I didn't tweak anything on it — the only thing I did was install `nvme-cli`.

Run:

```bash
nvme connect -t tcp -n test -a 10.10.1.42 -s 4420
```

And check the drives the system sees:

```bash
nvme list
Node              SN                    Model                                  Na
---------------- -------------------- ---------------------------------------- --
/dev/nvme0n1      76b9b4aeef600ece      Linux                                  1
```

OK, it works. The client sees the drive. Run:

```bash
ls /dev/nvme* -lah
crw------- 1 root root 238, 0 Jan    2 17:31 /dev/nvme0
brw-rw---- 1 root disk 259, 0 Jan    2 17:31 /dev/nvme0n1
brw-rw---- 1 root disk 259, 1 Jan    2 17:31 /dev/nvme0n1p1
brw-rw---- 1 root disk 259, 2 Jan    2 17:31 /dev/nvme0n1p2
brw-rw---- 1 root disk 259, 3 Jan    2 17:31 /dev/nvme0n1p3
brw-rw---- 1 root disk 259, 4 Jan    2 17:31 /dev/nvme0n1p4
brw-rw---- 1 root disk 259, 5 Jan    2 17:31 /dev/nvme0n1p5
brw-rw---- 1 root disk 259, 6 Jan    2 17:31 /dev/nvme0n1p6
```

And — like magic! — the entire drive has just "moved" to the client.

### Watch yourself!

This is where I made my first mistake. The sixth partition on my laptop was mounted as the root filesystem of my Linux. I decided to risk it and mount it as a filesystem on the client.

You know what? It worked!

No problems. `mount` did its thing happily and I had access to the filesystem.

I checked the disk's throughput and got a real 20 MB/s. Not bad, considering this was all happening over Wi-Fi.

After that, my laptop started misbehaving. Everything was great fun until I looked at the root filesystem on my own device and discovered it had been thoughtfully remounted read-only.

Trying to unmount it on the remote host got me nowhere. `Device busy`, end of story. Trying to remount on the local host failed too, and I had to reboot. Well — I had to start rebooting, because finishing the reboot didn't work either; the system refused to come up.

After a bit of `fsck`, I got everything back. I decided not to torture my main disk's filesystem any further.

The takeaways:

- Disk utilities like `fdisk`, `gparted`, and `lvm` are perfectly fine to use across both hosts at once. You can create a new partition on the remote host, or even write a brand new partition table to it. That's all legitimate. The key is not to mount those partitions.
- Mounting an `ext4` partition on two hosts at once creates a great many problems.
- If you actually want to mount the same filesystem on multiple hosts at once, you'll need a clustered filesystem.

OK, having figured out what I could and couldn't do, I dug into more testing.

That's when I stumbled onto a strange property of NVMET. Messing around with the only disk on my main computer felt joyless, and I had nothing else suitable lying around — so I grabbed a 32 GB flash drive, sliced it into ten partitions, and started experimenting.

As far as the system is concerned, this is fine — you can use NVMe to expose any kind of storage device. The catch is that NVMe is built for NVM devices, and good old spinning disks aren't NVM. It's a bit like using an oil tanker to ship a single suitcase. Technically, you're correct.

I went back into my namespace settings and added various partitions of the flash drive as namespaces in the NVMe config… and it all worked!

Since I wasn't trying to mount filesystems on two hosts at once, nothing terrible happened.

Here's an example of what came out of it.

On the "server":

```bash
lsblk
sdb                  8:16    1   29.3G   0 disk
├─sdb1               8:17    1   1.9G    0 part
├─sdb2               8:18    1   1.9G    0 part
├─sdb3               8:19    1   1.9G    0 part
├─sdb4               8:20    1   1.9G    0 part
├─sdb5               8:21    1   1.9G    0 part
└─sdb6               8:22    1   1.8G    0 part
```

We have a big disk with 2 GB partitions. Create a namespace in the NVMe config and point `device_path` at it:

```bash
cat device_path
/dev/sdb1
```

Then mount the disk over the network and see what shows up on the "client":

```bash
lsblk
nvme0n1          259:6      0       1.9G   0 disk
nvme0n2          259:21     0       1.9G   0 disk
nvme0n3          259:23     0       1.9G   0 disk
```

Our humble little flash drive plugged in via USB 2.0 is now showing up as an NVMe drive on the remote host. As three different drives, in fact, because I created three different namespaces.

Now let's play around with LVM and create a new volume on one of those drives on the "client":

```bash
nvme0n1          259:6      0       1.9G   0 disk
└─egdisk1-lvol0 253:0       0       1.9G   0 lvm
nvme0n2          259:21     0       1.9G   0 disk
nvme0n3          259:23     0       1.9G   0 disk
```

And now — without remounting or doing anything else — let's look at the flash drive from the server's perspective:

```bash
sdb                  8:16       1   29.3G   0 disk
├─sdb1               8:17       1    1.9G   0 part
│ └─egdisk1-lvol0 253:0         0    1.9G   0 lvm
├─sdb2               8:18       1    1.9G   0 part
├─sdb3               8:19       1    1.9G   0 part
├─sdb4                8:20   1   1.9G   0 part
├─sdb5                8:21   1   1.9G   0 part
└─sdb6                8:22   1   1.8G   0 part
```

Boom! The OS recognizes the partitions! Everything works exactly as it should.

But wait, there's more.

While working on the subsystem, every time I changed namespaces I'd disconnect the remote disk and disable the port to be safe.

Turns out you don't have to.

You can wander into the subsystem settings and create new namespaces on the fly. The "client" automatically picks up the changes and adds the new volumes to `/dev/nvme*`.

Interesting, I thought. NVMe gives you a huge toolbox for dealing with remote drives. With all this in mind, I wanted to gather some real numbers.

So I went and bought four 512 GB server-grade NVMe drives (CL SN720, which the docs claim are positioned as server NVMe drives), ten SAS SSDs, and 10 Gb/s network adapters. It's all being prepped, and a performance report is coming soon. The goal: measuring drive performance over TCP/IP. Expect a new article in about a week.

*(adapters on adapters on adapters)*

*(drives in the adapter. Heads up: do not use this in real servers! There are better form factors for that.)*
