---
title: "Setting Up Your Own Mail Server with docker-compose"
slug: "docker-mail-server"
date: 2022-01-03
description: "How to stand up your own mail server using Mailu — a curated set of docker containers with postfix, dovecot, roundcube and everything you need. Step-by-step, with the landmines marked."
lang: "en"
tags: ["sysadmin", "docker", "email", "Linux"]
---

Recently I had to build my own mail server. Simple job, in principle. Grab a server and install stuff. Postfix, dovecot, letsencrypt, roundcube, spamassassin, clamav. Well-trodden territory. Go do it.

Except I needed a *pile* of these servers. So I thought — why not do it all in containers? You can. You just have to pull all the containers listed above, write a century's worth of `.env` file with a hundred-odd parameters, and, of course, configure nginx. Easy. Half a dozen hosts, and you're in business.

I sighed heavily and decided there had to be a simpler solution. There was. Mailu. Turnkey and out-of-the-box — though it still has landmines of its own.

Below the cut: how to install Mailu without pain, what the components are, and what you can change and reuse.

I found Mailu after twenty minutes of Googling. It's a neatly packaged set of docker containers that lets you spin up your own email server in minutes. The project isn't exactly obscure — 3,000 stars on GitHub — but it rarely surfaces in the usual tech write-ups.

### Why run your own server when Google exists?

- **A custom domain for personal use** — it's just a cool email address. For any halfway-serious company, though, it's mandatory. Without a corporate email, you can't even register trials for most B2B products.
- **No ads and no third parties scanning your mail.** Gmail and others were famously aggressive about this. Most have stopped, but it's still worth checking your provider's privacy settings. Yandex, from what I can tell, is still at it for ad targeting.
- **The ability to write an API against your mail system.** If you're a serious sysadmin, creating a new user in a domain should not involve clicking through five different interfaces. You want to run a script and have it create and link all the accounts automatically.
- **Cost.** If you have spare server capacity and a decent user count, running your own server is far cheaper than paying Google.
- **Postfix.** If you're planning to grow, you want postfix. Emails that need to be processed, routed between boxes, and made to jump through flaming hoops while singing the Star-Spangled Banner — all of that needs postfix.

### Getting started

We'll be installing on Debian 10. You'll need a dedicated server with a domain name. The whole thing runs comfortably on 4 GB of RAM.

DNS setup takes a couple of minutes. Go to your favorite DNS provider, buy `mydomain.org`, and set up the following records:

```
mydomain.org          A     1.2.3.4
mail.mydomain.org     A     1.2.3.4
mydomain.org          MX    mail.mydomain.org
```

First, save yourself some nerves:

```bash
systemctl stop exim4.service
systemctl disable exim4.service
systemctl stop apache2.service
systemctl disable apache2.service
```

Then install docker and docker-compose following their standard instructions.

### Landmine #1

While installing docker-compose you'll see a message like this:

```
perl: warning: Setting locale failed.
perl: warning: Please check that your locale settings:
    LANGUAGE = (unset),
    LC_ALL = (unset),
    LANG = "en_US.utf8"
    are supported and installed on your system.
perl: warning: Falling back to the standard locale ("C").
```

Sometimes an improperly configured locale breaks docker-compose scripts. Fix it right away:

```bash
export LANGUAGE=en_US.UTF-8
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
locale-gen en_US.UTF-8
dpkg-reconfigure locales
```

`dpkg-reconfigure` will pop up a locale picker — select `en_US (UTF-8)`. If you're choosing something else, good luck.

Next, create a folder for all your data at the root of the filesystem:

```bash
mkdir /mailu
```

### Configuration

Head to [https://setup.mailu.io/](https://setup.mailu.io/) and interactively build your `docker-compose.yml`. Fill in the fields and pick `compose` in the first step since that's what we're using. The rest of the values are obvious.

A few things worth calling out:

Enable the option that mounts the admin interface for your domain. I'd recommend replacing `/admin` with something less guessable — a small security win.

In step three you can choose a web client for your mail. Useful in most cases when you don't have a native client handy. The options are roundcube and rainloop.

Rainloop, in my opinion, looks much nicer than roundcube. In terms of functionality inside Mailu, though, they're identical. Some people say rainloop is easier on mobile, but I never found a reason to use a webmail interface on my phone — use a native client instead.

You'll be getting the GPL version of whichever you pick, so no bells and whistles like custom branding or 2FA. Rainloop offers a paid tier for that. If you seriously plan to rely on the webmail UI, the paid version with 2FA is worth thinking about.

Enable the webdav service so you can store contacts and calendars alongside the mailboxes.

### Landmine #2

If you're standing up a mail server that isn't part of an existing IT infrastructure, make sure the `IPv4 listen address` is set to your actual server IP, not `127.0.0.1`.

In the last configuration step, pick the database you want to use. For a 50-person company, sqlite will do. I needed postgres — user creation in my system happens externally, and my scripts need direct postgres access.

Hit Generate and you'll get links to a ready-made `docker-compose.yml` and `mailu.env`. Copy both to the server into `/mailu`.

### Landmine #3

Postgres is not bundled and has to be configured separately. If you try to add postgres as a backend directly from the web configurator, you'll get a warning that this path will stop working in the next version. If you already have a postgres instance, just plug in its address, user, and password.

If you don't, add one by hand.

In `docker-compose.yml`:

```yaml
# Postgres Database
db:
  image: postgres
  restart: always
  volumes:
  - "/mailu/postgres:/var/lib/postgresql"
  environment:
  - "POSTGRES_PASSWORD=pass"
  - "POSTGRES_USER=postgres-mailu"
  - "POSTGRES_DB=mailu"
```

And in the `.env` file, make sure the database settings match:

```
###################################
# Database settings
###################################
DB_FLAVOR=postgresql
DB_USER=postgres-mailu
DB_PW=pass
DB_HOST=db
DB_NAME=mailu
```

Time to launch:

```bash
docker-compose -p mailu up -d
```

### Landmine #4

Always pass `-p mailu` when starting the system. If you don't, weird things start happening and pieces of the system will fall off at random.

### Landmine #5

Check the logs of the `mailu/nginx:1.8` container. The system auto-provisions letsencrypt certificates, but it may not succeed on the first try. If you try to open the admin panel and see a warning and a "server unavailable" error, that's the clue.

If the log says cert acquisition failed spectacularly, just:

```bash
docker-compose down
docker-compose -p mailu up -d
```

Everything should come up. If it doesn't, check the nginx logs and `/var/log/letsencrypt.log` — most errors are described there.

Congratulations. It's running.

### Post-setup

First thing, run:

```bash
docker-compose -p mailu exec admin flask mailu admin admin mydomain.org PASSWORD
```

Then go to `mydomain.org/admin` (or whatever path you chose in step two) and change the admin password.

For the uninitiated: the admin interface is nowhere near as intuitive as Google's console. If you can't wait to start creating mailboxes, click `Mail Domains` and look for the tiny icons under `Manage`. From there you can create users, aliases, and whatever else you fancy.

That's basically it. You can start pushing mail around.

But don't rush. Be careful. You're now saddled with admin duties. If you love riding the sled, you'd better love pulling it too.

### Operations

To keep yourself safe, it's enough to back up the `/mailu` directory on the server. At least once a day. If this is a production server at a real company, I'd recommend rsync every five minutes, plus a full backup every 8–12 hours.

Deleted mail is gone for good. Users will come to you begging to get it back. Backups — no way around them.

For some reason backups aren't covered in Mailu's fairly thorough documentation, even though on GitHub the developers say the server backs up fine with rsync.

Obviously, since we're running postgres as the database, you'll need to configure additional tooling to back that up properly.

And of course, the best part — email sizes. If Joe Average likes sending 60 GB of mail a day, make sure your quotas and limits are dialed in.

When your server eventually locks up, the first thing to check is:

```bash
df -h
```

to see how much disk is left. Then:

```bash
du * -cksh
```

to hunt down whoever ate the space.

And that's it, really. You have your own postfix, dovecot, roundcube, and whatever else. It's trivial to move from one server to another. When you decide you need more control, you can pull apart the docker containers and replace them with a standard install of each component.

Net result: you have a mail server. For 50 employees, this configuration is more than enough. You get your own mail server for about 20 rubles per user per month. Significantly cheaper than Google Workspace. Now you can sit down and write instructions on connecting from iPhone and Android. Thunderbird, for one, will figure out the correct settings on its own.
