---
title: "Learning Blazor by Building Something Useful. Part II"
slug: "blazor-useful-part-2"
date: 2021-11-01
description: "Part two on Blazor: WASM binary pitfalls, Razor gotchas, component communication struggles, lifecycle traps, and the state of the ecosystem."
lang: "en"
tags: ["C#", ".NET", "Blazor", "WebAssembly"]
---

As I mentioned in [Part I](/blog/blazor-useful-part-1/) of this article, we decided to build a system that converts commands for sending various instructions to multiple IoT relays using Blazor. We threw together a solid system for working with these relays practically on a shoestring. Everything was great and fast! But not everything was as simple as advertised.

Now let's dive into the dark forest of weird things we had to deal with in Blazor. Naturally, the technology isn't brand new, and most of the problems described here have been more or less figured out on StackOverflow. In some cases we were left with a bad taste, in others — with plain confusion.

So, here are the Blazor pitfalls you'll stumble upon in your projects.

### Pitfall 1 — WASM

Practically the most useless part of working with Blazor. Why? Because the final binary size is staggering. While debugging the application, I popped open the console and saw that the total size of all binaries exceeded 15 megabytes. After running a release build, the size was brought under control and came down to 7 megabytes.

In principle, if we're talking about shipping an application on a corporate intranet where clients will eventually cache the WASM itself, you can wave it off. But for launching something like this for mobile users, the binary size can be far more intimidating.

Of course, there are ways to reduce the output binary size. But they involve some pretty questionable tricks. For example, stripping out timezone information, which is typically used in any respectable application. With all the trimming you can do, you can squeeze the binary down to about four megabytes.

But even so, if you write in vugu (Golang), you can start at 3 megabytes and compress it down to one.

So building on a framework like this is something that should happen only after long and careful deliberation. Then again, even if we switch our application to server-side mode, it won't work properly without a stable connection. And if the connection drops once and something fails to render, the application crashes spectacularly and you'll need to reload the page. At that point, you lose all application state.

Bottom line: WASM in Blazor exists, but it's one of the heaviest frameworks on the market.

### Pitfall 2 — Razor

The name Blazor comes from Razor. And even though Razor (2010) is much older than Blazor (2018), it has certain — how to put this mildly — quirks.

For example, it's very strange to see how such a seemingly mature engine is so unforgiving about minor code mistakes. A single missing `@` symbol leads to a complete meltdown of the entire page code. And this is never communicated during development. VSCode stays completely silent about it (and highlights the code as if it's written correctly), while Visual Studio simply stops highlighting code as code and displays it as plain text.

And during the build, everyone keeps quiet like they're guarding state secrets, but you'll get a nice fat dump during debugging.

For people coming from React development, this will be extremely frustrating.

The takeaway? You need to keep a very close eye on Razor. Write away, by all means, but make sure you double-check what you've written, because typos will go unnoticed without thorough testing.

### Pitfall 3 — Component Communication

Just like in React, Blazor has a concept of components. And indeed, in both frameworks, the component system has been the feature I personally used the most. But that said, components in Blazor are far less sociable than in React.

If I change a search string in the search component and want to display new results in the results list on the same page, I have to jump through hoops.

In React, things aren't perfect either, but still, there are far more ways for components to talk to each other. You've got Overmind, MobX, and good old Redux. In Blazor, nothing like that exists yet. You're stuck rolling your own workarounds or just making peace with the existing component system.

The result of this search for solutions was a separate component called Refresher, which created virtual channels. Components subscribed to these channels. When an event fired on a channel, all subscribed components would update. A bit odd and unfamiliar, but you could live with it.

Of course, an alternative approach would have been to build separate pages and just skip the functionality of updating some components from others. But that feels pretty bare-bones, I'd say.

Takeaway: Decent inter-component communication will have to be implemented by hand.

### Pitfall 4 — Lifecycle

And the fight against that lifecycle. If you're coming from the MVC world, you probably know that there are various lifecycle stages for pages and components. In Blazor, not knowing or misunderstanding any aspect of the lifecycle is simply fatal.

You'd think — what could be simpler? You have a component that wants to subscribe to events at the start of its lifecycle and unsubscribe at the end.

Great, let's do exactly that:

```csharp
async protected override Task OnInitializedAsync()
{
    Refresher.Subscribe("ReBlaze.Pages.Devices", () =>
    {
        UpdateDb().Wait();
        InvokeAsync(StateHasChanged);
    });

    await UpdateDb();
    await base.OnInitializedAsync();
}

public void Dispose()
{
    Refresher.Unsubscribe("ReBlaze.Pages.Devices");
    Context?.Dispose();
}
```

And this is where we start running into some very interesting weeds and problems. It became immediately clear that something was off when double queries started showing up in the SQL profiler, and the subscription-handling component kept breaking due to duplicate subscriptions.

We had to dig in and investigate, and after a brief search the culprit was found. It turned out to be the student who didn't sit down and study the lifecycle management system from start to finish. Naturally, the lifecycle will be different for WASM and server-side applications. That much is expected.

But it will also be different for server-side and server-side. What? Yeah, they kind of forgot to mention it — you'll come across this in the docs, but buried a bit deeper. There are two variants of Server-Side Blazor, one of which is Server Pre-Render. This wonderful processing mode renders the page on the server so it's ready to go. This is done for search engine compatibility and to deliver the page to the client faster on first load.

When a user visits the page for the first time, we render it on the server and ship it to the user. And once it's displayed, a special JavaScript file loads all the necessary components, and the page starts working. Wonderful. Except it also fires your `OnInitialized` event a second time. You know, just for laughs.

What do we end up with?

A complete mess. Pages that incorrectly display empty components, double queries, and broken state managers.

After everyone was thoroughly fed up with these problems, I deleted all the event system code from the repository and sent everyone off to read the docs for two days.

After such tough love, we finally had an understanding of what to do and how to properly handle lifecycle events.

Since the application was for local use, we simply disabled Server-Side Pre-render and took the easy road.

Takeaway: If you're learning Blazor, do not under any circumstances skip any materials about how the lifecycle works. These materials are absolutely essential for understanding how to write your application.

### Pitfall 5 — Community

It exists, but it's pretty sluggish. Naturally, when you walk into the world of corporate Blazor development coming from the npm ecosystem, you'll think everything's been abandoned.

There's one big CMS written in Blazor called Oqtane. The system lets you write your code in Blazor while managing content in a reasonably civilized way. From a developer experience standpoint, though, it looks brutal.

When creating a plugin for Oqtane, you'll need to install the CMS itself, then create a site, and only then can you start building your plugin within it. The result of creating a plugin is a new Solution that you'll need to open in VS and continue developing.

Questionable fun. Oqtane itself is being pushed everywhere by its creator, and while commits are still being made, the CMS looks like it's straight out of 2016's greatest hits.

The takeaway? The best way to learn Blazor is to either read the documentation or pick up a solid textbook — learning it by trial and error is not the way. It's very unforgiving about that.

### Conclusions

So what do we have? Something very interesting. The attempt to claim the top spot in the world of such frameworks is going nowhere. If back in 2019 I was still seeing articles about how Microsoft had finally released a React killer, by 2021 such articles have dwindled, and the hype isn't nearly as strong.

In the end, what we got is a very good system for those working in the corporate sector. Blazor is an excellent fit for intranet websites that load corporate data and display it on screen. Porting existing C# code to Blazor and WASM doesn't take much time. Compilation support is at a very high level. And yes, you can use .NET WASM directly — it compiles and is quite stable. Naturally, certain things aren't available in WASM, but typical business logic ports over in seconds.

Plus, Blazor is very easy to integrate into existing .NET projects. No major issues there.

Write a 3D game in the browser with Blazor? No, you really shouldn't. If you're itching to do something like that, welcome to the world of Rust. Yew is your friend. There you get much more compact binaries. Or if you prefer, there's C++ awesome-wasm.

On the other hand, in the world of WASM frameworks for high-level languages, .NET is the most advanced. pyodide.org and vugu.org haven't seen the kind of support .NET has. But that's precisely the catch. .NET, Golang, Python — these are languages originally designed for a different platform than WASM. And even though we've taught them to compile right into the browser window, these frameworks look pretty dubious, mainly because they drag along the legacy of the platforms they were designed for.

That said, Server-Side Blazor is free from these drawbacks and is simply a large utility for hiding the enormous amount of underlying code that carries out your instructions.

Given a good, stable connection, this utility works more than decently.

Learning Blazor is worthwhile, but only if you're already immersed in the .NET infrastructure and ready to work with it. Starting a new service can be done with more widely adopted languages. You'd be better off learning TypeScript and React.
