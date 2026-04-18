---
title: "Taming QEMU with an Iron Fist"
slug: "qemu-iron-fist"
date: 2022-08-30
description: "A hands-on tutorial on driving QEMU virtual machines straight from Go via libvirt — no virsh, no clunky wrappers, just clean JSON in and JSON out."
lang: "en"
tags: ["QEMU", "virtualization", "Go", "Linux", "sysadmin"]
---

In my opinion, virtualization is still one of the most important technologies in datacenter administration. Sure, "everyone" will tell you that containers are way more convenient, that you've got to stuff everything into Kubernetes, and so on… But after a giant pile-up of configs nobody asked for, at some point you start to realize you've gone way too far.

And honestly. We write software that runs an entire datacenter. Originally, everything was supposed to be a container, and everything was supposed to ship via CI/CD. But when the rubber meets the road, you start to notice that nothing beats a plain Linux install with your golang utility running directly on top of it.

There is one problem, though. Virtual machines aren't as easy to manage as containers. Okay, fine — we know our way around, we can write a thing or two by hand.

So, below the cut, let's dive into working with QEMU and poke the emulator directly. The end result should be a Debian Linux cloned via golang.

### Intro

I assume everyone understands the difference between virtualization and containers. If not, I recommend brushing up — there's an absolutely massive amount of material on the topic.

The main upside of containers is that they're easy to manage and it's much simpler to share resources between programs. VMs aren't quite that convenient. If you've got something that eats 2 gigs of RAM, then 2 gigs is what it's going to eat.

### The Spec

What are we doing here? We're going to make life easier when managing VMs and write a small utility that lets you talk directly to QEMU from the console, spinning these machines up on the fly. The source for the utility will be available at the end of the article.

Once more, with feeling — we're writing a simple utility that lets you create, start, delete, and run virtual machines on QEMU. The point of writing it is to show you how to use Golang to programmatically create virtual machines.

You might think we already have `virsh` for this, but as practice has shown, it isn't as convenient or useful as I'd like. `virsh` can drive QEMU from the console, but in reality it's just a text interface that doesn't work all that well from scripts and external programs. To make managing VMs comfortable for me, I need to write my own utility — one that simply takes parameters as input, runs commands, and exits.

### A Bit of Background

Just a reminder: we're looking at one component of a whole stack of systems for managing virtualization.

There's the **hypervisor** — a subsystem in your OS kernel that lets you carve out a virtual space inside your physical computer's CPU and memory. In our case, we'll be using KVM.

Next — the **emulator** itself. This is the wrapper that turns the hypervisor into something that looks like a computer. Virtual ports, devices, I/O subsystems get attached to it, and in the end you get something that looks like a computer drawn on the screen. QEMU is our emulator. It can run on top of KVM, HVF, or that long-since-godforsaken proprietary code.

Then there's the **management layer** for all this stuff. To send commands back and forth, you need a library that can poke those commands. In our case we'll be using libvirt.

And finally, the **UI** for managing the VMs. We can use the console-based `virsh` or the more humane Virtual Machine Manager that ships with QEMU. But in this article, that last component is exactly what we're rewriting — because working with it isn't as straightforward as one might wish.

### Let's Get to It

We're writing this in golang because at this point only the lazy aren't writing in golang. You can also work with libvirt from other languages — pick whatever you want.

The most unpleasant part of building utilities on top of libvirt is the bone-crushing documentation. Sadly, it seems the maintainers stuck to the principle that if it was hard to write, it should be just as hard to understand.

For our purposes, let's grab a Go wrapper from over here.

The folks behind it did good work — they wrote a script that automatically wraps every libvirt call into ready-to-use Go bindings. The only catch is that nobody bothered with documentation, and even the examples in their repo compile with deprecation warnings.

### Alright, Let's Figure This Out

To start, let's seriously simplify the connection to our emulator and strip out everything complex and unnecessary. Here's an example of how to write the libvirt connection code without any deprecation warnings.

```go
var v *libvirt.Libvirt
func virtinit() {
    v = libvirt.NewWithDialer(dialers.NewLocal(dialers.WithLocalTimeout(time.Second)))
    if err := v.Connect(); err != nil {
        log.Fatalf("failed to connect: %v", err)
    }
}
```

This function will connect you to a QEMU instance running on the local machine. With `v` in hand, you can call any libvirt function you need to manage your machines.

The only question is — which functions should you actually be calling?

Unfortunately, this is where the trap is. Realistically, the only sane libvirt documentation lives on the libvirt site itself.

If you head over there and look at the docs, you'll see they're comprehensive — and written for C++. Which is no surprise. Our Go wrapper lets us call all of those commands without translating parameters into mysterious structs and so on. It's pleasant to use.

The problem is that the documentation was written by the people who wrote libvirt, and to find the function you need, you'll have to be ree-eeally clever. Mostly because the variable and function names don't correspond to anything you'd be used to. Either you're a libvirt developer, or you'll have to suffer by re-reading ALL the docs about how to do anything with a machine just to figure out how to reboot it.

Sometimes knowing the right `virsh` command can help you locate the matching function in libvirt, but that's not always the case.

### Let's Start by Rebooting a Machine

```go
// VirtualMachineSoftReboot reboots a machine gracefully, as chosen by hypervisor.
func VirtualMachineSoftReboot(id string) {
    d, err := v.DomainLookupByName(id)
    herr(err)

    err = v.DomainReboot(d, libvirt.DomainRebootDefault)
    herr(err)

    hok(fmt.Sprintf("%v was soft-rebooted successfully", id))
}
```

The code is simple enough. We need to find a pointer to the machine we're working with, then call `int virDomainReboot(virDomainPtr domain, unsigned int flags)`. We're calling it on the connection instance we set up at the very beginning.

In the Go implementation, we look up the VM pointer by name and call `virDomainReboot`, which in golang is just `DomainReboot`.

Also, as I mentioned, libvirt has its own "language." For example, `domain` is what I'm going to call a "virtual machine" throughout this article. It might not be the most accurate translation in libvirt's own terminology, but for our purposes it fits perfectly.

Let's quickly look at the error-handling helpers.

```go
func herr(e error) {
    if e != nil {
        fmt.Printf(`{"error":"%v"}`, strings.ReplaceAll(e.Error(), "\"", ""))
        os.Exit(1)
    }
}

func hok(message string) {
    fmt.Printf(`{"ok":"%v"}`, strings.ReplaceAll(message, "\"", ""))
    os.Exit(0)
}

func hret(i interface{}) {
    ret, err := json.Marshal(i)
    herr(err)
    fmt.Print(string(ret))
    os.Exit(0)
}
```

Pretty simple — we exit the program via `os.Exit` and return an error code. We won't bother with code values: 1 means there's an error, 0 means there isn't.

As you can see, the program's output is formatted as JSON. That's deliberate — I'm going to be calling this code over the web, and ultimately the output of this utility will be fed to a "Big Brother" service that manages the servers.

So I decided that JSON-formatted output would be the most convenient option in this case.

Alright, we test the program, run it on the local machine, everything works, the VM reboots! Excellent!

After reading the docs, you'll quickly figure out how to do the simple stuff — shutting down, powering on, rebooting, and stopping a VM.

Let's keep going.

### Let's Create a VM

```go
// VirtualMachineCreate creates a new VM from an xml template file
func VirtualMachineCreate(xmlTemplate string) {
    xml, err := ioutil.ReadFile(xmlTemplate)
    herr(err)
    d, err := v.DomainDefineXML(string(xml))
    herr(err)

    hret(d)
}
```

Easy enough. libvirt and QEMU describe VMs in XML. Once you've got such a file, you've described all the settings of the VM you need, and after that you can crank them out left and right.

To get hold of a starting file, I recommend using `virsh dumpxml VM1 > VM1.xml`.

That command lets you dump all the data about an existing VM into an XML file. Once you've read the file, you'll easily figure out what needs to change. The one thing I'll insist on is that you change the ID and GUID of the new VM.

And now, let's get to why I sat down to write my own utility in the first place. `virsh` doesn't let you get VM data in a robot-friendly way. To find out the number of CPUs, RAM, and similar things, I had to parse `virsh` command-line output.

```go
// VirtualMachineState returns current state of a virtual machine.
func VirtualMachineState(id string) {
    var ret tylibvirt.VirtualMachineState

    d, err := v.DomainLookupByName(id)
    herr(err)

    state, maxmem, mem, ncpu, cputime, err := v.DomainGetInfo(d)
    herr(err)

    ret.CPUCount = ncpu
    ret.CPUTime = cputime
    // God only knows why they return memory in kilobytes.
    ret.MemoryBytes = mem * 1024
    ret.MaxMemoryBytes = maxmem * 1024
    temp := libvirt.DomainState(state)
    herr(err)

    switch temp {
    case libvirt.DomainNostate:
        ret.State = tylibvirt.VirtStatePending
    case libvirt.DomainRunning:
        ret.State = tylibvirt.VirtStateRunning
    case libvirt.DomainBlocked:
        ret.State = tylibvirt.VirtStateBlocked
    case libvirt.DomainPaused:
        ret.State = tylibvirt.VirtStatePaused
    case libvirt.DomainShutdown:
        ret.State = tylibvirt.VirtStateShutdown
    case libvirt.DomainShutoff:
        ret.State = tylibvirt.VirtStateShutoff
    case libvirt.DomainCrashed:
        ret.State = tylibvirt.VirtStateCrashed
    case libvirt.DomainPmsuspended:
        ret.State = tylibvirt.VirtStateHybernating
    }

    hret(ret)
}
```

In this case, we get information about a specific machine's state straight to the console as a beautiful JSON blob. Now our little utility starts becoming a really useful one. It lets us quickly and conveniently scan all the VMs on a server.

On top of that code, here's a very handy set of constants.

```go
// VirState represents current lifecycle state of a machine
// Pending = VM was just created and there is no state yet
// Running = VM is running
// Blocked = Blocked on resource
// Paused = VM is paused
// Shutdown = VM is being shut down
// Shutoff = VM is shut off
// Crashed = Most likely VM crashed on startup cause something is missing.
// Hybernating = Virtual Machine is hybernating usually due to guest machine request
// TODO:
type VirtState string

const (
    VirtStatePending     = VirtState("Pending")     // VM was just created and there
    VirtStateRunning     = VirtState("Running")     // VM is running
    VirtStateBlocked     = VirtState("Blocked")     // VM Blocked on resource
    VirtStatePaused      = VirtState("Paused")      // VM is paused
    VirtStateShutdown    = VirtState("Shutdown")    // VM is being shut down
    VirtStateShutoff     = VirtState("Shutoff")     // VM is shut off
    VirtStateCrashed     = VirtState("Crashed")     // Most likely VM crashed on sta
    VirtStateHybernating = VirtState("Hybernating") // VM is hybernating usually due
)
```

As I already mentioned, reading libvirt's return codes isn't exactly intuitive. After half an hour of digging through Google and Stack Overflow, I pieced together what those VM stop codes actually mean.

### That's It! All Done

Now the only thing that can stop you is your imagination.

Let's give it a try and see what we've got. You'll need to add command-line argument handling and all the other minor pieces, which you can easily figure out on your own. At the end of the article I'm linking the full source for the component.

We fire up our utility and try to start one of the VMs on my machine:

```bash
./tarsvirt --id debian11 --virtual-machine-start
{"error":"Cannot access storage file '/dev/tars_storage/vol2': No such file or directory"}
```

Right — the system tried to start the VM and exited with an error. We learned about the error in nice JSON form, and we don't have to parse `virsh` output to figure out something's off.

The error message says we're missing some kind of disk we need to start the VM. Let's fix the error and try again.

```bash
./tarsvirt --id debian11 --virtual-machine-start
{"ok":"debian11 was started"}
```

Beautiful. Everything launched. We double-check via VM Manager:

*(screenshot: VM Manager showing the running debian11 virtual machine)*

Sure enough, the machine is running.

Now, just out of curiosity, let's check the VM's status:

```bash
./tarsvirt --id debian11 --virtual-machine-state
{"State":"Running","MaxMemoryBytes":1073741824,"MemoryBytes":1073741824,"CPUCount":2}
```

Excellent — we know we started up with one gigabyte of RAM and two CPUs. And the machine is running just fine.

The only thing left for you to do is go and read the rest of the libvirt docs, and you'll be able to programmatically create, delete, and manage VMs on your Linux box.

It wasn't all that hard, and you can easily embed this into any of your binaries. It takes no more than a couple of hours and lets you manage VMs almost directly, without needing third-party tools.

It's exactly with this little program that we can create a new virtual machine, clone a fresh disk, overwrite the Linux state inside that machine, and boot it up in less than 2 minutes.

Convenient, reliable, and most importantly — very simple. If you're curious how — I can share the details in future articles. In the meantime, happy libvirt-bashing.

PS. The utility is so simple that here's the source code for it:

*(like in the good old tube-amp days, when code was distributed in print in magazines)*
