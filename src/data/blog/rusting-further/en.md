---
title: "Rusting Further. How Rust Came to Be and Can You Do Web with It?"
slug: "rusting-further"
date: 2021-01-24
description: "A deep dive into the history of compilation — from processors and opcodes through C, Java, and JavaScript to LLVM and Rust. Understanding why Rust exists and when to use it for web."
lang: "en"
tags: ["Rust", "systems programming", "WebAssembly", "LLVM", "compilers"]
series: "rust-2021"
seriesOrder: 2
---

The previous article about Rust turned out to be rather popular. A lot of people reached out with the question: "Can Rust do web?"

The laconic answer is: "Yes."

You can do web in brainfuck too, if you really put your mind to it. But should you? To understand when to use Rust and when it's just overkill, you need to understand what Rust actually is. And for that, you need to understand how compilers and processors work. So buckle up — we're going on a little journey through the history of compilation.

### Act Number 0: Introduction

I've been teaching programmers for about 10 years now. People come in with wildly different levels of understanding. Some ask me about MMX optimization and how to properly align memory. Others ask whether you can compile Java to C#.

The difference between these two types of people is their understanding of how the processor works. If you know what's happening under the hood, you can make sense of any language, any framework, any hype train. If you don't — well, you're stuck copy-pasting from StackOverflow for the rest of your career.

Don't be scared. I'm not going to drown you in electrical engineering. I'll explain it in human terms.

### Act Number 1: The Processor

Everything starts with the processor. When you buy yourself a shiny Intel Core i9, it comes with a cute little booklet — a few pages of installation instructions. "Insert here, don't bend the pins, apply thermal paste."

But the real manual? The real manual is a 50 MB PDF, 5000 pages long, sitting on Intel's website. That's the document that tells you what the processor actually does.

So what does a processor do? At the most fundamental level, it executes three types of commands: arithmetic (add, subtract, multiply), logical (compare, AND, OR), and input/output (read from keyboard, write to screen).

The processor has registers — tiny, blazing-fast storage cells right inside the chip. AX, BX, CX, DX, and a bunch of others. These are where data gets manipulated. You load a number into a register, perform an operation, and store the result.

"But wait," you say, "what about RAM?" Great question. Memory is slow. Compared to the processor, RAM is like a sleepy postal service. So between the processor and RAM, there's cache — a small chunk of very fast memory, anywhere from 2 to 32+ megabytes, depending on your chip.

Now, let's talk about why modern processors are beasts. Imagine you're playing a 4K game. That's 3840 by 2160 pixels, times 60 frames per second. You need to process roughly 2 billion pixels per second. How does the processor pull this off? SSE instructions. These bad boys can chew through 16 values in a single clock cycle. Modern processors have entire modules dedicated to video processing, encryption, and even neural network operations.

And then there are interrupts — the mechanism by which the processor handles I/O. You press a key on your keyboard, the processor gets interrupted, handles the input, and goes back to what it was doing. Want to draw something on screen? Interrupt. Want to read from a disk? Interrupt.

Here's the catch, though. Different processors — Intel, AMD, ARM — have different instruction sets. Different opcodes. If you write a program using raw opcodes for an Intel processor, it won't run on ARM. You'd have to rewrite the entire thing. That's not great.

### Act Number 2: Assembly

So humans, being clever creatures, said: "What if we replace these numeric opcodes with something readable?"

And thus, assembly language was born. Instead of writing `0x06`, you write `mov`. Instead of memorizing hex codes, you use mnemonics — human-readable names for processor commands.

```asm
INC COUNT         ; Increment the memory variable COUNT
MOV TOTAL, 48     ; Transfer the value 48 in the memory variable TOTAL
ADD AH, BH        ; Add the content of the BH register into the AH register
AND MASK1, 128    ; Perform AND operation on the variable MASK1 and 128
ADD MARKS, 10     ; Add 10 to the variable MARKS
MOV AL, 10        ; Transfer the value 10 to the AL register
```

Now here's the nice part: a compiler (called an assembler, in this case) can optimize your code for a specific processor. One assembly program can be compiled for different processors, and the assembler handles the translation. Want to target Intel? Use the Intel assembler. Want ARM? Use the ARM assembler.

But writing assembly is still tedious. You're still dealing with registers, memory addresses, and low-level details for every little thing. Want to add two numbers and print the result? That's 15 lines of code. Want an if-else statement? Good luck.

So they created higher-level programming languages. And C appeared in the late 60s — early 70s. And it's still alive and kicking today.

### Act Number 3: C and C++

C was a revelation. It replaced long sequences of assembly instructions with readable, concise commands.

Instead of writing:

```asm
cmp ax, bx
jl less
mov cx, ax
jmp done
less: mov cx, bx
done:
```

You could write:

```c
if (a > b) {
    c = a;
} else {
    c = b;
}
```

Beautiful. Standard libraries appeared — `printf`, `scanf`, `malloc`, and friends. You didn't need to know the opcode for printing a character to screen anymore. Just call `printf` and let the library handle it.

Here's how compilation works in C. You write your `.c` files. The compiler turns each file into an object file — machine code, but with unresolved references. Then the linker takes all the object files and stitches them together into one executable, resolving all the function addresses.

C was simple, standardized, and portable. Write your code once, and compile it on any platform that has a C compiler. And pretty much every platform had a C compiler.

But. There's always a but.

32-bit versus 64-bit programs. Different operating systems — Windows, Unix, Mac — each with their own system calls and quirks. Your "portable" C code starts sprouting `#ifdef` blocks like mushrooms after rain. Makefiles appeared to manage the increasingly complex compilation process.

Then C++ came along in the early 80s and added object-oriented programming — classes, inheritance, polymorphism. The difference between C and C++ truly deserves an entire book to explain properly, but this article is about Rust, so let's keep moving.

### Act Number 4: Java and .NET

By the mid-80s, things had gotten complicated and very much unportable. Different processors, different operating systems, different compilers generating different code. The ecosystem was a mess.

Someone had a brilliant idea: what if we don't compile to processor code at all? What if we compile to some virtual code, and then run that virtual code with software?

Java appeared in 1995. .NET appeared in 2002. Both took the same approach.

Your code gets compiled into an intermediate language. In .NET, it's called CIL — Common Intermediate Language. Here's what a simple HelloWorld looks like in CIL:

```
.method private hidebysig static void Main(string[] args) cil managed
{
    .entrypoint
    .maxstack 8
    IL_0000: nop
    IL_0001: ldstr "Hello World!"
    IL_0006: call void [mscorlib]System.Console::WriteLine(string)
    IL_000b: nop
    IL_000c: ret
}
```

Looks a lot like assembly, doesn't it? That's because it essentially is — assembly for a virtual processor.

And here's the trick: JIT compilation. Just-In-Time. When you run your program, the CIL code gets compiled on the fly into native machine code for your specific processor. Right there, right then.

The advantage? If you upgrade from a 32-bit machine to a 64-bit one, your program automatically gets optimized for the new architecture. You don't recompile anything. The JIT compiler handles it.

Another advantage: multiple languages can compile down to the same intermediate code. C#, F#, Visual Basic — they all compile to CIL. On the Java side, you've got Java, Kotlin, Scala — all compiling to JVM bytecode.

### Act Number 5: JavaScript

And then someone asked: "Why compile at all? What if we just... execute instructions one by one?"

Enter JavaScript.

No compilation. No intermediate language. Each line of code gets read, interpreted, and executed right there in the browser. Wonderful! No compiler hassles, no build steps. Write your code, open it in the browser, and it works.

But then people wanted it to be fast.

The browser wars of the 2000s kicked off. Internet Explorer 6 won the first round, and then everything stagnated. Then Mozilla appeared with Firefox. Then Google appeared with Chrome. And suddenly everybody cared about JavaScript performance again.

Google's V8 engine won the speed battle. It was so fast that someone looked at it and said: "What if we rip this engine out of the browser and just... use it on the server?" And thus, Node.js was born in 2009.

Now you could write one language — JavaScript — and run it on any machine. Client, server, toaster, doesn't matter. One language to rule them all.

But. Here's the thing.

A C program compiles to native machine code. No overhead. No framework. Just raw ones and zeros that the processor chews through.

A Java or .NET program needs a 200+ megabyte framework installed on the machine to run.

A JavaScript program? The memory overhead is terrifying. Go look at your Chrome's Task Manager right now. I'll wait.

But does it matter? Computers have gotten tremendously powerful. In the early 90s, we had about 8 million operations per second. By 2010, we had 3 billion operations per second, with 8-16 cores, plus a GPU that could handle another few billion on its own.

For business applications — showing three currency exchange rates on a webpage — the difference between 25 milliseconds and 250 milliseconds is absolutely irrelevant. Nobody cares. Nobody notices.

For games? For real-time systems? For processing millions of requests per second? That difference matters tremendously.

### Act Number 0x00000000: Memory

In the ancient times of computing, programs had full, unrestricted access to all of memory. Your program could write to any address, read from any address, and there was nothing stopping it. You could crash the system, format the disk, or do whatever you pleased. Writing a virus was trivial — just plop your code into the right memory address, and off you go.

In 1985, the "protected mode" was introduced to processors. This brought us virtual memory. Now, when your program wants memory, it asks the operating system nicely. The OS allocates a chunk of physical memory, but gives your program a virtual address. Your program thinks it's writing to address `0x1000`, but in reality, the OS has mapped that to some completely different physical address. And if your program tries to access memory it hasn't been allocated? The OS smacks it down with a segmentation fault.

Now let me tell you a programmer joke.

> Pinocchio had 5 apples. He ate 2. How many are left? You think 3? Nope — 32,764! Because who's going to initialize that memory for your variables?

This is the problem. When you request memory from the system, it gives you a block of raw, uninitialized bytes. Whatever was left there from the previous program is still sitting there. If you forget to initialize your variables, you get garbage values. And garbage values lead to bugs that will make you question your career choices.

But it gets worse. Memory leaks. You request memory, use it, and then... forget to free some of it. One little allocation here, another one there. Your program slowly accumulates garbage like a messy apartment. And if you delete the pointer to allocated memory? Well, congratulations — that memory is now lost forever. You can never free it. It's just sitting there, occupied but unreachable.

And null pointer access? Oh, don't even get me started. Trying to read from a null pointer is like trying to open a door that doesn't exist — your program crashes, and everybody's having a bad day.

Memory management is serious business. Tools like PVS-Studio and various sanitizers exist specifically to catch these bugs, because humans are absolutely terrible at managing memory manually.

### Act Number 0xFFFFFFFF: Meet the Garbage Collector

"What if," someone said, "we just... handle memory automatically?"

And thus, the garbage collector was born. The platform itself tracks which objects are still in use and which ones are garbage, and it periodically cleans up the mess. You don't have to worry about freeing memory. You don't have to worry about dangling pointers. The garbage collector has your back.

For a business application that shows three currency exchange rates on a screen? Brilliant. Absolutely perfect.

For an application that handles an infinite scroll of video files and processes gigabytes of data? Not so much. Because the garbage collector might suddenly decide it's cleanup time, request 8 GB of memory for its operations, and freeze your entire application while it tidies up. Hope your users enjoy staring at a loading spinner.

This idea migrated to JavaScript too. And honestly, it's not a bad idea. It's just expensive. You're not just running your program — you're running your program PLUS another program that watches your program. It's like hiring a babysitter for your code.

### Act Number 6: LLVM

It's the 2000s. Java and .NET are battling for enterprise dominance. JavaScript is quietly conquering servers. And C/C++ is getting shaky. There are too many compilers — GCC, MSVC, Intel's compiler, and a dozen others — each with their own quirks, bugs, and incompatibilities.

Apple has a particular problem. They want everything proprietary, but they're using GCC, which is licensed under GPL. The GPL license means that if you use GCC in your toolchain, your modifications have to be open-sourced. Apple doesn't like that one bit.

Then, in 2003, a kid named Chris Lattner from the University of Illinois shows up with his PhD project: LLVM.

LLVM is a new compilation system. The idea is simple and elegant. You compile your source code into a low-level intermediate language (LLVM IR). Then, from that intermediate language, you compile to native binaries for any specific platform. No frameworks needed. No virtual machines. Just raw, fast, native code.

Clang — a new C/C++ compiler — compiles C and C++ code to LLVM IR. And LLVM can then output native binaries for Windows, Linux, macOS on x86, x86-64, PowerPC, ARM, AArch64... you name it.

And the license? Apache 2.0. Apple can take it, modify it, make it proprietary, and not share a single line of code. Apple switches from GCC to LLVM practically overnight. Xcode now runs on LLVM. Swift compiles through LLVM.

But here's the really beautiful part. Want to create your own programming language? You don't need to write a compiler for every processor architecture. Just generate LLVM bytecode, and LLVM handles the rest. It'll optimize your code, compile it for any platform, and produce blazing-fast native binaries. LLVM did the heavy lifting for you.

### Act Number 7: Where's Rust?

So LLVM solved the compilation problem. But it was just infrastructure — a backend for compilers. It didn't solve the memory problem. Memory management was still the programmer's headache.

Then, in 2010, the folks at Mozilla tried something new. They started building a language that was C-like, very low-level, with no garbage collector and no 200+ megabyte framework dragging behind it.

But — and here's the trick — it had a fundamentally new memory management system. The borrow checker. Built right into the compiler.

Here's how it works. You write code as if there's a garbage collector. You declare variables, memory appears automatically, and it gets freed when the variable goes out of scope. Sounds like GC, right?

But it's not a GC. The compiler itself analyzes your code and inserts the memory management instructions at compile time. There's no runtime overhead. A similar C program would be exactly as fast — because the memory management code is baked into the binary, not running as a separate process watching over your shoulder.

And the best part? The compiler tells you. At compile time. "Hey, line 10, you've got a potential memory error here." Not at runtime, when your server crashes at 3 AM. At compile time. In your IDE. Before you even run the program. Fix it now.

Now let's talk about zero-cost abstractions.

In C, `fork()` creates a copy of your running process practically instantly. It's a system call — the OS handles it with minimal overhead.

In .NET, `Thread.Start()` might execute 50+ additional commands behind the scenes — setting up the thread context, registering with the runtime, initializing synchronization primitives...

In Rust, creating a thread is no heavier than `fork()` in C. The abstraction costs you nothing.

Here's an example — an HTTP server in Rust:

```rust
HttpServer::new(|| {
    App::new()
        .route("/", web::get().to(index))
})
.bind("127.0.0.1:8088")?
.run()
.await
```

This is a full web server. It'll handle requests, manage threads, and do everything a web server needs to do. But Rust won't write a thread manager for you. It won't create a pool of worker threads behind your back. You get exactly what you write, nothing more.

So to summarize what Rust is: it's relatively fast (comparable to C), it doesn't require a giant framework, it prevents memory errors at compile time, and it compiles through LLVM to native code for any platform.

The downside? It's hard to learn. You need to understand computer architecture. You need to understand memory — the heap, the stack, how allocation works. You can't just declare variables willy-nilly and hope for the best. The compiler won't let you.

### Act Number 0xFE: Conclusion

So how do you choose a language for your project?

Know your project. Understand the load, the lifetime, the maintenance requirements.

Need a quick script to parse a CSV file? Write it in anything. Python, JavaScript, bash — doesn't matter. It's a one-off job.

Writing a driver? Try Rust.

Programming an Arduino on ARM? Try Rust!

Building a web application for 200 office workers who update spreadsheets? Node.js is perfectly fine. Don't overthink it.

2,000 users hitting your backend? C# or Java. Mature ecosystems, tons of libraries, well-understood patterns.

200,000 users? Now we're talking. Consider Rust.

Got a Docker microservice written in Java that takes up 200+ MB of RAM just to sit there and breathe? Rust could shrink that down to 20 MB. Think about what that means for your AWS bill.

Rust is used in Discord (they replaced a Go service with Rust and saw massive performance improvements), Azure IoT, OpenDNS, Firefox (obviously), and the Linux kernel (as of recently). These aren't toy projects. These are serious, production systems that need speed and reliability.

Rust is for serious systems programmers who want speed and are ready to design their applications with memory and performance in mind from day one.

If you're working with WebAssembly — definitely try Rust. LLVM compiles to wasm natively, and Rust has excellent wasm tooling.

But here's my honest advice: writing web applications in Rust is only useful if you're already comfortable with C or C++. If you're coming from JavaScript or Python and you've never manually managed memory in your life, you're going to cry trying to parse form parameters into JSON in Rust. There are frameworks that make it easier (actix, rocket), but the learning curve is steep.

### Act Number 0xFF: Learning

If you've decided to learn Rust for web development, here's your roadmap:

1. **Learn Rust itself.** Start with [The Rust Programming Language](https://doc.rust-lang.org/book/) — the official guide. Read it in the order I described in the previous article (Chapter 4 first!).

2. **Learn [actix.rs](https://actix.rs/).** This is the advanced web framework for Rust. It's fast, mature, and battle-tested in production. It's not the easiest to pick up, but it's the real deal.

3. **Try [Rocket](https://rocket.rs/).** Rocket has a simpler, more elegant syntax that feels closer to what you'd expect from a modern web framework. But it requires the nightly Rust compiler, which isn't great for production stability.

4. **Learn [diesel.rs](https://diesel.rs/).** This is the database framework for Rust. If you're doing web, you're doing databases. Diesel is your ORM.

5. **Learn [serde](https://serde.rs/).** Serialization and deserialization. JSON, YAML, TOML, MessagePack — serde handles it all. You'll use it in every single web project.

6. **For WebAssembly:** look into [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen) and [wasm-pack](https://rustwasm.github.io/wasm-pack/). These tools let you compile Rust to wasm and call it from JavaScript.

Lots of reading, even more learning. Install the Rust compiler and start experimenting. Break things. Fight the borrow checker. Lose, learn, and try again.

Good luck!
