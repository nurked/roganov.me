---
title: "Diving into the Rusty Depths. How the Rust Compiler Works"
slug: "rust-compiler-deep-dive"
date: 2021-01-31
description: "A walkthrough of the Rust compiler source code — from parsing a source file to generating a binary via LLVM. We trace a program's journey through AST, HIR, and MIR."
lang: "en"
tags: ["Rust", "compilers", "systems programming", "LLVM"]
series: "rust-2021"
seriesOrder: 3
---

In my previous article about Rust, I tried to tell the story of the language and show where it came from. The article was full of simplifications. An absolutely absurd number of them. People were not happy. But in the poll at the end, you said you wanted me to show the compiler's guts. Well then — below the fold you'll find a walkthrough of the Rust compiler source code. We'll trace the journey of a program, from source file straight to binary.

### Glossary

Throughout this text I'll be throwing around the following terms with reckless abandon. If you know what all of this means — great. If not, make sure you brush up before diving in.

1. **LLVM** — a compilation system consisting of a compiler and a set of tools that lets you create a front-end for any language and compile it for a multitude of different platforms.

2. **AST** — (abstract syntax tree) a tree-like representation of the semantic structure of source code. Each node typically represents a construct found in the code.

3. **IR** (intermediate representation) — a data structure typically used in the guts of a compiler or virtual machine to represent the source code of a program. This structure is usually optimized and then converted into final code.

4. **HIR** (High Level IR) — high-level IR. This is the primary code representation used in Rust. Essentially it's a version of the AST that the compiler finds convenient to work with.

5. **MIR** (Mid Level IR) — this is a representation of HIR that is much closer to LLVM IR.

6. **LLVM IR** (Language Independent IR) — essentially a high-level assembly language that isn't tied to any particular language or system. This kind of code is convenient to optimize, and afterwards it gets passed to the compiler.

7. **Crate** — this is what gets compiled into either a library or a binary. You get one library or binary on output, regardless of how many files make up the crate.

8. **ICE** (Internal compiler error) — a compiler error.

The text below assumes you know how to program. Doesn't have to be Rust.

### Getting Started

Off we go. We're going to stick our grubby little hands into the compiler itself and look at its source code. First, we'll need a few tools. Set up a clean virtual machine with Windows 10. Head to the internet and download the following:

1. Compiler sources. Grab them from GitHub. You can just download the zip, since we won't be committing anything back.
2. VSCode.
3. The compiler installer. Any recent stable version will do.
4. Let's not suffer — while we're at it, let's install the nightly compiler too.

```
rustup toolchain install nightly --allow-downgrade --profile minimal --component clippy
rustup default nightly
```

5. Guide to Rustc Development. The instruction manual for compiler development. 460 pages. Not bad. Save the PDF.

Let's verify:

```
C:\>rustc -V
rustc 1.49.0 (e1884a8e3 2020-12-29)
```

Good enough. That'll do for a start. Disconnect from the wired internet, grab the laptop, and head out to the porch to sit and dive in. We start diving and realize it would be silly to talk about a compiler without actually compiling something. Okay, let's do just that.

```
cd \
mkdir work
cd work
mkdir rust
cd rust
cargo new hello-world
```

Okay, that was easy. But we won't be using cargo for the actual compilation. We'll use the compiler directly.

```
cd hello-world
cd src
rustc main.rs
```

And... Boom.

```
The program can't start because VCRUNTIME140.dll is missing from your
computer. Try reinstalling the program to fix this problem.
```

What the? So, the compiler itself built everything fine, but it's complaining about a missing linker. Well, dammit. So it needs an external linker. We curse at the compiler, get up from our comfy chair, and walk back inside to plug into the wired internet, because burning through 5 gigs of the Visual Studio Build Tools installer over a hotspot is not exactly thrilling.

Build everything one more time and take a look. You rusty tin can! What the hell?? I've been telling everyone online for two weeks about what a wonderful compiler you are, and how beautifully you build minimal binaries, and you??? 150 kilobytes of executable code from a single line of text on the screen?

We try compiling with `-C opt-level=3` and get the same thing. What happened to the binary? We won't answer this question right now. File that away for later and move on.

Alright, what do we know? The compiler doesn't work without an external linker, and a source file that prints one line of text balloons to 150 kilobytes. Well, at least we can compile it. Let's go ahead and unpack the compiler sources and start digging. (I'm not going to build the compiler from source. If you really want to — you can, but it's a long and tedious process.)

### Step One: rustc

We crack open the sources and bask in the glory. Everything looks very tidy and clean. Obviously, you can learn a lot here about how to properly split your project into pieces and manage Rust code. Frankly, it's immediately obvious where to go. We climb into `compiler/rustc/src/main.rs` and take a look.

Hm. So the entry point just pulls in some jemalloc calls and runs two more functions. Well, that's it. Now we know how the Rust compiler works. Case closed! By the way, jemalloc is a special memory manager, originally developed for FreeBSD back in 2005. The main focus was on avoiding memory fragmentation when working with this allocator. In its original version it simply replaces malloc. In 2007, Firefox started using this manager to reduce memory consumption, and a couple of years later it made its way into Facebook.

### Step Two: rustc-driver

Alright, everything looks a little too simple. Let's go deeper. rustc pulls in rustc-driver. We dive in.

Here we find a small readme that tells us we won't find the compiler in the driver itself. This program assembles configuration from arguments and launches the actual compilation process from other crates. After studying the sources, we find the function that kicks off the compilation process.

```rust
interface::run_compiler(config, |compiler| {
    let sess = compiler.session();
    let should_stop = RustcDefaultCalls::print_crate_info(
        &***compiler.codegen_backend(),
        sess,
        Some(compiler.input()),
        compiler.output_dir(),
        compiler.output_file(),
    )
    .and_then(|| {
        RustcDefaultCalls::list_metadata(
            sess,
            &*compiler.codegen_backend().metadata_loader(),
            &matches,
            compiler.input(),
        )
    })
    .and_then(|| RustcDefaultCalls::try_process_rlink(sess, compiler));
```

Yeah, there aren't that many files in this crate, but whatever's going on here ultimately boils down to calling methods in a crate called interface. The code above shows exactly that. `interface::run_compiler` and off we go.

So what happened in rustc-driver? We gathered all the configs. Loaded all the files and figured out their locations in the file system. Created a closure that monitors the compilation process and launches the linker after successful compilation. Ran linters (if any were present) and prepared the compiler itself for launch. Let's fire it up.

### Step Three: rustc-interface

Aha. Now we're closer to the actual compilation process. All configs have been consumed, files have been mapped too. We look at the interface sources. There aren't that many, but this is our grand central station where a bunch of other crates come together.

So, we look around and find:

```rust
pub fn run_compiler<R: Send>(mut config: Config, f: impl FnOnce(&Compiler) -> R) -> R {
    tracing::trace!("run_compiler");
    let stderr = config.stderr.take();
    util::setup_callbacks_and_run_in_thread_pool_with_globals(
        config.opts.edition,
        config.opts.debugging_opts.threads,
        &stderr,
        || create_compiler_and_run(config, f),
    )
}
```

By the way, right nearby we can find the codegen backend configuration.

```rust
pub fn get_builtin_codegen_backend(backend_name: &str) -> fn() -> Box<dyn CodegenBackend> {
    match backend_name {
        #[cfg(feature = "llvm")]
        "llvm" => rustc_codegen_llvm::LlvmCodegenBackend::new,
        _ => get_codegen_sysroot(backend_name),
    }
}
```

Let's quickly glance at our sources and notice that right here in the source tree we have 3 different codegen modules. What do they do? They turn MIR into final code for the compilation system. We open rustc-codegen-llvm and look at the README:

```
The `codegen` crate contains the code to convert from MIR into LLVM IR,
and then from LLVM IR into machine code. In general it contains code
that runs towards the end of the compilation process.
```

Okay, so that's clear — we take MIR and convert it into LLVM IR. After that, LLVM can compile the code into a final binary. But wait — besides the LLVM backend we have two more! Let's look at those. rustc-codegen-ssa, according to the docs, allows generating low-level code that isn't tied to a specific backend (e.g., LLVM) and will enable using other compilation systems in the future.

And right there you'll also find rustc-codegen-cranelift. That is, in the future MIR may be compiled through cranelift, which ideally would speed up compilation. Well, that's in the future — for now the project is still being tested and works about as well as a truck without an engine.

We open the module and see what's happening inside:

```rust
fn configure_and_expand_inner<'a>(
    sess: &'a Session,
    lint_store: &'a LintStore,
    mut krate: ast::Crate,
    crate_name: &str,
    resolver_arenas: &'a ResolverArenas<'a>,
    metadata_loader: &'a MetadataLoaderDyn,
) -> Result<(ast::Crate, Resolver<'a>)> {
    //[snip]
```

Aha, this is where we grab the bull by the horns and start tearing the source code apart. Next, we create and validate the AST:

```rust
let has_proc_macro_decls = sess.time("AST_validation", || {
    rustc_ast_passes::ast_validation::check_crate(sess, &krate, &mut resolver.lint_buffer())
});
```

And this is where things get really meaty. Here's the deal — typically compilers do a fairly straightforward thing: you take the sources, make several passes over them, parse the syntax, find errors, break down macros, everything's great. Rust in the old days started out exactly the same way. But over time, a new compilation model was proposed. Queries. Instead of doing all the work several times in a row, let's just turn those passes into queries. Query results can be cached. If the user (programmer) didn't change anything in a particular file, there's no need to compile it. If we see that recompilation isn't necessary, we simply return data from the query cache.

Even if you did change something in some file, the query system lets you avoid unnecessary recompilation. What if you only changed a single line in a comment? No rebuild needed.

Let's look at the queries the compiler creates:

```rust
pub struct Queries<'tcx> {
    compiler: &'tcx Compiler,
    gcx: OnceCell<GlobalCtxt<'tcx>>,

    arena: WorkerLocal<Arena<'tcx>>,
    hir_arena: WorkerLocal<rustc_ast_lowering::Arena<'tcx>>,

    dep_graph_future: Query<Option<DepGraphFuture>>,
    parse: Query<ast::Crate>,
    crate_name: Query<String>,
    register_plugins: Query<(ast::Crate, Lrc<LintStore>)>,
    expansion: Query<(ast::Crate, Steal<Rc<RefCell<BoxedResolver>>>, Lrc<LintStore>)>,
    dep_graph: Query<DepGraph>,
    lower_to_hir: Query<(&'tcx Crate<'tcx>, Steal<ResolverOutputs>)>,
    prepare_outputs: Query<OutputFilenames>,
    global_ctxt: Query<QueryContext<'tcx>>,
    ongoing_codegen: Query<Box<dyn Any>>,
}
```

Parsing, crate creation, collecting HIR — all of this is done through queries. One thing worth knowing: not everything has been rewritten to use queries yet.

In the end, we get a big, hefty structure on the output:

```rust
pub fn global_ctxt(&'tcx self) -> Result<&Query<QueryContext<'tcx>>> {
    self.global_ctxt.compute(|| {
        let crate_name = self.crate_name()?.peek().clone();
        let outputs = self.prepare_outputs()?.peek().clone();
        let lint_store = self.expansion()?.peek().2.clone();
        let hir = self.lower_to_hir()?.peek();
        let dep_graph = self.dep_graph()?.peek().clone();
        let (ref krate, ref resolver_outputs) = &*hir;
        let _timer = self.session().timer("create_global_ctxt");
        Ok(passes::create_global_ctxt(
            self.compiler,
            lint_store,
            krate,
            dep_graph,
            resolver_outputs.steal(),
            outputs,
            &crate_name,
            &self.gcx,
            &self.arena,
        ))
    })
}
```

And it's precisely this structure that you can poke at to execute the necessary queries.

### Step Four: rustc-parse and rustc-lexer

Further in the text you'll find the simple logic behind all these queries. The "simple" logic amounts to calling the crates that handle them. For example, rustc-parse. This is a crate that uses rustc-lexer. The lexer reads strings from files and converts them into very simple tokens. The tokens are passed to the parser, which turns them into Spans and continues working with the code. The key point about Span is that every element in the code tree will have information attached about exactly where that element appears in the source file. When the compiler reports an error, you'll see precisely where that error occurred.

The main part of the parser is launched via a call to `parse_crate_mod` in `rustc_parse/src/parser/item.rs`. And further in the code you'll find an incredible number of syntax checks that this parser performs. Here's an example:

```rust
/// Error in-case a `default` was parsed but no item followed.
fn error_on_unmatched_defaultness(&self, def: Defaultness) {
    if let Defaultness::Default(sp) = def {
        self.struct_span_err(sp, "`default` is not followed by an item")
            .span_label(sp, "the `default` qualifier")
            .note("only `fn`, `const`, `type`, or `impl` items may be prefixed by `default`")
            .emit();
    }
}
```

### Step Five: rustc-expand

As a result of the parser's work, we get our great and mighty AST.

All of this is created by the enormous `ast_fragments!` macro in `compiler/rustc_expand/src/expand.rs`.

The AST is used for further code generation and whipping it into shape. You could write a whole separate book about that. But for now we'll content ourselves with the fact that the AST can be broken down into HIR.

### Step Six: rustc-middle

Where have you led us? We can't see a thing! Sorry folks, the brain's not cooking. Or rather, the brain is starting to boil. The complexity of the process ramps up so much that just reading the code any further is terrifying. Alright, let's consult the developer guide — let's see. We find that once we have the AST, we can go about whipping it into proper shape. Namely, into HIR.

That's exactly what rustc-middle does. Well, not just that. We climb into the sources and see that here we have HIR, MIR, and Types.

```rust
//! - **HIR.** The "high-level (H) intermediate representation (IR)" is
//!    defined in the `hir` module.
//! - **MIR.** The "mid-level (M) intermediate representation (IR)" is
//!    defined in the `mir` module. This module contains only the
//!    *definition* of the MIR; the passes that transform and operate
//!    on MIR are found in `rustc_mir` crate.
//! - **Types.** The internal representation of types used in rustc is
//!    defined in the `ty` module. This includes the **type context**
//!    (or `tcx`), which is the central context during most of
//!    compilation, containing the interners and other things.
```

So what happens in practice? Well, first we begin processing the AST. This, by the way, is handled by yet another module, `rustc_ast_lowering`. We look there and find a fairly long file where each AST element gets converted into HIR.

```rust
pub(super) fn lower_expr_mut(&mut self, e: &Expr) -> hir::Expr<'hir> {
    ensure_sufficient_stack(|| {
        let kind = match e.kind {
            ExprKind::Box(ref inner) => hir::ExprKind::Box(self.lower_expr(inner)),
            ExprKind::Array(ref exprs) => hir::ExprKind::Array(self.lower_exprs(exprs)),
            ExprKind::ConstBlock(ref anon_const) => {
                let anon_const = self.lower_anon_const(anon_const);
                hir::ExprKind::ConstBlock(anon_const)
            }
            ExprKind::Repeat(ref expr, ref count) => {
                let expr = self.lower_expr(expr);
                let count = self.lower_anon_const(count);
                hir::ExprKind::Repeat(expr, count)
            }
            ExprKind::Tup(ref elts) => hir::ExprKind::Tup(self.lower_exprs(elts)),
            ExprKind::Call(ref f, ref args) => {
                let f = self.lower_expr(f);
                hir::ExprKind::Call(f, self.lower_exprs(args))
            }
            ///[snip]
```

This is where all the syntactic sugar dissolves in the tea and stops being sugar. For example, my beloved `for node in data` turns into:

```rust
/// Desugar `ExprForLoop` from: `[opt_ident]: for <pat> in <head>` into:
///
/// {
///     let result = match ::std::iter::IntoIterator::into_iter(<head>) {
///         mut iter => {
///             [opt_ident]: loop {
///                 let mut __next;
///                 match ::std::iter::Iterator::next(&mut iter) {
///                     ::std::option::Option::Some(val) => __next = val,
///                     ::std::option::Option::None => break
///                 };
///                 let <pat> = __next;
///                 StmtKind::Expr(<body>);
///             }
///         }
///     };
///     result
/// }
```

And right here, everybody's favorite `?` operator turns into `Try::into_result`:

```rust
/// Desugar `ExprKind::Try` from: `<expr>?` into:
/// match Try::into_result(<expr>) {
///     Ok(val) => #[allow(unreachable_code)] val,
///     Err(err) => #[allow(unreachable_code)]
///                 // If there is an enclosing `try {...}`:
///                 break 'catch_target Try::from_error(From::from(err)),
///                 // Otherwise:
///                 return Try::from_error(From::from(err)),
/// }
```

Now we can work with the HIR...

### Step Seven: rustc_ty

And `compiler/rustc_middle/src/ty/mod.rs`. One of the largest parts of the compiler is responsible for type system checks once we have the HIR. What type will `let mut a = 5;` have? That's exactly the question our type system will answer. The two main structures here are:

```rust
//! - [`rustc_middle::ty::Ty`], used to represent the semantics of a type.
//! - [`rustc_middle::ty::TyCtxt`], the central data structure in the compiler.
```

The latter is threaded through the entire compilation process.

The file is absolutely enormous. We need to figure out the types of every variable, closure, and trait. The module itself is over 3,000 lines, not counting the other files in the directory.

By the way, take a look at `compiler/rustc_typeck/src/check/expr.rs`:

```rust
if let Some(ref e) = expr_opt {
    self.check_expr_with_hint(e, err);

    // ... except when we try to 'break rust;'.
    // ICE this expression in particular (see #43162).
    if let ExprKind::Path(QPath::Resolved(_, ref path)) = e.kind {
        if path.segments.len() == 1 && path.segments[0].ident.name == sym::rust {
            fatally_break_rust(self.tcx.sess);
        }
    }
}
```

Hmm.. If we encounter a break followed by a single label — `rust` — then we need to call the function `fatally_break_rust`.

Let's test it:

```rust
break rust;
```

Compile and run:

```
error: internal compiler error: It looks like you're trying to break rust; would you like some ICE?

note: the compiler expectedly panicked. this is a feature.

note: we would appreciate a joke overview: https://github.com/rust-lang/rust/issues/43162

note: rustc 1.51.0-nightly (b12290861 2021-01-29) running on x86_64-pc-windows-msvc
```

Easter eggs — this is exactly what they look like.

So, we've computed the types and can now verify that nobody's trying to shove a string into an Int. Good. Onward.

### Step Eight: rustc_mir and rustc_mir_build

Now our HIR can be transformed into MIR. We take the previously created TyCtxt and start converting it into:

```rust
/// Construct the MIR for a given `DefId`.
fn mir_build(tcx: TyCtxt<'_>, def: ty::WithOptConstParam<LocalDefId>) -> Body<'_> {
    let id = tcx.hir().local_def_id_to_hir_id(def.did);

    // Figure out what primary body this item has.
    let (body_id, return_ty_span, span_with_body) = match tcx.hir().get(id) {
        Node::Expr(hir::Expr { kind: hir::ExprKind::Closure(_, decl, body_id, _, _), .. }) => {
            (*body_id, decl.output.span(), None)
        }
        Node::Item(hir::Item {
            kind: hir::ItemKind::Fn(hir::FnSig { decl, .. }, _, body_id),
            span,
            ..
        })
        | Node::ImplItem(hir::ImplItem {
            kind: hir::ImplItemKind::Fn(hir::FnSig { decl, .. }, body_id),
            span,
            ..
        })
        | Node::TraitItem(hir::TraitItem {
            kind: hir::TraitItemKind::Fn(hir::FnSig { decl, .. }, hir::TraitFn::Provided(body_id)),
            span,
            ..
        }) => {
            // Use the `Span` of the `Item/ImplItem/TraitItem` as the body span,
            // since the def span of a function does not include the body
            (*body_id, decl.output.span(), Some(*span))
        }
```

And so on through all the nodes. MIR is a much more generalized version of HIR. It's very close to what LLVM requires for compilation. As a result of this generalization, we can work much more effectively on optimizing the code you wrote, and handle borrow checking and optimization.

### Step Nine: Borrow Checking

The most "terrifying" feature of Rust is the well-known borrow checker. It lives in `compiler/rustc_mir/src/borrow_check/mod.rs`:

```rust
fn do_mir_borrowck<'a, 'tcx>(
    infcx: &InferCtxt<'a, 'tcx>,
    input_body: &Body<'tcx>,
    input_promoted: &IndexVec<Promoted, Body<'tcx>>,
) -> BorrowCheckResult<'tcx> {
    let def = input_body.source.with_opt_param().as_local().unwrap();

    debug!("do_mir_borrowck(def = {:?})", def);

    let tcx = infcx.tcx;
    let param_env = tcx.param_env(def.did);
    let id = tcx.hir().local_def_id_to_hir_id(def.did);

    let mut local_names = IndexVec::from_elem(None, &input_body.local_decls);
    for var_debug_info in &input_body.var_debug_info {
        if let VarDebugInfoContents::Place(place) = var_debug_info.value {
            if let Some(local) = place.as_local() {
                if let Some(prev_name) = local_names[local] {
                    if var_debug_info.name != prev_name {
                        span_bug!(
                            var_debug_info.source_info.span,
                            "local {:?} has many names (`{}` vs `{}`)",
                            local,
                            prev_name,
                            var_debug_info.name
                        );
                    }
                }
                local_names[local] = Some(var_debug_info.name);
            }
        }
    }
```

Yeah, the module itself is just as massive and terrifying as the borrow checker it implements. And right here, for example, you can find all the logic for checking borrows during variable moves: `compiler/rustc_mir/src/borrow_check/diagnostics/move_errors.rs`.

### Step Ten: Optimizations

The Rust optimization system is worthy of its own book. Everything is neatly stashed in `compiler/rustc_mir/src/transform`. LLVM by itself can't optimize certain high-level primitives that only Rust knows about. And this is where we take care of optimizing those primitives.

For example:

```rust
// A construct like this
let x: Option<()>;
let y: Option<()>;
match (x, y) {
    (Some(_), Some(_)) => {0},
    _ => {1}
}
// Can be reduced to this:
let x: Option<()>;
let y: Option<()>;
let discriminant_x = // get discriminant of x
let discriminant_y = // get discriminant of y
if discriminant_x != discriminant_y || discriminant_x == None {1} else {0}
```

### Step Eleven: Farewell, Rust!

The resulting optimized MIR can now be converted into LLVM IR. Let's go. rustc-codegen-llvm creates LLVM IR based on the MIR we generated in the previous step. This is where Rust ends and LLVM begins. Although, we're not quite done with the compiler sources yet.

You can find a few interesting things here — for example, `compiler/rustc_codegen_llvm/src/asm.rs` contains code for compiling assembly directly from Rust. I hadn't even noticed that before. Check the docs — yep, this compiler supports that!

We dig a little deeper and find rustc-target, where we see various additional classes for working with specific assembly instruction sets.

Once codegen is complete, we can pass the IR to LLVM itself. rustc_llvm to the rescue.

And that, folks, is basically it! LLVM is beyond our line of sight. On my operating system, Visual Studio Build Tools take over and convert LLVM IR into a regular binary.

### TL;DR

The compilation process in Rust is no walk in the park. There's an unbelievable number of things to check. Here's what happens to your code:

1. It gets parsed from text into AST.
2. The AST is processed and optimized into HIR.
3. The HIR is processed and optimized into MIR.
4. MIR goes through borrow checking and optimization and gets converted into LLVM IR.
5. LLVM IR is compiled for the target platform.

### Getting Hands-On

Well then, one last thing — let's write a simple little program, something like this:

```rust
fn main() {
    let z = 10;
    if z > 5 {
        println!("Number Five is ALIVE!");
    } else {
        println!("Hmmm... No, number 5 is actually dead as a piece of wood.");
    }
    let mut input = String::new();
    let stdin = std::io::stdin();
    stdin.read_line(&mut input).ok().expect("You have failed me for the last time");
}
```

And start compiling it, only this time showing all the internals. To start with, there's a wonderful compiler option that works on any version:

```
--emit [asm|llvm-bc|llvm-ir|obj|metadata|link|dep-info|mir]
        Comma separated list of types of output for the
        compiler to emit
```

So, by running the compilation like this:

```
rustc --emit asm,llvm-bc,llvm-ir,obj,metadata,link,dep-info,mir main.rs
```

We get a cornucopia of different formats on the output, including generated assembly code, bytecode and IR for LLVM, and even human-readable MIR.

And if you have the nightly compiler, you can run:

```
rustc main.rs -Z unpretty=hir-tree > hir.txt
```

And feast your eyes on your HIR, while:

```
rustc main.rs -Z ast-json=yes > ast.json
```

Will let you see what the AST looks like.

### In Closing

Well then, we've ventured into the depths of the compiler. Now you know what happens every time you hit build on your machine. I showed you Rust. But don't worry — your favorite language is most likely no less complex. The only thing simpler would be compiling assembly for a 386 under DOS. And it doesn't matter whether you're running C#, Java, JavaScript, Go, or Haskell. A lot happens under the hood, though each in very different ways.

Got it? Good.

### Postscript

And the mystery unraveled.

So why is the binary so big? Well, this question has an easy answer. Fire up your favorite debugger, open the .pdb file, and look at the function pointers being pulled into our binary. There are a lot of them. The string handling subsystem, macros, and memory management. Plus the I/O system. What, you think 150 kilobytes is too much?

```
C:\work\rust\hello-world\src>rustc -C opt-level=3 main.rs

C:\work\rust\hello-world\src>upx --brute main.exe
                        Ultimate Packer for eXecutables
                           Copyright (C) 1996 - 2020
UPX 3.96w        Markus Oberhumer, Laszlo Molnar & John Reiser    Jan 23rd 2020
          File size             Ratio        Format      Name
    --------------------        ------     -----------   -----------
     154624 ->          65536   42.38%      win64/pe     main.exe
```
