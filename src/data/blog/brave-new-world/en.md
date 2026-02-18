---
title: "Brave New World"
slug: "brave-new-world"
date: 2021-02-23
description: "Oh brave new world of data privacy: The Social Dilemma documentary, the Brave browser, and why your grandparents deserve a better internet."
lang: "en"
tags: ["information security", "browsers", "Big Data", "social media"]
---

Oh, brave new world! How beautiful you are. How wrong George Orwell was, and how right Aldous Huxley turned out to be. Nobody is forcing anyone to do anything. People stampede in droves on their own, all to get a new pill and hand over every last bit of personal information to whoever asks. And of course, you, fellow Habr reader, are above all of this. We're not like the rest of the herd. We're smart. We sit behind firewalls, Tor, and all the rest. But all too often, we overlook the little matter of our grandmothers, grandfathers, mothers, fathers, and all the other ordinary people around us.

We're going to talk about Brave and a film called The Social Dilemma.

On Habr, this film has barely been mentioned at all. Unless I somehow missed a translated Russian version somewhere. And that's a shame.

### The Social Dilemma

I wouldn't let a single one of my relatives near a computer without first making them watch this film. It's a documentary, but it's shot in a very interesting way, where the documentary segments are interspersed with dramatized scenes performed by actors.

Tristan Harris (the creator of the project, data privacy advocate, and someone who greatly enjoys trolling major corporations) explains and demonstrates what's currently going on in the data processing industry, social media, infinite scrolling, and all that sort of thing. If you look at the list of participants in the film, you'll find former employees of:

- Google
- Facebook
- Firefox & Mozilla Labs
- Instagram
- Uber
- NVIDIA
- YouTube

All of these folks got together and, as one does, spilled the beans on everything that's happening in the industry.

> If you're not paying for the product, then you are the product.

Beyond the numerous commentaries from the former creators of all these systems and the discussion of where this all might lead, we get to watch events unfold in the life of a normal American family.

The film does an excellent job of explaining the problems with modern software that cosplays a bit too enthusiastically as Big Brother. It explains what's happening and why, clearly and accessibly. How is it that some people are willing to pay for your attention?

> There are only two industries that call their customers "users": illegal drugs and software.

A separate and very thorough section of the film covers how all of this big data and artificial intelligence has, as a side effect, started stoking racial tensions and massively contributed to the spread of conspiracy theories (such as anti-maskers, flat-earthers, and those who fervently believe that 5G towers must be burned with redoubled vigor because they're the ones spreading COVID).

The film deserves an award for its sheer reasonableness. Despite the fact that one of the participants, [Jaron Lanier](https://en.wikipedia.org/wiki/Jaron_Lanier), looks like a spaced-out hippie, his advice is anything but spaced-out. In fact, this man worked at Atari back in 1985, after which he left the company and worked on a multitude of projects, including early VR headsets, Internet2, and so on. He currently works at Microsoft Research, and in 2018 he wrote a book called "Ten Arguments for Deleting Your Social Media Accounts Right Now." The advice in the film is actually not that unhelpful at all.

Instead of suggesting we all form a circle and toss our phones into the fiery abyss, they suggest we "dial it back" — stop using infinite scroll, turn off social media notifications (and actually focus on work), stop watching "up next" videos on YouTube, use a secure search engine, and go on the internet when we need to, not when one of our news feed apps nudges us to.

By the way, the film has a solid rating on your beloved Rotten Tomatoes. And Google itself rated it at 95%, which is amusing given that Google took quite a beating from this movie.

(A brief aside and a small fly in the ointment: the film is in English. It was released in September 2020 and I haven't seen any Russian translations of it. To address this, I'd like to see if we can Habr-effect this whole thing. On the [film's website](https://www.thesocialdilemma.com/contact/), you can send feedback. If you're not an English speaker, ask if there are plans. And if you're feeling up to it — why not offer the team your help with translation? Even just subtitles.)

The truth is, we already know all of this. We, fellow Habr readers, don't need to be told why Facebook implemented infinite scrolling. We relentlessly strip out telemetry scripts from everything we can get our hands on. Our browsers are so decked out with blockers that only half the websites function semi-normally (and we're happy about that). Some of us don't even have accounts on social media at all, and those who do only use them to message grandma and grandpa.

But we are not legion. We are rare individuals, and there's a handful of us (at best). Fighters against addiction are forced to exist in an addicted world. We can compete all day long over how many firewalls we have installed, right up until we visit our dear mother (well, you have to show your face once in a while, even if just on a video call) only to discover she's had a falling out with dad because dad supports [that person we shall not discuss in this article], and she herself does not.

Or, it's always nice to find out that grandpa has already bought himself 10 electric vacuum cleaners from the brand "Babazooo," because it's the new crypto and it's going to skyrocket 50,000x any minute now.

A heavy facepalm is accompanied by an even heavier sigh. If the home Wi-Fi can still be put behind a proxy and secured, then beyond the walls of our castle, our kids, spouses, relatives, and friends are under constant bombardment.

Alright, we can try to enlighten the uninitiated by showing them films and giving them books. But what do we do about all this advertising pouring in from every direction? Just install an ad blocker on Microsoft Edge and Yandex Browser? Right. Those happily leak your machine identifier, and no matter how many times you reinstall them, they keep tracking your computer.

Okay, why bother with these spin-offs? We know there's Chrome and Firefox! (Which leak installation identifiers too, and you can rein them in somewhat by doing a full reinstall. Although Google doesn't really care about that either, because everything is tied to your precious accounts.)

### Brave — Defender of Our Data

And so, Brave the King strides onto the stage. Oh! Just look at the reviews on Google Play for the mobile version of this browser. You don't get ratings like that for nothing. The reviews are overwhelmingly positive. (Maybe five percent are complaints about someone's binary breaking after an upgrade.)

The entire internet won't stop talking about what a wonderfully secure browser this is, one that doesn't leak your data left and right! And on top of that, it lets you earn money by watching ads! (Ha, now there's an interesting idea — why not flip the money-for-attention engine around the other way? Let them pay me for my attention.) And how about IPFS and Tor support? Absolutely wonderful! I'll take it! A whole pack! The entire pride. Installing it on every device.

But even the Lion lets out the occasional stink, especially when he's gorged himself on zebra (that is, marketing campaigns). Why not sneak in auto-substituted referral codes without permission? Sure, let's do that! And hey, maybe show you some ads that King Brave deemed appropriate? Show them we shall!

Oh, why is everything so bad? Why is it so hard to just do things properly?

Because building browsers is hard business. At this point we have only one browser left, and it's Chromium. Unfortunately, the war has been lost. Firefox is still hanging on, but barely.

And building your own Chrome is no simple matter. More than once, articles have surfaced on Habr about how incredibly complex this browser's codebase is. And maintaining it independently is a losing proposition. So you need money, because programmers need to be paid, and servers don't fall from the sky, for crying out loud!

And what is our Brave trying to do? They're trying to walk this razor-thin line — the dividing strip between obscene profits and ethical handling of our data. They simply have no other way of doing it. They're stuck having to make do and improvise.

And that's why we, fellow Habr readers, are watching this lion warily. On one hand — thanks. On the other hand — whose gnawed-up skeleton is that lying over there? Ah, you devoured a zebra. Well, we understand, lions will be lions — they need their zebra.

So where does that leave us? Well, here's the thing: I know that on Habr, there are people involved with the project, and they keep an eye on what's going on here.

I'd like to propose (and I hope you'll back me up) that Brave add the following feature — a super-paranoia mode. This mode can be activated in the most arcane way possible. I'd be fine punching in the Konami code ten times in a row in the browser's main system menu just to enable it.

In super-paranoia mode, the following should be implemented:

- No bookmark syncing.
- No profiles.
- No password managers or credit card autofill. I don't need them. I keep everything offline.
- Allow clearing history on browser exit.
- No "approved" ads. Just block everything. Period.
- Actually remove all those whitelisted Facebook-related sites from the allowed lists. I don't care if half the internet breaks. If a site doesn't work in this state, I probably don't want to use it anyway.

Sure, it sounds like we'd be putting the lion on a starvation diet. Even the fattest lion would keel over in a month under those conditions.

But, ladies and gentlemen at Brave, consider this: people like us are few. We number in the thousands, not millions. But we have friends, partners, families, and all that. We could install regular, normal Brave on the computers of the people we know.

The only thing you'd need to do is bury the mangled zebra somewhere out of sight and stop with the shenanigans. Give me a browser that 100% leaks nothing to anyone, and in exchange, I'll find you an audience that you can show ads to, feed your BATs to, or insert referral codes for. (On the condition, of course, that you play fair and don't leak personal data — something you haven't been caught doing yet, as far as I can tell.)

Well then, fellow programmers, it's 2021. Let's not just call users "sheep" because they don't know any better. We're responsible people here. How about we teach them the right things instead, and everyone will be better off. Let's also make sure that someone with their head screwed on right is building us a browser that won't dump our data into the world's oceans without so much as asking.
