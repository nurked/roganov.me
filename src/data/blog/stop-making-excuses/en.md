---
title: "Stop Making Excuses"
slug: "stop-making-excuses"
date: 2023-01-08
description: "A blunt rant about programmers who blame everyone but themselves. On responsibility, professionalism, and why excuses are a one-way ticket to burnout and shaky knees."
lang: "en"
tags: ["career", "programming", "mindset", "opinion"]
---

Hello there, human, %habrauser%, %username%, programmer.

*(Image: "This is exactly how I feel right now.")*

This post is full of hate. The needle is off the scale. But yeah — it's been building up. Although, in my defense (heh-heh), I should say that I haven't named a single real person in this article. Even though some of them happen to hang around here on Habr.

I'd like to have a word with you. Could I please ask you to stop making excuses, and to stop accepting them from others? The second one matters even more. Because you have no idea how badly that habit hurts you.

Allow me to explain.

Take Vasily Vasilyevich the Slacker, born in 199-something. Vasily is a programmer I want to hire. Well, sort of — Vasily is pretending to be that programmer. He diligently grinds leetcode and all that. He can sort trees balanced and unbalanced. He's gotten so good he can sort a string with an O(n^-1) algorithm. Read his resume, and Vasily is pure gold, a no-brainer hire I need to bring on right this second. His resume is composed in the finest traditions of CEO marketing, and it landed on my desk piping hot, straight from the AI that picks the very best CVs.

Yeah. Sure. I totally bought it.

Whatever — let's set aside the fact that the only thing Vasily managed to do during his short life at my company was a new project in NestJS.

Let me tell you what NestJS is. It's a project written to "make writing microservices easier." And, miracle of miracles, this Nest has no documentation — it's sold for money.

We shipped our app in Docker. And I decided that it was unseemly for a NestJS project to die a horrible death the moment Redis or the database got disconnected. I figured it would be better if the project just kept running and reconnected to whatever services it needed. I asked Vasily to add this fairly simple bit of functionality to the project. And what do you think happened? Vasily couldn't do it.

He spent ages explaining, painfully and at length, that he didn't know how to properly implement this in Nest. And fine, whatever. Honestly, I'd have forgiven him just about anything. Vasily is a relatively junior specialist whom my international company, out of the goodness of its heart, decided to hire. I'd already decided that Vasily could handle it, and figured it was worth helping him out.

I helped. Honestly, I did. I told him his stinking microservices weren't needed by anyone. More than once I showed Vasily the original spec, which contained exactly one thing: a REST API server with five endpoints. That's it. I never asked for NestJS. In fact, I didn't even ask for JavaScript. I wanted the whole thing in Golang. But I knew Vasily wasn't strong, so I figured I should help him out.

But Vasily couldn't pull it off. And again — I'd happily have picked Vasily up off his knees and helped him dust himself off. But Vasily made one fatal mistake. He said his troubles were the fault of Kamil Mysliwiec, the person who built NestJS.

Vasily blamed the company for bad documentation. And we parted ways with Vasily. Despite the fact that times are uncertain right now, despite the fact that I knew I'd given him chance after chance, I let him go. Because enough was enough.

Please, Vasily, understand. You can blame whoever you want for your problems. Kuzka's mother, aliens, dinosaurs — take your pick. But that will be exactly the moment when everything starts falling out of your hands.

You're a programmer. Which means you should be able to make computers do what the customer needs them to do.

That's it. If you manage that — you get paid. If you don't, you sit in stand-ups trying to invent something to lie to managers about, your knees shaking constantly because you don't know when they'll boot you out of your company.

Stop lying and making excuses for yourself. You can rationalize things to your manager, you can pad your invoice with fake hours, you can do whatever you want — but YOU, on your own, will know that YOU screwed up.

When you say "this is a bad programming language" or "I don't like this database," you're just signing your own verdict. You, the programmer, know. You can.

If you walk up to me and say, "I couldn't get this thing running this week, but I'm going to bang my head against the wall until I figure out how it works, and next week, I guarantee it'll be running" — I'll believe you. You can fail however many times. The key is that you can stand up, turn around, and say, "Well then, looks like I need to sit down and do something about this."

Folks, please think about what a professional programmer actually is. Here are the definitions from the Oxford dictionary.

> Programmer: a person who writes computer programs.
>
> Professional: ...; competent, skilful, or assured.

Take a look at those three adjectives that describe a professional programmer.

Know what they mean?

They mean you can't just sit in front of YouTube for ten minutes and figure out how the latest JavaScript engine works. They mean you're capable of finding the actual source of a problem. They mean that when everything is on fire, you've got the guts to say, "It's all good, I'll figure it out right now." They mean you'll pick up that fat tome of a manual and read it.

*(Image: "And don't try to sell me on the puppy-dog eyes. I know the difference between someone who's pretending and someone I can trust with critical infrastructure.")*

Responsibility, these days, has turned into a dirty word. For some reason, "responsibility" gets interpreted as "who's going to be the scapegoat?" You know what responsibility actually is? Responsibility is when something smells like money. Responsibility is when you actually know what's running on those five servers, you understand HOW it works, and you know that Vasily Gennadyevich, the company director, is very happy when the servers run without a hiccup.

When you walk down the hallway and the CEO and his deputy walk past, and both of them wink at you and say, "There he is! Walking by! Thanks for the great work!" — that's when you understand what responsibility actually means.

Understand: responsibility is your ability to know things and to be accountable for them. And if you've got it, then you'll live a life without burnout and without your knees shaking constantly. You won't show up to work with that sucking feeling in the pit of your stomach, wondering whether something's going to fall over.

Oh, by the way — one more thing. You are obligated to know what the hell is going on inside your programs! Enough with the stories about how "our cache is handled by SuperDuperCacheFramework." If that cache falls over every two hours, that means nothing is handled, and you don't know jack.

Once, a long time ago, I interviewed at Universal Music Group. They asked me, "What would you do if your server started crawling out of nowhere?" My answer floored them. I responded with a question of my own: "Was this server working before?" They said, "Yes."

Then I told them — I'll sit down and figure out why this happened. If the server was working before and now it isn't, something has changed. You need to find the actual cause. Maybe you'll discover that your customer count has gone up tenfold. Fine. Then you can spin up another server and slap on a cache. But if the customer count is the same and everything's slow — watch out. I'm going to sit and stare at logs until I find the actual cause of this problem. How will I know I've found it? Everything will start working again immediately.

The folks at UMG were in shock. They offered me the position right then and there. And their lead engineer spent another five minutes telling me how marvelous that answer was. Then he told me the other candidates had suggested rewriting the program in a different language, or putting everything on Kubernetes and autoscaling the infrastructure, and other nonsense like that.

That answer implies a Professional Programmer. That answer implies that the person managing the infrastructure carries actual responsibility for it. He's not the scapegoat — no. He's the most trained, well-read, knowledgeable engineer in the whole place. He knows what the rapid blinking of the sixth LED on the eighth panel means. He can resolve any problem. And he's constantly envied. Because the CEO adores him, and he gets paid an indecent salary.

So please, %habrausers%, understand: there is no such thing as "this works badly." There's only "I haven't fully figured this out yet." Examples are everywhere. Any Turing-complete programming language is a programming language. You can write good APIs in Visual Basic inside Word. (I've seen it done.) That doesn't mean you should. It means that if you're a professional programmer, you'll get DOOM running on a kettle and JavaScript working just fine. And if you're a bad programmer, you'll always have a couple of excuses tucked in your pocket about how Go doesn't have generics, or some other rubbish. Stop pretending. I believe in you.
