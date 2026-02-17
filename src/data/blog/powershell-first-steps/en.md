---
title: "First Steps for PowerShell Beginners"
slug: "powershell-first-steps"
date: 2011-02-16
description: "A practical introduction to PowerShell for beginners — cmdlets, pipelines, working with .NET objects, the registry, and scripts."
lang: "en"
tags: ["PowerShell", ".NET", "Windows", "administration"]
---

> Come to me, brother, into the Console!
> — Admin the Long-Armed.

*Update from 2023: I wrote this article 12 years ago, and surprisingly, it's my most popular article. PowerShell has been updated over the years — it became PowerShell Core and now runs on Windows, Linux, and macOS. Scripts gained many new features, but the core idea remains the same. If you're just starting to write in PowerShell, this article is for you.*

Many shortcuts flew into the recycle bin since Windows Server 2008 came out. Regular users marveled at the new blue window that the folks at Microsoft stuck into their new products for some reason. People who follow blogs and know programming started studying this window. Eventually, people began to realize that Microsoft had truly developed something new and interesting.

So why do you need this? PowerShell (hereafter PS) is primarily designed for administrators and programmers. It lets you automate roughly 99% of all system operations. With it, you can configure remote computers, start and restart services, and maintain most server applications. The program's capabilities are astounding.

The goal of this article is simple — to show you a small fraction of what PS can do and give you a conceptual understanding of the subject.

### What Is PowerShell?

It's a command-line interpreter. You type commands, and the results appear on screen. Simple. That's how it's been since DOS and good old UNIX.

There are two key differences from its predecessors that set PS apart:

1. **Deep integration with .NET Framework.** This gives you the ability to weave powerful programming solutions into your commands and scripts.
2. **All returned values are objects** that you can work with as objects, not just collections of strings. This allows you to create incredibly powerful scripts.

### Getting Started

If you're using Windows 7 or 2008, PS is already available to you. After installation, launch the console and configure it to your taste. Take your first tentative steps — start by typing:

```powershell
dir
```

You'll get a list of folders in the current directory. A pleasant moment for UNIX fans — the `ls` command works just as well. PS has an alias system for various commands. In reality, you just executed the `Get-ChildItem` cmdlet. To see all aliases:

```powershell
ls Alias:\
```

### Cmdlet Naming Convention

Cmdlets in PS follow a **Verb-Noun** naming system. This helps you understand what each cmdlet does:

```powershell
Get-Process     # Get a list of processes
Remove-Item     # Delete something
Get-Help        # Get help on something
Set-Alias       # Create a new alias
New-Item        # Create a new object (e.g., a file)
```

### Virtual Drives

PS has a lot of interesting things in unexpected places. Check out what drives exist in your system:

```powershell
Get-PSDrive
```

You'll get a much more interesting list than what you see in "My Computer":

```
Name     Used (GB)  Free (GB)  Provider      Root
----     ---------  ---------  --------      ----
Alias                          Alias
C            16.56      63.44  FileSystem    C:\
cert                           Certificate   \
D              .11      53.92  FileSystem    D:\
Env                            Environment
Function                       Function
HKCU                           Registry      HKEY_CURRENT_USER
HKLM                           Registry      HKEY_LOCAL_MACHINE
Variable                       Variable
```

The `Alias:` drive holds all aliases. `Variable:` stores all session variables. `Env:` has OS environment variables. `HKCU` and `HKLM` are wrappers for working with the registry.

Try this:

```powershell
Set-Location HKLM:   # Or simply: cd HKLM:
```

An incredible way to navigate the registry! You can `ls` through registry branches or `cd` into any "directory" like `cd SYSTEM`.

### Learning in PowerShell

The most important command:

```powershell
Get-Help          # or the alias: help
```

Microsoft did an excellent job with programmer documentation. Pick any cmdlet you like and send it to help. For examples:

```powershell
Get-Help New-Item -Examples
```

The `-Examples` flag usually gives you two to five amazing usage examples with detailed descriptions.

If you don't know the function name but suspect it exists:

```powershell
Get-Help files
Get-Help Registry
```

### Useful Keyboard Shortcuts

**For newcomers:**
- Up/Down arrows — scroll through command history
- Right arrow at end of line — character-by-character replay of previous command

**For experienced users:**
- `Ctrl+Home` — delete from cursor to beginning of line
- `Ctrl+End` — delete from cursor to end of line
- `F7` — window with list of typed commands
- Select with mouse + Enter — copy to clipboard
- Right mouse button — paste from clipboard

### The Pipeline

When you run a cmdlet, its return values are converted to text and displayed on screen. But you can pass the output of one cmdlet to the input of another using `|` (the pipeline):

```powershell
ls -filter "*.bat" | Get-Content
```

The pipeline can solve the "wall of help text" problem:

```powershell
Get-Help Registry | Set-Content reg.txt
```

And here's some real magic:

```powershell
ps | ls
```

If you want to find out which file a process came from, just pipe it to `Get-ChildItem`:

```powershell
ps wordpad | ls
```

Result:

```
Directory: C:\Program Files\Windows NT\Accessories

Mode          LastWriteTime     Length  Name
----          -------------     ------  ----
-a---    6/28/2010   9:57 PM  4247040  wordpad.exe
```

### Objects and Get-Member

Everything you see on screen isn't strings — it's objects. To find out what we're holding, use `Get-Member`:

```powershell
ps wordpad | Get-Member
```

You'll see the full member list of the `System.Diagnostics.Process` class. The `ps` cmdlet returned an array of .NET objects, and we can program them:

```powershell
(ps notepad).WaitForExit()
```

If you wrap a cmdlet's result in parentheses, you can access it as an object right from the command line. The shell will "hang" and wait. Close Notepad — and you're back in the shell.

Try piping the results of different cmdlets into `Get-Member`:

```powershell
(ps notepad).StartTime | Get-Member
```

And so on, infinitely.

### Variables

In PS, variables can be untyped:

```powershell
$processList = ps
```

Or typed:

```powershell
[DateTime]$x = "02/14/11"
$x
# Monday, February 14, 2011 12:00:00 AM
```

### Working with .NET

Remember that everything returned in PS is a .NET object? We can create any object from the CLR:

```powershell
$client = New-Object System.Net.WebClient
$client.DownloadString("http://google.com")
```

We just built ourselves a `wget` from scratch. You can go to MSDN and browse through all the classes — this lets you create incredibly flexible scripts.

### Scripts

PS allows you to execute scripts, but by default, running unsigned scripts is prohibited. To lower the security level:

```powershell
Set-ExecutionPolicy RemoteSigned
```

Create a profile file — it will run every time you start PS:

```powershell
New-Item -type file $PROFILE
notepad $PROFILE
```

Your profile can contain color settings, favorite functions, aliases, and automation scripts. For example:

```powershell
$webClient = New-Object System.Net.WebClient
$cred = New-Object System.Net.NetworkCredential("login", "Pass")
$webClient.Proxy = New-Object System.Net.WebProxy("www.proxy.address", $true, $null)
```

### Practice Exercises

1. **Image sorter.** Write a script that sorts images into folders based on their size. You'll need `Where-Object` or `Foreach-Object`.

2. **Simple NMAP.** Run ping in a loop and parse the output. You'll need to learn `-le`, `-ge`, and string operations.

3. **Quote parser.** After logging in, display a random quote. You can use regular expressions, which PS handles very well.

4. **The Matrix.** Play with the `$host` variable and turn the blue screen into the Matrix.

Recent Microsoft software supports PowerShell — for example, SQL PowerShell lets you `ls` through records in any table.

I hope I've given you something interesting, and that you'll now take on the challenge of mastering an interpreter that will truly help simplify your tough programmer's life.
