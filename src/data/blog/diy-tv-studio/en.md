---
title: "Building Your Own TV Studio with Blackjack and…"
slug: "diy-tv-studio"
date: 2021-11-16
description: "How a sysadmin turned pandemic video calls into a full-blown TV studio: Jitsi, Restreamer, BlackMagic, SDI cameras, and broadcasting to 2,000 employees for under $7,000."
lang: "en"
tags: ["sysadmin", "video", "infrastructure", "Jitsi"]
---

Life as a sysadmin in post-COVID times is a special kind of joy. I remember running around every store in the area, buying up the last remaining webcams. Overnight, the network of a modest company spread across five buildings in the city was completely crushed by video traffic. Everyone wanted a video meeting, and everyone wanted attention. Our humble internet bills\* started getting not so humble anymore, and as usual, we had only ourselves to blame.

Fine, I thought. If that's how it is, let's figure out how to fix this. Here's what we came up with. Nobody knew what was happening or how to live. So let's just spin up our own video chat server. At the very least, we'd be able to control and throttle the traffic on that thing.

And better yet, let's do something like a CEO newscast. Get management into one room. They sit there, discuss all the issues live once a week or something like that, and instead of all those endless meetings and stand-ups, every employee gets access to an internal corporate "YouTube" where they can just tune into one big video broadcast for the week and go on living their lives in peace.

Who would have thought that the grumbling of a couple of sysadmins would lead to the creation of a TV studio.

By the way, this decision was unanimously accepted, no questions asked. People absolutely loved the idea of canceling all the meetings and stand-ups and just getting 1-2 hours of video briefing from the bosses. And if someone really wanted to voice their opinion, they could do it the following week. A pleasant bonus was that most of the talkative folks lost their urge to run their mouths after waiting a week.

The result — less traffic. Work gets easier, sysadmin is happy. But I wasn't satisfied. Running all these wonderful meetings through a 480p camera with a smeared background and green faces — not exactly classy. On top of that, a network overload problem cropped up very quickly. Instead of hundreds of small conferences, everyone was trying to stream one big one. The switches were overloaded again, everything started lagging and stuttering.

And here's how we fixed it.

### Step One — Jitsi

Meet Jitsi. If you've never dealt with Jitsi, I refuse to believe you're a sysadmin who survived COVID. Out of the box, Jitsi is already what you need. Installation takes practically no time at all. And if we're talking about broadcasting over a corporate network, it's almost laughable. You just need to install certificates so Chrome stops complaining about their absence, and you're good to meet till your heart's content.

But with Jitsi came other problems. You've got a centralized server for generating content. Naturally, when a couple thousand people try to connect to that server, you can overload it too.

By default, Jitsi tries to connect clients directly over the internet. Or if clients are on the same subnet. But when large numbers of clients connect or when there's no proper routing, traffic starts getting routed through the server. Trying to connect 2,000 people results in a blurry video feed and stuttering audio. People sit in front of their computers, everyone's eye is twitching, and their skin tone shifts to a lovely, healthy shade of crimson.

But since only 10-20 of those 2,000 people are actually participants in the conference at any given time, and the rest are viewers, I came up with the following solution.

We have 5 locations that need to receive this content. The video stream itself is around 1.8 megabits per second. I wanted a sharp and beautiful picture. That's not a whole lot. All five buildings are connected via VPN. Inside — a proper structured cabling system that can handle the necessary traffic.

### Offloading the Network

This is where Restreamer saves the day. The idea is pretty simple. We install Restreamer on a basic server in each building. The program picks up any existing video stream and redirects it wherever you want.

Install one instance in each building, connect them to the Jitsi conference, and enjoy life.

Although the connection itself is a fun adventure — but not a simple one.

First, we spin up the Restreamer Docker container. This part is straightforward — by default, it creates an RTMP server. You, video-sysadmin, need to know this stuff well. Understanding video formats and codecs will be essential for fine-tuning your video stream. So don't be lazy, read up.

Launching Restreamer with an RTMP server is fairly simple. The only thing you need to do is expose the port externally (`-p 1935:1935`). And if you want to make sure nobody uninvited barges into your stream, you'll need to add an environment variable (`-e RS_TOKEN=habr-loves-kittens`). In that case, you can redirect video traffic to `rtmp://[address of your box]/live/external.stream?token=...` (And good luck trying to pass a password written in Cyrillic.)

All that's left is to teach Jitsi to work with this stream. Until relatively recently, if you wanted to redirect a stream from Jitsi to your own RTMP server, the whole process was a riot. You had to run ffmpeg on the server and stream through bash. But during the pandemic, Jitsi was updated many times, and streaming video conferences became much simpler.

But wait! We're in the city of dreams come true here. And we're building our own video studio with blackjack and courtesans. We can't just slap a raw stream onto a screen. We need to do this in style.

Alright. The first thing we did was pull the Jitsi source code and stripped out all the logo overlays from the video. Don't get me wrong. It's not that we don't respect the company, but we just really wanted a clean video feed and nothing else.

Next — we disabled the video quality auto-adjustment. Instead, we set the quality to a constant value. Our network was designed to handle a certain amount of video, and we were ready to sustain 720p.

After that — everything is simple. Start the conference, redirect it to Restreamer installed on the main server. This instance has a simple job — it distributes the stream to the other five Restreamer instances installed at the branch offices. Since we don't even need to transcode the video in the stream, the load on this instance is minimal. The video arrives at the branch offices, and users can watch it on their workstations or through the corporate Wi-Fi. Restreamer conveniently lets you display video in a YouTube-like mode. Go to the site, press Play, and watch.

The endpoint server is where the real load lands. But since we're not transcoding video, the load is mostly network-bound, not computational. A good network card and a dedicated line to the main router will ensure successful video delivery to the endpoints.

On top of that, since some participants were invited to the broadcast "by phone," this created extra buzz, because you could end up on live air. People loved it. But keep in mind, by the time the video reached the end users, the delay was around five to six seconds. So true real-time broadcasting it was not.

### Improving Quality

First — set up the camera properly. Spoiler: the most important thing for a good conference is proper lighting. Second on the priority list is a good background, preferably solid-colored and contrasting with the clothing. If someone's wearing a white shirt, a white backdrop won't work. Backdrops can be bought in rolls, or you can just grab whatever you have and hang it behind the camera. A red fabric with sheer curtains over it and dim LED strips behind those curtains created a stunning festive effect that was a huge hit. Add some snowflakes — and there's your New Year's celebration.

Buy a decent camera, and you'll be fine. We spent an indecent amount of money on an indecently expensive camera from a well-known company that makes mice and keyboards, and we were very pleased. But that camera wasn't even the biggest win for video quality. If you have the option, talk to your electronics vendor, pick out a few cameras with a decent lens, and test them.

Don't fall for gimmicks like "Specially designed for Zoom" or having a million buttons on the remote control. All of that is unnecessary.

A good camera that gives you excellent coverage of a single room without blurring the image has a lens. And if you see a massive lens, about two inches across, that's exactly what you need.

The camera should NOT include a built-in microphone. That's evil. The microphone absolutely must be a separate device. Search your marketplaces for what's called an omni-directional microphone or conference microphone. A tip: we settled on products from a certain company whose name has something to do with the respiratory organs of fish. We spent a pretty penny, but the audio quality was outstanding.

If you decide to buy a camera or microphone with a noise cancellation system, don't expect to spend less than $600. Sure, every manufacturer will talk about "enhanced image quality." But that's complete nonsense unless you have a hardware unit that processes and enhances the image on the fly.

And one last note about cameras. Never forget that an old Samsung Galaxy S7 has a better built-in camera than most of the cheap alternatives available on the market.

For a couple of bucks you can turn your old Android into a decent camera. Especially when you're on a tight deadline.

Now, a bit about how the conferences actually run. Typically, the conference is kicked off by a responsible admin with steady hands and a good mouse. This person is the conference moderator, making sure only one person speaks at a time, and instantly muting those who shouldn't be talking — so you don't have to listen to coughing, water-sipping sounds, and all the rest.

In this format, a video conference like this actually looks very professional and feels more like a live broadcast than just another hangout on Zoom.

The last thing I want to add here is your network bandwidth. A quality video stream will generate around 2 megabytes of data per second. You can compress it down to 2 megabits per second, and it'll still look decent on big TVs. Going lower isn't worth it. Going higher only makes sense if you want to do everything in 4K. But trust me, even at Full HD the quality of your picture will blow away anything people have seen before. You'll be operating on a "whole new level" and impressing everyone with the high quality. And through all of this, your network won't be under any serious strain. And note — up to this point, all you needed to buy was a camera and a microphone.

### Going Stratospheric

Can we do something bigger than just setting up a server and a network?

We can. But the next part of this article was written in a city where finding this kind of equipment is no big deal. If you can still buy this stuff in Moscow for a hefty price, in the regions it'll seem like black magic.

And black magic is exactly what we're about to meet. Say hello to BlackMagic. This is for when you've decided to pivot from sysadmin to TV producer.

Depending on your budget and capabilities, you buy what's called a Production Switcher. There are many options, all prices start at $700 and climb skyward toward a staggering $18,000. It's a TV studio in your pocket. Well, almost in your pocket. Connect four cameras to your device via SDI. Forget HDMI — it's the most useless cable type you've ever seen in your life. You won't believe how much easier it is to plug in SDI cables. They don't fall out of their connectors and are much more compact on their own. And very flexible.

Hook up several cameras at once. I bought used ones. New devices at this level cost around $2-3K, but secondhand you could grab them for $500. The cameras had defects. For example, the zoom control buttons didn't work. But I didn't need them anyway.

Set up one camera covering the entire studio and one camera for each speaker. Everything gets configured separately. Lighting can be done with whatever you have lying around. Fortunately, good tutorials on lighting setups are easy to find.

Depending on the quality of your switcher, you can take advantage of various features: hardware chroma keying, your company logo, or even pop-up name tags for the hosts.

After that, the producer sits in front of the video switcher and toggles between cameras for different speakers by pressing buttons on the control panel. Meanwhile, one of the sysadmins is writing a script to trigger transition reels — those little clips that let you switch the video from one channel to another.

Load the presentation materials into the switcher itself and you're ready to go live.

And at this point, the video conference is long forgotten, and everything has turned into a TV studio.

Buy a device that captures your output signal on the fly and converts it into an RTP stream. And that's it. You're broadcasting.

You might say this is overkill. Yes. In a sense. But it's overkill for Zoom meetings. The PR team, on the other hand, took to the studio like fish to water and started cranking out videos for investors and customers. News segments, product reviews, and things like that.

And behind all of this stands the IT department. Exhausted, but happy. Because we just built a TV studio from whatever we had on hand, for less than $7,000. And we learned to broadcast on the internet. Live and in gorgeous quality.

On top of that, we gained experience in shot composition, lighting setup, scene building, and working with a teleprompter. (And in some cases — experience in sewing, building set decorations, costume design, and, God forbid, stage makeup.) Add a couple of servers for storing large volumes of data and a couple of good workstations for video editing, and you're ready to become a media mogul. Bring on the courtesans, deal the cards.

Everyone's exhausted, but happy. Sales went up, the admins got bonuses, a new audio-video department was created, and additional staff was hired.

---

*\* Humble internet bills. You'd think it's simple — just go buy more bandwidth. But not in Los Angeles. Compared to Moscow's internet prices, it's absolute hell here. A 75-megabit fiber line costs around $3,000. A 200-megabit coaxial connection runs you $350. And an "unlimited" mobile plan costs $80 a month. That unlimited runs out at 22 gigabytes, after which you get 128 kilobits per second for the rest of the billing period.*
