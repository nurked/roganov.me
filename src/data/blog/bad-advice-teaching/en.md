---
title: "Bad Advice for Teaching People to Code (in the Style of Grigory Oster)"
slug: "bad-advice-teaching"
date: 2021-12-02
description: "How to teach people programming without killing the spark in their eyes. On three idiotic claims, understanding vs. rote memorization, and why 'couldn't learn' actually means 'you didn't try hard enough.'"
lang: "en"
tags: ["teaching", "programming", "management", "Grigory Oster"]
---

Humans have this wonderful perk. We can teach other humans useful things. Sure, some animals can do it too, but they're nowhere near the staggering scale at which we teach one another. We've industrialized the whole thing and crank it out in such volumes that it's frankly impressive.

Have you ever taught anyone anything?

What's that? You're already cringing and shuddering at the mere mention of the ordeal? You keep thinking about that one intern who was so hopeless you just couldn't hold it together?

Someone nuked a production database because they couldn't tell the difference between `rm -rf ./old` and `rm -rf . /old`?

Have you ever sat through continuing education courses that exist solely for a checkbox? Or maybe you remember yourself, back when you desperately wanted to become a pilot, but after six months of sitting in a useless school, you decided to hell with it all, because the actual airplane was apparently reserved for your next life?

Come on in. Let's talk.

### A Digression: On Grigory Oster

Let's talk about how to teach people.

My experience in this area is backed by extensive experimentation. In my final year at university, back in 2008, I was handed a group of finance students who needed to learn computer graphics. After that, at work, I was constantly saddled with grad students, newbies, and occasionally people who had absolutely nothing to do with computers.

All findings have been tested (and studied) through personal experience.

### So, What's the Most Important Thing When Teaching Someone?

> If you've decided to teach
> Young sysadmins what to do,
> Please, don't mumble something vague
> Trying to get through to the crew.
>
> Better yet, pretend you're a tiger,
> Give a fearsome roar at all.
> 'Cause the louder you can holler,
> Closer they'll be to standing tall.
>
> Learning should instill raw terror,
> And that's why it's up to you
> To bring forth cosmic dread upon
> Those entrusted to your school.

You. First, you need to sit down and figure out how you're going to teach someone something. The world is full of prejudices and stereotypes about teaching. The biggest one is the belief that some people simply can't be taught.

So, here we have a spherical student in a vacuum. Let's call him Vasily. Vasily has landed in your clutches and stands before you with a spark in his eyes. Vasily wants to learn HTML and JavaScript. And this is where you start killing his desire to learn. How? Accidentally. I've heard plenty of idiotic methodologies that "explain" how to teach. Here are the main ones:

**Idiotic Claim Number One: The dumber the people around you, the more you'll get paid.** There are people who will say something like this with a straight face. "I don't need specialists who'll compete with me." If you're good at training specialists, nobody will compete with you. They'll carry you on their shoulders because you can make specialists.

Yes, you obviously need to stay in shape yourself. If you walk into any decent shop right now and announce that you know how to set up docker swarm, they'll laugh you out of the building. These days, even k8s isn't trendy anymore. People have moved on to Helm and all sorts of other gizmos. But that's no reason not to teach Vasily. It's a reason to sit down and level up yourself.

I was recently offered a six-figure monthly bonus just for taking on a couple of interns and turning them into proper programmers.

The better the programmers around you, the easier your life will be. You'll have less garbage code to clean up. And if you can't produce more code (thus making more money) by leveraging good programmers, well, I don't know what to tell you.

Now, of course, there's a carve-out for those special establishments where work materializes on its own and exists solely for the sake of having work. If it doesn't pay to rock the boat and produce better code — if you're just sitting there month after month pocketing $75K net — then fine. Sit tight and don't rock the boat. Or, consider changing jobs.

**Idiotic Claim Number Two: Vasily is an idiot and can't learn.** There's no such thing as "couldn't." There's only "didn't try hard enough." Vasily isn't "an idiot by default." He just hasn't been taught with enough dedication. People are one of the most important resources at your company. You can invest in people, and they'll push more commits — beautiful, diverse ones.

A bit further down, I'll talk about what to do with that "freshly chopped log" that HR stood in front of you and announced will be the new DevOps.

For now, understand this: you can do something with this Pinocchio.

Don't believe me? Here's a real-life story. My great-grandmother worked at a boarding school for deaf-mute children. She taught them to speak. Quite a feat. She had nerves of steel and titanium patience. In terms of sheer titanium content in her body, she could easily out-tank Bender Rodriguez. She never lost her temper with her students. It's pointless. And my great-grandmother told me about methods for teaching deaf-blind-mute children. That's where I really sat there in shock. But they did it. They taught them. And the children learned to communicate. Using a special language of gestures and touches, they could hold conversations.

And here in front of you stands a big lug who has two working eyes, two working ears, and a mouth. And after all that, you're going to tell me about problems? Ha!

Again, specific methods and techniques are described below.

**Idiotic Claim Number Three: He spent the last five years at \*\*\*University, he already knows what to do.** Here, I think most tech folks perfectly understand that this claim is complete and utter nonsense. Don't fall for it. And don't let anyone hang this particular noodle on your ears. (That's a Russian expression. It means "don't let them BS you.")

University education gives you one gigantic advantage. You get foundational knowledge across a huge number of fields, which can later become useful when learning something specific.

We all remember that "calculus with differential equations and statistics was pure hell and nobody liked it." We all know that "all that stuff is absolutely useless," etc. Nonsense. Ask any data sa... scientist Pete who's raking in money hand over fist because he perfectly understands how statistical methods work. Ask AI engineer Vic how he manages to build such killer video recognition models without a basic understanding of Fourier series. Walk up to 3D programmer Anatoly and ask him to explain how to rotate an image without multiplying matrices.

But don't forget — all this knowledge is fairly detached from reality. Calculus isn't Maya or Blender. You won't get far in TensorFlow armed with nothing but differential equations. Moreover, you don't actually need to know the underlying science to use these tools. But if you do know the underlying theory, you can use these tools effectively.

You can never have too much learning. You can only have too little.

Alright. We've sorted you out. Now let's look at our spherical student in a vacuum.

### What Does "Understood" Mean?

> If a freshly minted programmer
> Sits before a book, eyes glazed,
> Then whatever else you do,
> Don't try to explain it yourself.
>
> Let them truly come to know
> How hard it really is
> To grasp things quickly
> In your profession.

We could sit here forever debating the philosophical and psychological concepts of what "understanding" means. These are eternal arguments with no end in sight. Let's use a crutch instead.

"Understood" means you know how to do something.

"Understood" means you have a spinning 3D model in your head of the computer you're working with.

"Understood" means someone says "G10" and you immediately play a G in the fifth octave.

Have you ever met one of those mechanics "in the garages" who could walk up to a car, listen to its engine, and tell you: "Your belt is **** up, you need to **** well **** the whole **** thing **** and replace it." Whatever you say about the guy, he understands how things work. It might be an old 2009 Toyota Corolla. The man might know everything about that specific model and nothing about other cars. Then there are those who can take apart any engine with their eyes closed and reassemble it with their hands tied. These people understand how an engine works.

When you come to your young sapling and say: "Here's a system, it's broken, fix it..." — he might just freeze up. He's read every book on k8s he could find. He's watched 100+ hours of k8s content and can rattle off every command-line parameter for GCP, but none of that helps. He didn't understand what a "system" is and how it works.

Now let's look at the opposite case. We have a grad student. Back in 2005, he figured out the fundamentals of operating systems. He understood what makes Linux different from Windows and can use both equally well. He worked out what process isolation is and how virtualization works at a low level. He knows how memory works in a computer and has a clear understanding of what the system kernel is. He knows the difference between Fedora and Ubuntu. He knows the difference between a distribution and a kernel. He understands what happens when you launch a container on a physical machine. He knows where the network card plugs in and how a network bridge works. As a result, after quickly scanning the config files, he tweaks a couple of ports and everything starts working again. This grad student understood. He won't run containers as root — not because the docs say so, but because he understands how container virtualization works.

When you're teaching someone, you need to get them to understand something. It might take minutes if they have a broad education and lots of facts to build on. It might take weeks if they can't tell a bit from a byte.

I'm not going to argue here about which method of absorbing information is better. They're different. Different people process information differently. But don't think you can get away with just dumping a bunch of links to PDF files.

### How Do You Help Someone Understand?

> If before you there stands
> A freshly minted neophyte,
> And within their eyes all light
> Burns with brilliant flame so bright,
>
> Then don't give in to the urge
> To quickly hand them some controls
> Over something real, something tangible
> That they could manage on their own.
>
> Let them suffer for a while,
> The poor, wretched little child,
> And crush their every desire
> Smothering their interest dead.

One of the most critical moments in teaching is not killing the spark. A neophyte walks in and says: "O Master! Grant me the power to learn C#!" No problem, you say. Here's Donald Knuth, and here's Stroustrup. Read them both, do all the exercises, and then I'll teach you C#.

Unless you've got a true fanatic on your hands, you'll never see them again.

That spark in their eyes, that eternal "I want you to teach me" — it's wonderful. It's what makes Vasily want to learn. At some point, the kid saw a scary bearded guy who, with five keystrokes, made his phone whistle melodies. Someone saw a video game materialize from nothing. Someone else, after spending five weeks playing a game, suddenly realized that this game was written by someone.

Come on, remember what it was like for you the first time. Each of us has our own story. After many hours of playing specifically Theme Park, I noticed patterns in how visitors moved along the pathways. In that moment, I realized that someone had just described an incredible universe that lives by its own rules. I was stunned by how interesting this universe could be. And I wanted to create my own game. Many years passed before I actually learned to write programs. I learned Pascal, Assembly, and many other things, but that exact image always stayed with me.

After that came Roller Coaster Tycoon, Theme Hospital, Transport Tycoon Deluxe, and Factorio. But the original Theme Park will forever be the first game that made me want to understand how things work.

Make sure you don't smother that hope — the desire to tap into new knowledge — with speeches about how "programming is hard and you'll never get it." Don't talk about what's hard. Talk about what's easy.

"Our dear neophyte. Right off the bat, you won't be able to write a game. But I have an idea. We'll start with a very simple game and keep making it more complex until you've got the next Doom." Something along those lines.

Any teaching of anything will follow this rule. The person WANTS to learn something. Teach them that thing. Don't kill their desire with your "Nooo you caaaan't." "Yes you can!"

This rule is doubly applicable when you're teaching someone something that physically exists — like how to drive a car or how to solder. They came because they want to drift as cool as Dom Toretto. If you stick them in a classroom to study theory for five years, they'll walk out the door and never want to learn anything. You shouldn't immediately let them tear down the highway at 70 miles per hour either. But don't tell them they won't see a car until they've read 20 pounds of paperwork.

By the way, from a programming perspective, this is actually quite tricky. On one hand, in the physical universe, our product is something nearly invisible. If you look at a program from a physics standpoint, it's just a sequence of magnetized spots on a hard drive surface.

Of course, you can't look at a program that narrowly. After all, a good program also displays things on a screen. The fundamental cool thing about programming is that you make a computer do something. So when you've got a newbie standing in front of you with puppy-dog eyes, give them at least something to play with. And ideally, something with a Wow effect. Let them play around. It'll only push them to learn better and faster.

After that, start teaching. How? Well, that specific part isn't the topic of this article. You might have training plans. You might have courses. Maybe you can hand them a good book. Or maybe you'll just take the kid on as an apprentice to watch you crimp white-orange, orange, white-green, blue... In any case, there are countless training programs out there. Some you've experienced firsthand, some you've heard about. Good. If you know where to find quality material, make sure to save it somewhere safe.

### But What If They're Just Dense and Don't Get It?

Well, I talked about this a bit above. If they're truly dense and don't get it, the problem is that you didn't try hard enough.

To understand something complex, a person needs a clear grasp of the simple parts that make up the complex thing.

Recently, in the American corner of the internet, the older generation discovered a hilariously fun thing to do. They make kids dial numbers on rotary phones.

Go look it up. You'll have a good laugh. You know how a rotary phone works, right? Heh, back in the day I used to horrify youngsters by picking up the receiver and dialing the front desk by clicking the hook switch 10 times in a row. And today's kids can't even dial a number on a rotary phone.

Are these kids idiots because they don't know how to use a rotary phone? No. They simply have no concept of how telephone switching works. And I'm an NEC engineer. I studied the history of telephony switching and know how it worked in Alexander Graham Bell's time. Does that mean I have a higher IQ? Ha! One of those kids sold some NFTs for $200,000, and I completely missed the NFT wave and have no idea how they work.

So when your fresh recruit sits down, opens a Dockerfile, and immediately replaces `FROM ubuntu:20.04` with `FROM alpine`, don't rush to chop them to bits with your lightsaber.

Let's start asking questions:

— "Why did you do that?"
— "Well, Alpine is smaller!"
— "Right, and what's the difference between Ubuntu and Alpine?"
— "Uhhh..."
— "And our server runs CentOS. When you launch an Ubuntu container with an Alpine image, which kernel runs — CentOS, Ubuntu, or Alpine?"
— "Ummm... CentO..."
— "Wrong!" And the freshly minted DevOps gets a boot to the behind.

And that's when you start to realize that the kid doesn't know the difference between a distribution and a kernel. He doesn't understand that Docker is built around the concept of namespaces and that processes are isolated. Dig a little deeper and you realize he doesn't know what a process is. He doesn't know how the system allocates memory or what happens when a new process is created. He has no idea how any of this connects to the network.

He didn't have a university education or even just work experience. He's heard of things, but he doesn't understand them because he doesn't understand the underlying methods and terminology.

And that's exactly where your main job is. Rolling up your sleeves, sitting down, and figuring out what your student doesn't understand. You don't have to dive into the intricacies of how the Windows 3.11 task manager worked. Sometimes a general overview is enough. But if you're a programmer, you'd better know how the OS works.

Once, during one of these "what the hell is unclear to you?" sessions, I dug all the way down to the fact that the kid had absolutely no idea what electrical current is. And upon closer examination, I traced it back to the fact that he couldn't wrap his head around induction. And there, scraping the bottom of the barrel, I showed him this paragraph:

> From Latin *inductio* "a leading in," from the verb *indūcere* "to lead in, to introduce," from *in-* "into" + *dūcere* "to lead" (tracing back to Proto-Indo-European *\*deuk-* "to lead").

It hit him like an electric shock. He suddenly understood where current comes from in wires under the influence of a magnetic field, and why it's called induction. Over the next three days, nonstop, ten hours a day, with fire in his eyes, he read through every article he hadn't understood before. He figured out electricity, which let him understand how a p-n junction works. After that, the world of transistors opened up, and after playing around with those for a bit, he figured out logic gates, which then let him understand simple logic structures, get a general sense of how a processor is built, and sit down to study C# with a full understanding that it's a JIT-compiled language, distinct from native assembly for a specific processor.

And of course, there's no fixed approach here. Every person is unique. Your job as a teacher is to figure out what this particular person needs in order to understand. If you're teaching a programmer, you might get away with saying that electrons bounce through wires carrying charge from point A to point B. But if you're teaching an electrical engineer, then even the latest Veritasium video is just a warm-up.

We stalled for two weeks, working through gaps in underlying technologies. After those two weeks of stalling, he was flying. He didn't ask dumb questions about compiling Java on C#. He understood and knew what he was working with. And that knowledge was built on a heap of small, simple facts.

### Don't Kill the Kid by Dumping Too Much at Once

> The moment someone comes to you
> With a question on their mind,
> Answer right away, and pile on
> As much as you can find,
> So that, overwhelmed and weeping,
> They quickly flee the scene.

Don't try to dump everything on your mentee all at once. This is exactly what I value in good books and courses — they're built on the principle of "a little at a time." If you and I are going to be studying nuclear engineering, we'd better make sure the kid understands the basic principles of matter first.

If we're going to be working with Java and C#, you can't spit without hitting OOP. And if you want to teach them JavaScript, you should start with the basic principles of functional languages.

There are books that are written clearly. And there are those written haphazardly. If you don't have materials at hand that explain things well and gradually, you can assemble them yourself. Just take all the books, videos, and similar resources and compile them into a course. Just links to chapters, videos, and articles. In a more-or-less sensible sequence.

And keep an eye on the kid. If you told them about the nature of sepulkas (that's a Stanislaw Lem reference — look it up, it's a perfect loop of nonsensical cross-references), and they look confused, then maybe you need to go back to sepulkas and figure out what they actually are.

And if you just announced that you're now going to learn the basics of the for loop, and the kid deflated, maybe you should ask how many times they've seen a for loop and consider the possibility that they already know it.

### Practice and Repetition

In most cases in our profession, sitting over a book is enough to absorb 80% of all the necessary information. But in some cases, things have to be drilled in.

If you're teaching someone Linux administration, things like `lsusb`, `lsblk`, `netstat`, `ls -lah`, `traceroute`, and so on should just fly from their fingertips. No way around it — the person needs to practice.

If you're teaching them to solder or crimp a cable, it's doubly important. No matter how much you tell someone about how to solder properly, the first attempt will always come out as a blob. Oh come on, who among us hasn't done that at least once?

But when you have enough experience and you know that too much solder is too much, the soldering gets better.

If you're training a DevOps who needs to be able to spin up a new system from a backup in five minutes, give them a backup and a test bench. Let them sit there and deploy the whole thing. After repeating this operation N times, they'll have the correct sequence of actions memorized.

Never neglect learning through repetition and memorization where it's necessary. If the kid doesn't understand something, don't think that memorization will help. They need to figure it out first. Once they've figured it out, then they can sit down and memorize.

When was the last time you saw a sysadmin who couldn't remember the correct pin-out for cable connectors?

### Exams

> Every exam is important,
> Every exam serves a need.
> So go fail that poor intern
> Without any cause indeed!

We all know that exams are useless. Bad exams are useless. No matter how many formulas you show them or trivia games you play, you won't know how well they understand the material. Understanding can only be assessed by their ability to do the thing they're supposed to be able to do.

If we're talking about a car repair course, they'd better be able to repair a car. If you taught them to crimp a cable, they should be able to crimp a cable, plug it into a test device, and show you that the signal-to-noise ratio is within spec.

If you really want to give someone an exam, just give them a real-world task and have them solve it.

Organizing exams on Big-O notation is acceptable only if you're teaching them to pass recruiting interviews.

Most of us survived school and university. We all know how to lose our minds at the word "exam." Don't bring this archaism into the world of teaching people. If you've truly taught someone PowerShell well, they'll be able to sit down and write a PowerShell program.

Don't make their life harder than it needs to be. Answers to questions about what year the C language was invented are on Google and don't help anyone write programs.

If it's within your power, spare the poor soul from a pointless exam.

### A Real-World Example

One time, a group of unfortunate kids fell into my clutches. They were finance majors, and someone in the dean's office decided it was time for them to learn graphics programming. The kids showed up to my classroom, and I began getting acquainted.

— "Do you know how to program?"
— "Nope." In reality, about five people in the cohort could write programs to some degree; the rest had absolutely zero clue.
— "Okay, then here's the deal. I'm not going to teach you graphics programming. Instead, we'll learn the basics of programming, okay?"

Everyone agreed. And I started digging into what they knew and understood. Some of the students could write code in various languages, and I had them write Mario. A couple of them even managed to finish their Mario.

The rest sat there studying the basics of bits and bytes.

To explain how a linked list works, I sat them around a big table in the classroom, and they all pretended to be nodes. In front of each of them on the table was a piece of paper with a number on it. Their left and right hands were the pointers. They sat there and it clicked.

And you know what — most of them got it. Sure, not everyone immediately understood how to write computer graphics, though some of them did. But given that I had 20 people on my hands and only managed to spend 80 hours with them, I counted it as a victory that most of the kids could write simple programs and understood what happens in computer memory.

I didn't torture them with exams. Those who wrote Mario got an automatic pass. The rest were asked to explain the basic principles of programming to me. And you know what — everyone was satisfied, and with rare exceptions, meltdowns were avoided.

### Wrapping Up

- To teach someone something, you need to get yourself in the right mindset. Don't try to teach someone if you believe teaching them is pointless.
- A person who wants to learn comes to you with a spark in their eyes. Don't kill that spark with pointless rote memorization. Give them something to play with, let them feel the power of what they're learning.
- Teach for understanding. Use whatever methods you think are right to make the person understand what they're working with. Understanding means the person can correctly do the thing they're being taught.
- If the person doesn't understand, dig into the prerequisite and underlying material. Do they know what electricity is, if you're teaching them circuit design? You'll find astonishing things that people don't know.
- Don't overload them with information and jargon. Every person needs an individual approach.
- Sometimes you need to memorize material. But do it only after the student understands what the material means.
- Don't torture people with exams. Test their knowledge.

If you've never taught anyone anything, know this: it's one of the most wonderful things in the world. Five years from now, you'll see a happy engineer telling someone that you're the person who gave them their career. Someone you taught will mention to their friends, more than once, that you're the absolute best. You'll be shown respect and invited to all sorts of places. You will be valued.

You do understand that by teaching people, you make them better, right? They'll thank you for it many times over.

*P.S. Another installment with verses is here: [Bad Advice for Manual Writers (in the Style of Grigory Oster)](/blog/bad-advice-manuals/)*
