---
title: "What Should We Actually Be Afraid of in AI?"
slug: "ai-real-fears"
date: 2021-11-09
description: "Why computers can't think, what's actually dangerous about AI, and how we quietly handed machines the right to choose for us — from TikTok recommendations to hiring systems."
lang: "en"
tags: ["AI", "philosophy", "technology"]
---

*I wrote this in Russian in late 2021, months before ChatGPT shipped. The English below is a recent translation of the original — voice and argument unchanged. I'm reposting it because I'd rather you grade the predictions than have me grade them for you.*

*One thing that wasn't visible from 2021 and probably should have been: corporate AI adoption now runs as top-down mandate stacked on bottom-up cargo-culting. Juniors with no programming background are handed the keys and told to "automate everything," codebases drift into a kind of complexity no human reads end-to-end, and the AI-cleanup consulting market that will eventually rescue them is going to look a lot like the security-breach recovery industry of the 2010s. I missed that specific shape. I did see the broader one, which was the easy bit — we were always going to outsource choice before we outsourced thinking.*

*The piece is below. Tell me what it missed.*

A long time ago, in a city far, far away — Kharkiv — I was 7 years old. That's when I first laid eyes on a miraculous new piece of technology — a VHS player. In my hands was my very first cassette tape. I didn't really care what I was about to watch. What mattered was the sheer fact that I'd get to watch something recorded. Oblivious to what fate had in store for me, I shoved a cassette with a hand-scrawled label reading "Terminator 2" into the player.

They say kids have wild imaginations — that children picture things more vividly than adults do. I don't know why, but the scene I remember most clearly is Los Angeles getting bombed with nuclear warheads. I sat in absolute panic in front of the VCR, rewinding the tape to watch those terrifying frames over and over.

After I came to my senses, I started asking the adults what I'd just seen — when it would happen and whose fault it would be. They scoffed and told me not to worry.

And they were right. I grew up. Terminator 2 stopped being just a scary movie and became a masterpiece I've remembered since childhood. And the fear of artificial intelligence stopped bothering me, replaced by a fear of human intelligence.

And really, what's there to be afraid of? Automated nuclear bombardments? Killer drones from dystopian YouTube videos? Another spin-off of the same Terminator? Or, even worse, that awful RoboCop reboot? No — the future isn't populated by walking killer cyborgs, despite all the efforts of Keanu Reeves and Harrison Ford to show us November 2019 in Blade Runner.

And come to think of it — how is it that a long time ago, in a galaxy far, far away, there was no artificial intelligence whatsoever, except for droids stuffed with gears? And in the distant future twenty thousand years from now, if you believe Frank Herbert, creating artificial intelligence carries the death penalty.

But life goes on. Life is right here, right now. And people are quietly starting to lose it, because there's just too much of this AI stuff. And we can't seem to agree on what to do with it. Some say it needs to be eradicated; Mark Zuckerberg insists the answer is simply to teach AI to work even harder.

Here's a different take. When I asked my friends about this perspective, I found that most people somehow vaguely sense it, but rarely say it out loud.

### Your biggest mistake is thinking that computers can think

There's a useful word for what happened next: *misnomer* — using the wrong word or name for something. Way back when the first vacuum tubes were warming up inside ENIAC and UNIVAC, the American military men who built those machines in 1945 decided to call their creations "electronic brains."

And that's where all hell broke loose. Nobody back then had the faintest clue how the brain actually works. Frankly, nobody can properly explain it even now. We have neurons, they weave together, and out comes you — John Doe. Well, that's what we think. When you think, electricity runs through your brain. When you don't think, it doesn't. Here's the kicker: you store memories in your brain. But we don't know how. Probably something to do with neurons weaving together. If you actually count the neurons, it turns out we can't account for how we manage to remember anything at all. Oh, and one more thing. Some people take a bump on the head and forget who they are. Others can have half their brain removed by a surgeon and walk away fine.

No, seriously. Let's not pretend we fully understand how the brain works. "Understand" in the same way we understand how the heart works. We have four chambers. Blood enters here, flows from here to there, here's your systolic pressure, here's your diastolic. If things go really bad, we can install a pacemaker. We generally get how it works. But the commands to the heart come from the brain, and that part we're not touching. That's the part of the brain beyond human control. You can't control it. Unless you're some kind of Indian mystic. They can, but they get a pass on a lot of things.

Sure, we have neural interfaces, we can do MRI scans and remove tumors. We know that without a brain, our friend John Doe is a goner. But we don't know how it actually works. Why? Because we don't know how to build a new one from scratch.

If we understand how an old Heathkit tube radio works — the kind of kit hobbyists built on kitchen tables across America in the '60s — we know the purpose of every component, and we can build a new one. We can fix it. We can rebuild it on a transistor chip from China, on discrete transistors, or on warm, lovely vacuum tubes. That means we truly understand what a Heathkit is and how it works.

The brain? Nope. We have hunches, but we're not sure. In 1945 we had no idea about 90% of what we know about the brain today.

And so, armed with that level of knowledge, someone walks in and says: "You know what, dear sirs, I've been thinking — we should call this thing an 'electronic brain'!"

*Misnomer.* Wrong use of a word.

And it wouldn't have been a big deal, except some people bought it. If the name has the word "brain" in it, then a computer is a brain. And off we went. We have programmers who understand how computers work, and then we have a bunch of cultists trying to recreate the brain in hopes of making it alive and capable of independent thought.

### Let's put a few things on the shelf

Alright, let's start with definitions.

First, let's skip what's written on Wikipedia. That reads like the terror that flaps in the night.

Let's turn to the Merriam-Webster dictionary instead.

> **Full Definition of artificial intelligence**
>
> 1: a branch of computer science dealing with the simulation of intelligent behavior in computers
>
> 2: the capability of a machine to imitate intelligent human behavior

We don't need to invent anything else. There's your answer to what AI is. It's the imitation of human behavior by a machine. If you got any ideas about this being somehow connected to creating life — go look up the definition of *imitation*.

Accordingly, the first chess-playing program can be called AI. Clumsy, but still an imitation.

Now, armed with this definition, we can move on to more specific terms. For example, let's look at machine learning:

> **Definition of machine learning**
>
> The process by which a computer is able to improve its own performance (as in analyzing image files) by continuously incorporating new data into an existing statistical model.

So machine learning is simply adding data to a statistical model. What do you get at the output of your ML network? A float between 0 and 1. You're either looking at a dog — that's a .999 dog — or you're seeing a cat, that'll be a .998 cat. If the system is really confident, you might get a flat 1 dog. That's a 100% dog in the picture, I'd bet my teeth on it. Make these algorithms more sophisticated and you can build interesting things. You can teach a computer to play Mario. To stack Tetris pieces. Position 1 is 10% good, position 2 is 78% good.

And then, just like in Futurama:

> — Isn't it beautiful?
> — Of course, but it's only 93% of your beauty.
> — Oh, Bender! That's either a computing error, or you're the most romantic robot I've ever met!

For the sake of completeness, let's look at "Neural Network":

> A computer architecture in which a number of processors are interconnected in a manner suggestive of the connections between neurons in a human brain and which is able to learn by a process of trial and error.

Bottom line: we have an architecture where we've wired processors together in a particular way, and we can do "machine learning" on it.

Again, nothing described above implies the existence of a brain substitute or any actual intelligence.

### So what are you complaining about, author?

About the fact that we love burning witches at the stake and playing Ghostbusters. Maybe it's all the science fiction, or maybe we're missing something, but we've started attributing human feelings to machines.

And I'm not talking about us trying to build a system that decides when to launch nuclear warheads. No. We haven't been that stupid.

We're doing other stupid things instead.

We've handed AI our emotions and our ability to choose.

Every time we swipe up on TikTok, tap "like" on Instagram, or scroll through our Facebook feed, we're trusting artificial intelligence to pick the next piece of content to keep us occupied.

Something that was always the domain of human decisions has been handed over to computers. Because we simply can't physically process that much information correctly.

In the good old days, we had bards, jesters, storytellers, entertainers, and the like. Their job was to amuse us. When such a person takes the stage — or starts talking in a circle of friends — they can read the room and understand what's happening. If they crack a joke that falls flat, they can analyze the situation, think about it, and based on their experience, decide what to say next.

If Linda didn't laugh at the joke about pink pants and the unicorn, a good storyteller will remember that Linda is a tough crowd, but she loves cats. So he'll pivot to cats. And things might just get back on track.

When the Algorithm suggests the next video for you to watch, it's not your best friend who understands and forgives you. Its job isn't to make you feel better. Its job is to keep you on the site longer. And so your gaze lingers on some weird video, the Algorithm has already drawn its conclusion about what's good and what's bad, and three hours later you're knee-deep in roadkill videos.

### Don't get me wrong

There's nothing inherently bad about AI — as long as you accept it for what it is. It's a computer algorithm. A sequence of actions for finding a result. The result won't be precisely defined, but that's the whole point of AI: to find the most probably correct result from the most probably correct dataset.

What affects how AI works? Input data and the model. Who trains that model and collects the data? A human.

Behind every device, there's always a human.

A machine can never be the cause of something new. The cause of anything in life is some*one*, not some*thing*. Even if someone builds a machine that "thinks" and "creates a more perfect machine," it happens because some*one* created the machine that makes machines.

Then you've got your classic gun scenario. Put pistols in the hands of two people. The first is a seasoned shooter who's fired hundreds of different weapons. The second is some kid who knows nothing about guns but has watched gangster movies.

The first one will most likely put the safety on and tuck the gun away. The second one will shoot something. The first person knows what he did, what's in his hands, and how to use it. The first person is responsible for what he's holding. The second one will shoot the neighbor's cat and say: "It wasn't me, it went off by itself."

An even better analogy is cars. You've seen that seasoned driver who sits calmly in traffic. He knows that if he starts weaving lanes, he'll only waste time and gas. He knows how the car works and how traffic flows. His car is ten years old, but there's not a scratch on it, and the engine runs like clockwork. It's always got fresh oil. The battery terminals are polished to a shine.

On the other side, you've got your standard clueless driver who pours motor oil into the windshield washer reservoir.

The first person belongs to a strange, dying breed of professionals. People who can take responsibility for the results of their actions. The second breed is our self-taught programmers who watched a "How to Write Neural Networks in 3 Hours" course on YouTube.

The responsible programmer will sit down and use a neural network to restore blurred images. The second person will write a chatbot to cheer themselves and their friends up.

What's the difference?

The first one understands that AI is just an algorithm that efficiently solves problems with uncertain answers.

The second one thinks AI is some kind of consciousness that makes decisions better than humans.

### AI doesn't make decisions better than humans

It makes them faster. Within a given dataset, a well-trained network can find the most correct answer far more efficiently than a person. Processing an array with more than a thousand parameters — that's something that would take our friend John Doe 200 years of manual calculation.

The ability to rapidly sort images, execute specific instructions, or even drive a car — that's what AI excels at. We have a defined set of strict rules constraining the field of operation, and within that scope, we can teach our AI to make decisions based on environmental data.

You know what AI can't do? It can't create. It can't originate new ideas. An algorithm that performs specific actions to achieve an end result cannot one fine day say to itself: "Screw all of this! I'm moving out to a little village in the countryside, and the rest of it can go to hell. I'll build a house and grow carrots!"

And if you naively believe AI can do something like that because someone just wrote an AI that creates new works of art, you're deeply mistaken. Because some*one* wrote that new AI.

To create something new, we need you — the abstract human. A being who can do an incredible thing that obeys no laws of physics. A human can pull a thought out of nowhere. It just appears and exists. Out of thin air.

We don't have a random number generator in our brains. We don't need manna from heaven delivered via HTTP to suddenly jump up and say: "Oh! Cool! You know what I just thought of?"

And honestly, you don't know how it works. Neurosurgeons don't know how it works. Psychologists don't know how it works. It just works. So we, as engineers, can calmly set it aside. It's not in our area of expertise. It works, and let it work.

But as engineers, we should understand what *is* in our area of expertise.

AI algorithms are well-suited for automating tasks that can't be automated with a clearly defined sequence of steps. Image processing, anomaly detection, price and performance analysis — that's what we should be focusing on when training AI.

But certain things are beyond AI's reach. The ability to suggest what I should watch after finishing all of Game of Thrones — I'd rather leave that to my friends. The answer to "What goes better with dark pants, a gray or white t-shirt?" — that's a question only three people in my life can answer.

### So what's the problem?

The problem is that AI lets you dodge responsibility for your actions. And people exploit this to cover up their own shortcomings.

Remember when I talked about professionals? My grandmother was an architect. She spent her whole life in front of a drafting board with a slide rule in her hand. She knew structural mechanics like I could only dream of. Whenever she walked into a fancy new building, she'd critically examine the load-bearing structure, and several times in my presence she'd share her verdict: "This one will hold," or "Interesting solution, but they probably should've made it thicker."

A professional differs from an amateur in that they can deliver the result that's expected of them.

If you're a professional architect, you should be able to design stable structures.

If you're a professional programmer, you should be able to write good, stable, optimized code that produces answers and doesn't crash.

If you're a lawyer, you'll be expected to give proper advice and cite current legislation that resolves the dispute at hand.

If you're an opera singer, you should be able to hit the right notes at the right time, and do it well.

Professionals can do their job and be proud of it.

People who fall short will make excuses for why they can't write code or hit a high C. And that's where neural networks and AI came to the rescue.

*We got the market data from this model, but it was inaccurate, so our sales tanked.*

*We couldn't properly moderate internet posts, and our entire social network suddenly filled up with drug propaganda.*

Sounds like somebody can't do their job. And they're hiding behind a neural network, because blaming a computer is easy. A computer won't answer accusations. You can always start retraining it. The punchline is that things can only happen because of humans. A computer won't do anything new on its own.

But that won't make your work any better. And management buys it. It's so convenient to blame the algorithm. It didn't work — let's all sit down and redo the algorithm.

And instead of ripping into the sales department and making the people there solve their problems and actually start selling the product, we'll sit around writing a new algorithm that's already being misapplied as it is and can't possibly get better from rewriting.

Well then — welcome to our Brave New World!

When something doesn't work, we indiscriminately shove AI into it. When that doesn't work, we keep tightening the screws on the AI. And after that, we march into Congress to make excuses and explain how we were training our social network to neutralize terrorist propaganda, but things went sideways as usual.

### Computers can't make human decisions

And to create Inception or Tenet, you need a Christopher Nolan.

So what will the end of our civilization look like?

We'll simply wall ourselves off from taking responsibility for anything whatsoever by slapping AI onto everything in sight.

I can already picture absurdities like an AI justice system. Where you have no idea why decisions are being made. You'll have an AI system telling you how to properly spend your time. Not how *you* want to spend it, but how the average person spends theirs.

We already have an AI system telling everyone which movie to watch. So everyone stampedes to the latest Star Wars, which is basically a compilation of scenes generated from Big Data collected from all the fans. And meanwhile nobody knows about Moonrise Kingdom — a wonderful Wes Anderson comedy where Bruce Willis and Edward Norton play two grown-ups trying to keep a runaway boy out of trouble.

We have AI systems for listening to music that inevitably lead us to a list of our favorite tracks — or better yet, a list of tracks that are selling best at the moment.

We already have an AI system telling us who to fall in love with and how to text.

We have an AI system that helps us find the best job candidates. So naturally, the top results feature candidates with porn-star names in their resumes, because those resumes are SEO-optimized.

And the day isn't far off when we may stop taking responsibility for our own lives and hand them over to the Algorithm. You won't need any T-1000s or robot octopuses. Nobody's coming for you. You'll be invited. A glossy brochure will land in your hands explaining how living in the Meta universe is so much more convenient. They'll sell you on the idea that it doesn't matter what kind of house you have — you can just download the house the Algorithm suggests. After all, it knows best. And you don't anymore, because you've forgotten how to make decisions for yourself.

Remember: computers work with quantity. They can answer "How much," "How fast," "How strong." Quantitative answers are the kind that various models handle well.

Computers cannot answer "How beautiful," "How do you like it," and "What do you think."

Don't be 93% better than Bender Rodriguez.

### TL;DR

AI is just an algorithm. It fulfills its given objective. Despite all the efforts of certain people, it will always be an imitation of a human.

Problems start when not-so-bright amateurs hide behind AI and, owing to their ignorance and inability to do things, simply offload all responsibility for an entire domain onto AI.

And then nothing adds up.

*P.S. I wrote this 22,000-character text in 2.5 hours. I just had an idea to write something about AI, and I wrote it. I don't believe in AI text generation systems. And if you want to write articles, I recommend you don't believe in them either.*
