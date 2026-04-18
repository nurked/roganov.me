---
title: "Go Frontend with Vugu: WebAssembly in Pure Golang"
slug: "golang-frontend-vugu"
date: 2021-07-13
description: "A look at vugu, a young library that lets you write frontend in Go via WebAssembly. Cats, goroutines, and 500 KB of WASM payload by the finish line."
lang: "en"
tags: ["Go", "WebAssembly", "frontend", "WASM", "vugu"]
---

> Curiouser and curiouser!
> — Lewis Carroll, Alice's Adventures in Wonderland

Are you sick of `node_modules` on a simple website competing for disk space with your music collection?

You've re-read the Redux docs for the sixtieth time and arrived at two conclusions: "I think I'm starting to get it..." and "I should probably read this one more time!"

You've once again discovered that `1 + "1" == "11"` and `[] - {} == NaN`?

Your webpack build script takes up more space than your actual JavaScript library?

Then come on in, because I'm about to show you how to move your frontend to Go.

Meet **vugu**. A young (fair warning — not yet released) and very interesting library that lets you use Go directly in HTML. Naturally, since there are no browsers with built-in Go support yet, everything had to be implemented through WASM.

Vugu is a very young library, and I couldn't find any mentions of it on Habr, except for a couple of weekly digests.

Let's take a look under the hood and get our hands dirty with this library. So, what exactly is vugu?

To start, imagine you're writing an HTML component, except the scripts have the type `application/x-go` instead of JavaScript:

```html
<div>
    <p vg-if='c.ShowText'>
        Conditional text here.
    </p>
</div>

<script type="application/x-go">
type Root struct { // component for "root"
    ShowText bool `vugu:"data"`
}
</script>
```

You save this abomination to a file with the `*.vugu` extension and fire up some third-party library that devours 5 gigs of RAM. Just kidding — vugu was actually built with the goal of simplifying the development process rather than making it more painful. Everything you need to do in vugu can be done with standard Go tooling. To compile your app, you can use the good old:

```bash
go generate
go build
./file-name
```

It ships with a utility called `vgrun` to make development easier, but it's really just a wrapper around standard commands. For the sake of illustration, I'll be using this utility throughout.

```bash
vgrun devserver.go
```

This fires up a simple server and starts watching your files for changes. If any are detected, the program automatically restarts the server and refreshes the app. Simple, no bells and whistles.

Alright, time to trace the journey of a vugu file from source to end user.

1. The file gets parsed by an HTML parser. Yes, the file must contain fully valid HTML.
2. After that, the file gets parsed again by the vugu parser. Here it's broken down into parts and reassembled into Go. The generated code is fully working Go code.
3. The resulting file is compiled into WASM and packaged as WebAssembly for client-side execution.
4. PROFIT!

And that's it. You can all go home. Everything's crystal clear.

What? You want more? Fine, if you insist. Let's dig deeper and do more. Let's start by looking at the generated Go file. It's called `0_components_vgen.go`. Let's dive in.

The code from `<script type="application/x-go">` in the vugu file gets transferred into Go with no questions asked and zero modifications. Nice. On top of that, the file gets a `Build` function that generates the HTML interface.

```go
func (c *Root) Build(vgin *vugu.BuildIn) (vgout *vugu.BuildOut) {

    vgout = &vugu.BuildOut{}

    var vgiterkey interface{}
    _ = vgiterkey
    var vgn *vugu.VGNode
    vgn = &vugu.VGNode{Type: vugu.VGNodeType(3), Namespace: "", Data: "div", Attr: []vugu.VGAttribute{...}}
    vgout.Out = append(vgout.Out, vgn)    // root for output
    {
        vgparent := vgn
        _ = vgparent
        vgn = &vugu.VGNode{Type: vugu.VGNodeType(1), Data: "\n       "}
        vgparent.AppendChild(vgn)
        vgn = &vugu.VGNode{Type: vugu.VGNodeType(3), Namespace: "", Data: "button", Attr: []vugu.VGAttribute{...}}
        vgparent.AppendChild(vgn)
        vgn.DOMEventHandlerSpecList = append(vgn.DOMEventHandlerSpecList, vugu.DOMEventHandlerSpec{
            EventType:   "click",
            Func:        func(event vugu.DOMEvent) { c.HandleCat(event) },
            // TODO: implement capture, etc. mostly need to decide syntax
        })
```

It looks convoluted, as any generated code does, but if you squint a bit, you can easily see that it's just our HTML being constructed programmatically.

After all that, vugu collects all your site's components into a single program bundle (or multiple bundles, if you prefer) and ships everything to the client. The library is capable of tracking the DOM and DOM Events, passing events from HTML components into your Go code.

And there you have it. Pretty straightforward. Actually, it's *very* straightforward. Vugu is built on this philosophy. Vugu is not a framework. It's a library you can use in specific parts of your project. You can programmatically invoke rendering of particular components wherever you need them. You won't have to depend on `create-react-app` or anything else. Everything is extremely lightweight.

Alright, enough talk — let's write a simple app to show what you can and can't do with vugu.

First, let's run:

```bash
go get -u github.com/vugu/vgrun
vgrun -install-tools
```

Then you can create a project from a template:

```bash
vgrun -new-from-example=simple .
```

```bash
vgrun devserver.go
```

If at this point you get a couple of errors about missing modules, follow the instructions and run `go get`. The latest version of Go doesn't automatically resolve dependencies in `go.mod`, so you'll have to download them manually.

VSCode has syntax highlighting for vugu. A nice little bonus. Install the extension and let's start writing our `root.vugu`.

For the sake of everyone's sanity, let's write a program that displays cat photos. The internet was made for cats, wasn't it?

At the top of every vugu file sits the HTML markup for the component.

```html
<div class="demo">
    <button @click="c.HandleCat(event)">Get a cat!</button>
    <div vg-if='c.IsLoading'>Loading...</div>
    <div vg-if='len(c.Cats) > 0'>
        <div vg-for='c.Cats'>
            <img :src='value.URL' alt="cat"></img>
        </div>
    </div>
</div>
```

This is all pretty simple. And, frankly, it should look familiar to anyone who's worked with Vue.js. For those who haven't touched Vue, it won't take long to figure out either.

Events are defined using `@`. For example, `@click` is your event handler that fires when the button is clicked. The best part? You can stick a function in there or write Go code directly.

You can conditionally display content using the `vg-if` attribute.

```html
<div vg-if='c.IsLoading'>Loading...</div>
```

The `Loading...` message will only show up when the `IsLoading` variable equals `true` (I'll explain where this "c" comes from in a bit). You can shove any Go code in there too, as you can see on the next line.

After that, we'll use `vg-for` to generate output for each element in the collection.

And for dessert — if you add a colon at the beginning of an HTML attribute, its value will be pulled from Go code.

Now things get interesting — the most exciting part of the program.

```go
<script type="application/x-go">
import (
    "encoding/json"
    "net/http"
    "log"
)

type Root struct {
    IsLoading bool   `vugu:"data"`
    Cats      []Cat  `vugu:"data"`
}

type Cat struct {
    ID     string `json:"id"`
    URL    string `json:"url"`
    Width  int    `json:"width"`
    Height int    `json:"height"`
}
</script>
```

Here I'm defining two structs: `Cat` for handling cats from the API, and `Root`, the main struct for the program. This struct's name must match the filename, and it must be exported (start with an uppercase letter). The struct fields need to be tagged with `vugu:"data"`. Everything marked with this tag becomes accessible in our HTML code via the variable `c`.

`Root` is the name of our component. `Root` is a special component in vugu — it's the mount point where your app begins.

The number of vugu files is unlimited. Create as many components as your heart desires. If you feel compelled to name something with two words, the file should be named `koshki-sobachki.vugu` and the main type in that file would be `KoshkiSobachki`.

Routing is created automatically based on component names. So the component described above would be created and mounted at `/KoshkiSobachki`. Although, once again, vugu isn't a big fan of all this magic and syntactic sugar. All routing can be overridden manually.

Alright, let's finish writing our simple site.

```go
func (c *Root) HandleCat(event vugu.DOMEvent) {
    ee := event.EventEnv()
    go func() {
        ee.Lock()
        c.IsLoading = true
        ee.UnlockRender()
        client := &http.Client{}
        req, _ := http.NewRequest("GET", "https://api.thecatapi.com/v1/images/search?limit=3", nil)
        req.Header.Set("x-api-key", "710c211b")
        res, err := client.Do(req)
        if err != nil {
            log.Printf("Error fetching: %v", err)
            return
        }
        defer res.Body.Close()
        var newcat []Cat
        err = json.NewDecoder(res.Body).Decode(&newcat)
        if err != nil {
            log.Printf("Can't unmarshal the json: %v", err)
            return
        }
        ee.Lock()
        defer ee.UnlockRender()
        c.Cats = newcat
        c.IsLoading = false
    }()
}
```

The code is fairly straightforward. Head over to https://thecatapi.com, sign up, grab a free API key, and plug it into the code. (Don't worry, the key in this example isn't valid, so you won't be able to hijack my beloved cat generation service.) Two things worth mentioning here:

1. The event handler code directly spawns a goroutine, so it doesn't block the event handler itself.
2. Inside the goroutine, we use `EventEnvironment` to synchronize access to the data. Before updating the fields of the `c` struct, you need to call `Lock()`, and immediately after — `UnlockRender()`.

When the button is clicked, we fetch a JSON response with three objects containing links to cats. We parse that JSON into an array of the `Cat` type we defined earlier. We save that data back into the `Cats` variable in the `c` struct. Along the way, we toggle the `IsLoading` variable to show and hide the loading indicator div.

Wonderful, everything works.

Let's dive into some of the finer details of vugu.

The key principle — nothing happens automatically without your involvement. That's the position of vugu's lead developer. Everything you see on screen happens because you told it to.

For example, CSS declared in vugu files is simply inserted into your HTML as-is. No tricks. Nothing gets renamed, and if you write `.header` in two different modules, you'll get a style collision. So be careful with that.

A component, once written, can be used inside other components (just like in React and Blazor). Components can exist in four states:

- **`Init(ctx vugu.InitCtx)`** — the component has been created but hasn't seen the world yet or had its first beer.
- **`Compute(ctx vugu.ComputeCtx)`** — the component is about to see the light of day. Time to recalculate variables and update values.
- **`Rendered(ctx vugu.RenderedCtx)`** — the component has been thoroughly worked over and rendered to within an inch of its life.
- **`Destroy(ctx vugu.DestroyCtx)`** — the component is no longer needed and it's time for the scrap heap. Burnout — what else can you say.

It's all pretty simple. All components are just collections of structs with `vugu:"data"` tags. You can have as many of these structs as you like.

Here are a few more examples from the vugu creator's website:

```html
<!-- root.vugu -->
<div class="root">
    <ul>
        <main:MyLine FileName="example.txt" :LineNumber="rand.Int63n(100)"></main:MyLine>
    </ul>
</div>
<script type="application/x-go">
import "math/rand"
</script>
```

```html
<!-- my-line.vugu -->
<li class="my-line">
    <strong vg-content='c.FileName'></strong>:<span vg-content='c.LineNumber'></span>
</li>
<script type="application/x-go">
type MyLine struct {
    FileName   string `vugu:"data"`
    LineNumber int    `vugu:"data"`
}
</script>
```

In this example, you can see how easy it is to create and use components in vugu.

And finally, the WASM file you get as output weighs in at 7 megabytes. That's an order of magnitude better than what Blazor produces, but we can go deeper.

What if I told you that you can run your vugu project in tinygo? Well, that's exactly what I'm telling you.

Head over to https://www.vugu.org/doc/tinygo and run the build either through Docker or with duct tape and sheer willpower. The result? A beautiful WASM file weighing just 500 kilobytes. Hooray! Cats for everyone! Have as many as you want!

Alright, enough rambling — go read the official documentation at https://www.vugu.org/doc.

After that, you can dive into the much more comprehensive documentation at https://pkg.go.dev/github.com/vugu/vugu/.

I reached out to the project author and confirmed that the project isn't abandoned, though the documentation is outdated. I personally offered my help with updating the docs and developing the project, so vugu to the masses! But, despite that, here's the official disclaimer:

The project is still in experimental mode. For instance, the latest version of tinygo broke WASM code compilation. So use it at your own risk. But do use it. It's fun.

If anyone has questions — create an issue, submit a PR, or send me a DM and I can reach out to the creators on Slack.

Happy vugu diving, everyone!
