---
title: "Don't Even Think About Rewriting the Code? Seriously?"
slug: "dont-rewrite-the-code"
date: 2025-04-08
description: "LinkedIn is clutching pearls over the idea of rewriting the U.S. Social Security codebase. In 2025? With LLMs? Let's wake up — rewriting business logic costs pennies now."
lang: "en"
tags: ["AI", "programming", "industry", "opinion"]
---

*(Illustration: a frazzled old programmer surrounded by stacks labeled COBOL, FOXBOL, FOXBOX, DOSLANG, LLM, TELEX, POS, GOLANG UPGRADE. A smiling CRT monitor asks, "Why not just rewrite it?" Another sticker reads: "DO NOT WORKING CODE.")*

Once again, someone on LinkedIn decided to clown around. Says, apparently, Elon Musk wants to rewrite the entire U.S. Social Security system's software from scratch. Oh dear, what a blockheaded fool — don't ever rewrite something that's been running fine for over 40 years!

Yes, the Social Security code is written in COBOL. And if you want to find developers who can maintain it, you'll need to search high and low and pay them half a mil a year.

You know, a sign of intelligence is being able to tell the difference between things. The more differences you can perceive, the better. Back in 2003, when every developer was on record, when you actually needed a degree to get started, when they paid you well and expected a lot in return — no one was rewriting software just for fun.

But hey, it's 2025 now.

Let's wake up and look around. We have LLMs. And they're already really good. Some of them handle up to a megabyte of context. Meaning, theoretically, something like Claude could rewrite the entire Social Security codebase from COBOL to Go in a single go.

See, code — on its own — has been worthless for a long, long time.

In the old days, you could ask people to mail you 20 bucks in an envelope, and you'd send them back a floppy disk with a game or some useful program. I don't know if punch cards were ever sold this way — probably not. But in the 1980s, you could make decent money off code you wrote over the weekend and advertised in the paper.

Then the internet came along. People started learning a lot more about everything. Software began being sold for platforms. If you ran Windows, you'd pay 10–30 bucks for a good program. People bought WinRAR, Windows Commander, game CDs. At some point, software prices started dropping.

In 2006, the first public Git repository appeared. Linux was already taking over the server OS market, quickly pushing Windows and clunky mainframes aside. Open source became a real thing. Eventually, even market mastodons like Photoshop and Dreamweaver got replaced by less polished but totally free alternatives.

By 2015, the market shifted again. Big corporations realized that code could not only be free but profitable for them. Along came VSCode. A slapped-together project. A hideous lair of spaghetti code, which nevertheless got solid support and financial backing. Eventually, this horror show became the de facto standard for web development. (Side note: [https://zed.dev](https://zed.dev) is years ahead of VSCode.) It also became the de facto standard for siphoning your data, rights, and everything else. Software turned free to serve ads.

You don't need to build a new utility — it already exists. Need to process video? Use ffmpeg. Or fire up DaVinci Resolve — a brilliant studio built with one goal: to turn you into a BlackMagic customer.

Welcome to the latest era in the evolution of software. Today, code is just packaging — it wraps around a subscription to an LLM. Photoshop, Zed, DaVinci — they're not the point. The point is you're subscribing to their service, because they've got the assistant you need.

Programming itself brings in zero dollars. Zero cents. And in 2025, it literally can't be worth anything — unless your code is some deeply obfuscated bytecode for a proprietary chip, its value is zero.

Even if you slap a license on it and demand payment, a few LLM prompts will generate endless clones in no time. And if outright copying isn't okay, you can just have the LLM rewrite it based on the input/output behavior.

Understand this: the definition of a computer is a device that stores, processes, and transmits data. The data part is what matters. The method of manipulating it? Not so much.

Your language, compiler, or stack doesn't matter anymore in the realm of business logic in 2025. Back in 2020, it still mattered. Today, one good engineer can feed an LLM a monorepo with a few hundred microservices and get back a working monolith. Or split a monolith into microservices.

Still suffering from the lack of static typing in JavaScript? No problem — switch to Go. Tired of Go? Rewrite it all in JavaScript. It'll cost you, what, ten bucks? Got more than a megabyte of code? Okay, maybe you'll have to work a whole week and spend a hundred bucks. What a nightmare. Hook up some tests — also written by the LLM — and done.

(This doesn't mean you shouldn't have a good developer steering the LLM. Quite the opposite. Without a solid dev, the LLM will hallucinate nonsense. But a good developer today can produce 100x more code than a "10x developer" from ten years ago.)

Yes, in every specific case, a reasonable developer must sit down and analyze whether rewriting a codebase in a week is justified. Sometimes it is, sometimes it isn't.

Now, back to the U.S. Social Security system.

This country desperately needs to rewrite EVERYTHING from the ground up. Most of its government software was written on mainframes in the 1990s, and it still runs under layers of 60 different emulators just to work on modern CPUs. They've got Informix databases everywhere, Prolog in some places, and even FoxPro peeking out in others.

Know why you can't transfer money in the U.S. just using a card number or phone number? Because most banks use ACH, which runs on TELEX. Don't know what a telex is? Then either you didn't serve in the Navy, or you're under 80. Telex machines looked like typewriters. You'd connect them to the phone line, and when you typed on one, the other typed the same thing back. Of course, those machines are probably long gone (let's hope), but banks still use software that runs inside DosBox, wrapping CSVs in command-line scripts for a telex emulator.

Don't believe it?

Try sending an ACH transfer and include more than 80 characters in the memo field. All ACH processors and gateways will reject it. Dig through your tech support logs, and eventually, you'll get a CRT monitor photo with red text on white saying: "Text too long for line." Why red on white? That's how we did it in DOS.

This system needs to be shaken up. It's been overdue for a shake-up for decades. There's nothing complex about it. The entire U.S. Social Security payment database could easily run on a single iPhone 16 with a terabyte of memory. The system is tiny — execution-wise. But since no one wants to update anything, we'll keep spending millions to build emulators, manufacture LPT printers, hunt down COBOL and Prolog developers, and do all sorts of similar nonsense.

There's nothing hard about this. We've known how to handle financial transactions since the 1990s. For 30 years, we've been able to process thousands of requests per second. 20 years ago, we handled millions. 10 years ago, billions. We know how to do this. It's all open-source. It's all documented. We have LLMs that can translate COBOL to Go. We have hardware cheaper than dot matrix printers. It's all here. All that's left is to do it.

But no — we'll sit around whining that we can't rewrite anything, because "what if something breaks."

To actually understand what you're rewriting, you need to demand data. And the data — they're available. Go here — [https://www.ssa.gov/OACT/ProgData/tsOps.html](https://www.ssa.gov/OACT/ProgData/tsOps.html) — request the numbers. They'll show up right on the screen (by the way, the site looks like it's straight outta 2006). Check how much money flows into and out of the funds. Look at the numbers from 2005. And you'll realize: we don't just need to rewrite everything from scratch — we need to sound every alarm.

Because no matter how many people say "it'll all be fine," you can't cheat the math. Negative numbers speak for themselves. And a sea of them says a whole lot more.

So let's stop pretending we still live in 2003. Rewriting business logic in 2025 costs pennies. You're not building a video codec or training LLMs. You've got tightly codified procedures that can be translated into another language with your eyes closed.
