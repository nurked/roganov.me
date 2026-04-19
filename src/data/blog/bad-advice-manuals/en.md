---
title: "Bad Advice for Manual Writers"
slug: "bad-advice-manuals"
date: 2021-11-08
description: "Why people don't read manuals, how to make docs even worse, and why you should write decent ones — a satirical reverse-advice take on documentation."
lang: "en"
tags: ["documentation", "management", "writing"]
series: "bad-advice"
seriesOrder: 1
---

Recently, someone tried to sell me on TikTok again. The youth were singing praises about how wonderful this new platform is. "Perhaps," I said. "So what makes it so wonderful?"

— Well, you can learn a huge number of new and unknown things there.
— Oh... Really? Okay, surprise me.
— Look! — the naive youngster eagerly pointed at an indicator on the dashboard of his Honda.
— And what's so cool about that?
— See that arrow? It shows which side your gas cap is on, so you remember where to pull up at the pump.

I sighed heavily, opened the glove compartment, and — to the kid's horror — pulled out a battered owner's manual from 2004. After 20 seconds of flipping through said manual, I pointed my finger at that very same icon showing which side your gas tank is on.

— There you go. This was known long before TikTok, and even before Facebook. Hell! This was known before the internet and possibly before the automatic transmission was invented. This was known before your parents were born. Did you read the manual?
— No.
— Clearly.

Let's face it — people don't read manuals. Let's take a look at what advice we can give you to make sure people ditch them entirely.

### For the Nitpickers

I belong to that strange extraterrestrial race that actually enjoys reading service manuals.

Maybe it's because I remember, ever since childhood, how my grandfather constantly brought an old Foton TV set back to life. The box was over 30 years old and broke with admirable regularity. Once a year, my grandfather would pull out a screwdriver, a soldering iron, and a pile of fascinating tools. Then he'd stick a special probe into the tube, and I'd hear a terrifying "bang." That was him discharging the main capacitor so he wouldn't electrocute himself with all those volts. But the really interesting part came next. Inside the TV itself lay IT — the circuit diagram. I simply couldn't take my eyes off this magnificent map of a micro-world that seemed so mysterious and incomprehensible, yet guided my grandfather precisely through every alleyway of that electronic country. A couple of pokes with the probes would usually quickly find a blown capacitor or a burned-out resistor. After that, the box would come back to life and continue serving, giving the Curiosity Mars rover a run for its money in terms of days lived past its service life.

Or maybe it all happened differently. When we were learning to program on computers at university, the internet wasn't yet an infinite database of all knowledge. The crown jewel was the beloved and cherished MSDN. Microsoft's Library of All Knowledge was carried to every class, and the Great Keeper of the Subscription was that very druid dispensing knowledge to all who wished to learn and discover. (For the uninitiated: MSDN was Microsoft's developer documentation, distributed on CD-ROMs and later DVD sets — a physical subscription library that was the gold standard of programming reference before everything moved online.)

MSDN was read for pleasure and for showing off to the professor (hi, @ceba!), demonstrating mastery of obscure functions and earning access to the universally beloved "automatic pass" — where your grade was so good you didn't even have to take the final exam.

Later, in the line of duty, I repeatedly stumbled upon "islands of knowledge." manualslib.com was always the supplier of those coveted service manuals. Those same impossibly voluminous manuals that described every last internal organ of printers, phones, circuits, and controllers. Those same manuals that let you get to the very last solenoid whose rubber gasket had rotted away and was killing a $2,000 printer.

When I was leading a team of juniors who were supposed to be figuring out Docker Swarm, I answered their questions with great interest — by copy-pasting links from Docker's documentation. It hadn't occurred to me that someone would tackle Docker without at least a quick skim of the docs, if only to know where things are and what's where.

People don't read manuals. There are several reasons for this.

First, in the developer world there's now this idea that making users read manuals is evil. We hate the fact that when a user opens our app, they don't immediately start buying the services we need them to buy or clicking the button we need them to click. The most we're willing to give our customer is a quick tour of the main buttons by forcing them to click on said buttons.

Second — the sheer panic-inducing fear of manuals. Instructions have turned into tomes that are equally readable before and after encryption. No matter what the user does, they're not interested / have no time / have no desire. We live on a different planet. We're used to the fact that if a function doesn't return what we need, we're going to go dig through docs.[nameofthecompanygoeshere].org. After reading a mountain of text, we'll figure out that the sixth parameter needs to be non-zero, and we'll finally make the thing work properly.

But even among the ranks of engineers and programmers, there are more and more people who prefer StackOverflow to actually understanding the subject matter.

So, let's figure out how to make sure your manual sinks without a trace, and how to guarantee you'll be getting phone calls at 3 AM when everything goes down.

### Composition

> If you have already decided
> To compose a mighty tome,
> So that everyone at work
> Knows each detail, top to bottom,
>
> Don't you rush to organize it,
> Don't arrange things on the shelves,
> Start wherever — doesn't matter.
> Just make sure you have some words.

Here are some of the most spectacularly awful examples in this category. The California Driver Handbook. This is my favorite book for a good laugh, when I really need one. Besides being written in a jumbled order, it's also machine-translated (into other languages). So you can slide under the table in tears with absolutely no effort. What's so interesting about it?

Unlike Moscow, where you're expected to go to driving school, learn the rules, and only then start learning to drive, California takes a different approach. You need to study this handbook, go to your local DMV, pass a multiple-choice exam, and then you get a learner's permit.

With this permit, you can spend up to a year doing whatever you want and driving anything that fits your vehicle category — but only with someone who has a license sitting next to you. Only after that can you go take the actual driving test. (Heh, and then complain that the roads are full of idiots.)

So anyway, this booklet is 120 small pages of text and can be read in 30 minutes.

But the first 40 pages are taken up by a bunch of fluff: what to do with your documents and which window to go to. Special attention is given to the fact that you shouldn't leave animals and children locked in cars in parking lots, because they die from this. (Indeed, this is a real problem, but for perspective, that's only about 20 parking lot deaths out of 3,500 total traffic deaths per year.)

Information about how to, you know, actually drive a car starts on page 58. In the middle of the book.

Or here's another one. Take any owner's manual for your car. You can have a good time there too. First, you have to read about how to properly install car seat belts for transporting infants. Undoubtedly, this information is very useful for parents of small children, but they're not 100% of the audience. What's the most important thing about a car? It should drive. Information about how to make it go starts after roughly 120 pages about how it breaks and how you shouldn't service it.

Another example of such a manual is the Rust programming language documentation. I've already [written about this](/blog/how-we-rusted/). The first chapter fully immerses the reader in all the hardships of the language. But you can only understand the first chapter after studying the fourth... Quite the dilemma...

Let's look at something decent. Here, for instance, is the manual for a Mackie mixing board. After one page of instructions about how not to electrocute yourself, you're presented with a picture showing how to hook up a guitarist, a bassist, a drummer, and a vocalist and start banging out Deep Purple at full blast. The following pages sequentially walk through examples and descriptions of failure cases (for example, improperly soldered cables). At the end of the document, all the technical specs and pseudo-diagrams are provided, with all the detailed characteristics of the instrument — that is, all the really nerdy stuff.

### Nomenclature

> If you've set out to write
> A manual, big and thick,
> Then don't bother choosing words.
> Name things any way you like.
>
> If the user really needs it,
> They'll go dig the answer up.

Here I can cite one of the most terrifying manuals I've ever had to read in my life. NEC Univerge Phone System Programming.

According to the dictionary, nomenclature is a set of names, terms, and categories used in a particular branch of science or technology.

Well then. This set of terms might exist somewhere in the depths of NEC as a company, but it's not accessible to conscientious engineers. For example, if you open the manual to page 246, you'll see instructions on how to program an ICM Key on the phone. You will have absolutely no idea what an ICM Key is. The manual says nothing about it. Think it's simple — just go Google it? Ha, right! Go ahead, try Googling it, just for fun. You'll discover that this abbreviation is used only by NEC engineers and nobody else. Googling it will be impossible. There is simply no way to find this information on the internet. You'll have to call the engineering tech support line and talk to a specialist. If you're lucky, they'll answer.

These kinds of problems aren't usually encountered by Joe who decided to learn NPM in 20 minutes on YouTube, or Bob who's Googling "how to solve algorithm interview questions" on StackOverflow. You'll run into this when you go work at a real company with real people. Serious enterprise systems always come with a stack of words that nobody outside that system uses.

The names of servers, networks, platforms, and systems that have been second nature to you for the past 5 years while you worked at ${user.CompanyName} have become so ingrained that you can no longer believe anyone doesn't know them. Some people just don't think about it. For example, the word FTP might not mean the file transfer protocol — it might mean a specific server.

PNSV, Desktop, That-One-Card, The Server — these are all those strange colloquial terms that mean nothing to anyone outside your circle.

Moreover, even words that can be found in dictionaries can pose certain difficulties for the reader. Some terms can be interpreted two ways. "Firing" can happen in a kiln or with a blowtorch. (And of course, a completely different kind of "firing" can happen in HR.)

### What You're Talking About

> If in your shiny new manual
> You discuss some tachyons,
> Then don't rush to show the reader
> What a tachyon looks like.
>
> Users nowadays are awesome
> At imagining stuff themselves.

I'm seized with fear and trembling when I recall one particular printer service manual. It didn't have a single illustration.

> Remove the front panel.
> You'll see 6 screws; unscrew them.
> Remove the side panels.
> On the right you'll see two screws and three nuts.
> Rotate the printer 90 degrees clockwise, find the screw under spring number 85, and unscrew it. This will release holder assembly number 10, which secures the drum...

And so on.

You can explain to the user where that screw is for as long as you want, but it's easier to just show them. On the other hand, overloading text with images can make everything more complicated too.

### The Core Idea of Your Manual

No bad advice here. We can go straight to the main point. How should you write a manual?

Start by answering this question for yourself — what does your product / device / system exist for? What is its purpose? The most fundamental purpose.

> An automobile is a technical device designed for rapid transportation on roads.

Style doesn't matter. At some companies you'll be severely punished for stylistic liberties, while at others you can rickroll everyone left and right. What matters is that you can formulate a description of your product in a single sentence.

> A car lets you travel quickly on roads.

> This system lets you access your credit card data by phone.

> The product is a multi-tool for analyzing the security of information systems.

The most important thing is to convey what's actually going to happen over the next 100 pages.

After that, everything you discuss can be built on that core idea.

> You need to know how to drive a car. To drive it, you need to know how to use the basic controls, such as the steering wheel and pedals. You must also know and understand what the various instruments on the dashboard mean.

> **Warning!** Driving a car involves risk, and improper use can lead to fatal consequences. Be sure to review the safe driving information.

> Proper car maintenance ensures its operational readiness...

This is something that's pleasant to read, and most importantly — something that can actually be read.

Why do we start our blog posts with a carefully crafted header image and a great introduction, while our manuals look like the terror that flaps in the night? (That's Darkwing Duck, for the uninitiated.)

### Why Do You Need All This?

> If you really, truly want
> On a Sunday, crack of dawn,
> To receive a call from your boss
> On your precious mobile phone,
>
> And, ignoring your weekend,
> Sprint right into the office,
> Proudly grab your keyboard
> And start fixing everything,
>
> Then don't bother writing manuals.
> Won't do much to help you anyway.
> Better just ignore the problem.
> Everything will sort itself out.

A well-written manual is that very miracle that saves your nerves and your time.

When you catch yourself explaining how and why something works for the umpteenth time — it's time to sit down and write.

There are people in this world who can crank out 20 pages of text in a day. And there are those who break into a cold sweat at the mere thought of writing an email.

If you belong to the latter group, consider this. The words you write are your avatar. They're your virtual assistant that stands in for you before the crowd trying to bombard you with questions.

Don't stress about not having a style or not knowing how to write. If you have a system for entering text into a computer, you have everything you need.

Sit down and write. Then read what you wrote, and write some more. Give it to someone who knows nothing about the subject and see if they can understand what you wrote.

The main purpose of a manual is to enable someone else to perform a specific set of actions. So try to achieve that goal. Hand your manual to someone who knows nothing about the topic, and see if they can follow the instructions you described.

Don't try to make a video or audiobook. Video takes far more time to produce. Audio is often useless. What's more, I personally find it very tedious to spend time watching video. Text is absorbed much faster than video. And when I need to figure something out, it's much easier to do when you have text in your hands.

Video is very useful when the manual is already written, especially for illustrating complex system components.

A wiki is often a good idea for storing manual resources, but it doesn't negate the fact that you should have a decent text that can be read from beginning to end.

In short, if you're fed up with being peppered with constant questions and feeling like a frazzled helpdesk, it's probably time to sit down and write that manual.

hanselman.com — here's one example. Every time someone comes to Scott Hanselman with a dumb question, he writes a blog post about it. As a result, he has a blog, and he never has to repeat himself.

Write. It's a wonderful skill. Good practice, too.
