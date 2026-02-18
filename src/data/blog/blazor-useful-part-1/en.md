---
title: "Learning Blazor by Building Something Useful. Part I"
slug: "blazor-useful-part-1"
date: 2021-10-25
description: "Part one of how, instead of yet another ToDo list, we built a useful IoT relay control system in Blazor: Entity Framework, MVC controller, server-side rendering, and C# instead of JavaScript."
lang: "en"
tags: ["C#", ".NET", "Blazor", "WebAssembly", "IoT"]
---

Whenever I see someone teaching a programming language, I often notice a tendency to show beginners primitive examples in the form of a ToDo list. Besides the fact that such examples don't teach anything actually useful about programming, they're incredibly one-sided and don't let you appreciate all the pros and cons of a given development platform.

This makes me sad. Let's try building something useful and, in the process, show you what you can and shouldn't do with a fairly new Microsoft technology called Blazor.

Not long ago, I had to help some kids get started with programming. The boys were young, but their eyes were full of enthusiasm, and you'd constantly hear "How?" and "Why?" One of the students brought a couple of IoT relays to the studio — the kind that let you turn lightbulbs on and off over the network. Sure, for us Habr folks, that's not terribly exciting, but for teenagers it was just the ticket. Why not, I thought, and we started writing various relay programs with timings that let you animate string lights and all that. After all — don't want to scare you — but the end of the year is approaching, and soon we'll need to decorate trees and rooms.

The relays they brought in were bought on Alibaba and Amazon. They cost next to nothing and came in quite a large assortment. The kids were thrilled that the first relay was easily controlled over HTTP by sending well-formed requests. That kind of thing is easy to implement in any programming language. So even with JavaScript there were no issues, and everyone was happy.

The problems started with the second relay. It required commands to be sent as ASCII strings. And the third relay demanded binary input on a port. All the string-light-blinking programs started accumulating an unhealthy amount of logic and turning into hacks.

We decided to build the following system:

1. We have a list of relay models.
2. In the list, we specify the data transmission type and a list of commands available for each model.
3. We create a list of devices. Each device has its own IP address, name, and model name.
4. Based on this information, a control URL is generated for each command of each device, looking like this:

```
http://control-center/control/relay-lobby/port-1-turn-on
http://control-center/control/relay-lobby/port-1-turn-off
http://control-center/control/relay-lobby/port-2-turn-on
http://control-center/control/relay-lobby/port-2-turn-off
http://control-center/control/relay-lobby/port-3-turn-on
http://control-center/control/relay-lobby/port-3-turn-off
```

With a system like this for communicating with the relays, calling functions is a breeze. Among other things, it also becomes easier to connect such devices to smart homes.

Alright, we pick out the most advanced students and get to writing.

We'll be working with the latest version of Blazor for .NET 6.

We create an empty project and start designing. In principle, the requirements describe everything quite well — there's a database, it has relays, straightforward stuff. For the database, we'll use Entity Framework Core with a Code-First approach (meaning we write the code first, and then the framework generates the database based on that code).

### The Database

```csharp
public class DataModelContext : DbContext
{
    public DataModelContext(DbContextOptions<DataModelContext> options)
        : base(options)
    {
    }

    public DbSet<Model> Models { get; set; }
    public DbSet<Device> Devices { get; set; }
    public DbSet<Command> Commands { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Model>().ToTable("Model");
        modelBuilder.Entity<Device>().ToTable("Device");
        modelBuilder.Entity<Command>().ToTable("Command");
    }
}

public class Model
{
    public int ID { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public ICollection<Command> Commands { get; set; }
    public ICollection<Device> Devices { get; set; }
}

public class Device
{
    public int ID { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Address { get; set; }
    public int Port { get; set; }

    public int ModelId { get; set; }
    public Model Model { get; set; }
}

public class Command
{
    public int ID { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public CommandType Type { get; set; }
    public string Payload { get; set; }
    public Model Model { get; set; }
}

public enum CommandType
{
    AsciiString,
    UtfString,
    ByteArray,
    Binary,
}
```

If you've never seen anything like this, let's pause and get you up to speed. What you're looking at is Entity Framework. It's a framework that speeds up database development for applications written on the .NET platform. The applications are written in C#, primarily because to access your data, you're offered a language feature called LINQ (Language-Integrated Query).

What's good about all this? You can focus on your code first and not worry about the database. EF Core lets you connect your application to various databases without needing to learn their syntax. Everything can be done right in the language itself.

What's bad about it? EF Core lets you connect your application to various databases without needing to learn their syntax. Everything can be done right in the language itself. Online, you'll find endless wars about how this approach can seriously hurt performance. And indeed, a JOIN in SQL can look very elegant and return only the data you requested. If you write a sloppy LINQ query, you can bring down an entire cluster with a single line.

So LINQ is a double-edged sword. Extremely fast development and database prototyping must go hand in hand with a clear understanding of how your query works and what's happening on the server side.

Let me note right away: at this point, we should write the business logic on top of this database. But I decided to leave that task for the students (in this case, the business logic maps perfectly to the methods provided by Entity Framework itself, so we don't need to write anything extra).

Keep in mind — if you ever, anywhere, in any interview say that you pulled the Entity Framework model directly into your code, you'll be disqualified from the candidate pool and sent off to dig potatoes in a field. So don't you dare do that.

Next, we'll need two things. First is the Blazor site itself, which will allow editing values in this table. Second, we need a controller that will let us call network functions and send commands to the actual device. This component will be written separately, since we don't need Blazor for it.

### Frontend

For those who are here for the first time, let's cover some theory. Blazor is a relatively new framework for building websites, developed by Microsoft under an open-source license.

The main selling point of Blazor is that you can write all your site logic in C#, without using JavaScript (which is exactly what we'll be doing here for demonstration purposes). The site gets compiled to WebAssembly, and you can deploy it to a server. For those who've never worked with WebAssembly, I recommend reading up on the official website.

What does this mean for developers? The site consists of a few files — an empty HTML page, a small JavaScript file that manages the site, and a hefty chunk of C# code compiled into a WebAssembly file. This kind of file structure doesn't require any special server to run. You can throw it all on a static server, without any Microsoft platform, and everything will work.

But life isn't that simple. A site where buttons click and everything spins and twirls is nice, but it's no better than spinners and fidget cubes. All user interaction needs to be recorded on a server.

Idea number one — the site is built with Blazor, and you have a separate API server that lets you call functions remotely over the web.

Idea number two — Blazor doesn't have to do any of this WebAssembly business. You can compile your code into a .NET library and run it like a good old client-server application. The code executes on the server, and the client updates the page on screen, reflecting the changes.

This is exactly the approach we'll use.

A couple of things worth noting here.

In the good old days of ASP.NET, we did everything like this — the client clicks a button on the site. The entire site, essentially a form, gets sent to the server with all the data on screen. The server processes the site, modifies it, and spits it back to the screen. All of this takes less than 10 seconds, and everyone's happy about it in 2002. But it's 2021 now, and that won't cut it.

Blazor uses a different system. All elements available to the user trigger JavaScript code that talks to the server, executes the needed procedure on the server, and then the server sends back a list of changes that need to be made to the page. All of this gets packaged up and sent to your client, and the client-side JavaScript updates the page.

It's much faster and works in fractions of a second. This approach will be more convenient for us, and that's the one we'll use.

The main advantage of Blazor is that you don't need to bother with how to send messages to and from the server. It's all done automatically. Even if you want to switch your application from Server-Side to WebAssembly, all you need to do is change one parameter in the config.

The main disadvantage of Blazor is exactly the same thing. No matter how wonderful all these speedups are, they won't be faster than static content from cache. You shouldn't write every site in Blazor — its domain is complex applications with lots of buttons, dials, and the like. If you suddenly feel the urge to write a blog, don't write it in Blazor.

### Backend

Now let's move on to the Backend we'll be working with. As I already mentioned, we have code that takes certain character sequences and sends them to the relay. This code uses .NET TCPClient for data transmission. Normally, websites don't deal with this kind of thing.

To create this controller, we'll use ASP.NET Core MVC.

The MVC code itself is dead simple:

```csharp
[Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
[ApiController]
public class SendController : Controller
{
    [Inject]
    private IDbContextFactory<DataModelContext> Context { get; set; }

    public SendController(IDbContextFactory<DataModelContext> dmc)
    {
        Context = dmc;
    }

    [HttpGet("{Device}/{Command}")]
    public JsonResult Get(string device, string command)
    {
        try
        {
            CommandRunner c = new(Context.CreateDbContext());
            var answer = c.Run(device, command);
            return Json(new { result = "success", device = device, command = command });
        }
        catch (Exception ex)
        {
            return Json(new { result = "error", message = ex.Message });
        }
    }
}
```

We simply define the route `[HttpGet("{Device}/{Command}")]`. If a user navigates to the site at this address, we assume the first part of the path is the device identifier and the second part is the identifier of the command to send.

On success, we return a confirmation, and if anything goes wrong, we let the client know.

As you can see, we also have a `CommandRunner` class that actually executes the commands on the server by sending packets to the devices. Let's take a look inside this class.

The `CommandRunner.Run` code is pretty straightforward:

```csharp
public string Run(String Device, String Command)
{
    var dev = DbContext.Devices.Include(p => p.Model).ThenInclude(p => p.Commands)
        .First(p => p.Name.ToLower() == Device.ToLower());
    var com = dev.Model.Commands.First(p => p.Name.ToLower() == Command.ToLower());

    var answer = Executor.Say(com.Payload, com.Type, dev.Address, dev.Port);

    return String.Join(", 0x", answer);
}
```

And the `Executor.Say` code in turn does the following:

```csharp
public static Byte[] Say(string What, CommandType Type, string Address, int Port)
{
    Byte[] bt = Type switch
    {
        CommandType.AsciiString => System.Text.Encoding.ASCII.GetBytes(What),
        CommandType.UtfString => System.Text.Encoding.UTF8.GetBytes(What),
        CommandType.Binary => ProcessBinary(What, 8),
        CommandType.ByteArray => ProcessBytes(What),
        _ => Array.Empty<byte>()
    };

    using TcpClient t = new TcpClient(Address, Port);
    var s = t.GetStream();
    s.Write(bt, 0, bt.Length);
    return bt;
}
```

Here we convert the character string into a sequence of bits, bytes, ASCII, or Unicode characters, depending on what our device expects as input.

The main trick of the platform is this — the user digs through the manual and finds the codes that need to be sent to the device. Then they type these codes into a text field, and we send them to the device itself.

Naturally, this was a convenient opportunity to teach the kids the difference between strings, binary data, and ASCII sequences.

The outcome of this research activity was two functions that convert binary and byte strings into actual binary and byte values:

```csharp
static Byte[] ProcessBytes(string What)
{
    if (What.Length % 2 == 1) What += "0"; // If user sent us uneven byte string
    List<Byte> ret = new(What.Length / 2);
    foreach (String ch in What.SplitInParts(2))
    {
        var d1 = Convert.ToByte(ch[0].ToString(), 16);
        var d2 = Convert.ToByte(ch[1].ToString(), 16);
        d1 *= 0x10;
        d1 += d2;
        ret.Add(d1);
    }
    return ret.ToArray();
}

static Byte[] ProcessBinary(string What, int WordLength)
{
    List<Byte> ret = new(What.Length);
    foreach (var ch in What.SplitInParts(WordLength))
    {
        ret.Add(Convert.ToByte(ch, 2));
    }
    return ret.ToArray();
}
```

After that, we simply fire this byte sequence off to the device's address and consider our job done.

So, what do you need to know about the MVC framework?

It's a well-established software development technology from Microsoft. You can use it without worrying too much about stepping on landmines (though don't worry — we'll have plenty of mines ahead).

### This Was Just the Prologue — The Real Story Lies Ahead

So, we have the basic concept of the application.

Everything's great, ponies are jumping around, birds are singing. Everything works.

Yeah, right.

It's actually not that simple. In Part II, you're invited to join us in the godless world of Blazor and the massive pile of bugs that you'd do well to sort out before cheerfully diving headfirst into the world of coding.
