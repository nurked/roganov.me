---
title: "Погружаемся в логово ржавчины. Как работает компилятор Rust"
slug: "rust-compiler-deep-dive"
date: 2021-01-31
description: "Разбор исходных кодов компилятора Rust — от парсинга исходного файла до генерации бинарника через LLVM. Прослеживаем путь программы через AST, HIR и MIR."
lang: "ru"
tags: ["Rust", "компиляторы", "системное программирование", "LLVM"]
---

В моей предыдущей статье о Rust я попытался рассказать об истории языка, и показать откуда он пришёл. В статье было сделано множество упрощений. Просто нереальное множество. Народу не понравилось. Но в опросе, в конце статьи вы сказали, что надо бы показать кишки компилятора. Ну что же, под катом вы найдёте разбор исходных кодов компилятора Rust. Мы проследим путь программы, начиная из исходного файла, прямиком к бинарнику.

### Словарь

Далее по тексту я буду разбрасываться следующими терминами без удержи. Если вы знаете что это всё значит — хорошо. Если нет, убедитесь что подтянули свои знания, перед тем как заныривать.

1. **LLVM** — система компиляции которая состоит из компилятора и набора инструментов, позволяющая создавать фронт-энд для любого языка и компилировать его на множество различных платформ.

2. **AST** — (abstract syntax tree) древовидная репрезентация семантической структуры исходного кода. Каждый узел обычно показывает конструкцию, встречающуюся в коде.

3. **IR** (intermediate representation) — структура данных, обычно используемая в кишках компилятора или виртуальной машины, для представления исходного кода программы. Такую структуру обычно оптимизируют и перегоняют в конечный код.

4. **HIR** (High Level IR) — IR высокого уровня. Это основная репрезентация кода, используемая в Rust. Фактически это представление AST, которым компилятору удобно пользоваться.

5. **MIR** (Mid Level IR) — это репрезентация HIR, которая намного ближе к LLVM IR.

6. **LLVM IR** (Language Independent IR) — фактически это высокоуровневый ассемблер, который не привязан к определённому языку или системе. Такой код удобно оптимизировать и после он передаётся компилятору.

7. **Крейт, crate** — это то, что будет скомпилировано либо в библиотеку или бинарник. На выходе будет одна библиотека или бинарник, вне зависимости от того, сколько файлов входят в крейт.

8. **ICE** (Internal compiler error) — ошибка компилятора.

Дальнейший текст подразумевает, что вы умеете программировать. Можно и не на Rust.

### Начало

Поехали. Мы будем лезть нашими ручками в сам компилятор и смотреть на его исходники. Для начала нам понадобятся кое-какие инструменты. Ставим чистую виртуальную машину с Windows 10. Идём в интернеты и льём следующее:

1. Сорцы компилятора. Достаются с GitHub. Можно лить просто zip, ибо обратно коммитить мы ничего не будем.
2. VSCode.
3. Установщик компилятора. Любая свежая стабильная версия подойдёт.
4. Не будем мучиться, давайте, заодно, установим nightly компилятор.

```
rustup toolchain install nightly --allow-downgrade --profile minimal --component clippy
rustup default nightly
```

5. Guide to Rustc Development. Инструкция по разработке компилятора. 460 страниц. Не хило. Сохраняем PDF.

Проверяем:

```
C:\>rustc -V
rustc 1.49.0 (e1884a8e3 2020-12-29)
```

Ну и хорошо. Этого, для начала достаточно. Отключаемся от проводного интернета, хватаем ноутбук и идём на веранду, сидеть и погружаться. Начинаем погружаться, понимаем что будет глупо говорить о компиляторе, если мы не скомпилируем хоть что-то. Ок, так и сделаем.

```
cd \
mkdir work
cd work
mkdir rust
cd rust
cargo new hello-world
```

Ок, это было просто. Но мы не будем использовать cargo для самой компиляции. Используем компилятор напрямую.

```
cd hello-world
cd src
rustc main.rs
```

И… Бух.

```
The program can't start because VCRUNTIME140.dll is missing from your
computer. Try reinstalling the program to fix this problem.
```

Чего? Так, сам по себе компилятор всё собрал, но ругается на отсутствие линкера. От жеж, зараза. То есть, линкер ему нужен внешний. Ругаемся на компилятор, встаём с удобного кресла и идём обратно, подключаться к проводному интернету, потому что палить 5 гигов установщика Visual Studio Build Tools не хочется на хотспоте.

Билдим всё ещё раз и смотрим. Ах, ты, ржавая банка! Какого чёрта?? Я уже как две недели рассказываю всем обитателям Хабра о том, какой ты прекрасный компилятор, и как хорошо ты собираешь минимальные бинарники, а ты??? 150 килобайт исполняемого кода из-за одной только линии текста на экране?

Пытаемся скомпилировать с `-C opt-level=3` и получаем то же самое. Что случилось с бинарником? Сейчас на этот вопрос отвечать не будем. Мотаем на ус и едем дальше.

Ладно, что мы знаем? Компилятор не работает без внешнего линкера и исходник для вывода одной строки текста раздувается до 150 килобайт. Ну, по крайней мере мы это можем скомпилировать. Давайте пока распакуем исходники компилятора и начнём рыться. (Собирать компилятор я не собираюсь. Если вам очень хочется — это можно сделать, но процесс это долгий и утомительный.)

### Шаг первый: rustc

Открываем сорцы и наслаждаемся. Всё выглядит очень прилично и чисто. Тут, понятное дело, можно учиться тому как правильно разделять свой проект на куски и как правильно управлять кодом на Rust. Собственно говоря, сразу понятно куда идти. Забираемся в `compiler/rustc/src/main.rs` и смотрим.

Хм. То есть точка входа в программу просто тянет jemalloc вызовы и запускает ещё две функции. Ну вот, всё. Теперь понятно как работает компилятор Rust. Делов-то! Кстати, jemalloc это специальный менеджер памяти, изначально разработанный для FreeBSD в 2005 году. Основной упор был сделан на то, чтобы избежать фрагментации памяти при работе с этим аллокатором. В оригинальной версии он просто заменяет malloc. В 2007 году Firefox начал использовать этот менеджер для снижения расхода памяти, а ещё через пару лет он попал в Facebook.

### Шаг второй: rustc-driver

Ладно, всё выглядит слишком уж просто. Погружаемся дальше. rustc тянет за собой rustc-driver. Ныряем туда.

Тут мы найдём небольшой readme, который расскажет нам о том, что компилятора в самом драйвере мы не найдём. Эта программа собирает конфигурацию из аргументов и запускает сам процесс компиляции из других крейтов. После изучения исходников находим функцию для запуска процесса компиляции.

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

Да, в этом крейте файлов не так-то много, но что бы тут не творилось, на самом деле всё сводится к вызову методов в крейте под названием interface. Вышеприведённый код это и показывает. `interface::run_compiler` и поехали.

Что же произошло в rustc-driver? Мы собрали все конфиги. Подгрузили все файлы и нашли их местоположение в файловой системе. Создали замыкание, которое следит за процессом компиляции и запускает линкер после успешной компиляции. Запустили линтеры (если такие имелись) и приготовили сам компилятор к запуску. Давайте запускать.

### Шаг третий: rustc-interface

Ага. Тут мы уже ближе к самому процессу компиляции. Все конфиги подъедены, файлы тоже замеплены. Смотрим на исходники интерфейса. Их хоть и не так-то много, но это наш центральный вокзал, где куча других крейтов собирается воедино.

Так, осматриваемся и находим:

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

Кстати тут же, недалеко, мы можем найти настройку механизма кодогенерации.

```rust
pub fn get_builtin_codegen_backend(backend_name: &str) -> fn() -> Box<dyn CodegenBackend> {
    match backend_name {
        #[cfg(feature = "llvm")]
        "llvm" => rustc_codegen_llvm::LlvmCodegenBackend::new,
        _ => get_codegen_sysroot(backend_name),
    }
}
```

Быстренько посмотрим на наши сорцы и увидим что у нас прямо в сорцах есть 3 различных модуля кодогенерации. Что они делают? Превращают MIR в конечный код для системы компиляции. Открываем rustc-codegen-llvm и смотрим в README:

```
The `codegen` crate contains the code to convert from MIR into LLVM IR,
and then from LLVM IR into machine code. In general it contains code
that runs towards the end of the compilation process.
```

Ок, ну тут всё понятно, мы берём MIR и переделываем его в LLVM IR. После этого LLVM может скомпилировать код в конечный бинарник. Но погодите, помимо LLVM бекенда у нас есть ещё два других! Смотрим туда. rustc-codegen-ssa согласно документации, позволяет генерировать низкоуровневый код, который не будет привязан к определённому бекэнду (например, LLVM) и позволит в дальнейшем использовать другие системы компиляции.

Собственно говоря, прямо там же вы найдёте rustc-codegen-cranelift. То есть MIR в будущем может компилироваться через cranelift, который в идеале ускорит процесс компиляции. Ну это в будущем, пока что проект в процессе тестирования и работает не лучше, чем Газель без мотора.

Открываем модуль и смотрим, что происходит внутри:

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

Ага, вот тут мы берём быка за рога и начинаем разбирать исходный код на части. Далее, создаём и проверяем AST:

```rust
let has_proc_macro_decls = sess.time("AST_validation", || {
    rustc_ast_passes::ast_validation::check_crate(sess, &krate, &mut resolver.lint_buffer())
});
```

И вот тут у нас начинается полное мясо. Прикол вот в чём, обычно компиляторы делают достаточно простую вещь — берёшь сорцы, проходишься по ним несколько раз, парсишь синтаксис, находишь ошибки, разбираешь на куски макросы, всё хорошо. Rust в стародавние времена начинал именно так же. Но, со временем, была предложена новая модель компиляции. Запросы. Вместо того чтобы делать всю работу несколько раз подряд, давайте просто превратим проходы в запросы. Результат запроса можно сохранить в кеш. Если пользователь (программист) не менял ничего в определённом файле, то и компилировать его не надо. Если мы видим что делать это не надо, мы просто возвращаем данные из кеша запроса.

Даже если вы и поменяли что-то в каком-либо файле, то благодаря системе запросов вы сможете избежать ненужной перекомпиляции. Что если вы изменили только одну линию в комментариях к файлу? Пересобирать такой не придётся.

Давайте посмотрим на запросы, которые создаёт компилятор:

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

Парсинг, создание крейта, сбор HIR — всё это делается через запросы. Один момент про который полезно знать, это то что ещё не всё переписано на запросах.

В итоге у нас на выходе получается большая и толстая структура:

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

И как раз её можно дёргать для выполнения необходимых запросов.

### Шаг четвёртый: rustc-parse и rustc-lexer

Далее по тексту вы найдёте простую логику всех этих запросов. «Простая» логика заключается в вызове крейтов, которые её обрабатывают. Например, rustc-parse. Это крейт, который использует rustc-lexer. Лексер читает строки из файлов и преобразовывает их в очень простые токены. Токены передаются парсеру, который превращает их в Span и продолжает работу с кодом. Основной момент этого Span заключается в том, что к каждому элементу в дереве кода будет добавлена информация о том, в каком конкретно месте этот элемент записан в исходном файле. Когда компилятор будет сообщать об ошибке, вы увидите, где именно эта ошибка произошла.

Основная часть парсера запускается через вызов `parse_crate_mod` в `rustc_parse/src/parser/item.rs`. А дальше по тексту вы найдёте невероятное количество проверок синтаксиса, который этот парсер делает. Вот, например:

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

### Шаг пятый: rustc-expand

В результате работы парсера мы получаем наш самый великий и могучий AST.

Всё это создаётся огромным макросом `ast_fragments!` в `compiler/rustc_expand/src/expand.rs`.

AST используется для дальнейшей генерации кода и приведения его в нужный вид. Про это можно писать отдельную книгу. Но мы пока удовольствуемся тем, что AST можно разобрать до HIR.

### Шаг шестой: rustc-middle

Куда ты завёл нас? Не видно ни зги! Простите, ребята, не варят мозги. Вернее, мозг начинает вариться. Сложность процесса увеличивается настолько, что просто читая коды дальше ходить страшно. Ладно, обратимся к инструкции для разработчиков — смотрим. Видим что после того как у нас появился AST мы можем заняться приведением его в приличный вид. Вернее, в HIR.

Этим как раз и занимается rustc-middle. Вернее, не только этим. Залезаем в исходники и видим что тут у нас есть HIR, MIR и Types.

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

Что же происходит в реальности? Ну, для начала мы начинаем обработку AST. Этим, кстати занимается ещё один модуль, `rustc_ast_lowering`. Смотрим туда и находим достаточно длинный файл, в котором и происходит преобразование каждого элемента AST в HIR.

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

Здесь весь синтаксический сахар растворяется в чае и перестаёт быть сахаром. Так моя любимая `for node in data` превращается в:

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

А вот здесь, как раз, всеми любимый оператор `?` превращается в `Try::into_result`:

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

С HIR теперь можно работать…

### Шаг седьмой: rustc_ty

И `compiler/rustc_middle/src/ty/mod.rs`. Одна из самых больших частей компилятора занимается проверками системы типов после того, как у нас есть HIR. Какой тип будет у `let mut a = 5;`? Вот на этот вопрос и ответит наша система работы с типами. Две основных структуры здесь:

```rust
//! - [`rustc_middle::ty::Ty`], used to represent the semantics of a type.
//! - [`rustc_middle::ty::TyCtxt`], the central data structure in the compiler.
```

Последняя тянется через весь процесс компиляции.

Файл просто огромный. Нам надо вычислить типы каждой переменной, замыкания и трейта. Сам модуль занимает более 3000 строк, не считая остальные файлы в директории.

Кстати, смотрим в `compiler/rustc_typeck/src/check/expr.rs`:

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

Хмм.. Если мы натыкаемся на брейк, после которого есть только один лейбл — `rust` то нужно запустить функцию `fatally_break_rust`.

Проверяем:

```rust
break rust;
```

Компилируем и запускаем:

```
error: internal compiler error: It looks like you're trying to break rust; would you like some ICE?

note: the compiler expectedly panicked. this is a feature.

note: we would appreciate a joke overview: https://github.com/rust-lang/rust/issues/43162

note: rustc 1.51.0-nightly (b12290861 2021-01-29) running on x86_64-pc-windows-msvc
```

Пасхалки они выглядят именно вот так.

Так, вычислили типы и теперь можем проверить что никто не пытается запихнуть строку в Int. Хорошо. Можно идти дальше.

### Шаг восьмой: rustc_mir и rustc_mir_build

Теперь наш HIR можно преобразовать в MIR. Берём ранее созданный TyCtxt и начинаем преобразовывать его в:

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

И так далее по всем нодам. MIR это намного более генерализированная версия HIR. Она очень близка к тому что требует от нас LLVM для компиляции. В результате этой генерализации мы можем намного более эффективно работать над оптимизацией написанного вами кода и заниматься проверками заимствований и оптимизацией.

### Шаг девятый: Проверка заимствования

Самая «страшная» функция Rust это всем известный borrow checker. Сам он живёт в `compiler/rustc_mir/src/borrow_check/mod.rs`:

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

Да, сам модуль такой же огромный и страшный, как и borrow checker. А вот тут, например, можно найти всю логику проверки заимствования при перемещении переменных: `compiler/rustc_mir/src/borrow_check/diagnostics/move_errors.rs`.

### Шаг десятый: Оптимизации

Про систему оптимизаций в Rust можно писать отдельную книгу. Всё аккуратно сложено в `compiler/rustc_mir/src/transform`. LLVM сам по себе не сможет оптимизировать некоторые высокоуровневые примитивы, о которых знает только Rust. И вот тут мы как раз и занимаемся оптимизацией этих примитивов.

Например:

```rust
// Вот такую конструкцию
let x: Option<()>;
let y: Option<()>;
match (x, y) {
    (Some(_), Some(_)) => {0},
    _ => {1}
}
// Можно привести к такой:
let x: Option<()>;
let y: Option<()>;
let discriminant_x = // get discriminant of x
let discriminant_y = // get discriminant of y
if discriminant_x != discriminant_y || discriminant_x == None {1} else {0}
```

### Шаг одиннадцатый: прощай, Rust!

Полученный оптимизированный MIR можно теперь переделать в LLVM IR. Поехали. rustc-codegen-llvm создаёт LLVM IR на базе MIR, который мы сгенерировали на предыдущем этапе. Здесь заканчивается Rust и начинается LLVM. Хотя, мы ещё не закончили с сорцами компилятора.

Тут можно найти пару интересных моментов, например `compiler/rustc_codegen_llvm/src/asm.rs` содержит код для компилирования ассемблера напрямую из Rust. Даже не замечал этого. Смотрим в документацию — есть такая поддержка в этом компиляторе!

Копаемся чуть глубже и находим rustc-target в котором видим различные дополнительные классы для работы с определённым ассемблером.

После того как кодогенерация завершена, мы можем передать IR в сам LLVM. rustc_llvm нам в помощь.

Вот, собственно говоря, и всё, ребята! LLVM за пределами нашей видимости. На моей операционной системе Visual Studio Build Tools берут на себя контроль и перегоняют LLVM IR в обычный бинарник.

### TL;DR

Процесс компиляции в Rust — это вам не мешки ворочать. Надо проверить неимоверное количество разных вещей. Вот что происходит с вашим кодом:

1. Он парсится из текста в AST.
2. AST обрабатывается и оптимизируется в HIR.
3. HIR обрабатывается и оптимизируется в MIR.
4. MIR делает проверки заимствования и оптимизацию и перегоняется в LLVM IR.
5. LLVM IR компилируется на конечной платформе.

### Пробуем ручками

Ну что же, напоследок осталось написать простенькую программку, типа этого:

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

И начать её компилировать, только показывая все внутренности. Для начала есть замечательная опция компилятора, которая работает на любой версии:

```
--emit [asm|llvm-bc|llvm-ir|obj|metadata|link|dep-info|mir]
        Comma separated list of types of output for the
        compiler to emit
```

Значит, запуская компиляцию следующим образом:

```
rustc --emit asm,llvm-bc,llvm-ir,obj,metadata,link,dep-info,mir main.rs
```

Мы получаем на выходе мириады различных форматов, включая сгенерированный ассемблеровский код, байткод и IR для LLVM, и даже человекочитаемый MIR.

А если у вас есть nightly компилятор, то вы можете запустить:

```
rustc main.rs -Z unpretty=hir-tree > hir.txt
```

И полюбоваться вашим HIR, в то время как:

```
rustc main.rs -Z ast-json=yes > ast.json
```

Даст вам возможность посмотреть на то, как выглядит AST.

### Напоследок

Ну что же, мы залезли в дебри компилятора. Теперь вы знаете, что происходит каждый раз когда вы запускаете билд на своей машине. Я показал вам Rust. Но не бойтесь, ваш любимый язык, скорее всего, ничуть не менее сложен. Проще будет только компилировать ассемблер для 386 под досом. И не важно, если вы запускаете C#, Java, Javascript, Golang или Haskell. Происходить будет многое, хотя и совсем по-разному.

Понятно? Ну и хорошо.

### Постскриптум

Ус размотался.

А почему бинарник такой-то большой? Ну, на этот вопрос можно ответить легко. Залезаем вашим любимым дебаггером в .pdb файл и смотрим на указатели функций, которые тянутся в наш бинарник. Их много. Подсистема работы со строками, макросами и памятью. Плюс система ввода-вывода. Что, считаете что 150 килобайт — слишком много?

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
