---
title: "Fear and Loathing in RDP"
slug: "fear-and-loathing-rdp"
date: 2022-08-24
description: "How RDP has quietly evolved over the last ten years: versions from NT 4.0 to 10, useful mstsc flags, shadow connections, security holes, and the future of Windows administration."
lang: "en"
tags: ["RDP", "Windows", "sysadmin", "networking", "protocols"]
---

Those of us who still administer Windows on servers are used to the RDP protocol.

The Win+R → mstsc sequence is hard-wired not just into our muscle memory — by now it's probably etched into our genetic memory.

But not many of us have actually studied the RDP protocol. To us, it's a given, and we don't ask questions about it. And that's a shame. RDP has actually been changing over the last ten years, and using it lets you build some pretty unconventional setups. It's also true that this wonderful, marvelous protocol can become a giant security hole in your company's internal network if you don't keep an eye on it.

In this article, I'll tell you what's been happening to the RDP protocol, where it's all heading, and what you should be afraid of.

### First — a bit of history

The RDP protocol was recently bumped to version 10. Although most of us are still used to version 5.1 and have never noticed any of the changes.

A quick recap of the previous five thousand episodes:

- **Version 4** was the first one, shipped with Windows NT 4.0.
- **Version 5** was added in Windows 2000. It let you work with printers on the local machine.
- **Version 5.1** showed up in Windows XP, allowing 24-bit color and audio.
- **Version 5.2** was added in Windows 2003 and was the first to include TLS encryption. On top of that, it picked up the lifesaving Console Connection feature, which has saved the author's behind from many a 2 a.m. trip to the data center.
- **Version 6** was a big deal for all those fancy users with multi-monitor setups. It came out with Windows Vista.
- **Version 6.1**, added in Windows Server 2008, let you redirect printers from the client machine. More importantly, it let you push only specific applications through RDP (rather than the whole desktop).
- **Version 7**, released with Windows 7, sped up the redirection of all those bells and whistles Windows Vista brought along. Pretty animations, Windows Aero, bidirectional audio, and similar things became available with this version.
- **Version 7.1** let you use the server's GPU through RemoteFX.
- **Version 8** finally let you turn off Aero Glass redirection, which was so essential in version 7. This version also, for the first time, let you tunnel an RDP connection through an RDP connection. Remember those wonderful times when we had to play out Christopher Nolan's *Inception*? The whole movie is basically a metaphor for the fact that if you connect to RDP through RDP, everything starts running excruciatingly slowly. Well, they fixed it. Plus they piled on a bunch of pointless extras that they'd remove in the next release.
- **Version 8.1** was just as pointless as Windows 8.1 itself, on top of which the client stopped running on the then-universally-loved Windows 7. The new version did contain an excellent feature called Restricted Admin, which let you connect to the admin console knowing only the password hash, not the password itself. Microsoft fixed this security hole by publishing an 80-page document that explains in detail how this hole — isn't a hole at all.
- **Version 10** brought support for High-DPI screens and added a bunch of stuff you'll never bother with.

Well, there you have it — a brief history of RDP. And although it kept changing, on the surface nothing much was happening.

But, as you can see, things actually were happening, and the protocol was sprouting new features that you may have never used.

### Let me in, I've got credentials!

Let's start with the ability to connect to a server's console. I spent many years training Windows admins, and to my horror I often discovered that people don't know about this useful flag built right into mstsc.

So: when launching mstsc from a console or the Run… menu, you can type `mstsc /console` or `mstsc /admin` to remotely connect to the server's console. This gives you access to session ID 0. In other words, you can "directly work" with the server's monitor and keyboard.

Why would you need this? Most administrators don't know about this feature because they've never administered Remote Desktop Services servers. And the most unpleasant moment comes when the licensing server suddenly decides to depart this world, and you can't connect to your RDP server remotely to reconfigure it.

So — remember that you can always type `mstsc /?` and check out the command-line options for the client.

### In shadow I stand

One of the most useful additions, in my opinion, in RDP. The ability to remotely "eavesdrop" on a user's session. When configuring this option, I recommend using common sense and the criminal code of the country you live in. At the very least, consult with local lawyers and make sure that some particularly enthusiastic lover of internet smut won't get the chance to rat you out to the authorities for catching him on the My Little Pony website.

*(Aside on how to handle situations like this and avoid getting yourself into trouble.)*

As you can see, even the folks at Microsoft themselves spent a long time not knowing what to do with this feature. First they added it in version 7, removed it in 7.1, and then added it back in version 8.

To enable this feature, you'll need to dig around in GPO. On the RDP server, configure: `Computer Configuration -> Administrative Templates -> Windows components -> Remote Desktop Services -> Remote Session Host -> Connections`.

Configure *Set rules for remote control of Remote Desktop Services user sessions* to taste. I usually picked *Full Control with user's permission*, meaning the user is notified of my presence. Although, if your corporate policy allows it, you don't have to notify them :)

After applying this GPO, you can log into the Remote Desktop Services server and run `qwinsta`, which will dump a list of all active connections on that server. After that, you can use:

```
mstsc /shadow:{id} /control /noConsentPrompt
```

`/shadow:{id}` lets you connect and view the session with the ID from `qwinsta`.

`/control` lets you actually control the session.

`/noConsentPrompt` lets you barge into the session without the user knowing that anyone's barged in. (Whether this flag actually works depends on how you've configured the GPO.)

This is a very handy tool for training users who don't know what to do with their lives. It's also great for remote support.

### Security threats

Let's not forget the small and very tedious little program called `rdp2tcp`. It lets users tunnel TCP bridges through RDP. The client side requires Linux, so it's not exactly the kind of gadget your accountants will be using. It's for the more tedious sort, the kind of people whose hands itch as long as there's something they could be breaking.

In general, the protocol itself is fairly vulnerable. Back in the day, for example, plenty of admins resorted to tricks like this to "quickly" patch up missing certificates:

*(screenshot of client settings disabling certificate validation)*

What's more, some admins, in an attempt to speed up client connection times, started fiddling with NTLM settings:

*(screenshot of NTLM settings)*

In the end, you literally get a system in which the login and password aren't transmitted in the clear — except, perhaps, to grandma at the farmers' market!

It's safe to say at this point that RDP itself never was — and never will be — a secure protocol. So don't go tossing RDP around the open internet without a VPN — it can be a hazard to all living things.

### The future of administration

Given all of the above, it looks like RDP isn't the first protocol everyone reaches for when they need to administer their servers. At best, it's for granting users access to a terminal server.

So what are we, the sysadmins, supposed to do?

Well, first, I strongly recommend taking a moment to enjoy the fact that Windows these days has excellent SSH support. If you want to give it a try, you can spin up a Windows VPS on RUVDS ;)

*(How to connect to a Windows virtual server over RDP on RUVDS.)*

Windows 2019 / Windows 10 work great with OpenSSH right out of the box.

If you haven't tried it yet, I highly recommend installing it. Right after that, you can set up Powershell-over-SSH.

*(Detailed instructions on setting up OpenSSH on Windows Server 2019 or 2022.)*

In this state, you can manage your server from the comfort of your Ubuntu laptop. Granted, you'll need to install PowerShell on Linux for that. And yes, this will look like you've taken all the heroes from *Star Wars* and dropped them into the *Star Trek* universe — but in spite of that, you'll be able to run admin scripts on your Windows machine at RUVDS through Linux. Which is what I actually recommend you go and do.

*(How to connect to a RUVDS Windows virtual server over RDP from Linux?)*

Fortunately or unfortunately, Windows is dying off as an OS (subjective opinion, sure). Even on home laptops, I'm increasingly seeing various flavors of Linux. Windows administration is now something only those companies do who are stuck in Excel and the need to work over RDP. Microsoft itself understands this and is trying to keep Windows alive for developers by jamming WSL into it.

But be that as it may, for now you can comfortably work with Windows over either RDP or SSH. The only question is how much time you'll spend setting up the clients.

### Useful links

- An article on SSH
- Our review of current RDP clients
