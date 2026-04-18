---
title: "Inheritance in ADO.NET Entity Framework"
slug: "entity-framework-inheritance"
date: 2008-12-20
description: "Two inheritance types in ADO.NET Entity Framework — Table per Type and Table per Hierarchy — walked through with common mistakes and their fixes."
lang: "en"
tags: [".NET", "Entity Framework", "databases", "programming"]
---

*What are you talking about, Morpheus?*

Hello everyone! My first article was received quite well. Thank you to everyone who left their opinion — it was a pleasure reading your feedback. I'm continuing.

In this article, I'd like to talk about inheritance. To be honest, before studying ADO.NET Entity Framework I never even thought about introducing entity inheritance in object-oriented database wrappers. Usually we built databases to avoid inheritance as much as possible. While it occasionally loomed on the horizon, we managed without it. Now I'll describe how I added two very simple classes to my project that were inherited from existing tables.

Again, I won't dive into theory — everything is shown through practice. I'll make a separate series of articles for the theory.

### Preparation

I'll say right away: I spent an hour over the code sorting through the errors that came up while writing this article. My goal now is not only to show how inheritance is implemented in ANEF, but also to show you the typical mistakes that can be avoided.

By the way, let's agree on an abbreviation: **ANEF = ADO.NET Entity Framework**.

### Database Structure

Since the first article, the DB structure has changed slightly but remains very simple. Originally, the DB only had two tables: `Post` and `User`. Now the schema has been slightly expanded:

1. **I created a BlogPost table.** The idea is that in my system, `Post` will serve not only as a blog post but also as a comment, message, and generally anything one user can send to another. This schema was created purely for educational purposes, since in most systems the comments table is a very critical one — constantly full of records and the most heavily loaded table in the system. Accordingly, `BlogPost` should inherit all data from `Post` and carry additional information. I want users in my system to write custom link titles for comments under each blog post. For example: "Hot takes here," "Thoughts on this." This will add some variety. Here I'll use the first type of inheritance — **each Entity has its own table (Table per Type)**.

2. **I also wanted my DB model to have both regular Users and Admins.** So, using the `IsAdmin` field, I'll implement the second type of inheritance — **one table for multiple Entities (Table per Hierarchy)**. Records will be filtered by the value in this field.

### Table per Type: BlogPost Inherits from Post

Let me note right away — this is where I made my biggest mistake, which cost me 20 minutes of forum-browsing. And it was actually very stupid and made by oversight.

It's important to set up the relationships in the DB correctly. The first time around, I stupidly reversed them — I made the `BlogPost` table the Primary in the relationship. Oh well, it happens, let's move on.

We go into Visual Studio, into our database project, and update our schema from the DB. A new Entity `BlogPost` should appear. Great, it appeared. Even with a relationship. **Delete this relationship first thing.** We don't need it in inherited Entities. After that, through the context menu of the `Post` Entity, we add a new inheritance.

And here I was disappointed by the visual development environment for the first time. We run project validation (I recommend running this validation after almost every change if you're not yet fully comfortable with ANEF inheritance). And validation crashes spectacularly.

The issue is that we need to do a bit more tweaking and understand a few things before we can properly set up the inheritance. We have two tables: `BlogPost` and `Post`. The tables have two keys — `BlogPost.PostId` and `Post.Id`, as SQL sees it. ANEF correctly determines that the `BlogPost` table doesn't actually have its own `BlogPost.PostId` key, but rather uses `Post.Id`. This makes perfect sense — we have a 1:1 relationship, so why bother with another key?

Fair enough. We remove the `PostId` parameter from the `BlogPost` Entity. After this, validation fails again — also correct. Our table has a `PostId` value, but it has no mappings. We fix this: we set the mapping for the table's `PostId` field to the `Id` variable.

The immediate question arises — where did we define an `Id` variable for the `BlogPost` table? As I mentioned earlier, ANEF considers that the `Post` and `BlogPost` Entities share a single key, so it implicitly added it to the `BlogPost` table.

Seems like that's it — now it can be used. Go ahead, try compiling.

### Table per Hierarchy: Admin Inherits from User

That was the first type of inheritance — each Entity is tied to its own table in the DB. Now let's move to the second type, where we have only one table and several Entity types.

As I mentioned — I wanted to separate the `Admin` Entity from `User`. With ANEF this is fairly simple. Through the context menu, add a new Entity, specifying that it inherits from the `User` Entity. You can immediately remove the `IsAdmin` property from both `User` and `Admin` entities — I left it in for clarity, but you won't pass validation with it.

Again, we need to do some tweaking. First, we need to set up the mapping conditions. Currently, all `User` and `Admin` records are identical — nothing separates them. We go to the entity mappings and select the conditions under which the mapping should occur.

ANEF doesn't allow you to expose the `IsAdmin` field as a property since it serves as a mapping condition.

And here was another great mistake. I spent another five minutes on forums before a fairly simple fact dawned on me: **if records are filtered into the Admin table by some condition, that doesn't mean all remaining records automatically go into the User table.** Therefore, you also need to include a condition in the `User` table's mappings to filter the remaining records into that table.

A quick note — my `IsAdmin` field, despite the name, isn't `Boolean` but `Int16`, so filtering was done using `IsAdmin=1` and `IsAdmin=0`. We had plans to expand the admin capabilities later, so this was done with future-proofing in mind.

### Conclusions

We now have two very simple, yet properly inherited entities. The specific properties and how to inherit them aren't that important. You can experiment with that yourself. My goal was to show how to actually set up this inheritance.

While digging around in ANEF inheritance, I thought of several schemas whose implementation would genuinely be easier with inheritance. For example, one of our systems had a portfolio system where a person could enter various data about themselves: workplace, education, scientific publications, and so on. Each type of portfolio entry had its own table, and I can tell you for certain — the SQL query that fetched this data was absolutely hellish. Everything was incredibly inconvenient and messy. If I had used inheritance back then, I would have had a `List<>` of base classes, say `PortfolioEntry`, that I could work with quickly and conveniently. This is a real-life example — I think that once you dig into the internals of ANEF, you'll find plenty of such examples in your own code.

In the next article, I'll try to include more code that demonstrates how to properly work with inherited entities.

**P.S.** All of this was done using free versions of Visual Studio and Management Studio. Microsoft didn't cut their products in the most savage way.
