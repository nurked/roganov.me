---
title: "How to Build a Career by Helping People"
slug: "career-by-helping"
date: 2021-10-07
description: "Transcript of a live talk about building an IT career: from fixing a PHPBB forum at 14 to landing contracts without interviews — why helping people works better than any resume."
lang: "en"
tags: ["career", "IT", "soft skills", "project management"]
---

Last week, Ivan Roganov — a software developer, problem-solver of unusual challenges, and author of articles on our blog — gave a talk on our social media channels.

Ivan graduated from the Moscow State University of Economics, Statistics, and Informatics (MESI) in 2008 with a degree in Software Engineering.

After several years working at his alma mater, he switched to the private sector. His particular talent turned out to be solving legacy software problems at businesses. Throughout his entire career, he has only been to one job interview, yet he's changed workplaces many times.

Here's the transcript and recording of that talk.

---

Hey everyone watching. My name is Ivan Roganov. Today I'm going to talk about employment, about how to approach work the right way, about how you can develop your potential, find new opportunities, and switch to a different field. I've done this quite a few times in my life — mostly over the last 11 years — and I wanted to share my experience with you.

I work in software development in tough situations. If you've ever started a company, or found yourself at your company, or walked into a boardroom and saw all the directors sitting there with their heads in their hands, staring at you — or at whoever — and nobody knows what to do, and everything is going terribly wrong, and so on — those are exactly the kinds of situations where I typically show up and help.

I mostly write on Habr — that's where my virtual life is. I don't have Facebook, Instagram, or TikTok, but you can find me on Habr through the link. I have posts there where I write about various situations I've been in, working across different programming languages.

### How It All Started

A few words about where and how I studied. Unfortunately, the link to this university only exists on Wikipedia now, because it closed in 2015. I studied at MESI and graduated from the Institute of Computer Technology as a Category 1 Software Engineer. That was essentially the start of my career — but before that, I studied the way many of us did. I don't know how many of you have ever seen books like these, but this is what, let's say, a childhood is built on. Happy or unhappy — I don't know what you'd call that childhood — but everyone had a "Teach Yourself Delphi" book. Not everyone had a book on Intel processor assembly, but many had at least one copy of "Hacker" magazine. Who didn't? Of course, the book about Professor Fortran was there too, but that was a very long time ago — probably around 1996 — and then everyone moved on to the Delphi and C++ self-study guides that eventually ended up on the shelf.

Everyone had their own books. And then comes this idea that we have computers, and you can do fun and interesting things with them. Then you move on to the heavier stuff, and it all ends with you finding yourself buried in books written in English — books on C# and network administration. And you read them completely fine, because by that point you've read so much documentation that you can speak English without any trouble.

I've been working with the C# programming language for the last 17 years, pretty much since it came out. Somehow it just happened that I always wrote in it. Very late in my career, I started getting into other things — running network cables, configuring CISCO equipment, doing system administration. I had no idea I'd end up doing that, but as it turned out, I did.

### The Land of Weird Outlets

All my responses to requests like "hey, can you help me with my computer?" led me to the land of weird outlets. Those who know, know. Those who don't — Google this outlet, and you'll figure out where it's from.

When I arrived in the US, I was stunned by the state of the internet in this country. For me, as a decent user, it was a shock that the internet in America looked like this. This is called a T1 line — the primary system for delivering internet here. And this is what websites in the US look like in 2021, still selling these lines that let you transmit a laughably large 1.5 Mbps.

Yes, these websites still have PHP warnings hanging on them that nobody knows how to fix, because the site hasn't been updated since who knows when. Nothing changes; everything stays at the same level.

Here you go — this is what wired internet looks like. For $45/month you're offered 500 Mbps speed. Naturally, the fine print clarifies that "500 Mbps" is just the name of the plan; the actual speed will be whatever it turns out to be. Welcome. When I got here, I was like, "guys, what is going on?" When I walked into an office for the first time, I saw a wall outlet with two COM ports, and a cable running from it to a computer.

I ask: does someone do robotics here? What is this? Why is there a COM port outlet in the wall? And they tell me — no, that's just the network. In 2010. Then I started visiting various businesses, campuses, and so on, and I learned: yes, that's how they run networks. They install COM ports. I thought I'd seen everything there was to see about computers, but it turned out — no, I hadn't seen a thing.

Alright, not everywhere has a network that looks like this, of course. But if you go to an airport, or any old enough medical facility — somewhere under the desks you'll find these things. They even hook up life support equipment through them. It's not that someone reinvented the technology with these ports — they were installed in the early 1980s, and they're still there, and there's nothing else.

So there I am, walking into my first business, in shock, saying: guys, do you need help with your network? Turns out they did. And that's how I started running cables, helping replace all this stuff with Ethernet, and so on. After that came situations with servers, which I also jumped into and started dealing with.

### Fixing Problems on the Spot

For example, one time I walked into a studio, and the entire staff was gathered around a massive server rack. The server was down. As it happened, I knew these servers — the DELL PowerEdge 2950, a good workhorse. Anyone who's worked with them knows there's a card inside that you can plug into the server, and it sometimes burns out. When that happens, the server is obviously down. You pull the card out, throw it away, reboot the server, and everything works. Everyone is in shock, people come over to look. Then the conversation goes:

— How did this even happen? What went wrong? How did it get fixed?
— Hi, I'd like to work here as a network administrator.
— Welcome aboard. Right this way. How do you know how to fix a server?
— I have experience.

Naturally, the servers needed to be replaced with something more modern. We sat down, swapped out the servers, upgraded everything, made it all better.

The projects I worked on looked roughly like this. I basically started seeking out and finding businesses that were in exactly this kind of situation. When someone posts a job listing saying they need a person to create DOS disk images to support their databases, my ears perk up. I look at it and say: hey guys, do you need help? Why is this all running on DOS? It's 2010, excuse me, and you don't even have FreeDOS — you have actual DOS, with 386 machines running this database that spits something out, and the data gets loaded onto floppy disks, and those floppies get loaded into a normal computer that runs a script to update the data, and so on. You redo the whole thing, upgrade everything, update the core, the connections, and so on — and everything is great.

One time I had to upgrade a server running Fedora 1. It was a history lesson. I sat there learning how people worked with Linux in 2003. Most of the commands I knew didn't work, and I had to figure out how to migrate the software and make everything run on something reasonably modern that at least looked like CentOS. Or here's another one — migrating from MS Access 1.0 (for Windows 3.11) to elasticsearch or PowerBI.

You find these wonderful programs that are running on ancient computers that everyone comes to and prays to, and then they tell you that nothing can be done, that this computer has always been here, please don't touch anything. That's the moment I walk in and say — guys, what the hell is going on? Why not do something about this? Let's export everything, migrate it to PostgreSQL, elasticsearch, PowerBI. The accountants stare with wide eyes and say — where did all this come from? How can we suddenly make these beautiful reports that show everything?

### Helping as a Career Strategy

Here's what I want to say. In every single one of these situations, somewhere there was a person sitting there, trembling, unable to speak, waking up every morning thinking — is the system still running? Did the hard drive crash? What am I going to do about all of this? You need to walk up to that person, calm them down, and say: show me your problem. And here's the thing: if you genuinely help someone solve their problem, you can get something much bigger than just a paycheck and a goodbye-see-you-never. Specifically, you can get referrals, new acquaintances and friends, an enormous amount of help in return — especially if you're helping from the heart.

There was a recent article on Habr about how horrible the hiring process looks right now. Especially in the US — how resumes get lost because they all go through a computer that looks at them and tries to pick the best candidates. The candidates get selected, and then they have to go through a three-part interview where they sit down and talk to 15 people who ask stupid questions about notation. Notation you only know because you needed to pass the interview. You go through these questions, draw all over the whiteboard. And a month later you get a notification — thank you so much, we liked the way you work, you have great potential — and that's it.

I've seen so many people end up in this position, just sitting there: "I can't find a job, it's been six months, a year," "I became a developer, now what do I do?", "I don't like my specific job, what should I do?" — and so on. I have a question (and always have had) for these people: have you ever tried to help anyone with anything?

### First Job at 14

One of the first jobs I ever had went like this: completely by accident, my mom brought me, a 14-year-old, along to some meeting with business partners. I was sitting there listening to a woman explain that she had a new website, this is how it launches, it needs to be put on the internet, they're looking for a technologist to put the site online. So there I am, sitting at a computer, I see a folder with the website, I look — aha, it's written in PHP, I know what that is. I look inside — there's the whole site with a PHPBB forum installed. Someone had left the FTP login and password right there. I log into the FTP with nothing better to do, look around, and think — what the heck is going on here? It was just a blank site. Someone had uploaded it in that state, completely empty. I go to the URL and get a 404 error — index not found, no site. I grab the PHPBB folder, drag it over, go to /install — everything works. I poke around some more, get it running.

I turn around and say: hey, here's your website, it's working, I put it up. That was my first job. And then something incredible happened, something I absolutely did not expect. I didn't know how any of this worked back then. The woman walked over, looked at the site working, and slipped $200 into my shirt pocket. This is for a 14-year-old kid in the year 2000! I was in shock — I could do anything now, they gave me $200, I'm going to go buy everything!

Of course, it wasn't all that simple, but the point is that I just went and helped someone. I didn't even know that I was helping with some big problem — there was just a person sitting there, complaining that the website didn't work. And I came over, took a look, and fixed it.

### The No-Interview Approach

Again, with nothing better to do, I wrote an article on Habr, and then another one, and then another one. Then suddenly offers started appearing — people would say: guys, thanks so much, you write wonderfully, come work with us. I got offers from four different companies: I worked with some of them, didn't with others. The point is that each of them needed something done. They needed help in some form, needed their problems solved — and that's exactly what matters most here.

When you show up somewhere and solve someone's problems, that someone says: hey, you look like a really valuable resource — could you also do these five other things?

Naturally, I've seen and heard many times that this is terrible, that this is why people burn out, that this is the reason for overwork and not getting paid. In reality, I've never once seen that happen. Why? Because when you genuinely show up and help someone with something, that person is usually normal. It's not the psychopath they describe in articles, or in movies, or wherever else — where you come to help and they go: ha ha, wonderful, we're going to enslave you and make you write code for free. Usually, people come to you and say: thank you so much, listen, I've also got this other problem, could you please help with that too?

### About Real Results

And on top of all that, you absolutely need to collect data on how you've helped in real life. When I hear that wonderful word "KPI" — those so-called "key performance indicators" of how wonderfully you work — my knees start shaking. And I say: guys, if you're going to measure my KPIs, I don't want to do this, thanks, let's just do the project and be done with it. Look at the real things you've accomplished. You need to look at the actual output of your work. If you helped someone, if someone told you "that was amazing, great job" — you can go to that person and ask for, say, an accounting report to see the actual growth.

Unfortunately, that's not what typically ends up on a resume. What goes on there are things that automated processing systems respond to — synthetic things that can be presented to computers but not to people. You upload your resume, but as soon as you sit down with a real person, you can say: "Look, I have a notebook, and in it I record real impact. For example, after I worked with this company and helped them migrate from legacy to modern software, their revenue grew sixfold — let me work for you."

### On Learning

Now for the question of how to learn. Unfortunately, I see this attitude toward learning all the time on the internet right now: "Oh my god, learning, I have to go take exams, I have to do this again, I don't want to go to college, I won't survive, I barely made it through school, I don't want anything to do with this, stop torturing me." When you need to learn something, you take the documentation posted on the official website — we live in an amazing time when everything is published on some official website. Take the Rust book I wrote an article about. You pick up the documentation, you study it — you look at it and you read it. If you can't understand it, you look at it and say: okay, there's something I don't get here, I'm going to go figure it out. And you keep figuring it out until you start understanding.

Unfortunately, people bring an enormous amount of unnecessary complexity to something as simple as learning. How do you learn something? You get the information and figure out how to apply it. There's nothing more to it. You can just turn around, look at a piece of documentation, open a compiler, and start writing a program.

I have a diploma from a Moscow state university, the certificate, everything in order — I have it. I went to the website and wrote: yes, I graduated, I have a diploma, everything's fine. And not once, in all these interviews, has anyone asked: where's your diploma? Meaning, you can write that you have a degree or not write it — nothing changes. Same thing with certificates and courses. The question is whether you can actually apply all of this in real life — or whether you can't, and you're just going to sit there showing off your diplomas.

### The Human Approach

This is what I wanted to talk about today. This is a humanized approach to finding work. An approach that, unfortunately, we've forgotten, and that currently gets a lot of bad press. You know how to do it, you know where to do it, you know why to do it, you know the people who need help — so you go and help those people, despite what others say.

When you actually provide someone with help, you get the opportunity to bypass all the roadblocks, barriers, and so on that exist in the bureaucratic world. When you have this approach, when you say: "Look, give me two weeks, I'll show you what I can do. Pay me a third of the salary." I once signed a contract that way that turned out to be very, very lucrative. Here's how it went: I walked in and said, "So, look, either we do this contract, or you end up paying a standard developer salary ($12K a month). Let me work for you for two weeks, you pay me $2K, and then we'll compare results. If there's real output and you can see that something is happening, then let's talk further." It paid off. People agreed, said — let's see what you can do. And all of this happened without an interview, simply because I wanted to do something, could do something, knew how to do something, and was able to explain, help, and get connected.

There are companies that genuinely do one thing — produce a specific product. Like, we make mushrooms, nobody sells better mushrooms than us, nobody has ever been poisoned by our mushrooms, we're proud of our quality. Wonderful — go and help the people who jar the mushrooms, because they've got the best russula mushrooms in all of Moscow. There are companies out there, and there are many of them, that aren't built on the principle of a giant business machine, that don't turn every person into a cog, that don't make people burn out. Normal companies exist. They allow for normal human relationships, and those relationships really do still exist. All you need to do is come in and say: hey, let me help you with this thing — I know how. And they'll say: you know what, let's do it — what terms are we working on? And everything works out great.

---

One last thing: I wrote an article on Habr. In that article, I described one of those moments when I came in and started helping sort out an old system that had been installed there and wasn't working properly. In the same article, I described how I learned to work with Rust, and also how I found someone, helped them, and learned something new in the process of helping. Honestly, there was nothing complicated about it. And here I am, 35 years old, not experiencing any difficulties making a living. Because I believe there are still people out there who need help. If you honestly, sincerely come to someone and say "hey, let me help you with this," the response you'll mostly get is "sure, I think you can help us, let's take a look and figure it out."

If you have any questions — I'm easy to find through my articles on Habr. I can help you make connections, talk to people, help answer existing questions about getting through an interview, or having a conversation, and so on. Thanks for listening.
