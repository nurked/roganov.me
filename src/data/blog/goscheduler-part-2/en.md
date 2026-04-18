---
title: "Digging Into the Compiler Source — How the Go Scheduler Works (Part II)"
slug: "goscheduler-part-2"
date: 2021-10-11
description: "Part two of the series on Go's task scheduler: breaking down G, P, and M, thread parking, system calls, netpoll, and sysmon — all based on runtime source code."
lang: "en"
tags: ["Go", "goroutines", "scheduler", "systems programming"]
series: "goscheduler"
seriesOrder: 2
---

I recommend starting with [Part I](/blog/goscheduler-part-1/), where we torment an OS with an absurd number of threads, see what comes of it, and learn that concurrency is not necessarily multithreading.

Let's dig into the source and find out what all those G's, P's, and M's are about.

- **G** — a goroutine that we're going to run.
- **M** — a machine, i.e. a thread that will run on the CPU and execute your tasks.
- **P** — a processor that will carry out the work.

When you launch a program written in Go, the runtime reads GOMAXPROCS to figure out how many actual CPU cores exist on the system. Well, no — that doesn't sound quite right. Hardly anyone sets GOMAXPROCS before launching Go programs, and everything works just fine on multiprocessor systems.

Let's look at the source. On line 706 in `proc.go`, we find the following:

```go
procs := ncpu
if n, ok := atoi32(gogetenv("GOMAXPROCS")); ok && n > 0 {
    procs = n
}
```

This all happens inside the `schedinit` function, which is responsible for bootstrapping the scheduler. Looking at the comment above this function, we find:

```go
// The bootstrap sequence is:
//
//    call osinit
//    call schedinit
//    make & queue new G
//    call runtime·mstart
//
// The new G calls runtime main.
```

Aha, so we're not just starting the scheduler — we're booting up the entire program. First, `osinit` kicks in, and right there in the OS initialization section we do this:

```go
cpuinit() // must run before alginit
```

By the way, right before that we set `sched.maxmcount = 10000`. So right off the bat, we limit the maximum number of machines to 10,000 for some reason. Let's file that away and move on.

`Cpuinit` together with `osinit`, using a healthy dose of assembly and standard OS library calls, figures out the number of cores available on the host machine. The source code for these functions differs across processors and operating systems, so we won't dive into details here — there are simply too many of them.

In any case, we set the number of processors based on OS data, and THEN override it with whatever's stored in GOMAXPROCS. And if GOMAXPROCS contains nonsense, we just ignore it and carry on with the processor count provided by the system.

But here's our first opportunity to screw things up royally. By setting GOMAXPROCS to a specific value, you're taking on the responsibility of understanding how the scheduler works. If you set GOMAXPROCS to a value higher than what the OS actually has, you can seriously tank your program's performance.

By the way, digging a bit deeper into the docs, we find that `maxmcount` can be changed via `debug.SetMaxThreads`. The documentation for this function notes that the limit is arbitrary but serves to prevent the operating system from being murdered by the creation of unlimited threads. The function is mainly intended for debugging. The runtime will crash the moment we try to create more threads (M's, machines) than this value.

Let's see what `func main` does besides initializing the scheduler. A brief aside: we can see all over the place that if we're running the program on wasm, no threads are created and all goroutines run on a single machine. So be careful when porting your code to wasm. You might have issues with parallelism.

Next, we find the main goroutine that needs to be executed and bind it to the first thread launched by the OS. Most programs don't particularly care about this, but there are certain situations where your goroutine absolutely must run on the OS's first thread.

### Theory: P, G, M

Now let's return to the world of theory for a moment. Given:

- P, G, M.
- A list of processors in the system.
- A list of machines (threads) that we're running on the system.
- A list of G tasks that we're trying to run on all this stuff. Where and how?
- The list of P's is fairly straightforward. It's an array of structs describing processors. But M is where things get a bit more interesting.

M is our execution thread. M is what the operating system fights over, as we saw earlier. The fewer active M's, the easier life is for the OS scheduler and the faster the CPU gallops along. But with too few M's, we accumulate an insane number of unfinished goroutines.

That's why M's can be parked. If there's no work to do right now, there's no need to keep an M in an active state. You can send it to the reserves.

### Parking and Starting

What matters here is the balance between running and parked processes (M's) to properly utilize all available system resources. Again — too many threads and you overload the CPU, too few and you're sitting idle. Balancing this is tricky for at least two reasons:

1. The scheduler itself is distributed. Work queues (goroutines ready for execution) are stored separately for each processor. So computing the exact order in which to execute all existing goroutines right now is impossible.
2. Plus, as we saw earlier, the OS and the CPU play quite the game of musical chairs when it comes to pulling processes off execution. So if we have a goroutine on deck but it's not quite ready yet, parking the execution thread would be stupid — it's simpler to wait 200 cycles and run it on the existing thread.

There are many possible solutions to this problem. Here, for instance, are some wrong ones:

1. Centralize the scheduler. Although, obviously, this approach will give us scaling problems. The scheduler will become a bottleneck.
2. Spin up a new execution thread whenever a new goroutine appears. Example — a single-threaded program calls `go()`. In that case, we could grab a new thread, launch it on an idle P (processor), and live happily ever after. Meanwhile, the thread that just launched this goroutine might finish executing, and then it'll need to be parked. Plus the execution context (variables, memory, and caches) lives in the thread. If we launch the goroutine in a new thread, all of that has to be copied over.
3. We could just start up a new M process without running the freshly created goroutine on it. This gives us the ability to launch even more goroutines if needed. But if it's not needed, we'll have started and parked a thread for nothing.

This is where we realize that context switching isn't just about changing the current instruction pointer. When switching context, you have to swap the stack. And the stack can hold data. For example, say we have function 1 that calls function 2. Function 2 won't bother itself too much and just uses the address space of the thread where function 1 is running. After all, execution isn't parallel. We save the current stack pointer, add a bit to it, align everything to a memory boundary, and carry on peacefully. When it's time to return a value, we shove it where it belongs and restore function 1's stack position. Done! Simplicity! In assembly, you can write this in three lines:

```nasm
push      rbp
mov       rbp, rsp
sub       rsp, 32
```

Now imagine that function 1 and function 2 are goroutines running on different machines M. Here's where the stack goes completely haywire. Returning values through registers won't work — everything has to be written to memory. And if function 2 tries to use data from function 1, it's even more fun. Some programmer sat down and wrote a closure that captures a bunch of variables. Those will either need to be copied to the stack or placed in shared memory.

Cache isn't exactly something we have in abundance. What if one goroutine runs on the first core and its child process runs on the third? The execution threads are on different cores, and the second goroutine will have to wait until data from memory hits the cache.

Oh well. The latencies are small, nothing to worry about. Actually, no — you should worry. If the load is heavy and your goroutines are tiny, then yes, you should absolutely worry. Every time you try to do trivial computations with 4 kilobytes of memory a billion times across different threads, you're looking at a lot of potential problems.

This, by the way, explains why creating an infinite number of OS processes doesn't help. We don't just need parallel computations — they also have to be fast.

### Spinning

And along the way, we can understand why we even need M's in the first place. After all, we could just run goroutines directly on a real processor P, without binding them to machines M. But now it all makes sense, because M holds that execution context and is easier to haul around when needed.

So here's a description of how work gets distributed in Go at the moment.

First, you need to understand that an execution thread can be spinning. If you've ever visited a textile factory, you might have seen threads being unwound from bobbins, and bobbins sometimes spinning idly. Hence the name.

An execution thread M will be marked as spinning (`m.spinning = true`) if the following has occurred:

1. Thread M has finished all goroutines in its execution queue.
2. The global execution queue is also empty and there are no new goroutines.
3. The timer completion queue is empty. If you called Sleep in your goroutine, it goes dormant while its timer ticks. Once the time is up, that goroutine lands in a special execution queue where such goroutines wait.
4. The network stack execution queue is also empty and looking bleak. (I'll talk about this queue a bit further down.)

The thread checks these queues one by one, and if any of them has something to execute, it gets to work. If the thread doesn't find any decent work, it automatically gets parked. (That is, it gets pulled off the CPU and placed in a basket to wait.)

All newly created threads are created in this spinning state.

When new work appears (some goroutine), we'll start a new M if there are idle processors P and there are no M threads already spinning. If there's a thread already spinning, we simply hand the work to that thread. And here's an extra twist: every time a spinning thread finds work and starts executing it, it checks whether there are any other spinning threads in the system. If none remain, it starts a new thread and leaves it spinning.

With this approach, the random overhead of starting and parking threads is significantly reduced, and system resources are used more efficiently.

So, to sum up:

**Processors:** some number of them.

**Worker threads:** Depends on the load — one thread per processor. You can launch more by setting variables manually, but that'll create problems.

**Tasks to execute:** zillions. Depends on what's happening in the system. Either the programmer spawns a new task, or a timer ticks, or it's time for garbage collection. The garbage collector could toss tasks for background processing. Although, judging by the source, this is currently disabled (line 108).

```go
// * Idle-priority GC: The GC wakes a stopped idle thread to contribute to
// background GC work (note: currently disabled per golang.org/issue/19112).
// Also see golang.org/issue/44313, as this should be extended to all GC
// workers.
```

Tasks run on threads, get executed, and finish. Bliss. Well, not quite — as we can see, they don't always finish, but they can be pulled off execution. Like what we saw with timers, for example. But there are other reasons why tasks might not complete.

### I/O

Your goroutine can always do something so outrageous that it completely blocks the execution thread. For instance, requesting data from a hard drive. Not an SSD — a regular spinning disk. And one that the operating system has put to sleep, so it needs 5 seconds to spin up. An unforgivable waste of resources. In this state, your execution thread will sit idle for 5 seconds.

Ten years ago, Microsoft tried to tackle this problem in Windows 8 by creating new APIs where all such disk and network requests were asynchronous by default. Every time you accessed a disk, you had to write a closure or callback to handle the result. Of course, the idea was simple — all programmers will just switch to the new APIs, right? Ha. Sure, everyone jumped right on that.

The I/O problem in Go is solved simply. There are no APIs for asynchronous I/O. Anything you need to do asynchronously — do it yourself using goroutines. Seems like a strange decision. Other platforms bend over backwards trying to provide async systems, while Go just shrugs and offers nothing. But it's actually the opposite. By building a well-designed runtime, we ensure you don't have to worry about dealing with asynchronous I/O systems.

And honestly. Synchronous systems are much simpler to use. How about this for fun — creating a new thread in a pool for every read/write operation? And the modern contortions used in JavaScript/Java and C# deserve a whole separate mention. After all, in C# we've already come full circle and arrived at async/await operations.

Now instead of creating a new thread, you can just write:

```csharp
var text = await File.ReadAllLinesAsync(...);
```

In Go, none of this is necessary. Just write synchronous I/O operations and, when needed, run them in goroutines. The runtime will clean up all the unpleasant details that come with it.

### System Calls

System calls come in different flavors. Some are very fast — like when you need to get the current time — and some can block the execution thread. In any case, when a system call is being executed, the processor becomes unusable for running our code, since we have to switch the CPU to kernel space, where our code will be inaccessible until the OS returns a value.

So how do we deal with a goroutine that tries to make a system call and requests forbidden data, creating merciless latencies that lead to program lag?

If we solve this head-on, we can simply run the program on thread M, and right after that thread makes a system call on processor P, we unbind M from that P and switch its execution to another free core. After we get our system call data back and consider it complete, we try to land execution thread M back on our processor P. And if we pulled the thread off the processor and discovered there are no additional processors to land it on, we just park that goroutine in the global execution queue. It can sit there and wait — nothing bad will happen to it.

But here's the thing. In the world of documentation, all system calls are theoretically blocking and switch the CPU to kernel execution mode. In reality though, that's not the case. We've had vDSO for a long time, which allows requesting certain data without any blocking.

The thing is, if we do want to make a system call — it's really tedious to pull the execution thread off the processor and search for a new processor to continue executing whatever we can. Too much effort goes into copying all the data structures that come bundled with these machines M and processors P. And on top of everything, if we end up in a situation where we don't have enough processors to handle all existing goroutines that are ready to execute, then under this system call handling scheme, we'll have to park the goroutine that made the call. All this red tape is simply useless if your system calls complete quickly or don't even go to the system at all and get an answer in nanoseconds from vDSO.

That's why Go has two modes for executing these goroutines: **pessimistic** and **optimistic**.

In **pessimistic** mode, the runtime just gives up, slumps its shoulders and says "Screw it, I can't take this anymore," releases the current processor P before the system call, and tries to get it back when the call finishes.

In **optimistic** mode, the runtime says: "Eh, whatever — let's just mark this processor with a flag" — "busy executing a system call" — and forgets about all the problems. The thread M doesn't get pulled off the processor, but other threads can steal work from this thread's execution queue if they've ended up in the idle spinning state.

### sysmon

Let's go further and find this line:

```go
// 5244:
func sysmon() {
```

And here's one of the main characters of what goes on in the runtime. This goroutine runs constantly. Under the hood, you'll find a lot of interesting things, including the handling of processor states waiting for system call completion. In particular, `sysmon` tries to "reclaim" cores that are busy executing system calls:

```go
// retake P's blocked in syscalls
// and preempt long running G's

if retake(now) != 0 {
    idle = 0
} else {
    idle++
}
```

Looking deeper into what happens inside `retake`:

```go
if s == _Psyscall {
    // Retake P from syscall if it's there for more than 1 sysmon tick (at least 20us)
    t := int64(_p_.syscalltick)
    if !sysretake && int64(pd.syscalltick) != t {
        pd.syscalltick = uint32(t)
        pd.syscallwhen = now
        continue
    }

    // On the one hand we don't want to retake Ps if there is no other work to do,
    // but on the other hand we want to retake them eventually
    // because they can prevent the sysmon thread from deep sleep.
    if runqempty(_p_) && atomic.Load(&sched.nmspinning)+atomic.Load(&sched.npidle) > 0 {
        continue
    }
}
```

So we try to free up the processor that's stuck waiting for a system call to complete. But we won't be too greedy about it. If there's no work at the moment, we'll leave them alone and let them work on those system calls. At some point we'll still reclaim those processors because they've been spinning for way too long, but that's in the distant future.

When we finally get the return value from the system call, we'll be able to check whether the processor was freed. In other words, we check if we pulled the rug out from under goroutine G and it's sitting there without a processor — then we either give that goroutine a new processor P, or we just send it to the global execution queue, where it'll eventually be picked up by a processor with nothing to do.

If all is well in the world and our system call took a mere few nanoseconds, we get very little overhead — we just run a couple of checks and our goroutine continues working on the same processor without any changes. In case things go sideways, the goroutine stuck on a system call will be pulled off the processor after 20 microseconds. If we're in a state where we've got a ton of goroutines and no free processors to run them, we sacrifice those 20 microseconds.

Here's the code that calculates the delay between `sysmon` runs:

```go
if idle == 0 { // start with 20us sleep...
    delay = 20
} else if idle > 50 { // start doubling the sleep after 1ms...
    delay *= 2
}

if delay > 10*1000 { // up to 10ms
    delay = 10 * 1000
}
```

So, all in all, the system is quite fair and doesn't cause a lot of trouble.

### netpoll

And while we were watching how `sysmon` handles system calls, we stumbled upon this code:

```go
// poll network if not polled for more than 10ms
lastpoll := int64(atomic.Load64(&sched.lastpoll))
if netpollinited() && lastpoll != 0 && lastpoll+10*1000*1000 < now {
    atomic.Cas64(&sched.lastpoll, uint64(lastpoll), uint64(now))
    list := netpoll(0) // non-blocking - returns list of goroutines

    if !list.empty() {
        // Need to decrement number of idle locked M's
        // (pretending that one more is running) before injectglist.
        // Otherwise it can lead to the following situation:
        // injectglist grabs all P's but before it starts M's to run the P's,
        // another M returns from syscall, finishes running its G,
        // observes that there is no work to do and no other running M's
        // and reports deadlock.
        incidlelocked(-1)
        injectglist(&list)
        incidlelocked(1)
    }
}
```

And this is the last stop on today's deep dive. Networking has been extracted into a separate subsystem called netpoll.

The word "poll" means to check or query. This is our network poller that checks whether any network responses have arrived.

This subsystem is designed to convert non-blocking network I/O into good old cozy blocking I/O. `Sysmon` constantly runs netpoll to check whether it's time to hand execution back to goroutines that are waiting for network data.

netpoll consists of two parts. There's the platform-independent part. Then everything else is supplemented by a platform-specific part. These are pretty small, by the way — about 200 lines each. The Windows code uses the `IoCompletionPort` API to get this data, the Linux implementation uses `epoll`, and BSD uses `kqueue`.

Every time you open a connection in Go, you get a file descriptor bound to that connection. This descriptor operates in non-blocking mode. If you try to perform an I/O operation but the descriptor isn't ready yet, you get an error. When you launch a goroutine to read/write to a network stream, control passes to netpoll, which will carry out this operation until it's complete. The goroutine itself gets pulled off the processor and suspends execution. After that, netpoll returns to sysmon the goroutine whose I/O operation has completed. That goroutine resumes execution.

The most interesting stuff happens in these two functions:

```go
// returns true if IO is ready, or false if timedout or closed
// waitio - wait only for completed IO, ignore errors
func netpollblock(pd *pollDesc, mode int32, waitio bool) bool {
    gpp := &pd.rg
    if mode == 'w' {
        gpp = &pd.wg
    }

    // set the gpp semaphore to pdWait
    for {
        old := *gpp
        if old == pdReady {
            *gpp = 0
            return true
        }
        if old != 0 {
            throw("runtime: double wait")
        }

        if atomic.Casuintptr(gpp, 0, pdWait) {
            break
        }
    }

    // need to recheck error states after setting gpp to pdWait
    if waitio || netpollcheckerr(pd, mode) == pollNoError {
        gopark(netpollblockcommit, unsafe.Pointer(gpp), waitReasonIOWait, traceEvGoBlockNet, 5)
    }

    // be careful to not lose concurrent pdReady notification
    old := atomic.Xchguintptr(gpp, 0)
    if old > pdWait {
        throw("runtime: corrupted polldesc")
    }
    return old == pdReady
}

func netpollunblock(pd *pollDesc, mode int32, ioready bool) *g {
    gpp := &pd.rg
    if mode == 'w' {
        gpp = &pd.wg
    }

    for {
        old := *gpp
        if old == pdReady {
            return nil
        }

        if old == 0 && !ioready {
            // Only set pdReady for ioready. runtime_pollWait
            // will check for timeout/cancel before waiting.
            return nil
        }

        var new uintptr
        if ioready {
            new = pdReady
        }

        if atomic.Casuintptr(gpp, old, new) {
            if old == pdWait {
                old = 0
            }

            return (*g)(unsafe.Pointer(old))
        }
    }
}
```

These two functions are exactly what adds and removes goroutines from the netpoll execution queue. After that, `sysmon` sits there running the platform-specific netpoll to figure out which goroutine can be sent back for execution by pushing it into netpoll's completed goroutine queue.

### Conclusion

We've studied a runtime whose code isn't littered with opaque and mind-bending constructs for "simplifying" I/O operations. Your code looks simple, yet you don't sacrifice proper approaches for implementing multithreaded I/O.

We also see that the runtime's task scheduler (whether it's Go's or another runtime's — we'd surely find a similar approach elsewhere) and the OS scheduler are two completely different things.

Writing a proper multithreaded application doesn't mean simply creating thousands of threads. On the contrary, such an application implies a well-honed, carefully thought-out approach to how the runtime uses the OS to efficiently launch and process tasks.

Different runtimes offer you different approaches. For example, .NET Framework takes a fairly conservative approach that lets you work both with threads directly and with thread pool systems. Meanwhile, Rust has no concept of the runtime doing any work for you. So if you absolutely must use some kind of thread pool, you'll have to reach for third-party components like Tokio.

Go presents you with an entirely new approach to running your applications. Everything appears as though you don't have to think about how to properly run multithreaded programs, but behind the scenes, a whole lot is going on. You get to take advantage of the runtime's wonderful tools without sweating the details of how it's all implemented.

In closing, I'd like to retell a story from Scott Hanselman:

> My sister-in-law emigrated to the US from Zimbabwe. She's 30 and a teacher. She had never driven a car (and in the US, you're pretty much stuck without one). I put her in our Prius and we drove to a parking lot where we practiced for several days. It came time for parallel parking, and this was the thing she simply could not wrap her head around. I told her: "Well, imagine how the front wheels turn when you turn the steering wheel."
>
> "The front ones?" she asked. "What difference does it make which wheels turn?" It turned out she didn't understand that the front wheels are the ones that turn. She thought ALL FOUR wheels of the car turned when you steered. I naturally insisted — no, only the front ones. She didn't believe me until she got out of the car and watched me park. She was amazed that the rear wheels didn't turn and the car followed the direction of the front wheels.
>
> "You didn't know that?" I asked.
>
> "I just never thought about it. I assumed they all turned and never questioned it."
>
> Obviously, this "assumption" became a problem when we were trying to debug her parking skills.

There are programmers in this world who proudly declare: "I don't need to know how the runtime works in my programming language." That sounds, let's say, shortsighted, and one fine day you'll find yourself on the verge of a nervous breakdown, trying to figure out why your shiny new project is brutally lagging on a new server.

I hope this information helps you understand how Go's runtime works and what exactly makes Go fundamentally different from other programming languages.
