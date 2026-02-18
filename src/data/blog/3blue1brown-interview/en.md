---
title: "Special Interview for Habr: Grant Sanderson (3Blue1Brown)"
slug: "3blue1brown-interview"
date: 2021-12-09
description: "Grant Sanderson, creator of one of the most popular YouTube channels about advanced mathematics — 3Blue1Brown — answers questions about applying math in business and programming, computing integrals in your head, and how a programming side project turned into a massive channel."
lang: "en"
tags: ["mathematics", "interview", "YouTube", "education"]
---

Last month I wrote a post about Grant Sanderson, creator of one of the most popular YouTube channels about advanced mathematics — 3Blue1Brown — agreeing to answer questions from the Habr community (a major Russian-language tech platform).

Grant answered your questions. Below you'll find a modern take on teaching mathematics, how to properly apply math in programming, and the story of how a simple animation utility turned into a massive channel. And of course, you'll get some on-the-fly derivative-taking and a story about computing antiderivatives in your head.

Let's go!

---

**How did you start learning math? Was it just for fun, or did you have some idea of how you'd make money doing mathematics?**

**Grant Sanderson:** Like most people, I started learning math because it was required in school. My father took an interest in giving my brother and me extra problems and instruction. I remember playing math games on more than one occasion. I remember these games from childhood — things like stacking sugar cubes in certain interesting arrangements and then figuring out how many cubes were on the table. (I got the sugar if I gave the right answer.) On top of all that, my father volunteered to lead classes at school and ran a "math olympiad." In those sessions, he placed special emphasis on creative problem-solving. At home, he would often tell us about various cool things he knew. I can't remember the details anymore. But one thing that comes to mind is something about how if you memorize the squares of numbers, it can help you multiply them. For example, 16 × 18 = 17² − 1 = 288. Because of this trick, I ended up learning the squares beyond 12 (which was the standard at school).

I wouldn't call all of this "fun" at the time, but I did enjoy doing math as a hobby. Part of it was fueled by a sense of self-importance. It feels good to be ahead of the other students in your class. I think my early desire to read math texts and solve problems was driven by an ambitious urge to be the best. In any case, by middle school it had grown into genuine interest and stopped being just a self-serving attempt to stand out. I didn't have any idea how to make a career out of it. But if you had asked me back then what I wanted to be, "mathematician" would have been one of my answers. At the very least, I would have said I'd study math in college.

---

**How often do you Google mathematical formulas?**

**Grant Sanderson:** It depends on what I'm working on. I'd say: fairly often. A lot of the day-to-day math I do is related to creating animations. I often need some specific formula for constructing a visual. Sometimes I'm just double-checking my calculations with a search engine. But when I'm learning math, I prefer books over Google.

---

**How much of mathematics is applicable to business? (In universities we're often required to take advanced math courses. A lot of people question this. "You won't need this at work." Can you say that this is a lie? How can an ordinary company squeeze extra value out of mathematics?)**

**Grant Sanderson:** Without a doubt, good "number sense" is useful in business. For example, for understanding annual growth rates, or for quickly estimating whether a deal will be profitable. But those cases don't really require a "deep understanding" of math. I think the more interesting question is: "How can a student apply advanced mathematics in practice?"

I think it's fair to say there's a correlation between how well someone knows math and how much they earn. It's unclear how direct the application of mathematics would be. It's also unclear how often such a correlation shows up. The cliche goes: we teach math not just so people know its direct applications, but because mathematics teaches you how to think. For example, you probably won't be applying the fundamental theorems of calculus at your job. (Unless you have a very unusual job.) But those who thoroughly mastered the nuances of differential equations and calculus as students usually end up in higher-paying positions. It's tempting to say this is because of their training, but I suspect the reason goes deeper. How much trust does modern society place in technical knowledge?

One clear example of how math knowledge is applicable is programming. It seems that knowing math lets you learn and understand code and software architecture faster. Knowing what proof by induction is makes it easier to understand recursion. If you've written and read a lot of mathematical proofs, it helps you get up to speed faster on applied tasks like debugging software, and so on. There are also a huge number of problems in software development that require direct application of mathematical principles. For example, machine learning requires knowledge of linear algebra and probability theory. Graphics programming requires excellent knowledge of linear algebra, calculus, and geometry. But even other areas of software development that don't look particularly mathematical at first glance can be improved with a good knowledge of math.

---

**Are there any criteria you can use to identify a good mathematician? How do you personally tell when someone is good at math?**

**Grant Sanderson:** What I like about math is that it combines technical and creative approaches. It's not just "you calculated something without making mistakes." Often you need to find the right perspective or the right approach to solving a problem. Here's a simple example — say you want to prove the Pythagorean theorem. First, you need to understand what a "proof" is and its general principles, such as deduction and avoiding logical fallacies. You need to be able to see where there's a gap in your chain of reasoning. But all of that knowledge alone won't be enough. The Pythagorean theorem isn't something that follows directly from definitions. You'll need to add some idea, draw the right lines, invent something. That's where creativity comes in. (A huge number of proofs can be found on Wikipedia.)

---

**Have you ever heard of Habr? How do you feel about Russians? Do you know any Russian mathematicians?**

**Grant Sanderson:** This is my first time hearing about Habr.

I've always really enjoyed working with Russian mathematicians. I've always respected how mathematics is treated in Russia. The books by Russian authors that I've read always placed a strong emphasis on problem-solving as part of the process, rather than something randomly tacked on at the end of a chapter. Vladimir Arnold has always been one of my favorite mathematicians. He explained things extremely well, and I think his style is present in the approach of a great many mathematicians from Russia.

---

**What unsolved mathematical problems hold the greatest potential for modern society?**

**Grant Sanderson:** Well, if it turns out that P=NP, that would be a huge blow to all of cryptography. It seems like that's probably not the case. But whatever the answer turns out to be, it will be very important. If someone manages to prove that P≠NP, I hope the process of the proof will bear more fruit than the result itself. The potential proof would be more important than the conclusion. Such a proof could potentially improve the general approach to creating and solving NP problems. If someone could prove that no proof exists, that too would be an applicable result, one that could point to problems with formalism.

---

**How many digits of π do you know by heart? What do you think about π digit memorization competitions?**

**Grant Sanderson:** Let's see, without any hints or peeking: 3.1415926535897932384...

I'm typing this, but I'm not entirely sure that's correct. I remember that as a kid I knew 20-30 digits. At the time it seemed important to me. Today I think it's silly. Memorizing constants, in my view, reflects the fact that something is wrong with modern math education. Kids just memorize things that have no meaning to them. There are many cases where memorization is useful in math. For instance, kids should memorize multiplication tables. But there's a huge amount of stuff that's useless to memorize. The "reason" is that it seems easier to memorize such things than to understand them.

Yes, in schools we don't make kids memorize the digits of π. But I'm afraid the obsession with rote learning leads to kids being trained to memorize the things they should be understanding. It leads to a kind of show where the result is the ability to memorize things.

---

**How important is mental arithmetic when there are so many calculators and computers around?**

**Grant Sanderson:** Despite what I just said about memorization, I believe that mental arithmetic is extremely useful. Especially if you're constantly encountering a particular type of problem. The best way to develop intuition is through problem-solving exercises. Often the "side effect" of this approach is that you learn to solve certain "subproblems" in your head. The more you can compute mentally, the better prepared you are to push through something that's hard to understand. You won't be distracted by a calculator. Intuition gets lost in the calculator.

Of course, there are many things you should compute with a calculator or Mathematica. But in order to learn how to solve problems in your head, you need to practice solving increasingly larger problems that will eventually become part of something even bigger.

Your ability to just "see" the answer depends on your understanding of integrals and trigonometry. For example, if you can compute an antiderivative, that means you understand the basic symbols and operations. Moreover, you know integral calculus. A lack of this knowledge will lead to problems with more complex integrals and derivatives. Heuristically, you should be able to visualize the area under a sine curve and have a sense of its magnitude.

If you constantly rely on a computer, you'll lose the ability to compute such integrals.

With all that said, when you come across an algebraic problem you've already solved many times, a computer will help you save time for more important questions. Furthermore, the development of software for quick answer-checking has improved the quality of mathematical work.

---

**What is your favorite movie about insanely talented mathematicians?**

**Grant Sanderson:** My favorite is Good Will Hunting. It's my favorite film.

---

**How and why did you create your YouTube channel?**

**Grant Sanderson:** It all started as a programming side project. I didn't know much about YouTube. Moreover, I couldn't even imagine that someone could make a career out of it. I simply wanted to write a utility (Manim) for creating animations of object transformations. (That was my original idea.) It was fun making videos and improving my tool. After a while I started getting feedback from friends who said they really enjoyed my videos. That inspired me to create educational content.

---

**How long does it take to write a script for a video? How long does it take to produce a 12-minute video?**

**Grant Sanderson:** It varies. Sometimes I write a script in one evening. Sometimes it takes 3 months. I really wish I were more disciplined about it.

Once the script is written, production of a 12-minute video usually takes about a week.

---

**What do you do besides YouTube? What kind of applied work is there for mathematicians?**

**Grant Sanderson:** I used to work at Khan Academy. I'd say it's not that different from what I'm doing now. But besides that, I do a lot of writing.

---

**What are your hobbies? How would you spend a vacation?**

**Grant Sanderson:** I like running, tennis, and rock climbing. In the winter I'm into snowboarding.

Thanks for the interesting questions!

*— Grant Sanderson, "3Blue1Brown"*
