---
title: "Why I Still Don't Believe in AI"
slug: "why-dont-believe-in-ai"
date: 2025-08-02
description: "A programmer's take on the AI hype: a system that needs constant babysitting isn't a working system. And 'AI everywhere' is just another kind of stupidity."
lang: "en"
tags: ["AI", "programming", "opinion"]
---

*(Image: a stylized portrait of a woman in a leather jacket holding up a cube labeled "AI".)*

Like many here, I'm a programmer. I studied programming from 2003 to 2008, although before that I was already drawn to tech, coding, and similar pursuits.

Before diving into my reasoning, I want to clarify a few points.

### Chapter Zero: Defining Two Key Terms

First — and very important — point: Stupidity is when you didn't know what was supposed to be there in the first place.

Imagine you walk into a house to hang your keys on a hook… except the hook isn't there because someone removed it. Your keys land on the floor and you look foolish. Not too hurtful — and later it's kind of funny once you realize you didn't know the hook had been moved. But one can give a more costly example: standing at a car service center, listening to someone telling you your car is wrecked because you filled a diesel engine with gasoline — you didn't even know your engine was petrol-powered. That's expensive, painful stupidity. Every time you've ever felt stupid, it's because someone assumed something, and you didn't know.

Second, equally important point: Something only counts as working if it functions on its own, without supervision. You shouldn't need to prop it up, nudge it, patch it, or grease it so it runs.

Yes, most machines require maintenance — like changing oil or running antivirus on a server — but those are routine known actions. If to print a page on a "new" printer you need to open a new app, click "Exit" three times, switch to the old app, then reopen the new app — that is not a working application. It's broken.

Then — here's something: my degree says I'm a software engineer. The word "engineer" implies I can invent, build, maintain, and manage software and hardware. I can set something up, create something new, or remove something unneeded. Whether it's a mouse driver for Windows 95 or a distributed system on Kubernetes — I can handle it. If I don't know how, I have the tools to find the instructions, learn, understand — and then I'll tackle the mouse driver or Kubernetes.

Finally — the main point: A computer is a device that gathers, stores, processes, and transmits information. Processing means executing a precise sequence of commands encoded into the machine.

### Chapter One: What Programming Truly Is

Programming is an exact science. I can precisely predict what will happen when a command runs, and I can estimate system reliability within defined probabilities. There are well-known methods to build fault-tolerant systems.

We can build systems where any node can be swapped on the fly. Real-time systems guarantee a result within a strictly bounded period — used in rockets, aircraft, telecom stations. Banking systems handle numbers with extreme precision to track balances and compute fees so accurately that clients don't notice.

Computers can repeat the same task infinitely without deviation — and that's why we need them. Nobody wants to sit in Excel and add up numbers manually. In fact, the term "computer" originally referred to people doing arithmetic calculations for space and military agencies in the 1950s.

### Chapter Two: And Here Comes… AI!

It's 2025. We now have so-called "artificial intelligence."

It's touted as an incredible system — because it does things not like traditional computers. Under the hood, it's mostly matrix multiplications with random noise added to responses, letting us shuffle data in novel ways.

But here's the issue: introducing uncertainty into a computer's output fundamentally violates the definition of "computer." A computer should always give an exact answer.

I'm seeing massive sums poured into AI — literally a black hole of hype drawing in dollars. It's overhyped to absurd levels. NVIDIA went from making GPUs for gaming, to selling to cryptocurrency miners — and now AI folks throw money at them nonstop. The NVIDIA AI processor is $35,000 a piece. Bulk buyers pay up to 150,000 a card in one lot.

Energy? That's another nightmare. In the U.S., investors are dumping cash into power plants just to feed AI farms. I'm dead serious. I can help — if you have a company that builds power plants — contact me. We need to spend $250 billion by year's end.

All that is to keep AI running.

Which is fine! NVIDIA hasn't collapsed — the market is booming.

But the question remains: What is the point of AI? What's the purpose? What's the actual output?

Sure, it's obvious: AI helps process large amounts of data fast. That's great. I don't have to write code by hand — bots do it for me.

But the problem: no AI model can ever guarantee 100% correctness. That severely limits its use in programming. Check the discussion in the next thread — we say that no matter how well you engineer it, sooner or later, something's gonna go haywire and it starts spitting nonsense. Your AI assistant isn't a working system. It needs care.

When working with AI, you must strike a precise balance. You need to know exactly how much work you can offload and how much you must do yourself. If you ignore AI, you'll be too slow. If you overuse it, you'll waste hours debugging AI-generated junk.

Striking that balance can notably speed up work. How much depends. But you can speed up.

The danger is rampantly over relying on AI — it'll quickly lead to absolute stupidity. Mistaking `rm ./* -rf` (a command that deletes all the files in a folder) for `rm . /* -rf` (a command that deletes all the files on your computer) would be fatal. Misunderstanding AI-generated commands can cost jobs. Production gets deployed no matter how messy. AI-written code goes live unreviewed.

I see this from the banking world. When you suggest using AI, bankers look at you like this.

### Chapter Three: Who Actually Needs AI?

Imagine a financial accounting system written in the 1980s. No one changes it — there's no need. What matters is that it produces in 2025 the same outputs it did in 1990.

Plus, AI systems suck at any kind of specialized programming.

Interestingly, AI systems excel at very narrow tasks — predictive modeling and big data handling. Look at Google's weather-prediction models. "Predicting." We still aren't sure of the outcomes. The question "Will there be a hurricane in Florida?" matters. For now, it's 50/50 — either it happens or not. We don't know.

But here come LLMs and big-data analytics: we can offer more nuanced — but still probabilistic — insights.

AI text processing is useful. "Rewrite this text and replace all 'you' in informal form with formal 'you'." Easy. "Rewrite in an archaic style." Done. Then you just proofread it. It's serviceable.

LLMs work well for tasks where exact precision isn't required. You could open Word and do a global find-replace — but the result would be awful. Thanks to LLMs, we can replace "you" to "you" with 99.95% accuracy.

Translations? Sure, if you don't need a perfect literary translation. The LLM might use incorrect shades or idioms, yet it will be better than any google-translate you can get.

That saves hours trying to decipher a weird translation.

But it's useless when you need a film translation or a poetic rendering.

### Chapter Four: The Human Factor

The hardest hit zone is the human factor. Suppose you run a business and need a programmer. You post a job listing somewhere and use an LLM to filter resumes.

If you only have three programmers, you won't see the fourth quickly. But if you have ten thousand candidates and 1,500 resumes per day per job, you can't hire without AI.

Here's the thing: any "no" that AI sends on someone's resume has some legitimate reason. You can't just hire through AI. You need to talk to the candidate in person.

That's when you learn: AI might admit the worst monster you'd never want to work with — or reject an excellent person who doesn't memorize high-level theoretical math.

### Conclusion

What they say: AI is a gold mine with no downside.

Reality: AI is just another technology you must study, know, and learn to apply.

Any idea, however brilliant, gets ruined if used too little or too much. AI everywhere is stupidity. AI once a month in ChatGPT is falling behind.

Don't fall for every marketing pitch. Instead, ask for sales charts and earnings figures from those companies pushing "AI must be everywhere."
