---
title: "Windows 8 Developer Preview: What's Really Inside"
slug: "windows-8-deep-dive"
date: 2011-12-06
description: "A detailed breakdown of Windows 8 Developer Preview: WinRT, Metro UI, tablet features, IE10, and honest impressions from three months of daily use."
lang: "en"
tags: ["Windows", "Windows 8", "WinRT", "Metro UI", "Microsoft"]
---

> This article was NOT written in Vim

First — let me explain myself a bit. To me, the word "marketing" means "Creating a specific opinion among the public regarding a given marketing object." It doesn't mean "Pouring garbage into idiots' ears" or "Telling people how cool our useless product is." Good marketing made BMW what BMW is. The same happened with Windows XP, which is one of the longest-living operating systems in the world.

I'd like to note that Microsoft in America actively runs numerous marketing campaigns and promotes its products. There's nothing wrong with that. In fact, there's a lot of good in it — because users who read those newsletters and blogs know what features they're getting and how to use them.

For example, "pinning" apps and websites to the Windows taskbar. You know why in Russia the taskbar has only 3 icons by default? Simply because people don't know what and how they can pin things there.

Marketing can work other wonders too — for instance, it can help you suppress "black propaganda" and start actively selling your product. McDonald's is a prime example. I think it's the most mud-slung fast food joint in the world. But despite all that, it's also the most widespread and profitable fast food joint in the world.

So what's my point? It's simple: in the absence of accurate information, flame wars begin. Flame wars escalate into trolling, and from there it's easy to manufacture good black propaganda.

The thing is, after six hours of excellent video presentations, tons of text and video clips, after an excellent marketing campaign, the US already knows and understands what's what in Windows 8. But in Russia, people are embarrassingly confusing the system search with the new app store.

So from here on, I'll be laying out the facts about what Windows 8 is, how you consume it, and what it goes well with.

So what great and mysterious secrets does this system hold? A newbie will tell you that Windows 8 is just a new and disgusting Start menu. But we're not just people — we're Habr-people. Our task is to deeply understand the topic at hand.

### WinRT

Let's go. To understand what one of the greatest achievements of the new OS is, let's dive into the wonderful world of programming. What does an operating system actually do? No, it does not provide users with access to a computer. It provides programmers with an API. WinRT specifically is a new set of APIs designed to make the programmer's life easier.

The core approach the company is taking is "Clean and Simple." The interface must be simple and responsive. If a user clicks a button — the button must react instantly. There should be no deep pondering by the entire system. (You do remember how Windows 95 would blue-screen when you pulled a disc out of the CD-ROM, right?)

Accordingly, the new APIs were built with this approach in mind.

What's most interesting here:

**They are completely native.**

As good as the much-praised .NET is, it's not fast enough to properly provide access to operating system functions.

**They are completely asynchronous.**

No matter what you try to do, only in a real-time system can you guarantee a response within a given time. In Windows, you can't predict how long it will take to read five bytes from a file (maybe that file is 20,000 kilometers away on a shared drive).

All major languages have been extended with special features for working with asynchronous calls. This makes it reasonably easy to work in a terribly asynchronous environment. Here's an example in C#:

```csharp
public async void InitializeDictionary()
{
    Stream s = await GetTextReader();
}

async Task<Stream> GetTextReader()
{
    StorageFile sfro = await
        Windows.ApplicationModel.Package.Current
        .InstalledLocationAsStorageFolder
        .GetFileAsync("Test.xml");

    IInputStream inputStream = await sfro.OpenForReadAsync();

    Windows.Storage.Streams.DataReader dr = new DataReader(inputStream);

    return inputStream.AsStream();
}
```

Any reasonably advanced programmer will understand the main idea. To parallelize your process, you no longer need to spawn threads — just use a couple of new keywords.

By the way, notice the `StorageFile sfro` and where it comes from. The key twist in WinRT is that you cannot perform a synchronous operation. At all. They are no longer available. Let's continue.

**They are equally well supported in C++, C#, and VB.**

Moreover, what blew my mind — you can get the exact same result using JS + HTML5.

I want to note that the folks at Microsoft, after a long game of Q&A with themselves, decided that C++ deserves to live for several more generations. So many good trolls have fallen on the battlefields of C++ wars, and it turns out it's going to live on.

Though what pleased me most was the proper HTML + JS combo that matches the speed of a .NET application. And as I've mentioned, you have access to ALL the tools available in WinRT. Think you can apply a DirectX 11 filter to an image on your website? Well, in Windows 8 you can do exactly that.

Moreover, all new control sets are available in .NET languages, JS, and native code alike, so all your applications will look absolutely identical.

Appetizing? The main thing is that it's incredibly fresh and novel. You just want to try it. But this is only the programming part. We have a tremendous number of features still ahead.

### Metro UI

Now let's move to the design aspect. The amount of flame war over the new Windows 8 menu has been so massive that I personally watched trolls being carted away from the battlefields. What is Metro UI? It would be silly to say it's "a new Start menu interface." No. It's a new approach to application design.

It's the same Control Panel tab, but one shows the old approach and the other shows Metro-style interface design.

What you can see with the naked eye is the absence of chrome. Chrome — in design speak — means the visual decoration around elements. The trim, roughly speaking. Every self-respecting designer knows you're better off not touching this trim, and if you do, do it carefully. Because it can end up like putting a body kit on a cheap car. You can over-embellish, or you can go too austere.

The Windows 8 developers settled this issue with an axe. They disabled chrome entirely. Completely. You no longer have borders around your controls. All you have on screen is data and nothing else. The idea is that the user sees data and manipulates it. They shouldn't be distracted by shiny buttons at all.

A brilliant idea, in my opinion. No more arguments about how many useful pixels on screen the browser takes up — it takes ALL the pixels on screen.

So, every application takes up the full screen, works only on presenting data, and doesn't bother drawing any borders around elements.

An offended designer might say that such a brutal approach leaves no freedom whatsoever. Not at all. Who told you data can't be beautiful? Think about it — if you want someone to read beautiful articles, why do you need to draw attention to the hosting logo? Habr's logo is simple and memorable, but it doesn't hurt your eyes. The main thing on Habr is good articles.

That's the foundation of the Metro UI approach. If you have a weather forecast, who needs to draw attention to the "Refresh" button when you can draw attention to the weather itself?

With this approach, the possibilities for application design actually increase. You don't need to be constrained by form display classes. You don't need to worry about whether the programmer will convert your beautifully drawn buttons into controls or just replace them with standard Windows controls.

Of course, several other concerns arise:

1. Working in Metro style requires a certain zen. A rainbow vomited onto a canvas won't make your application a super-Metro application.
2. Moreover, great restraint in font choice is needed. As you can see in all the screenshots so far, there's only one font. Nobody forbids you from using your font, but any Metro can be ruined by using 15 different fonts per page, five of which are variations of Comic Sans MS.
3. You need to break patterns. If you've spent your life designing classic-style applications, you'll need to retrain.

But there's one very important caveat, and the folks at Microsoft emphasized this several times. MS Visual Studio version 11 is a new version, and nobody tried to force Metro onto it. Why? Because at the same Windows 8 launch, the Microsoft team stated that the Metro interface can't be crammed into every application. Photoshop will work without Metro. Visual Studio will work without Metro. Because these programs aren't designed for finger input and aren't meant for sitting in front of a touchscreen.

So don't worry — if you're writing a global network sniffer, keep maintaining it without changing the interface. But Sudoku could definitely be rewritten for Metro.

The window-based interface isn't going anywhere.

On the other hand — the biggest plus of Metro apps is that when I'm relaxing, I like seeing Metro apps. When I'm quietly surfing the internet, I prefer doing it from Metro IE10 rather than the regular one. When I'm reading news on my tablet, I prefer seeing the Metro interface on screen. When I'm buried in tons of code — I couldn't care less about Metro.

The Microsoft developers understand perfectly well that they have no iPad alternative. So they decided to kill two bits with one stone. On one hand, they support the most widespread window manager in the world. On the other hand, they're creating a new, innovative manager that will be pleasant and convenient to use on portable computers.

So let's forget another stupid myth about Windows 8: no, nobody is going to force you to switch to Metro. Switching between the old desktop and the new Metro UI takes a quarter of a second and isn't really switching at all.

### Tablet Computer Features

Research shows the market will soon be flooded with tablets of every shape and color. The selection is already decent. There are relatively budget HP Slates ($500–$900), more extravagant Asus Slates ($1100–$1500), and even exorbitant dual-display Acer Iconias ($1400–$1800).

There are several key considerations:

1. All of the above run on batteries.
2. Screens are small.
3. Size should be compact.
4. Usability must be top-notch.
5. Goodbye, IBM PC architecture.

Windows 8 addresses all these points.

**Battery.** My Asus Slate on Windows 7 lasted 3.5 hours. That's just embarrassing. Windows 8 added an extra hour of life to this beast. Now I can get 4.5 hours with internet, music, and Word. It's not amazing — I'd certainly prefer a 9-hour battery — but still, that hour of extra life came for free.

**Screen.** How do you make your apps work well on both 1280×800 and 1920×1080? Lately, monitor and screen DPI has jumped from 90 to 200+. This happened thanks to the mobile market, which was racing over dots per inch. If you switch Windows XP to 150 DPI, you'll see a bloody mess of pixels in icons, mismatched fonts, and all that. Windows 8's Metro portion offers a different approach to application scaling and lets you actively play with screen DPI.

**Usability.** Here, Windows 8 — even in its unfinished super-alpha version — boasts a set of features I've never seen on any touch device. The on-screen keyboard is simply gorgeous. Beyond its pleasant "feedback" sound, it has three features: the letter "Ё" (a Russian letter often omitted from keyboards), a dash, and a comma on the base layer. That last one alone made me a fanatic of this keyboard. There's also a special mode for typing with two thumbs on the go.

Windows 8 completely rewrote the finger tracking algorithm. Where you used to need sniper precision to hit a checkbox, now you can easily resize a window with a single touch.

And of course, the ergonomics of the new Start menu and app switching are commendable. Simply swipe from the right or left edge of the screen toward the center — and what you need appears.

**ARM Architecture.** At BUILD Windows, a device was demonstrated that happily ran Windows 8 on an nVidia Tegra 3. Brighter future ahead.

### General Impressions and System Stability

I personally managed to boot my laptop from scratch to a fully loaded desktop in 7 seconds. This is a new feature in Windows 8 called "kernel hibernation mode." After several reboots, the system makes some modifications and starts booting faster than a hamster.

Add to this the Start menu written in the praised WinRT that does its job smoothly and quickly. The system is very responsive. Even a hung program trying to eat 100% of the CPU doesn't block the ability to open the Start menu. Moreover, nothing stops you from reaching the new Task Manager, which kills programs at your first command, no questions asked.

Compatibility with various programs is on par with Windows 7. If something ran there, it'll fly on 8 too.

**IE10** became not just a browser but a platform. First, browser auto-updates appeared. Second, IE exists in two forms within the system — one with Metro UI support and another that looks more like IE9. The difference between them is huge. The first Metro version couldn't care less about Flash and won't let you run it. Nor any other plugins. The second is more conservative and lets you stuff it with ActiveX steroids and the like.

Full disclosure — from the first Google Chrome release, I'd been riding the colorful company's creation for years. Then, after installing Windows 8, I decided to "civilize" it with a proper browser… And by the time I reached Google's download page, I realized I'd fallen in love with IE10.

1. It's the only browser that supports multitouch out of the box.
2. It's faster than Google Chrome. I don't think that'll last, but right now I can see that IE's rendering has finally reached truly proper levels.

Moreover, IE10 in Metro style lets you look at nothing but the website. Memory consumption is more than modest: 227 megabytes with 10 open tabs. Like any other Metro app, IE switches to "freeze" mode after 5 seconds in the background.

Another WinRT and Metro UI feature is the ability to store application settings in the cloud. You can now link your Windows login and password to your Live ID and get full transfer of settings and saved games to other computers.

By the way, you don't have to type your password anymore. There's a new super-feature — picture password. You make three gestures over an image and that's your password.

Antivirus is installed with the system. Updates arrive automatically. And memory consumption on a clean system dropped from 400 megabytes (Windows 7) to 200.

File copying is now collected in a single window. You can pause and resume different copy operations. You can also view a speed graph.

On the downside — in the new Start menu interface, it's best to navigate either with fingers or keyboard. The mouse suffers. I wrote to Microsoft about it, and they replied that they know and are actively working on improving mouse usability.

Despite using this system as my daily driver, I'd recommend installing it only to specialists in administration and engineering. The super-pre-alpha-preview-beta version that exists now occasionally glitches. I reboot it about once a week. I never saw a blue screen. Not all drivers worked, and some Windows 7 drivers required some wizardry.

### What to Do, and Who Lives Well on Windows?

To grab the bull by the horns, head to dev.windows.com. There you can:

1. Download the system image. Download it with Developer Tools only, otherwise you'll struggle installing them later.
2. Read about the new APIs. Unfortunately, documentation still leaves something to be desired. But I can note visible progress — every week I see article updates on the site.
3. Learn how to boot the system from a VHD.

The system is genuinely interesting. Mainly because despite the same old Windows kernel, the developers managed to completely rewire and rebuild it in a new way, without creating problems but adding a staggering number of new features.

All the technologies and approaches — WinRT, Metro UI (not to be confused with "the new Start menu that ewwww") — let you look at software development cycles in a new way.

By the way, if you're into 3D development, do yourself a favor and create a DirectX app in Visual Studio 11. I loved the ability to trace every pixel's journey on screen. How about this — set a breakpoint on a pixel, or simply click a point on a screenshot and get a stack trace for that point?

Before you start telling everyone what this system has and doesn't have, please — at least familiarize yourself with the documentation.

As one mutual acquaintance of ours used to say — "Developers, developers, developers..." Ladies and gentlemen, us developers are attracted to facts and interesting information about new programs and operating systems. And information about how we can apply it in our work.
