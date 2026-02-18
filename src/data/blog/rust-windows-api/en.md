---
title: "Leveling Up — Rust and Windows API"
slug: "rust-windows-api"
date: 2021-10-06
description: "Continuing the compact programs series: building 2048 in Rust with windows-rs, creating a window via WinAPI, and wrangling the message queue."
lang: "en"
tags: ["Rust", "Windows", "WinAPI", "systems programming"]
---

I recently wrote an article called [Shaking Off the Dust — or How to Relearn Assembly When You Studied It 20 Years Ago](/blog/assembly-2048/). It covers learning assembly by building a 2048 game. The game was probably a decent fit for the article itself, but the end result left me a bit bummed out. A 10-kilobyte binary that gobbles up 2 megabytes of RAM because of an incorrectly linked library — yeah, that was hard to look at.

So I started wondering: how could this be done properly? Surely there's a much better solution out there.

Why not do it in Rust, with properly wired libraries? And here's the thing — if you know what you're doing, you can easily cut down on memory consumption while still writing a visual game that talks to the Windows API.

And we're not talking about some obscure third-party library here. Meet windows-rs, a project maintained by Microsoft themselves. Your ticket into the world of Windows, if you write Rust.

While writing this article, I realized we're borrowing a little from two worlds — Windows API and Rust. Certain things will seem obvious to Rust developers; other things will seem obvious to Windows developers. Since this article is for everyone, I decided it's better to over-explain than under-explain.

### Introduction

For those unfamiliar with Rust — you'll need to get up to speed. If for no other reason than the fact that since its creation in 2010, the language has been steadily gaining popularity. Since 2016, it's appeared in StackOverflow reports as one of the most loved languages. In 2021, Rust remains the most loved language on StackOverflow, which doesn't stop it from being a very niche language, accessible only to the chosen few. Mainly because Rust is a low-level language that, while beautiful and pleasant to work with, doesn't exactly teach itself in a 20-minute YouTube video.

Rust is used in the Linux kernel. Naturally, since Rust was originally created at Mozilla Foundation, a significant number of Firefox components are written in it. Over at Microsoft, they decided they didn't want to be left behind and started using Rust in some of their projects.

A year ago, you might have seen notices in the repository saying the project wasn't in a stable state and wasn't recommended for production use. Those notices are now gone. (Although, to actually use this project's output, you'll still need to install Rust Nightly, and you'll get plenty of quality time with compiler warnings.)

So what is this project all about? All Windows APIs have been imported into Rust, and you can use any standard functions directly from your program without a whole lot of black magic.

### Getting Started

Alright, so what do we need to do to start working with Windows API in Rust?

First, we'll need Rust nightly.

```bash
rustup default nightly
rustup update
```

After that, create a new Rust project and immediately create an additional library called bindings.

```bash
cargo new testproject
cd testproject
cargo new --lib bindings .
```

Then add the dependencies for the Microsoft library to the project's cargo.toml.

**Cargo.toml**

```toml
[dependencies]
bindings = { path = "bindings" }
windows = "0.21.1"
```

At the time of writing, the current version of the library is 0.21.1, so we'll be using that version throughout.

Next, inside the bindings library folder, we need to add the following to its Cargo.toml:

```toml
[package]
name = "bindings"
version = "0.1.0"
edition = "2018"

[dependencies]
windows = "0.21.1"

[build-dependencies]
windows = "0.21.1"
```

So what do we have here? We have a project called testproject with a bindings library inside it. The purpose of this library is to wire up dependencies so you can work with Windows API in your application.

The `bindings/src/lib.rs` file itself will consist of a single statement:

```rust
::windows::include_bindings!();
```

This is a macro call that pulls in all the necessary dependencies.

And now, the interesting part — the `bindings/build.rs` file:

```rust
fn main() {
    windows::build! {
        Windows::Win32::UI::WindowsAndMessaging::MessageBoxA,
    };
}
```

Naturally, following the fine old tradition, we'll start by displaying a useless message on screen. So we begin by importing the standard MessageBox class, which lets us show a message.

### Writing the Program

Alright, we're done with the setup. What now? Now it's easy. From here you can grab the Windows API documentation and look up whatever interests you. To start, let's figure out a very simple task: displaying a "Hello Habr" message. It's all very straightforward, but it lets us look at two key differences between a winrs program and a regular Rust binary.

First — the main function now needs to return `windows::Result<()>`. In this case we'll be returning an empty tuple, but since we're in Windows land, we could return a whole bunch of different values. For those who might need it, Result accepts an error.

```rust
fn main() -> windows::Result<()> {
    Ok(())
}
```

Second — all actual Windows API calls must be made through the `unsafe` directive.

I've seen plenty of incomprehensible holy wars about how using the `unsafe` directive should be outlawed. Honestly, I've never understood what these wars are about. Let's look at the official documentation. It clearly and plainly tells us there's nothing diabolical about using unsafe, and it's permitted by the Geneva Convention. You just need to know what you're doing and how to use it.

OK. Let's dive deeper. Let's open the Microsoft documentation and find MessageBoxA.

We have four parameters to pass to this function.

```c
int MessageBox(
    HWND    hWnd,
    LPCTSTR lpText,
    LPCTSTR lpCaption,
    UINT    uType
);
```

- **hWnd** — handle to the parent window where the notification will be shown. Since MessageBoxA is a modal window, command execution in the parent window will be blocked while the notification is active. Since we don't have any window, we can safely pass NULL here.
- **lpText/lpCaption** — Long pointer to a string — the strings that will be displayed in the title and body of the message box.
- **uType** — a set of constants that define the behavior, button types, and icons in the MessageBox.

It's worth noting that Microsoft did a solid job creating proper bindings. We'll call this function in Rust like so:

```rust
MessageBoxA(None, "Привет", "Это игра 2048 для Хабры", MB_OK | MB_ICONINFORMATION);
```

As you can see, we didn't have to reinvent the wheel or try to create a NULL type that doesn't exist in Rust, and passing strings doesn't require six conversions into different formats. So we don't need to contort ourselves and write something like:

```rust
MessageBoxA(
    std::ptr::null_mut(),
    lp_text.as_ptr(),
    lp_caption.as_ptr(),
    MB_OK | MB_ICONINFORMATION
);
```

Pretty civilized, all things considered.

Now let's plug in our bindings, build the program, and see how it works. The final result looks like this:

```rust
use bindings::Windows::Win32::UI::WindowsAndMessaging::{MessageBoxA, MB_OK, MB_ICONINFORMATION};

fn main() -> windows::Result<()> {
    unsafe {
        MessageBoxA(None, "Привет", "Это игра 2048 для Хабры", MB_OK | MB_ICONINFORMATION);
    }
    Ok(())
}
```

Wonderful! Garbled text everywhere, like it's 1999 all over again. What do we do? We dig in and realize that MessageBoxA works with ANSI strings, while MessageBoxW works with Unicode (wide strings). This naming convention, by the way, is consistent across all Windows APIs. I see no reason not to use the W versions of functions. But be careful — a large number of tutorial writers in the English-speaking world don't understand the difference, and you'll see code littered with A versions of functions when you should actually be using the W versions.

We replace everything in lib.rs and main.rs. Try again. Victory!

At 164 kilobytes on disk, the program consumes 940 kilobytes of RAM. And it talks to the Windows API. Pretty modest. Better than assembly with janky bindings that only works in the console.

Let's go over the key takeaways from this chapter:

1. Calling WinAPI is always an unsafe call.
2. `fn main` must return a result that Windows can understand.
3. You know where and how to find the Windows API documentation and can use it in your program.

### Building the Program

Well then, now we know how to create a Rust program that can pull in WinAPI. All that's left is to create a window, throw some stuff into it to represent the tiles in our game, and write the logic.

So let's create a window and throw some stuff in there.

First, let's update `build.rs` and add a few functions we'll need.

```rust
fn main() {
    windows::build! {
        Windows::Win32::{
            Foundation::*,
            Graphics::Gdi::ValidateRect,
            UI::WindowsAndMessaging::*,
            System::LibraryLoader::{
                GetModuleHandleA,
            },
        },
    };
}
```

After that, we replace the imports and the Main code with the following:

```rust
unsafe {
    let instance = GetModuleHandleA(None);
    debug_assert!(instance.0 != 0);

    let window_class = "window";

    let wc = WNDCLASSA {
        hCursor: LoadCursorW(None, IDC_ARROW),
        hInstance: instance,
        lpszClassName: PSTR(b"window\0".as_ptr() as _),
        style: CS_HREDRAW | CS_VREDRAW,
        lpfnWndProc: None,
        ..Default::default()
    };

    let atom = RegisterClassA(&wc);
    debug_assert!(atom != 0);

    CreateWindowExW(
        Default::default(),
        window_class,
        "2048",
        WS_OVERLAPPEDWINDOW | WS_VISIBLE,
        CW_USEDEFAULT,
        CW_USEDEFAULT,
        CW_USEDEFAULT,
        CW_USEDEFAULT,
        None,
        None,
        instance,
        std::ptr::null_mut(),
    );
    Ok(())
}
```

Here we call `GetModuleHandleA`. This function returns the name of the module we're working in. Every window must be associated with a specific module. In this case, it'll be the name of our binary file.

After that, we create a `WNDCLASSA` struct and fill it with the parameters our window will launch with.

Then we register this class.

And finally, we launch the window by calling `CreateWindowExW`.

We compile and try to run it.

Nothing on screen. What's worse, if we try to recompile the project, everything blows up with a linker error saying the output binary file is locked for writing.

We open Task Manager and see our program just hanging there, shamelessly.

> As Ilf and Petrov once said: "Only kittens are born quickly!"

Creating a window in Windows isn't just calling some function. For the window to work properly, you need to create a message queue handler.

But to help you understand how the message queue works in Windows, let's use the following example.

How many times have you seen a window that's "Not Responding"? Probably plenty. What happened? The window stopped responding to messages in the message queue.

Essentially, you need a non-blocking function running continuously that receives and processes messages sent to the window. An example of what happens when you manage to block this function is shown above. Our window doesn't respond to system requests.

That's exactly why our program turned into an invisible ghost.

Let's create a message handler.

First, add the following code after `CreateWindowExW`:

```rust
let mut message = MSG::default();
while GetMessageW(&mut message, HWND(0), 0, 0).into() {
    DispatchMessageA(&mut message);
}
```

And in the `WNDCLASSA` struct definition, replace `lpfnWndProc` from `None` to `Some(wndproc)`.

Now let's write that `wndproc` function that will handle our messages.

```rust
extern "system" fn wndproc(window: HWND, message: u32, wparam: WPARAM, lparam: LPARAM) -> LRESULT {
    unsafe {
        match message as u32 {
            _ => DefWindowProcA(window, message, wparam, lparam),
        }
    }
}
```

Basically, we just forwarded all messages to the default message handler.

Now let's run it and see what happens.

Hooray! Finally! We have a window! Just don't try to close it. Everything will crash. The window will close, but the program will keep hanging in memory. And don't try resizing the window either. If you do, you'll see black rectangles instead of content.

There are a lot of messages that get sent to your window. The two main messages we need to deal with right now are `WM_PAINT` and `WM_DESTROY`. The first is called when the window needs to repaint its content; the second is called when the window is closing. In the first case, we'll simply repaint the content; in the second, we'll exit the program.

We update the code and get:

```rust
extern "system" fn wndproc(window: HWND, message: u32, wparam: WPARAM, lparam: LPARAM) -> LRESULT {
    unsafe {
        match message as u32 {
            WM_PAINT => {
                ValidateRect(window, std::ptr::null());
                LRESULT(0)
            }
            WM_DESTROY => {
                PostQuitMessage(0);
                LRESULT(0)
            }
            _ => DefWindowProcA(window, message, wparam, lparam),
        }
    }
}
```

When the window closes, we exit the program, and when it's resized, we repaint it. Now the window won't hang, and you can launch and close the program normally.

Let's check. A 160-kilobyte binary, consuming 1 megabyte of RAM. Very tidy.

**Knowledge check:**

1. To work with windows, you first need to create one. That means finding the name of the module creating the window, defining a struct that describes the window class, registering that class, and then creating the window.
2. A window by itself is not a program. You need to create a message queue handler for that window.
3. The handler needs at least the `WM_DESTROY` message logic so the user can actually exit your program.
4. Despite all of the above, the program still remains compact.

*(Challenge for the attentive reader — this window won't display Russian text correctly in its title bar. Look at the information from the previous chapter and try to fix it.)*

### What's Next?

I'll stop here, because the article keeps growing and is creeping past any reasonable reading time. Although you already have a working Rust program that creates a window and runs a message queue. From here, only your imagination can stop you.

1. **WM_KEYDOWN** — a message you need to intercept in our message queue handler. It fires when a keyboard key is pressed. This message gives you the keyboard state, so you can detect arrow key presses.
2. **XInput** — if you have a game controller, you can use these APIs to capture button presses.
3. **GDI+** — lets you draw objects inside the window.
4. **Direct2D** — lets you do that much faster and with better quality.
5. **Direct3D12** — lets you take it all to the next level.

Additional information is available on GitHub. There you'll find a huge number of examples covering all the content rendering methods described above, plus links to the documentation.

And all of this is available right now in Rust. I hope you learned something new, and maybe some ideas popped into your head about how you could apply this in your work. If so, I'm really glad it was useful to you.
