---
title: "First Slice of Rails: Ruby on Rails Through a .NET Developer's Eyes"
slug: "first-slice-of-rails"
date: 2010-03-01
description: "A .NET developer's personal experience switching to Ruby on Rails — installation, setup, first scaffold, and impressions of the framework."
lang: "en"
tags: ["Ruby on Rails", "Ruby", ".NET", "web development"]
---

The number of frameworks in the world is growing at an alarming rate. There are thousands of them already. Thankfully, the best among them aren't that many. The entire world of web developers has simply split into several groups, each favoring one framework or another. I don't like arguments or flame wars, so never mind what's better. I just want to talk to ASP.NET developers about Ruby on Rails.

### Why?

Let me tell you my story. I've been writing ASP.NET since 2004. I know many of the system's nooks and crannies and I know it's wonderful in its own right. I've been through 3 large .NET projects and written about ten websites that continue to run stable to this day. As far as frameworks go, .NET satisfied me in every way. In the largest projects, I found solutions to the most complex problems. And then, after 6 years, I simply wanted to see what else was out there. Naturally, the first thing I stumbled upon was RoR.

> This article is aimed at experienced programmers. If you can't tell a compiler from an interpreter, you're better off with Google.

### Terminology

**Ruby** is a high-level interpreted language for fast and convenient object-oriented programming. The language features OS-independent multithreading, strict dynamic typing, garbage collection, and many other capabilities. Ruby is close in syntax to Perl and Eiffel, and in its object-oriented approach to Smalltalk.

Any programmer who has been developing on .NET for a year is capable of understanding and quickly learning Ruby.

### Installation

You can install Ruby on Windows using the One-Click Install. Note that unlike the familiar `%APPDATA%` directory, everything related to Ruby is best installed on drive `C:` or similar — this will make working with it easier later.

Ruby without plugins is like an uncut gem. That's why **RubyGems** was created — a package manager for Ruby that provides a standard format for programs and libraries in a self-contained "gems" format.

Honestly, I can't find anything in .NET that comes close to a proper package manager. The .NET philosophy is that everyone makes their own installer and distributes packages however they see fit. In Ruby, everything is much simpler. For example, Facebook has an API, and someone has already written a wrapper for it. Great! You can use it by typing in PowerShell:

```bash
gem install facebooker
```

I immediately recommend updating Gems to the latest version:

```bash
gem update --system
```

### Ruby on Rails

If you still don't understand how Ruby on Rails differs from Ruby, allow me to offer the following equation:

```
.NET => ASP.NET Framework
Ruby => Ruby on Rails
```

Ruby on Rails is a software framework written in Ruby. It provides the Model-View-Controller architectural pattern for web applications and ensures integration with a web server and database server. Ruby on Rails is open-source software distributed under the MIT license.

### Setting Up the Environment

There are two options:

1. **Instant Rails** — a pre-configured server that includes Apache, SQLite, and Ruby with Rails. You unpack the archive onto your disk, run the batch file — it configures Apache and everything else. Installation is dead simple. Perfect for those who consider Notepad++ the best development environment.

2. **Aptana** — a full-featured IDE that lets you write in RoR and significantly makes life easier. The IDE must be installed in a folder without Cyrillic characters in directory names. I recommend installing as close to the drive root as possible.

The IDE will offer to install Ruby if you haven't done so already. For happy owners of Windows 7 — Aptana only runs stable under admin rights.

### Creating a Project

In Aptana, this is done by right-clicking in the Rails Explorer window. The entire project is best placed as close to the drive root as possible, in folders without Cyrillic characters. Or via the console:

```bash
rails testblog
```

Both commands create a site skeleton. After that, at `http://localhost:3000/` you'll find a welcome page with a tutorial.

### Scaffold — Rails' Greatest Treat

Let's generate a scaffold:

```bash
scaffold recipe title:string author:string description:text
```

Scaffold is one of the greatest treats of Rails. In my lifetime, I've seen many data access tools. I've written two homemade frameworks, I've used ASP.NET Entity Framework, but scaffold blew me away with its simplicity and power.

This command created a new entity in the data access layer. In the `db` folder, a migration script appeared:

```ruby
class CreateRecipes < ActiveRecord::Migration
  def self.up
    create_table :recipes do |t|
      t.string :title
      t.string :author
      t.text :description
      t.timestamps
    end
  end

  def self.down
    drop_table :recipes
  end
end
```

This class was automatically generated by the framework and has two methods — `up` and `down`. They're used for applying and rolling back database changes. If you make multiple edits to your scaffold, multiple versions of migration scripts are created, each sequentially calling `up`. This lets you keep your DB under control and properly deploy it to production servers.

Moreover — this isn't SQL. At this point, we're completely database-agnostic. Take a look at `config/database.yaml`:

```yaml
development:
  adapter: sqlite3
  database: db/development.sqlite3
  pool: 5
  timeout: 5000

test:
  adapter: sqlite3
  database: db/test.sqlite3
  pool: 5
  timeout: 5000

production:
  adapter: sqlite3
  database: db/production.sqlite3
  pool: 5
  timeout: 5000
```

You can even use different database types on different servers.

### Migration

We have an entity and a database description, but we don't have the actual DB structure yet. We run the migration through **Rake** — a build automation tool similar to Make and Ant, but using Ruby syntax:

```
Rake > db > migrate
```

Rake migrated our entities to the database. And here's the main trick of Rails — scaffold isn't dumb. It not only provided data access code for the entity, but already wrote the entire MVC for it. You can go to `localhost:3001/recipes` and start working — a standard database access view that lets you make basic changes.

### What's Next?

Look in the `App` folder and see what's in the `models`, `controllers`, and `views` of your project. Everything needed to work with the entity is already there. Note that in Rails, a lot depends on variable and file names.

For further learning, I recommend:
- A collection of over two hundred screencasts on Ruby: [railscasts.com](http://railscasts.com/)
- The Rails guide: [guides.rails.info](http://guides.rails.info)

I hope this article gives you a chance to taste the wonderful RoR.
