---
title: "Sharing (into) the Console"
slug: "console-sharing"
date: 2021-10-27
description: "Useful console services for sysadmins and developers: terminal streaming via seashells.io, file transfers through transfer.sh, and what to do in the console while you're waiting for a deploy."
lang: "en"
tags: ["Linux", "console", "sysadmin", "tools"]
---

We've all gotten used to conferences being virtual by now. We all work through Zooms, Skypes, Meets, and Teams. Convenient, sure, but there's one nagging problem. When we, the programmers, need to share our screen, we let out a heavy sigh and hit that Share Screen button. And it's never without issues.

How do you show the kids all the wonderful things happening in the console?

The most annoying part is when you need to share a link that appeared on screen. A command finishes running and spits out a link or a key that you need to share with the team. Naturally, you end up selecting, copying, and "duplicating it in the chat." This is especially painful when what you need to paste into the chat is something a terminal command just spewed at you. The lines will lovingly shift, the formatting will be lost, and the colors will fade.

> A word about security...

### Sharing the console — seashells.io

This is exactly the problem seashells.io solves.

Instead of struggling to properly display your terminal on screen as video, you can simply stream your terminal straight to a website. And you don't even need to install any clients for this. Good old `nc` works like a charm.

So let's give it a shot:

```bash
echo "Привет, Хабр!" | nc seashells.io 1337
```

In response, you'll get a link — follow it and you'll see the command's output.

Your entire terminal — out there for the world!

The command output is fully mirrored to a text-based terminal available on the site. This terminal is accessible to anyone who has the link.

But let's talk about something more practical and professional. Anyone can print strings to a screen. How about something more serious?

Here goes:

```bash
htop | nc seashells.io 1337
```

The result? Colors, live updates, and all sorts of bells and whistles — right in the browser for everyone interested. Encoding, colors, and real-time updates are supported right there, out of the box.

Plus, everyone in the conference will be able to enjoy the ability to copy text straight from their browser.

```
Reading package lists...
Building dependency tree...
Reading state information...
Calculating upgrade...
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
1 not fully installed or removed.
After this operation, 0 B of additional disk space will be used.
Do you want to continue? [Y/n]
```

A few additional things to note:

All errors are still printed to your terminal, but not to the website. To get around this limitation, use a simple trick:

```bash
apt-get update 2>&1 | nc seashells.io 1337
```

And of course, if you want to see the output in your own console as well, you can use `tee`:

```bash
apt-get | tee >(nc seashells.io 1337)
```

And if users replace the `v` in the given link `seashells.io/v/pmMS6rAC` with a `p` (`seashells.io/p/pmMS6rAC`), they'll see a plain text document — no colors, no terminal rendering.

A couple of boring issues with the site you should know about:

1. Keyboard input is not supported. Obviously, nobody expects other users to be able to run commands on your server through a browser, but they also won't be able to do Ctrl+C or press F5. If you want to copy something — use the mouse.
2. The screen size is determined by the console that's sharing the connection. So if the admin fires up htop on a 4K monitor, people with smaller screens will either have to shrink their font size or deal with the same old problem of mangled lines.
3. Five concurrent sessions per IP address. So users on the same network might have a rough time.

The project is in beta and still being tested. You don't need any registration. No accounts either. All links created by the site are automatically deleted a few hours after your session ends.

On the site you can find the official Python client and a couple of unofficial clients. (Not entirely sure why, but hey, let them be.)

### Sharing into the console — transfer.sh

Ever been in this delightful situation: a server is down. You need to update certificates. Or upload some key. Or, conversely, download a key. You're standing in front of a rack with a KVM plugged into your beloved machine, wondering what to do. Sometimes you can fix things with a USB drive. Sometimes you can't. But you need to get data onto the server and off the server.

There's a whole bunch of services for this — you could use Dropbox, Google, OneDrive, Yandex.Disk, Mega.io, and the like. But all of the above have a problem. They only work through browsers or dedicated clients. You can't just upload data from the command line.

Meet transfer.sh.

To use the service, you don't need any utilities or browsers. Right from the console, type:

```bash
curl --upload-file ./hello.txt https://transfer.sh/hello.txt
```

In response, you get a link: `transfer.sh/cK6onw/link.txt`. And that's it! The file is available for upload and download. No registration, no accounts. And as a bonus, completely free of charge, you get a unique QR code!

You can download the file using the same curl:

```bash
curl http://transfer.sh/cK6onw/link.txt > link.txt
```

If you really want to upload something secret, you can pipe it through gpg first:

```bash
cat /tmp/hello.txt | gpg -ac -o- | curl -X PUT --upload-file "-" https://transfer.sh/test.txt
curl https://transfer.sh/1lDau/test.txt | gpg -o- > /tmp/hello.txt
```

By the way, the project itself is on GitHub, and if you really like it — you can deploy it in your own environment and use it locally. This reduces the chance of accidentally spreading your corporate encryption keys to the whole wide world.

### Bonuses

Never forget that sometimes a sysadmin's job is to potentially just wait around. I've spent hours sitting in front of a rack, waiting for a RAID array to rebuild or a production code update to finish.

So what can you do when there's no graphical interface in front of you? Well, sure, you could install lynx and try to browse your favorite tech site, but honestly, most of them don't behave very well in lynx. And half the time you don't even feel like installing lynx.

But why do we need lynx when there's telnet?

```bash
telnet aardmud.org
```

And there you go. Start playing. Create a login, a password, pick a race, a class, and off you go, exploring the world. With three hundred other equally weird people who are ready to play DND-like games in the console while waiting for a deploy.

And if DND isn't your thing — why not play chess?

```bash
telnet freechess.org
```

And from there — you know the drill. E2-E4 and a confident crushing of your opponent.

Registration on both sites doesn't require any personal data and exists solely to save your progress.

Relax as much as you like.

### Conclusions

The trends in console application development are nothing short of exciting. Let's share useful console-only things that can help save you time.

Once more, for convenience:

1. seashells.io — terminal streaming to a browser
2. transfer.sh — file transfers via the console
3. sprunge.us — a pastebin alternative
4. tmate.io — collaborative work through the console
5. `nc rya.nc 1987` — for when your sysadmin is getting on your nerves
6. awesome-console-services — a large collection of console services
