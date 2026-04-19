---
title: "Windows 11 Deep Dive: What's Really Inside"
slug: "windows-11-deep-dive"
date: 2021-08-20
description: "Windows 11 inside and out: rounded corners, the new Start menu, TPM 2.0 requirements, telemetry, and what the scary number eleven really hides."
lang: "en"
tags: ["Windows", "Windows 11", "UI/UX", "system administration"]
---

*Like all previous articles in this series, this article was NOT written in Vim.*

Hello, reader. We continue our once-a-decade blog covering innovations in the Windows operating system. The list of previous articles can be found here: [What the Scary Number Eight Really Hides Inside](/blog/windows-8-deep-dive/)

If back in those ancient times when I was describing Windows 8 innovations, I was a bit frustrated that Microsoft was thoroughly and clearly explaining all the new features in their latest OS versions while the tech forums were drowning in flame wars, now things are different. Somehow, even Microsoft stopped telling us about what's actually new in the Windows world and what it looks like.

Let's dive in and take a look.

> The world is changed. I feel it in the water. I feel it in the earth. I smell it in the air. Much that once was is lost, for none now live who remember it.

Long ago, Microsoft decided to get their act together and start educating developers about the innovations in what was then the new and unusual Windows 8. Blogs across the internet were overflowing with stories about new technologies, rendering systems, boot acceleration, and the like — all promising to make Windows 8 something incredible. We, fortunately, survived all those innovations, and Windows 8 evolved into Windows 10, which most of us respect. What's most interesting is that all those Windows 8 innovations carried over into Windows 10, and we still use them to this day.

Unfortunately, those days are gone, and the developers at MS are in no hurry to share facts about the new OS. Those facts are buried deep, deep down. Let's run through the main highlights.

## The User Interface

Well, first of all, so I'm not just talking empty — behold. W11. I've been working on it for about a month now and have been using it since the release of the first official preview. It looks just like any normal Windows. The Recycle Bin is still right there on the desktop (and where else would the little rascal go? We've been cracking that joke since the XP days).

The first innovation that Microsoft sang so many songs about is the centering of icons on the taskbar. A dubious innovation, since honest folk are used to having Start in the left corner. But fear not, simple man! Everything will be fine.

In the settings panel, you can put everything back the way it was. The Start button returns to its usual spot and the icons align as before, without the showing off.

I, as a true pioneer, will stick with the center alignment, because now that's what's considered canonical.

Alright, let's look deeper. Let's inspect for atrocities and heinous perversions. The Start menu. In my personal opinion, this element of the OS has sustained the most injuries with every interface overhaul.

Don't be afraid — this time too, the Start menu has undergone an incredible number of changes that will make you flinch. But it's not all that terrible. It could have been worse, really. Look, here are your apps pinned as icons. You can pin several pages at once. Or you can hit the All apps button and get a list of all applications, the Windows 10 equivalent. Same goes for the recommendations list. Smack the button and get a simple list of recommendations. Tiles are a thing of the past. No app grouping whatsoever.

Scary? Don't be afraid. I stopped using the Start menu back in the Windows 8 days. Everything I need to launch with a mouse from the couch is pinned to my taskbar, and if I do need to open something, I just hit Start and type the name of the application. Thankfully, this part of the interface hasn't changed and works like clockwork. Even better than in Windows 10. So relax — you won't be seeing this revamped menu.

Now let's talk about the interface. All icons have been redesigned and polished to meet modern design standards. All elements have been pleasantly rounded and buffed to a shine. Someone had the bright idea to redo the hideous Explorer menu into something reasonably coherent, albeit made of just icons.

Personally, I actually like this new Explorer interface. A ton of junk has vanished, and it's become more convenient to work with. Folders no longer try to render with icons showing previews of their contents. That perversion from the Vista era has been forgotten.

And most importantly — you'll no longer have five-meter-long context menus cluttered with icons from every useless program you've ever installed on your computer. (Yes, of course, please do add a "Register WinRAR" button to my context menu — I simply can't live without it.) Now all that garbage is tucked behind a single menu item, which you can invoke with the very convenient keyboard shortcut Shift+F10.

But don't worry. An interface overhaul doesn't necessarily mean everything needs to change. Take, for example, our beloved mmc. It's still stubbornly resisting dark mode and looks exactly as it should. Although the universal rounding has reached even here, as you may notice. Windows, like buttons, are rounded.

A special mention goes to the titanic effort of updating all the icons in Windows. A new interface demands a new icon set. For example, this year in our temple of all things interface, they finally redesigned and updated the most ancient icon collection, `shell32.dll`. This beast hadn't seen updates since time immemorial.

*And lo, it preserved the icon of the five-and-a-quarter-inch floppy drive, just for kicks, to have a laugh about.*

But wait — what kind of Windows update would it be if they didn't touch the Settings panel? Fear not, people! The Settings panel got updated too. And... Suddenly, it's become even more intuitive and convenient. Well, how shall I put it — more intuitive and convenient compared to the thing we never used in Windows 10. Gone is that "welcome screen" — you're dropped straight onto the tab you need and can start changing settings.

Are you kidding me? For the first time since Windows 8 was released, I changed network settings through the new Settings panel rather than through a cpl file. Achievement unlocked!

But despite all this, even since our last article, the classic Control Panel is still alive. Fewer and fewer applets remain in it, but it soldiers on. Why? More on that later.

The window manager update deserves special mention. Now when you hover your mouse over the restore button, you can behold a wonderful window positioning system. Very convenient, by the way. I actually use it.

And when you connect a second monitor, Windows has now learned to remember the state of your windows, and if you constantly plug a second screen into your laptop, it will remember that screen and restore the windows that were open on it upon connection.

*Fancy Zones have migrated into mainstream Windows*

Conclusion: MS has made a pleasant user interface that looks pretty darn good, without making any radical changes. The interface is easy on the eyes, and the designers did a stellar job. You can work with it, and it doesn't really distract. So be it.

Although, unlike other operating systems of this world, Windows bears the heavy burden of backward compatibility. Therefore, anything that was built and tailored for OLE plugin support back in 1999 still sticks out like a sore thumb. mmc and control aren't going anywhere. They will continue to warm our souls with their rays of immutability.

## Under the Hood

And here is where we need to crawl under the hood and look at the guts, to find out what the scary number eleven has really prepared for us. And this is where I could genuinely start foaming at the mouth and swearing. Well, I'll skip the swearing — I've been writing about this stuff for 16 years now. I can manage without.

If during the Windows 8 release MS was relentlessly talking about magnificent innovations like kernel hibernation mode and the new rendering system, now their Twitter feed is graced with wonderful updates about wallpapers and icons. Everything has become terrifyingly sanitized, even for developers.

Alright then — the news that shocked everyone and their grandmother is the mandatory requirement of TPM 2.0 in the system. In my personal opinion, this is a good thing. Fewer people will get hacked and compromised, since with this TPM, conboot won't cut it anymore, and extracting data from a stolen laptop won't be so easy. Of course, recovering the system will be quite the treat, but honestly, I think that ship has sailed. Messed up your Windows — reinstall from scratch. Naturally, corporate sysadmins will be thrilled. How convenient! You just need to keep a log of all recovery keys. So there you have it. This innovation is very much a double-edged sword. For the end user, it's great in terms of security; for the administrator, it's a headache. Although the security folks will love it, since lost laptops won't turn into a festival of handing out accounting spreadsheets.

And the rest?

In the latest weekly dev channel update, for once I received a shiny new updated Calculator. Its buttons are now rounded too. And this week came a new version of Mail. Its buttons are also rounded. And the week before that — get this — Microsoft Teams built into Windows. Because of course. (Although Teams does have one very handy option — "disable and remove from taskbar.")

Everything else is somehow indecently buried in blogs and documentation. Things you could endlessly talk and argue about — they're just not on the surface.

You have to hunt for information about innovations on websites of questionable repute, or follow scandals on Twitter. (Yes, yes, we know that getting rid of the omnipresent Internet Explorer Edge is going to get harder and harder. But deep down we all understand why you do all this, and we know that in the modern world, living without collecting data about your users is simply impossible.)

Where did Cortana go? Apparently Master Chief did something unspeakable to her, and you decided to axe her. OK, no great loss. But why don't I know about this? Nobody says a word. And I'm actually curious about what happened to her. Care to enlighten me?

Or here's another one — they removed Tablet mode support. Seems like an odd move in the age of touchscreens. But in reality, they just made it a native part of the operating system. And they did it well, dammit. (I have a Lenovo Yoga, a convertible, so I got to poke at all sorts of things with my finger.) And once again: radio silence.

Meanwhile, Microsoft Design is pouring out gigabytes of information about how they designed the new wallpaper.

## Big Brotherness

And of course, it all very gently and carefully veils the reality that the new Windows leaks data at the first opportunity to whoever will listen. I personally don't stress about it. Let them leak away, as long as they don't nag me. And various goodies help with the not-nagging part — browsers with ad blockers and no trackers (hey there, Brave!) and scripts for disabling the bells and whistles in the system, if the paranoia really gets to you.

Why does data get leaked? Not to spy on us and check whether we're storing anything spicy on our computers (hello, Apple!), but so they can more conveniently and effectively sell us services and all that jazz. In essence, the social dilemma is in full swing. Oh well. I buy food and clothes in offline stores, and ads get blocked on my end anyway.

So the Big Brotherness is still livable for now. Consider it an almost fair price for free OS updates.

## The Bottom Line

So what do we end up with? Some kind of Windows 10.5 came out. They updated the interface, redesigned Start, but the serious internal stuff somehow got skipped over.

And what's most frustrating is that the team writing articles about Visual Studio works far more nimbly and effectively than the Windows Insider team.

Microsoft, could you please fix this situation?

I understand that the articles on your blog are mostly repackaged versions of what's posted on the official Insider blog. And the information in the Insider blog is perfectly suited for a very specific audience. But your readers are curious engineers from all over.

The people demand blood and spectacle! Or rather, oil and gears! We need to know what's going to happen with support for new drivers, how support for new devices will work. What about Thunderbolt 3, what exactly will TPM protect, and so on. What's new in interface development? Will the new Windows be the main launchpad for MAUI and Project Reunion? What portion of the new OS kernel has been rewritten in Rust? What secure data transfer protocols will be supported in the new release?

And honestly, where are the kernel update logs?

Come on, folks, don't be lazy. We're genuinely interested. And if nobody on your team wants to write all this — write to me, and I'll write about it just for the fun of it. I'm armed with the most terrifying weapon in the world — my curiosity.

Thank you all for reading, and I'd appreciate any comments with links to good sources that are worth exploring.
