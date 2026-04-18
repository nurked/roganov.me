---
title: "Tightrope Walker on NVMe-over-TCP 2.0"
slug: "nvme-over-network-part-2"
date: 2022-02-22
description: "Round two of beating up NVMe-over-TCP. A real test bench made of two Dell PowerEdge boxes, a 10-gigabit network, kernel 5.16, and answers to the questions you raised."
lang: "en"
tags: ["NVMe", "Linux", "sysadmin", "networking", "TCP"]
series: "nvme-over-network"
seriesOrder: 2
---

Hi everyone! Glad to see you again, and I'm thrilled you enjoyed my [previous article](/blog/nvme-over-network-part-1/) titled "So is everyone lying? Let's keep abusing NVMe."

A quick reminder: in that article I explained how to properly hook up your NVMe drive remotely over the network. Not "how do I share a folder?" and not "which way do I shove an NVMe stick into the computer?" but specifically "how do I attach your NVMe drive over the network?"

What does that buy you? You can plug an NVMe drive sitting in one machine straight into another machine over the network. Over the most ordinary copper cable. And you don't need to install any sketchy third-party programs or fiddle with any dubious configuration. The whole stack is part of the standard Linux driver set.

What's more, with a 10 Gbps network you can fully enjoy the full speed of an NVMe device. It will feel like the device is sitting right there in your machine, running at full tilt. Just give it the network it deserves.

It all sounds like magic, but it really does work. And of course, this raised a pile of questions for many of you. Well, I have answers. Everything you ever wanted to know about NVMe-over-TCP but were afraid to ask.

Let's dive in.

### The test bench

So, let's remind ourselves what we're working with. We need a recent Linux. Kernel 5.8 should work. Kernel 5.10 (Debian 11) more or less works. And if you're an enthusiast on 5.16, don't even sweat it — go ahead and use NVMe-over-TCP.

If you want to know exactly how to attach an NVMe drive from one machine to another, take a look at the [previous article](/blog/nvme-over-network-part-1/). I covered all the steps in detail there.

The funny thing was, in that article I goofed and ran the tests on my tiny little laptop (managing to corrupt the filesystem and almost trash the entire drive in the process). Not exactly classy. I figured it was time for some real testing. So I picked up some hardware to do the job properly.

Let's start with server-grade NVMe drives for the experiments. I grabbed four of these little cuties.

After that I added an absolutely useless gadget to the mix. I thought it would help, and it turned out to do the exact opposite. What I had hoped would be a simple way of jamming SSDs into the PCIE bus turned out to be a weird little RAID controller that just mirrored all my drives. Lucky for me, the board cost only 20 bucks, so it could be ceremonially set on fire for failing to live up to expectations.

Moving on. We have drives. Now we need something to plug them into. If we're going to test, let's test properly, I decided, and acquired these three boxes.

One of the boxes contained a Dell PowerEdge R620. Let this be our client. We have 48 cores, 386 gigs of RAM, and a 10-gigabit NIC that will easily handle the unfathomable traffic.

Our storage server will be a Dell PowerEdge R730. Same 48 cores, 64 gigs of RAM, and a heap of assorted SAS-SSD drives. Plus our NVMe drives, which we'll cram into it as well.

The third box contained a simpler 10-gigabit switch. The HP A5820x handled the load like a champ.

Now the test bench is ready. Grounded up, and away we go.

> A reminder: with a test bench like this, living without an anti-static strap is genuinely terrifying. Every spark could be the last one for a huge pile of equipment. So be careful, don't forget to strap yourself in, and check your ground.

Alright, assemble, install, configure. We put down Debian 11 with kernel 5.10, turn everything on. Works out of the box.

We start it up and check the state of the drives on the server:

```
Node              SN                    Model                                       Names
---------------- -------------------- ---------------------------------------- -----
/dev/nvme0n1      21211U801053          WDC CL SN720 SDAQNTW-512G-2000              1
/dev/nvme1n1      21211U801229          WDC CL SN720 SDAQNTW-512G-2000              1
/dev/nvme2n1      21211U801257          WDC CL SN720 SDAQNTW-512G-2000              1
/dev/nvme3n1      21211U801038          WDC CL SN720 SDAQNTW-512G-2000              1
```

Excellent. Our 4 NVMe drives are detected and behaving as expected.

On top of that, just to compare performance, let's use the built-in PERC r710 SAS controller and create a RAID-5 array out of plain SAS SSDs.

Now we'll follow the instructions from the previous article and mount our NVMe drives on the client. Then we'll use the same procedure to mount the SSD drives on the same client over the NVMe protocol.

What, is anyone going to stop us? No. Nobody would dare. We can mount any block device over NVMe. While I was abusing the system, I even mounted an LVM disk that was sitting on a USB 2.0 flash drive.

And yes, it worked! Nobody is stopping you from mounting any block device over NVMe. You can even mount HDDs.

### What even is NVMe?

Let's take another look at what NVMe actually is. It's not "hard drives." NVM stands for Non-Volatile Memory. Any memory that doesn't depend on a battery or capacitors to keep its contents.

NVMe stands for NVM Express. Originally NVM Express was simply a protocol for moving data from the CPU to the drive. It was designed specifically for NVM drives that connected to the system over PCIE.

Older data transfer systems like IDE, SATA, and SAS just couldn't move that much information. What's more, the older protocols were designed under the assumption that drives have only a single I/O queue.

Over time, NVMe started growing into something more interesting. The data transfer protocol began to break apart into subsystems and a set of transport protocols. The protocol itself was decoupled from the PCIE bus, and the maintainers managed to wedge it onto other transports like Fabrics or TCP/IP.

And the brand-new 2.0 spec tells us that NVMe will natively support hard drives (precisely with the goal of unifying the protocols used to talk to the CPU).

Unlike standard SATA devices, with NVMe you have not one but 64 thousand data transfer queues at your disposal. You can create 32 thousand input channels and 32 thousand output channels. Or, if you'll be doing a lot of reading from disk, you can reconfigure for 8K input channels and 52K output channels. Whatever you want. As much as your heart desires.

So you can easily wedge any block device into the NVMe protocol. And of course, you won't see a performance boost. A spinning drive that turns at 5,400 RPM is going to keep turning at 5,400 RPM.

But on the other hand, the client will see NVMe drives only as I/O devices. As a reminder, the current version of the protocol (1.4) doesn't support hard drives. They will work over the protocol, but NVMe can "suffocate" a hard drive with the sheer number of instructions it sends. You can copy data, but if you're trying to do "fast" disk access — forget it. In this version of the spec, SATA will be faster than NVMe.

### The first test

So, we have two servers. The data server has NVMe drives and a SAS-SSD RAID-5 array. The client has those same drives attached over NVMe.

Let's run the first test.

```bash
dd if=/dev/zero of=/tmp/test1.img bs=1G count=1 oflag=dsync
```

We start it up, check the result, and see something unimaginably ugly going on. It's just embarrassing.

Well, sort of. On the one hand, sure, embarrassing. On the other, we do have some data points that don't look so bad.

For starters, on the local NVMe we got 617 megabytes per second of write speed. The RAID managed to squeeze out a full 785. If you look at the spec sheet for the SN720 itself, it's supposedly capable of up to 3,000 MB/s on sequential reads. Our model is supposed to write at 2,500 MB/s. 617 is a long way from that number.

Okay, let's pause on this table for a second and look at the "remote" numbers. That's data from the remote server, sitting and writing to the disk over our 10-gigabit network. Interesting — in a synthetic test like this we got 60% of the speed of writing to the actual disk. Not bad. But not particularly impressive either. Let's find a better tool.

While we're here and the bench is in front of us, let's check one more thing. Fire up `ioping`. Here's the time, in microseconds, it takes to reach the disk. The results here are a bit more interesting. Sending data from the CPU to the NVMe drive takes 181 microseconds. And sending data over the network adds only 270 microseconds on top. Nice numbers to see. Talking to the RAID array is much slower, and pushing it over the network still costs the same ~300 microseconds.

By the way, here's the full `ioping` statistics (min, mean, max, deviation).

### Bringing in fio

Alright, let's get serious about our testing setup. Let's find something better than `dd`.

We try:

```bash
fio --randrepeat=1 --ioengine=libaio --direct=1 --gtod_reduce=1 --name=test --filena
```

Hmm. Magic.

With these parameters, in a random write of 4 GB of data, NVMe beats everyone and everything. But remotely it works like a piece of… ahem. Like nothing at all. Total garbage, basically.

It's possible that one of our esteemed Habr readers will tell me I made a mess of things and configured `fio` incorrectly. Fair enough — I'd be happy to receive your tips on how to properly benchmark NVMe with `fio`.

But empirically I figured out the following. If you pass `fio` the `numjobs` parameter and set it to, say, 4, the tests perk up considerably.

Here, for instance, are the local NVMe stats with `numjobs=4`:

```
Run status group 0 (all jobs):
   READ: bw=1043MiB/s (1093MB/s), 130MiB/s-130MiB/s (136MB/s-137MB/s), io=23.0GiB (2
  WRITE: bw=348MiB/s (365MB/s), 43.4MiB/s-43.7MiB/s (45.5MB/s-45.8MB/s), io=8199MiB
```

That's about as much as I could squeeze out of `fio` itself. Naturally, because this isn't sequential writing — it's a random pattern. Which, in principle, isn't bad.

But the interesting part is when we switch over to the remote server and run `fio` with `numjobs=4` over the network.

```
Run status group 0 (all jobs):
   READ: bw=950MiB/s (996MB/s), 119MiB/s-123MiB/s (124MB/s-129MB/s), io=2399MiB (251
  WRITE: bw=317MiB/s (333MB/s), 39.6MiB/s-41.4MiB/s (41.5MB/s-43.4MB/s), io=801MiB (
```

BOOM!

Pay attention now! The write speed to disk over the network is only 10% lower than writing directly through the PCIE interface.

Well then.

That's a result!

After lengthy testing I figured out that the main bottleneck is the CPU. Yes, the CPU on the server is fairly old.

```
# cpu-info
Packages:
    0: Intel Xeon E5-2690 v3
Microarchitectures:
    24x Haswell
```

Bumping the number of threads simply spreads the load across cores, and everything runs much faster.

I consulted with Habr readers who participated actively in the discussion of the previous article. Some advised enabling Jumbo Frames on the switch and bumping up the MTU. I did, but in practice it made no difference. In this case the MTU didn't really matter.

So once again — if you've got a useful tip on how to properly run all of this through FIO, let me know.

### When things break

And so, while I was running all these tests, one fine day I discovered that the filesystem on the drives had blown up. Worse, the drives themselves had wandered into a strange "blocked" state.

`nvme list` was returning weird results. Instead of showing this:

```
Node                    SN                    Model
--------------------- -------------------- ----------------------------------------
nvme1n2                 4765c43fe7fa83e5      Linux
nvme0n2                 b574d76af59e7acf      Linux
```

I'd get back this (with a phantom namespace `-1`):

```
Node                    SN                    Model
--------------------- -------------------- ----------------------------------------
nvme1n2                 4765c43fe7fa83e5      Linux
nvme0n2                 b574d76af59e7acf      Linux
```

What's more, attempts to disconnect and reconnect the drives went nowhere. `nvme disconnect-all` ran fine and returned zeroes, but in fact the drives from the bizarre `-1` namespace kept hanging around in memory.

Meanwhile `dmesg | grep nvme` showed a steady stream of segfaults.

The only way to fix the situation was a full server reboot.

And here, trying to figure out why this was happening, I started thinking. After a few attempts to find the problem, I realized it all boiled down to a flaky network port. Sometimes the link between the servers would drop, and along with it, half the NVMe stack on both servers would seize up.

Trying to fix it, I started poking around the nvme github. First I found out that my `nvme-cli` was wildly out of date. I was on version 1.12, while github had 2.0 rc2.

```bash
# nvme --version
nvme version 1.12
```

Fine, I downloaded and built `nvme-cli`. For the record: if you follow their instructions, you can build the binaries. But because of some broken Python scripts, the attempt to install them into the system fails spectacularly. So instead of installing the utility, I simply used the binary directly.

```bash
# ./nvme --version
nvme version 2.0
```

Okay. With the new version of the utility, the strange drives with namespace `-1` disappeared from the list. But they were still visible in `lsblk`.

After that I dove into the Linux kernel sources and discovered that nvme isn't forgotten — work is actively being done on it.

My 5.10 module was on a build from June 2021. A bit stale, I thought. My kernel 5.10 was a full 6 versions behind the latest 5.16.

"Well, then?" I thought… and set about compiling the latest kernel on the server.

If your memory has gone blank and you can't remember how to do this, you can find a decent guide here.

So, after several hours of compiling (because my dumb head forgot about `make -j 48`, and I was building the Linux kernel single-threaded on a 48-core system…) we check.

```bash
# uname -a
Linux dev-vm-1 5.16.8 #2 SMP PREEMPT Wed Feb 9 15:54:42 PST 2022 x86_64 GNU/Linux
```

We're on the latest version.

Fire it up and see what we get.

First — nvme works just like before. It just works. And nothing fell over. Okay, good. Dell servers are famous for having great Linux support. Nice.

Off to test.

### Hot-swap

We set up the connection between drives. We start `watch 'dmesg | grep nvme'`. We yank the cables out of the switch live and…

```
[   506.695802] nvme nvme2: creating 48 I/O queues.
[   506.707593] nvme nvme2: mapped 48/0/0 default/read/poll queues.
[   506.732979] nvme nvme2: new ctrl: NQN "05zbcqmysyej9dzgse9yveh9yg", addr 10.22.1.
[   506.740016] nvme nvme3: creating 48 I/O queues.
[   506.751832] nvme nvme3: mapped 48/0/0 default/read/poll queues.
[   506.773902] nvme nvme3: new ctrl: NQN "05zbcra03ybrvjpw1a7kh7b1mg", addr 10.22.1.
[   705.041167] nvme nvme3: queue 0: timeout request 0x0 type 4
[   705.041180] nvme nvme3: starting error recovery
[   705.041195] nvme nvme2: queue 0: timeout request 0x0 type 4
[   705.041200] nvme nvme2: starting error recovery
[   705.042836] nvme nvme3: failed nvme_keep_alive_end_io error=10
[   705.042903] nvme nvme2: failed nvme_keep_alive_end_io error=10
[   705.057243] nvme nvme3: Reconnecting in 10 seconds...
[   705.057246] nvme nvme2: Reconnecting in 10 seconds...
[   718.320953] nvme nvme3: failed to connect socket: -110
[   718.320972] nvme nvme2: failed to connect socket: -110
[   718.320975] nvme nvme3: Failed reconnect attempt 1
[   718.320980] nvme nvme3: Reconnecting in 10 seconds...
[   718.320995] nvme nvme2: Failed reconnect attempt 1
[   718.320999] nvme nvme2: Reconnecting in 10 seconds...
[   728.338579] nvme nvme2: creating 48 I/O queues.
[   728.338716] nvme nvme3: creating 48 I/O queues.
[   728.373946] nvme nvme3: mapped 48/0/0 default/read/poll queues.
[   728.373987] nvme nvme2: mapped 48/0/0 default/read/poll queues.
[   728.376019] nvme nvme2: Successfully reconnected (2 attempt)
[   728.376019] nvme nvme3: Successfully reconnected (2 attempt)
```

It works!

We just yanked a drive out of the system live and plugged it back in. And nothing fell over!

Check `./nvme list`:

```
# ./nvme list
Node                   SN                   Model
--------------------- -------------------- ----------------------------------------
nvme1n2                4765c43fe7fa83e5     Linux
nvme0n2                b574d76af59e7acf     Linux
```

Hooray! No more phantom drives! Everything works as expected.

### So, kids, what did we accomplish?

Quite a lot, actually. We have a brand new technology stack. It lets you attach block devices over the network (and not just over the network) using whatever happens to be lying around. What's more, we get a single unified protocol for moving data between block devices.

And if you're not afraid of Linux, you can start experimenting right now. I like this technology and I believe in it.

Definitely send me your `fio` parameters — I'll run them on the servers and let you know how it went.
