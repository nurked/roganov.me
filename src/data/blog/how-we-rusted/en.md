---
title: "How We Rusted. A Story of Adoption and Learning"
slug: "how-we-rusted"
date: 2021-01-17
description: "A real-world experience of adopting Rust in production — from reading the documentation inside out to replacing 16 Docker containers with a 564 KB binary."
lang: "en"
tags: ["Rust", "systems programming", "learning", "DevOps"]
---

Everyone kept saying — switch to Rust! Start using the most beloved language on StackOverflow and all that.

I sighed heavily and looked around. Here we go again. Fine, let's figure out how to properly rust everything over.

I've been programming professionally for 17 years. In the distant past, I started learning programming with x86 Assembly. This brutal approach to learning computers gave me a deep understanding of how the processor works and what other programming languages actually do. Learning new languages was never a problem for me. I just learned them. C, C++, C#, Go, thousands of different scripts and frameworks. What the heck, just another language to learn.

Yeah. Except not with this rusty wreck. I spent two weeks staring at the official guide, squinting at VSCode, and couldn't squeeze out more than `fn main() {}`. What the hell?

I just closed my eyes, opened the guide at a random page, and started reading. And the funny thing is — I understood what it was talking about. And then it hit me… The guide is written inside out. The beginning and the end are no better than in Christopher Nolan's Memento. They somehow managed to tangle up what is otherwise a perfectly fine guide.

After that, things got better. The rusty gears creaked and started turning. The program took off. If you want to know how I deployed Rust in production, how I learned it, and what came of it — welcome. Real people, commits, examples, and no todo-lists or hello-worlds. If we're rusting, we're rusting all the way.

First — let me quickly tell you what I replaced with Rust. Once upon a time there was a lab tech. He was told: "Write a little program — connects to this system, downloads binary data over the network from a port, converts it to a human-readable format, and saves everything to a database." The lab tech was a very curious go-getter. Why not show off? So he did. He wrote a C# program that connected to a server and pulled data from a computer. It converted the data to JSON, available through a POST API. He wasn't great friends with C#, so he decided to save to the database using Node.js, which called the C# program, received the JSON, did a bit of logic, and pushed it to the database (PostgreSQL). A web interface was bolted on top of this to manage settings. All good, but we had no search over the received data. The lab tech said: "No problem! I'll fix it!" and slapped Elasticsearch on top of everything. Maintaining all of this became scary, so the lab tech said: "I'll fix that too!" and wrote a bunch of Docker files, put everything into containers, made a docker-compose, and everything worked.

About a year later, I came and looked at the whole thing. A full database dump weighed 250 MB. Data growth was 50 megabytes per year. Trivial task. But all of it was running on a dedicated server with 32 gigs of RAM and 24 processors. The server was howling and buzzing because it had to run 16 Docker containers with an Elasticsearch cluster that kept crashing from overload.

Oh dear. I thought. Something must be done. I had enough time, so I decided — why not try Rust?

### Act Number 0: Introduction

Sure, there are YouTube videos and all that, but I come from a different era. When we learned C++, the only thing that helped was a fresh CD with an MSDN dump. We love proper docs.

And what do you know? Docs exist. And they're even in pretty decent shape.

**The Rust Programming Language** — a wonderful book that covers all the main aspects of the language and shows how to use it. The book is notable for first leading you into an impenetrable swamp full of demons, goblins, and reptiles, and then trying to pull you out. (600 pages)

**The Rust Reference** — a complete, thorough, and meticulous guide that tells and shows you what every squiggle on your screen does. Want to know how Rust will lay out your wonderful `enum` in memory? This is your book. An absolutely human-unreadable guide that covers everything. (300 pages)

**Rust Compiler Error Index** — Rust has a wonderful feature. Their compiler is so chatty that you won't even need a rubber duck for conversations. While writing a program, you'll enjoy walls of compiler errors. Just an incredible number of them. In this wonderful tome, all these errors are thoroughly described and explained. (400 pages)

**Rustonomicon** — everyone who's gotten somewhat started with Rust will tell you about "the Nomicon." This book of dark magic lets you slay your enemies and divine the future from coffee grounds. All the terrifying aspects of Rust are revealed right here. (200 pages)

Quite a hefty amount of documentation for a language. All of it is publicly and freely available. I read it in the original, but translations exist. Alright, let's dive in.

### Act Number 1: What Are You Talking About, Morpheus?

Every time I see an article about Rust, I see cute crabs, kittens, and fluffy remarks about how beautifully this rust looks on my new server.

But let's look at the world more seriously — why Rust after all? Code generated by Rust uses LLVM as a compiler. What does that give us? Pretty decent cross-platform portability with zero need for different frameworks. A Rust program will be practically as fast as a C program.

What difference does it make if Rust is as fast as C or if C beats it by 5%? Don't worry about it. The point is that Rust is a systems programming language that lets you work with your hardware at a very low level and doesn't carry millions of abstractions and frameworks.

Let's look at this:

- Project written in .NET Core 3: Executable — **6 Megabytes**.
- Project written in Rust: Executable — **240 Kilobytes**.

Haha! But these numbers are a setup and a trick! Lousy marketers.

I take this project, copy the executables to a flash drive, and run them on another computer (Windows 7). And what do you think? The .NET Core project won't start! Why? No framework.

Fine, let's recompile the project to include all libraries needed to run the application.

Result? **89 Megabytes!**

Haha! Take that, .NET! Sneaky! Trying to fool me!

Alright, now let's launch our Rust project. See, you just click here and…

```
The program can't start because VCRUNTIME140.dll is missing from your
computer. Try reinstalling the program to fix this problem.
```

Fine, we rebuild the project and bake all dependencies into the executable and… **569 Kilobytes**.

Hm. Not bad, actually. Considering this thing connects to a database and all that. That's a systems language for you.

There aren't that many frameworks and bells and whistles. Some things will be trivial and super-fast, while others will drive you mad. But what you write won't drag along gigabytes of different libraries and overload servers until they howl louder than hungry cats. Ready?

### Act Number 2: Learn, Learn, and Learn Some More

Here's an example. On page 38 of the official guide (600 pages), there's a simple "guess the number" game. The computer picks a number, and you sit there guessing it. Trivial, Watson, right?

No.

Not one bit trivial. This "simple" program for "beginners" is loaded with pitfalls, landmines, and anti-aircraft bombs.

The thing is, despite its C-like appearance, Rust includes an incredible amount of syntactic sugar and goodies that compile into decent and fast code. All these goodies confuse you to death if you don't understand them.

No, no, no, and no again!

**The first chapter of this guide should burn in a furnace!**

Let me show you how to read it.

You should start reading this guide **from Chapter 4**, called "Understanding Ownership." Figure out the rules of variable ownership. If you've started working with Rust, you'll have to learn and understand these rules. This is exactly why and how Rust is so wonderful.

Memory management has always been a bottleneck of many programs. When you write your JavaScripts, you rarely worry about memory. The result? Look at how much memory your Chrome is eating right now. Here, memory is handled by the so-called garbage collector, which knows what to clean and where.

But if you need to write code that moves faster, then swap the garbage collector for manual memory management. We always did that in assembly. Screwing up memory management is practically sacred.

First you have to request memory from the operating system. Then you receive it, then clean it properly, then initialize it, then finally use it. After that, you must remember to give it back to the system. And after you give it back, you must remember to delete all references to that memory so nothing reads from it anymore.

In Rust, this is solved as follows: create a reference to a new object — the compiler will quickly insert code that requests memory from the system, cleans it, and initializes it. And after your reference goes out of scope, the compiler automatically adds code that frees the memory at that reference and returns it to the system. Simple and beautiful. Easy-peasy! Yeah.

If you don't figure out how these rules work, you'll sit in front of your monitor for hours, crying and begging the compiler to build your code. Code where you manage memory incorrectly won't compile. Period.

Example:

```rust
let s1 = String::from("hello");
let s2 = s1;
println!("{}, world!", s1);
```

The simplest code that any programmer understands. It absolutely won't compile in Rust. Why? Because with this kind of assignment, there's a possibility of the system freeing memory twice, which could lead to an error.

Alright, enough scaring you.

Read the Ownership chapter and figure out how this memory stuff works. Fortunately, the chapter is well-written and explains everything in order.

### Act Number 3: Everything in Order

After Chapter 4, you should read Chapter 3.

Amazingly, some people have a strange understanding of the word "Number." They mix them up.

Chapter 3 covers the basic concepts of the language. How to work with what, how to create variables, branch your program, and so on. All this information is actually tied to understanding Chapter 4.

Alright, basics done. Now go through Chapters 5 (Using Structs), 6 (Enums and Patterns), and then read Chapter 8 (Collections). This gives you an understanding of the basic objects and how to work with them.

After that, I recommend re-reading Chapter 4. New horizons open up.

Now you can confidently move to Chapter 9 (Error Handling).

Rust has a twist — it has no concept of Null. If you Google "Null is a mistake," you'll understand what I'm talking about. A significant number of developers have been complaining since 1965 that the concept of Null as a variable value was a wrong idea.

Rust got rid of the idea of Null, and this leads us to a very interesting, pleasant, and understandable error handling system.

Chapter 7 explains how to split your program into pieces so you don't have to write all your code in one file. After that, move on to Chapter 10 and learn about generics, traits, and other such gizmos.

After this, it's recommended to re-read Chapter 4. Consciousness expands.

After Chapter 10 come Chapters 13 and 17. They explain that Rust has traits of both functional and object-oriented languages, and describe how to use all these gadgets.

After all of that, you can move on to the two most jaw-breaking chapters in this book — 15 and 16. While reading these chapters, it's recommended to re-read Chapter 4 after every paragraph. Why? Because if you struggled to understand memory management in a regular program, understanding memory management in multithreaded programs will be a champion's pursuit.

But don't be afraid. The chapters themselves are well-written — it's just the order that's wrong.

Alright, after this — you're the master of the house. You can start re-reading the book from Chapter 1 and then move to Chapter 2. The "guess the number" exercise will seem like child's play (which it is). Then go through all the remaining chapters and read thoughtfully. After all of this, you'll be able to write Rust.

And by the way, it's not that hard — all in all, it took me about a week after I figured out these chapters. The book is available in Russian on GitHub, but even in English, it's quite simple and readable.

After reading this book, you'll gain a couple of special skills:

1. You'll know what's actually written in the Nomicon. (Though you won't venture in there.)
2. You'll be able to read The Rust Reference.

With this knowledge, you can actually sit down and start developing your first project that's more complex than a todo-list.

### Act Number 4: Realities

Real-world development brings its own specific knowledge.

The experiences and opinions I'm sharing with you are purely my own — your perception of the world may differ.

The first thing you'll understand is that the compiler doesn't forgive a huge number of mistakes. Yes, of course, that's good because those errors won't make it to production. But on the other hand — building a prototype in Rust in a couple of minutes won't happen. If you somewhere said "There should be a number here, but in 1% of cases it might not be there," you'll have to write that branch handling the 1% case. The code won't compile.

Those who didn't master Chapter 4 will play the wonderful game of "Convince the Compiler to Compile Your Code." All the memory management rules that make Rust so soft and fluffy force you to think differently about your program's architecture. No dangling tails or unfinished code chunks. If you just try to write a program off the cuff, you'll likely spend hours getting it in order and compiling.

Next comes the software catalog **crates.io**.

This is a site where you can download a decent number of modules and libraries for your Rust application. The site actually contains a huge amount of code. But reality isn't always wonderful.

For example, I had to spend about 2 hours finding a decent library for working with PostgreSQL. Everything was fine, and I worked with this library for about ten hours until I ran into a very interesting problem. Rust has no built-in type for currency operations. Float won't work — I needed something like Decimal. I managed to find Decimal as a library, which I reluctantly downloaded and added to my project. And then it suddenly turns out that the PostgreSQL driver has no idea how to convert this Decimal to a Postgres Decimal.

I had to spend 4 hours figuring it out and writing a converter.

Another rather ugly aspect of Rust is package documentation. Yes, Rust has a built-in code documentation system, and you can always pull docs that are auto-generated from code comments. But these docs often leave much to be desired. The same Decimal from the example above has wonderful documentation that says the following — "This is Decimal. It lets you work with Decimal. Work. God bless you!"

I had to dig into the source code until I figured out how to write that converter.

On the other hand, mature projects have good websites with tons of additional documentation. For example, tokio, actix, and rocket.rs.

### Act Number 5: Results?

The good old smoking and roaring server calmed down and stopped overheating. The 100-megabyte C# application was replaced by 564 kilobytes of Rust code. The 200 megabytes of memory consumed by the C# app became 1.2 megabytes of RAM for the Rust program. (I also got rid of two Docker containers the app was running in.)

After three weeks of learning the language, it took me about a week to rewrite the application. While I was at it, I looked at the whole setup of Dockers and YAML files and started disassembling it. Removed Elasticsearch. Seven Docker containers sank to the bottom. As it turned out, most data searches were done as follows — the user selects dates in Elastic and then downloads a CSV. Then all the searching happens in Excel. Elastic was replaced with a simple CLI command that could dump CSV by date, which was perfectly doable from PostgreSQL.

Next came the web interface for settings. (A couple more containers float off into the ocean.) There turned out to be about 12 settings, and I stuffed them into a TOML file that my Rust application simply reads. Another Docker container gone. The whale was left swimming alone, with no containers. It got offended and swam away. Docker could be uninstalled.

I looked at the server. Only PostgreSQL and my wonderful Rust application remained. I dumped everything onto a Raspberry Pi and showed everyone the wonders of optimization.

In the example above, Rust wasn't the only reason the servers stopped screaming from overload. The application design was nonexistent. Everything was cobbled together hastily and carelessly glued with Docker, because that's just how things are done. I think that if I had completely rewritten everything in C#, the resulting application would have been about 100 megabytes and would have sat there consuming 250 megabytes of memory.

It just doesn't compare to half a megabyte on disk and one and a half megabytes of RAM. I felt as good as I did in childhood, when I ran my assembly programs and watched how a mere 20 kilobytes of ones and zeros created stunning visual effects on screen.

Rust is fun. After you read their documentation.

### Act Number Last: Conclusion

Rust is a solid programming language. It's not designed for prototyping applications. You can't develop an agile project in Rust in 20 minutes. Rust requires a good understanding of systems programming.

While Rust isn't as complex as C in memory management and references, it demands very careful and properly planned application design, and like C, it doesn't forgive mistakes. But unlike C, many of these mistakes will be caught at the compilation stage, before your application goes to production.

Use Rust in isolated projects? Yes! If you know how.

Replace a simple system utility that some lab tech wrote for you in Node.js in 2 hours and that's overloading the server? Yes! Go for it!

Add Rust to existing C and C++ projects? Think again. Rust forces you to think differently. And all those wonderful memory management features that exist in Rust also exist for C and C++. You have to install and configure them separately, of course, but if the project is already many years old, maybe don't. Let it be.

So go ahead, get rusty. It's fun here.

*P.S. Hobby — disassembly. I take apart overloaded server applications. Remove Docker. Reduce AWS bills.*
