---
title: "x64 Assembly in 2021: Rebuilding 2048 After 20 Years"
slug: "assembly-2048"
date: 2021-09-23
description: "Writing the game 2048 in x64 Assembly on Windows: from TASM memories to NASM and MinGW, fitting the entire game field into 16 bytes of memory."
lang: "en"
tags: ["Assembler", "x64", "systems programming", "NASM"]
---

This is a warm, nostalgic article about Assembly and software development. We won't be trying to write the next Microsoft or Android killer here. We'll be writing a 2048 killer. There won't be any Docker or Terraform with Kubernetes. But you will find a wealth of Assembly materials that can help you dive back into the world of three-letter instructions. Grab a cold one, and let's go. *(The soundtrack for this article might as well be IBM 1401 A User's Manual)*

Recently, I was sitting around waiting for the results of some conference at a corporate office. It was boring, so I pulled out my phone to dive into the world of killing time. But, to my dismay, we were in a spot with an absurdly weak signal, and I realized I was in that strange, bewildering world where there's no internet. I had nothing useful installed on my phone, so I turned my attention to the guest laptop. The corporate proxy was asking for a login and password for internet access, neither of which I had. Stuck. I was reminded of the 1990s, when the internet was dial-up only and getting online meant a trip to the post office or an "Internet café." A strange feeling.

Fortunately, said computer had a little game called 2048 installed. Wonderful, I thought, and sank into tile-stacking for a full 30 minutes. Time was killed swiftly and decisively. When it was time to leave, I tried to close the game, and noticed it had frozen. Out of habit, I fired up the task manager and was about to put the poor thing out of its misery, when my eyes caught a memory consumption of 250 megabytes of RAM. The hair on the back of my neck stood up as I put the old mare down. Those horrifying 250 megabytes of RAM wouldn't leave my head.

I got in the car and drove home. During the ride, all I could think about was how anyone could fatten up 2048 to the point where it devours 250 megabytes of RAM. The answer was simple enough. The keen eye of a systems guy spotted Electron, launching a bloated JavaScript engine, which was rendering 16 sixteen-bit numbers on the screen.

And I thought: why not make it all much more compact? How many bits do you actually need to store the game field of 2048?

First, let's consult the internet. Assuming we play a perfect game and all the odds are in our favor, at the very best run we can't score higher than 65536. Well, or if everything goes our way and we get blocks of four 100 percent of the time, we might finish with a tile of 131072. But that's bordering on fantasy.

So, we have a field of 16 tiles, with values up to 131072, which fits in an Int. Depending on the system's bit width, an int can be 4 or 8 bytes. That is, 16*4 = 64 bytes would be enough to store the entire game field.

Although, actually, even that is overkill. We can store powers of two, right?

```nasm
;00 = nothing
;01 = 2
;02 = 4
;03 = 8
;04 = 16
;05 = 32
;06 = 64
;07 = 128
;08 = 256
;09 = 512
;0a = 1024
;0b = 2048
;0c = 4096
;0d = 8192
;0e = 16384
;0f = 32768
;10 = 65536 - maximum with the highest number is 2
;11 = 131072 - maximum with the highest number 4
;12 = 262144 - impossible
```

Aha, we can fit each cell of the field into a single byte. In fact, all we need is just 16 bytes to store the entire game field. You could go a bit further and say that the case where someone collects anything above 32768 is an edge case that simply can't happen. So you could pack the whole field into nibbles and shrink it down to eight bytes. But that's not very convenient.

So, I thought, if this whole thing fits in 16 bytes, why not just do it. And how could I pass up the chance to revisit my first programming language — Assembly.

### Childhood flashbacks

*[flashback mode on]*

Of all the websites listed as examples in Hacker magazine, not a single one has survived. But fear not — the craft lives on and tutorials are still being published.

*[flashback mode off]*

When I got home and sat down at my computer, I set about revisiting my youth. How do you compile assembly? Back in the day, when we were learning all this, we had TASM, MASM, and MASM32. Personally, I used the last two. Each assembler came with a linker and the compiler itself. Of these three projects, only the original MASM is still alive.

To install it in 2021, you have to download Visual Studio and set up a bunch of workloads, including the linker. And for that you need to download a gigabyte and a half of tooling. And though I did find articles about using llvm-link instead of link when working with Assembly, that involves some truly unholy cross-breeding of snakes, hedgehogs, and albatrosses. We will not engage in such indecencies.

Alright, so what then? I was surprised to find that a large number of x64 Assembly courses are written for Linux. YASM and NASM rule the roost there and work beautifully. What's good for us is that NASM runs and works just fine on Windows, too. Sort of.

Runs, sure, but it doesn't come with a linker. You'd have to use the Microsoft linker, and as we know, that means downloading gigabytes of MSVS2021. There's also FASM, but it feels unfamiliar, and NASM comes with a great macro system as a bonus.

The internet is full of stories about how wonderful MinGW is. Being lazy, I took the easy route and downloaded the CodeBlocks development environment. It's an IDE with all sorts of bells and whistles and, most importantly, it comes with MinGW installed.

Great, we install everything, add it to PATH, and now we can compile by running:

```bash
nasm -f win64 -gcv8 -l test.lst test.asm
gcc test.obj -o test.exe -ggdb
```

Excellent! Now let's store data in memory:

```nasm
stor     db     0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
fmt      db     "%c %c %c %c", 0xd, 0xa, "%c %c %c %c", 0xd, 0xa, "%c %c %c %c", 0xd, 0xa, "%c %c %c %c", 0xd, 0xa, 0
```

Here is our game field `stor`, and here is a shameless waste of RAM — the format string `fmt`, which will render the game field to the screen.

Accordingly, to access any cell of the field, we can address bytes like this:

```nasm
; byte addressing
; 00 00 00 00     [stor]       [stor+1]     [stor+2]     [stor+3]
; 00 01 00 00     [stor+4]     [stor+5]     [stor+6]     [stor+7]
; 00 01 00 00     [stor+8]     [stor+9]     [stor+a]     [stor+b]
; 00 00 00 00     [stor+c]     [stor+d]     [stor+e]     [stor+f]
```

Now we start getting into the difference between that good old 16-bit DOS Assembly from the fearsome 2002 issue of Hacker magazine and our 64-bit Assembly straight out of 2021.

We had registers `ax`, `bx` and so on, remember? They were all split into two halves: `_l` and `_h`, like `al`, `ah` for writing a byte into the upper or lower half of `ax`. Accordingly, `al` was eight bits, `ax` was 16 bits, and if you were the lucky owner of a decent processor, you had access to `eax` for a full 32 bits. Ha! Welcome to the new processors. We now have `rax` for writing 64 bits.

Moreover, in the world of 64-bit processors, we have at our disposal not only `EAX`, `EBX`, `EDX`, and `ECX` (let's not forget `EDI`, `EBP`, `ESP`, and `ESI`, but we won't be playing with those either). We've been given `R8` through `R15` — wonderful 64-bit registers. The real brain-twister begins when you want to read data from these registers. Bytes can be read by accessing `r10b`, words live at `r10w`, double words can be found at `r10d`, and you can address all 64 bits through `r10`. Why they couldn't name these the same way as the previous registers — beats me. But hey, we'll get used to it.

On top of that, thanks to SSE, SSSE, and AVX, we also have 15 registers of 128 or 256 bits at our disposal. They're named `XMM0`–`XMM15` for 128 bits and `YMM0`–`YMM15` for 256 bits. You can do interesting things with them. But this article isn't about that.

Moving on. How do we output data to the screen? Remember DOS and those wonderful times when we'd do:

```nasm
mov    dx, msg        ; the address of our message in dx
mov    ah, 9          ; ah=9 - "print string" sub-function
int    0x21           ; call dos services
```

Now forget about it. Direct interrupt calls are no longer in fashion, and we can no longer do that. If you're assembling under Linux, you can invoke system calls or use interrupt 80, which handles spitting data to the screen. But on Windows, you have no other option than to use `printf`. (No, of course, you could obtain a console handle and write directly, but at that point things would be getting really indecent). In principle, this isn't that bad. `printf` is part of the C standard library, and you can call it from anything.

So we'll begin our program with a couple of declarations for the compiler and linker:

```nasm
bits           64
default        rel

       global   main
       extern   printf
       extern   getch
       extern   ExitProcess
```

The first line indicates that we're working on a genuine, old-school 64-bit processor. The last 3 lines state that we'll need to import 3 external functions. Two — `printf` and `getch` — for printing and reading data, and `ExitProcess` from the Windows standard library to terminate the application.

Accordingly, to use any of the above functions, we need to do the following:

```nasm
push      rbp
mov       rbp, rsp
sub       rsp, 32

lea       rcx, [lost]        ;Load the format string into memory
call      printf
```

We save the current stack position, align the stack, and give it an extra 32 bytes. We load the address of a string called `lost` into the CX register, defined as `lost db "You are done!",0xd, 0xa, 0`, and call `printf`, which will print that string to the screen.

The two key things you need to know are how to align the stack and how to pass parameters to functions.

Alright, so what can we do now? We can load data into and out of memory, shuffle it around in numerous registers, and call functions from the standard library.

We'll use `getch` to read keyboard input. Controls will be vim-style, that is, `hjkl` to move tiles. For now, let's not bother with arrow keys.

What's left to do? Write the actual program logic.

And here's the trick. You could do math and add values and all that, but it's all too complicated. Let's look at our game field and what happens to it each time the user presses a button in any direction.

First of all, direction doesn't matter. Whatever the user presses on the keyboard, we can always rotate it and say it's just a compression of 16 bytes from left to right. But since our rows don't intersect, we can say that the entire logic is just compressing four bytes from left to right, repeated four times.

And since we only have four bytes, we can just write the logic for edge cases. What difference does it make?

So we read the direction, iterate through all values in a single row, and load them into registers `r10` through `r14`. These are the registers we'll be working with.

To make our lives easier, we'll use NASM macros. We write two macros — one for reading memory into registers, and another for writing registers back to memory:

```nasm
%macro memtoreg 4
    xor r10, r10
    mov r10b, byte [stor + %4]
    xor r11, r11
    mov r11b, byte [stor + %3]
    xor r12, r12
    mov r12b, byte [stor + %2]
    xor r13, r13
    mov r13b, byte [stor + %1]
%endmacro

%macro regtomem 4
    mov [stor + %4], r10b
    mov [stor + %3], r11b
    mov [stor + %2], r12b
    mov [stor + %1], r13b
%endmacro
```

Pretty straightforward here.

After this, moving the entire field in any direction becomes a simple task. Here's an example for the down direction:

```nasm
down:
    push       rbp
    mov        rbp, rsp
    sub        rsp, 32

    memtoreg         0x0, 0x4, 0x8, 0xc
    call       shift
    regtomem         0x0, 0x4, 0x8, 0xc

    memtoreg         0x1, 0x5, 0x9, 0xd
    call       shift
    regtomem         0x1, 0x5, 0x9, 0xd

    memtoreg         0x2, 0x6, 0xa, 0xe
    call       shift
    regtomem         0x2, 0x6, 0xa, 0xe

    memtoreg         0x3, 0x7, 0xb, 0xf
    call       shift
    regtomem         0x3, 0x7, 0xb, 0xf

    leave
    ret
```

We simply load bytes from memory into registers, call the procedure that computes the shift, and move the bytes back to memory. If you look at the other directions — it's the exact same thing, except we take bytes in a different order to simulate "movement" left, right, down, and up.

The shift procedure itself is the most convoluted one. Moreover, I can tell you for certain that in some edge cases, it doesn't work. That needs to be tracked down and debugged. But if you look at the actual code of this procedure, it just compares a bunch of values and makes a bunch of jumps. There's no math in this procedure whatsoever. `inc r11` — that's the only math you'll see. In fact, the only thing happening in the game from a mathematical standpoint is simply adding one to the current cell value. So there's no reason to burden the processor with anything else.

We run it, try it out — everything's good. Numbers bounce around the screen, adding to each other. We need to write a small spawner that tosses new values onto the field. I had no desire to write my own randomizer right this minute, so we'll just shove a value into the first empty cell. And if we can't find one, we'll say the game is lost.

We put it all together, build it, give it a try.

Execution beauty — negative 5 out of ten. We, the rascals, didn't even bother converting powers of two back into actual numbers.

Let's check the RAM consumption: grand total — 2.5 megabytes. Of that, 1900 kilobytes are general operating system resources. Why so chunky? Because our `printf` and `ExitProcess` use a lot of other system calls. If you tear the program apart with x64dbg (a wonderful free debugger, by the way — not IDA, but it gets the job done), you can see which symbols are imported and consumed.

The program itself uses 300 kilobytes of memory for everything. You could shrink that further, but this article isn't about that.

### So, what do we now know about Assembly in 2021

1. It's still alive, and people still use it. There's a wealth of development tools for all operating systems.
2. It's not as simple as it was in the old days, when you had to memorize the interrupt table by heart. Today the manuals are more numerous and heftier.
3. But it's not all that hard, either. Again, today the manuals are easier to find, and StackOverflow has plenty of data on assembly. And there are plenty of warm, nostalgic articles about Assembly floating around on tech blogs.
4. Mixing assembly with other programming languages isn't that hard. In our example we imported functions, but we can also export them. All you need to know are the rules for working with the stack to pass data back and forth.
5. Serious systems engineers who can debug a BSOD on the fly and tear apart any program to patch it can read this kind of code with no trouble at all. So if you need to seriously get into systems programming, you won't get very far without ASM.

### Why would you need this?

So that you understand how processors work. Back in those warm, nostalgic times when I had to write in ASM, I deeply internalized the foundational knowledge of how computers work. Once you understand how to work with memory, what happens inside a program, and how and where your data is passed, you'll have no trouble learning any other programming language. The memory management system in C and C++ will seem more convenient and pleasant, and picking up Rust won't take long.

### A warm, nostalgic beer contest

On top of everything, here's a beer contest for you. All the code for the "working" 2048 application is at: https://github.com/nurked/2048-asm

We play with raw powers of two. Controls are `hjkl` key presses, exit by pressing `s`.

Happy assembly learning, everyone!
