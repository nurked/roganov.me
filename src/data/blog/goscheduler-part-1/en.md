---
title: "Digging Into the Compiler Source — How the Go Scheduler Works (Part I)"
slug: "goscheduler-part-1"
date: 2021-10-04
description: "Part one of a series on Go's task scheduler: what happens with OS threads, why 180,000 threads will kill your system, and what work stealing has to do with any of it."
lang: "en"
tags: ["Go", "goroutines", "scheduler", "systems programming"]
---

Every time I pick up a new book about golang, I inevitably flip to the chapter on goroutines and once again read about how ruthlessly magnificent Go is. Just think about it — instead of spawning OS threads to handle concurrent tasks, we get to use the language's own built-in tools!

That's all wonderful, and most books and courses on golang provide tons of examples of just how fast Go is and how it can effortlessly handle an infinite number of tasks. Unfortunately, none of these books actually explain what's going on under the hood. So let's crack open the gopher's source code and take a look inside.

> **On translating the word "concurrency"**
>
> The first rule of parallelism in Go goes like this:
>
> *Concurrency is not parallelism*
> — Andrew Gerrand, 16 January 2013
>
> Wonderful. We've all heard this one. Now try writing it in Russian:
> Parallelism is not concurrency… Sounds terrible. Let's translate "concurrency" into Russian. Nope, no luck. I think the word **согласованность** (agreement/consistency) fits better than the alternatives. Alright, we'll just have to live with that word going forward.

Part one, in which we torment an operating system and get a glimpse into the miserable lives of those poor execution threads spawned via `CreateThread`.

### Introduction to Multithreading

So, let's start by popping the hood on an operating system and seeing how threads work. In broad strokes. Without overthinking it.

Here we are, running our program — everything's fine and dandy. Instructions execute one after another, all peaceful and calm. But then it occurs to us that it would be better to run a disk read operation in a separate thread. On Windows, we'd use `CreateThread`, or `pthread_create` on Linux.

Microsoft's documentation includes the following note:

> The number of threads a process can create is limited by the available virtual memory. By default, each thread is created with one megabyte of address space. Therefore, you can create at most 2,048 threads. If you reduce the stack size, you can create more threads. However, your application will have better performance if you create one thread per processor and build queues of tasks for which the application maintains context.

Now we can read data from disk in a separate thread. Easy enough — create the main execution thread plus a second thread for data operations. We keep developing and decide it's time to aim higher and rewrite nginx.

There it is — our brand-new server, spawning a new thread for every incoming connection. All would be fine, except we'll start hitting walls. We'll either run out of memory trying to handle all those threads, or — more realistically — we'll simply choke the CPU with context switching overhead. Online, the question of the maximum number of threads has escalated to holy war status. Bringing it up is pointless, and you'll never get a definitive answer. But as far as anyone can tell, creating more than 2,000 threads is a bad idea because you'll just torture the CPU.

But that's theory. The practical point about these limitations is that all the stuff about the 2 GB memory cap and so on applies to 32-bit systems. And we've known for ages that 64-bit took over the world.

Let's put this to the test:

```cpp
#include <iostream>
#include <windows.h>

DWORD WINAPI callable(LPVOID lpParam);

int main()
{
    for (int i = 0; i < 1000000; i++) {
        CreateThread(NULL, 0, callable, NULL, 0, NULL);
    }
    std::cin.get();
}

DWORD WINAPI callable(LPVOID lpParam) {
    std::cin.get();
    return NULL;
}
```

We write the simplest possible program that just fires up 1 million threads. Each thread asks the user for input, meaning it blocks immediately. Zero CPU load per thread.

Test rig: 10th gen Intel Core i7. A solid mobile processor — pretty modest by server standards, but good enough for our purposes.

We note that the operating system is currently running 3,720 threads.

We launch the program with a debugger attached and discover that the Visual Studio Debugger slows things down to a crawl. After five minutes, the program has only created 20,000 threads and is more or less functional, although the system has become sluggish and unresponsive.

We launch the program without the debugger. The first 40,000 threads are created in a fraction of a second. Then the system starts to lag a bit. The thread count climbs to 150,000 within five seconds. The system starts lagging more seriously. All eight (four) cores are pegged at 100%. After that, we can't create more than 2,000 threads per second, and the system slowly ticks along until the thread counter reaches 180,000. Somewhere around that mark, the system completely and irreversibly locks up. Everything freezes. The mouse is dead, the keyboard doesn't respond — the system goes into total paralysis.

Unfortunately, I can't show you screenshots of this because they all perished along with the system, which had to be forcibly rebooted.

The 12 GB of RAM was plenty for running this program. What killed us was CPU context switching. The threads we created weren't actually doing anything.

If you want to stress-test your system without compiling C++ programs, you can use the excellent `testlimit64 -t` utility written by Mark Russinovich.

Let's get back to writing our server. Our server is going to be vulnerable to DOS attacks. We're not just creating millions of threads — we're loading them up with actual work, so things will be even worse. You could take down a server like this from a laptop. That's unacceptable. Instead of stress-testing the silicon, we'll follow Microsoft's recommendation and create a thread pool. Handy thing.

We create a limited number of threads and run tasks on them one by one. The tasks execute quickly, and the CPU doesn't overheat from constantly switching execution context between threads.

Practically every framework out there carries some flavor of this — Thread Pool in C#, Thread Pool in Java.

### First Steps

In golang, instead of letting you spin up all those threads and pools yourself, the developers went a step further and took away the ability to create OS threads directly. Instead, we got goroutines and a task scheduler designed specifically for Go.

So make sure you understand what G, M, and P are before diving any deeper. We're about to dissect the gopher, and surface-level knowledge won't cut it.

Alright, fine, I'll admit it — there isn't a single article about Go's scheduler in existence that doesn't feature a picture with little triangles, squares, and circles. Every single one has those triangles, squares, and circles.

We'll look at G, P, and M, but a bit later.

But that's not enough for us. How does the scheduler actually work? Well, answering that question isn't so simple. Let's dig into the go/golang repository and find the real scheduler. `src/runtime/proc.go`. That's where the gopher is buried.

In that same file, you can find a magnificent document written by Dmitry Vyukov that describes the internal design of Go's task scheduler.

### Going Deeper

And this is where we start finding real answers to our questions.

Why is Go's scheduler so beautiful and wonderful? At its core, the scheduler is based on research by Robert Blumofe and Charles Leiserson titled "Scheduling Multithreaded Computations by Work Stealing." (I spent a long time thinking about how to properly translate the term "Work Stealing" into Russian and settled on "Захват Работы" — literally "Work Capture.")

Let's look at some of the points from that paper. Scheduling execution is an extraordinarily complex process. From the operating system's perspective, the smallest unit of execution is a thread. The OS can't regulate the number of threads a user creates. If the user wants to, here's Photoshop running alongside Lightroom and Spotify, together spawning an army of 1,000 threads. And if the user wants something else, here's a Linux server where 150 threads launch at startup and then peacefully sleep, putting zero load on the CPU.

The OS has to distribute these threads across processors. And since we typically have fewer processors than threads, it has to run each thread for a certain amount of time, then pull it off and run other threads instead.

And if you look at how any CPU's cache is structured, you'll realize the problem runs even deeper. In our synthetic test above, we weren't using memory in our processes, weren't saving any data, and weren't performing any computations. But any real program will be reading and writing data from RAM. Data read from memory during program execution gets placed into the CPU cache. So when the operating system decides that a particular thread has had enough fun on the processor and it's time for a break, there's a lot of work to do. You don't just need to change the instructions the CPU is executing — you also have to flush and reload caches.

And it's not just one cache. There are four different ones per core. IL and DL are the instruction and data caches at Level 1. Then each core has a Level 2 cache, and all cores share a Level 3 cache.

When working with caches, latencies get progressively more serious. If Process Explorer is to be believed, at this very moment — under no particular load — my OS is switching context roughly 20,000 times per second. And when our killer program is running, context switches jump to 700,000 per second.

Accordingly, the operating system, working together with the CPU, has to figure out how to properly perform all these context switches. Context switching means additional load on the CPU. But the absence of switching means your media player will stutter and spit out music in chunks because it won't get executed frequently enough.

To figure out when to perform context switches, the OS uses a task scheduler.

Based on all this, we know that Windows uses a preemptive, priority-based task scheduler. Depending on the current system configuration, certain time quanta are allocated — intervals during which a process executes. Each process runs only during its allotted quantum, after which it gets pulled off the CPU and replaced by another process based on priority.

By the way, depending on that same priority, a process might not even finish its quantum if a higher-priority process comes along.

### Interim Conclusions

If you're trying to write a multithreaded application, creating threads is not the solution to your problems. In fact, the fewer threads you create, the faster they'll run.

But Go's runtime is not an operating system. It's an entirely different level of abstraction. It's just a thread running alongside other threads in the OS.

In golang, the approach to task scheduling inside the runtime is built on a different principle called work stealing. Work queues are created, and idle processors pick up work from them.

In Go, you have no way to directly access the mechanism for creating new OS threads. None whatsoever. You can only create goroutines, and those are managed by the runtime. How exactly are they managed? Let's take a look at that in the next article.
