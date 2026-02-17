---
title: ".NET Interop: Working with Sockets via P/Invoke"
slug: "dotnet-interop-sockets"
date: 2009-01-19
description: "Bridging two worlds: using P/Invoke and DllImport to work with native Windows Sockets from a .NET application."
lang: "en"
tags: [".NET", "Interop", "sockets", "programming"]
---

*Enough theory already — show me the practice!*

We have a multitude of technologies. Some are incredibly fast, others are incredibly convenient. Some let you fly at the speed of light, others let you develop at the speed of light.

Arguments about which approach is better rarely die down. Today I'm going to show how you can cross a hedgehog with a snake. We have .NET, which lets you develop quickly, and we have Native, which runs quickly.

For educational purposes, we'll be crossbreeding these two approaches. This article has another goal as well. At its foundation lies a program called DuSter, written by me and Arwyl. This program is a dummy server that lets you test network applications. The server is very simple to use, quite flexibly configured, and supports protocol description files that allow you to more or less automate testing of any protocol. I handled the network layer development, my friend — the business logic and protocol parsing. The result was something incredibly well-polished and pleasant. We're proud of our program and want to make its source code available to the world for non-commercial use.

### The Basics

There's CLR — the Common Language Runtime, an environment that allows you to execute programs written in languages that support CLI (Common Language Infrastructure). All of this plus compilers and libraries forms the .NET Framework, one of the most widespread development environments in the world. I won't explain how .NET programs work, since that topic deserves a few articles of its own. I'll just state the key thing we need for this article: the machine code of .NET and the machine code of Native applications are not the same thing. This leads to an interesting situation: we can take one Native application written in Assembler and another Native application written in Pascal and cross them together. It's fairly straightforward — we were given such an assignment in university.

Being naturally curious, I decided to show off. I decided to cross Assembler with C#. I thought it would be simple — I'd just embed assembler code in C#. How wrong I was. Naturally, upon learning about MSIL, I realized the idea wasn't the best, but I didn't want to give up. I searched for a way out of this situation for a long time — and found one: P/Invoke via DllImport.

### The Task

So we have a .NET program that runs using the .NET runtime. The task: make the runtime call external libraries. Let's complicate it a bit more — let the program work with sockets based on Windows Socket 2.0.

> When we had network programming at university, they made us write using WS2, but as devoted C# fans, we turned our noses up at this library, since compared to `System.Net.Sockets`, WS2 is a pathetic parody of code. We negotiated with our professor for a long time and eventually reached a compromise: we were allowed to use .NET on the condition that we'd call WS2 through DllImport.

### Importing Functions

Let's get started and jump straight into the code:

```csharp
[DllImport("ws2_32.dll", CharSet = CharSet.Auto, SetLastError = true)]
public static extern Int32 accept(Int32 socketHandle, ref SocketAddres socketAddress, ref Int32 addressLength);

[DllImport("ws2_32.dll", CharSet = CharSet.Auto, SetLastError = true)]
public static extern Int32 bind(Int32 socketHandle, ref SocketAddres socketAddress, Int32 addressLength);

[DllImport("ws2_32.dll", CharSet = CharSet.Auto, SetLastError = true)]
public static extern Int32 listen(Int32 socket, Int32 queue);

[DllImport("ws2_32.dll", SetLastError = true)]
public static extern Int32 WSAStartup(Int16 wVersionRequested, ref WSADATA lpWSAData);

[DllImport("ws2_32.dll", SetLastError = true)]
public static extern String inet_ntoa(Int32 inadr);

[DllImport("ws2_32.dll", SetLastError = true)]
public static extern Int32 inet_addr(String addr);

[DllImport("ws2_32.dll", SetLastError = true)]
public static extern Int32 WSACleanup();

[DllImport("ws2_32.dll", SetLastError = true)]
public static extern Int32 WSAGetLastError();

[DllImport("ws2_32.dll", SetLastError = true, CharSet = CharSet.Ansi)]
public static extern Int32 gethostbyname(String name);

[DllImport("ws2_32.dll", SetLastError = true)]
public static extern Int32 socket(Int32 af, Int32 type, Int32 protocol);

[DllImport("ws2_32.dll", SetLastError = true)]
public static extern Int32 closesocket(Int32 socket);
```

This is C# code that does a simple and obvious thing. By referencing the standard Windows library `ws2_32.dll`, it imports pointers to the above methods into .NET. In other words, I'm allowing my program to use Native methods.

### Error Handling

What always annoyed me about the WS2 library was how errors were returned and information was read. I'm very uneasy about methods that return the number of bytes read and `-1` in case of an error. Even less do I like having to call `GetLastError` after getting `-1` to figure out what went wrong. The exception stack unwinding mechanism present in .NET satisfies my aesthetic requirements much better.

> **Note:** This style of error handling is specific to WinAPI. In it, all (or most) functions return error codes, including via HRESULT, 0, -1. And `GetLastError` is precisely the system function created to understand what actually happened. The transition to error handling through exceptions is one of the key features of the .NET platform.

### Constants and Marshaling

The next step was to bring the socket operations up to the level of .NET applications. First, let's gather all the constants that exist in Native applications into enums:

```csharp
enum ADDRESS_FAMILIES : short
{
    /// <summary>
    /// Unspecified [value = 0].
    /// </summary>
    AF_UNSPEC = 0,
    /// <summary>
    /// Local to host (pipes, portals) [value = 1].
    /// </summary>
    AF_UNIX = 1,
    ...
}
```

Next — the methods we exported from WS2 work with types that don't exist in the .NET environment. So we had to get a bit creative with marshaling technology to make ends meet:

```csharp
[StructLayout(LayoutKind.Sequential)]
public struct SocketAddres
{
    public Int16 sin_family;
    public UInt16 sin_port;
    public Int32 sin_addr;

    [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 8)]
    public String sin_zero;
}
```

This structure allows you to operate with a remote host's address.

### The NSocket Class

As a result, we have a full import of the WS2 library into .NET. That's cool, but we considered it insufficient because the library is incredibly inconvenient to use. So, with WS2 methods at hand, we started developing the `NSocket` class. The first step was creating a simple exception class — because network operations are full of problems, and these problems need to be reported to the developer. In .NET, the best way to report an error is to throw an Exception:

```csharp
/// <summary>
/// Socket exception handling class
/// </summary>
public class NSocketException : System.Net.Sockets.SocketException
```

Two more classes were written for the main work — `NSocket` and `NNet`. While `NNet` is more geared toward network operations, `NSocket` is an object-oriented representation of a socket (the thing WS2 lacks the most).

Here's one method from the `NNet` class that accepts an incoming connection:

```csharp
/// <summary>
/// Accept an incoming connection on this socket.
/// </summary>
/// <param name="bindedSocket">Bound socket to accept connection on</param>
/// <returns>Pointer to the connected socket</returns>
public static NSocket Accept(NSocket bindedSocket)
{
    WS2_NET.SocketAddres n = new WS2_NET.SocketAddres();
    Int32 toref = Marshal.SizeOf(n);
    NSocket s = new NSocket(WS2_NET.accept((Int32)bindedSocket, ref n, ref toref));
    s.Connected = true;
    return s;
}
```

And here's the `NSocket` class constructor that initializes a new socket instance:

```csharp
/// <summary>
/// Create a new socket.
/// The socket will be automatically created for IPv4.
/// </summary>
/// <param name="type">Socket type</param>
/// <param name="proto">Socket protocol</param>
public NSocket(NSocketType type, NProtocol proto)
{
    if (this.Disposed)
        throw new InvalidOperationException("Component is disposed");

    socket = WS2_NET.socket(2, (Int32)type, (Int32)proto); // 2 = AF_INET

    if (this.HasError)
        throw new NSocketException(WS2_NET.WSAGetLastError());

    this.Closed = false;
    this.Protocol = proto;
    this.SocketType = type;
}
```

### The Result

I'll be honest — I wasn't very good at .NET back then, so the class implementation has some rough edges. But overall, we built socket handling from scratch in one week of fairly relaxed work. It's worth noting that here we traced the evolutionary path from Native WS2 to .NET Objects.

Granted, the task is somewhat redundant, because .NET has not only excellent socket classes but also classes implementing servers and clients for popular protocols. Not to mention WCF — one of the pillars of .NET 3.0, which lets you connect programs over the network without requiring any knowledge of sockets. But behind these giants that free network programmers from their troubles, the forgotten WS2 is doing all the heavy lifting. Learning it is worthwhile — purely for understanding.

In the real program we're sharing with you, there's ten times more code. We tried very hard and wrote comments for every method so that everything could be understood.

In the end, working with sockets became a breeze:

```csharp
try
{
    NetModule.NNet.StartWS();

    if (CurrExemp.SocketProtocol == NetModule.NProtocol.Tcp)
        CurrExemp.Socket = new NetModule.NSocket(NetModule.NSocketType.Stream, CurrExemp.SocketProtocol);
    else
        CurrExemp.Socket = new NetModule.NSocket(NetModule.NSocketType.Datagram, CurrExemp.SocketProtocol);

    CurrExemp.Socket.Bind(CurrExemp.Port);

    if (CurrExemp.SocketProtocol == NetModule.NProtocol.Tcp)
        CurrExemp.Socket.Listen();
}
catch
{
    if (CurrExemp.ClientSocket != null && CurrExemp.ClientSocket.Connected)
        CurrExemp.ClientSocket.Close();

    if (CurrExemp.Socket != null && CurrExemp.Socket.Binded)
        CurrExemp.Socket.Close();

    if (NetModule.NNet.Started)
        NetModule.NNet.StopWS();

    MessageBox.Show("Can't create socket on specified port!");
    return;
}
```

This code shows how simple it is to start a new server for TCP or UDP protocols. No need for the many checks that WS2 requires.

### Applications

Using the information from this article, you can start creating your own applications that, for example, use the OpenGL library. Although, actually, don't bother — such a library already exists.

You could try speeding up your application using assembly language computations. MASM32 is a wonderful package for assembly programming on Windows. It lets you export your assembler code as standard libraries that you can plug into your .NET applications.

You could also write a program for interfacing with COM ports or USB interfaces, with the core in C/C++ and the frontend in C#. I think many would agree that programming interfaces in C# is much more convenient than in pure C.

And that's my story of how you can cross a hedgehog with a snake.
