---
title: "UUIDv7, or How Not to Get Lost in Time When Creating Identifiers"
slug: "uuid-v7"
date: 2021-08-12
description: "A deep dive into UUIDv7 — a next-generation binary-sortable identifier: why it exists, how sub-second precision works, and why it matters for databases."
lang: "en"
tags: ["UUID", "systems programming", "databases", "Big Data"]
---

*Be careful when storing a date inside a UUID*

For many years I resisted the onslaught of UUIDs as database keys, but over time and with practice it finally clicked. They really are convenient when you're dealing with distributed systems. Generating a new identifier on opposite sides of the planet is not exactly trivial. Creating pseudo-random identifiers solves this problem.

That said, such solutions are not always great. Unlike plain numeric values that are easy to cache and sort, UUIDs are not as flexible to work with. UUID version 7 is designed precisely to tackle these kinds of problems.

Welcome to the world of sorted randomness.

UUIDs themselves are not just a pile of random bits. There are several variants for generating them. @AloneCoder's article on how UUIDs are generated describes the existing identifier formats in detail — versions one through five.

### UUIDs in databases

Why do we need to generate UUIDs instead of just using random data? Well, there are plenty of reasons. Storing information about the host that generated the sequence, storing the timestamp, and similar values makes UUIDs more informative. This approach can be used when building distributed computing systems. For instance, instead of hammering the database with date-filtered queries, you can simply select the identifiers that already contain that date.

All well and good, but that part is actually not so easy. Extracting dates from the string representation of a UUID is a real headache. Why? Well, let's look at how UUIDv1 is generated.

1. Take the low 32 bits of the current UTC timestamp. These become the first 4 bytes (8 hex characters) of the UUID [ TimeLow ].
2. Take the middle 16 bits of the current UTC timestamp. These become the next 2 bytes (4 hex characters) [ TimeMid ].
3. The next 2 bytes (4 hex characters) concatenate the 4-bit UUID version with the remaining 12 high-order bits of the current UTC timestamp (which is 60 bits total) [ TimeHighAndVersion ].

What a wonderfully tangled mess. In fairness, parsing the date out of such an identifier is straightforward enough, but parsing is parsing. It's no fun and it burns CPU cycles.

### The hero of the day

Ladies and gentlemen, meet UUIDv7!

At the moment, Version 7 is a draft RFC available at https://datatracker.ietf.org/doc/html/draft-peabody-dispatch-new-uuid-format-01.

The main development is driven by two developers: bradleypeabody and kyzer-davis. Anyone interested can join the discussion and contribute to the format on GitHub: https://github.com/uuid6/uuid6-ietf-draft/.

Five days ago this specification sparked a lively discussion on Hacker News.

While developing the specification, the following UUID generation formats were reviewed:

1. LexicalUUID by Twitter
2. Snowflake by Twitter
3. Flake by Boundary
4. ShardingID by Instagram
5. KSUID by Segment
6. Elasticflake by P. Pearcy
7. FlakeID by T. Pawlak
8. Sonyflake by Sony
9. orderedUuid by IT. Cabrera
10. COMBGUID by R.Tallent
11. ULID by A. Feerasta
12. SID by A. Chilton
13. pushID by Google
14. XID by O. Poitrey
15. ObjectID by MongoDB
16. CUID by E. Elliott

So, what's so special about UUIDv7 and how does it differ from previous versions?

This version of the identifier is **binary-sortable**. That means you no longer need to convert UUID values into some other format to figure out which one is greater or smaller.

> "But why should we care? We can just do `select id, creation_date order by creation_date` and call it a day."
>
> — The average developer.

You're missing the point.

It's not about what's convenient for you, the programmer, when writing a SELECT. The question is how the database stores its indexes. UUIDv4 values created sequentially will appear random. Consequently, when writing these index values to the database — even if the values were created within the same time window — clustering will put extra load on the indexes during writes.

Imagine you have a high-load system. 100 servers are generating new records with UUIDs several times per second, and all of that flies into Redis, which then loads the data into PostgreSQL.

Right. This is where life with UUIDv7 gets easier. The index values aren't as scattered, and keeping track of them is much simpler.

On top of that, key values can be sorted very simply and quickly in binary form. Take the first 64 bits of the identifier, compare them as int64 with another identifier, and you already know which one was created first.

Convenient, isn't it?

### But how does it actually work?

OK, when it comes to the date itself — it's straightforward. Write the number as a unix timestamp and you've got something binary-sortable. I just ask you, please don't write this date in scattered chunks all over the place. Simple and clear: the first 36 bits contain a single number. But if you're trying to store milliseconds, things get trickier.

Let's talk about math. About approximation and limits. Everyone's favorite topic, right? Let's look at the following representation of a second: 05.625. Five and six hundred twenty-five thousandths of a second. We discard the 5, since that will be stored in the unix timestamp.

If you store this value as a float, it's going to look ugly from a binary perspective. But what if we apply a bit of calculus? Let's start by expanding one into the following series.

$$1 = \frac{1}{2} + \frac{1}{4} + \frac{1}{8} + \frac{1}{16} + \ldots$$

Simple enough, right? If you add up all the numbers in this series, you get one. But what if you don't add every term? Well, we can work with that. Let's assign one bit to each number in the series. Each bit indicates whether that term is present in the series or not.

We take our sub-second precision, 0.625, and start encoding this precision using bits.

The first number is 1/2, i.e. 0.5. If our precision value is greater than this number, we set the bit to 1 and subtract it from our current precision value. We end up with a bit sequence of `1` and 0.125 as the remainder.

Looking further: 1/4 is 0.25 — clearly greater than 0.125. So the sequence becomes `10` and we move on. We continue in the same fashion, and discover that to write 0.625 in binary this way, we need to write: `101`, because

$$\frac{1}{2} + \frac{1}{8} = 0.625$$

The nicest thing about this system is that if you trim bits from the end, you lose precision, but you still retain a more or less approximate value.

The value is preserved, and at the same time you can play with the number of bits you spend to represent it. And — most importantly — this encoding produces binary-sortable values.

Moreover, there is a very simple mathematical way to perform this operation. To encode any number, do the following:

```python
bits = 12
fraction = 0.321
subsec = round(fraction * 2**bits)
```

And, of course, to decode it you do the reverse.

```python
bits = 12
subsec = 1315
fraction = round(subsec / 2**bits, 3)
```

What do we get in the end? The ability to store time with sub-second precision in a binary-sortable format.

### What about collisions?

If you're generating values on a single node, there is a chance that even with sub-second precision you might create two identifiers within the same time window.

For this, the standard provides a counter of arbitrary length that must monotonically increase when timestamps match.

In addition, you can allocate an arbitrary number of bits to identify the computer that generated the value. (You shouldn't write the MAC address into this field, since that has historically raised too many security concerns.)

Plus, all the space not used for the timestamp, counter, and node number (roughly 54 bits) must be filled with random values to prevent any collisions across different nodes.

In summary:

```
Unix TS | Subsecond precision | Counter | Node | Random data
```

### What it looks like in the end

```
     0                   1                   2                   3
     0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                            unixts                            |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |unixts |       subsec_a       |  ver  |       subsec_b        |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |var|               subsec_seq_node                            |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                    subsec_seq_node                           |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

Here is an example of how data is stored in a UUIDv7.

The `ver` and `var` fields are preserved for compatibility with other identifier versions.

The first 36 bits are occupied by the unix timestamp, which allows storing dates up to `4147-08-20 07:32:15 +0000 UTC`. I very much hope that will be enough for current projects. The remaining fields can be filled with sub-second precision, node number data, and a counter.

At this point, the number of bits allocated for sub-second precision, node number, and counter is not defined by the standard. From a database perspective, this information is not particularly important. The identifier will look like any normal identifier, and you can use it everywhere UUIDs are used. And if you know the original values you used when creating the identifier, you can parse them out without much trouble.

Here's a concrete example of this identifier:

What do I know about `06115aa098-9277-0087-49a8-cb901fc2f7`? It's quite simple.

- It was created at `2021-08-12 16:08:57 -0700 UTC-7` (with unix timestamp 1628809737)
- Nanoseconds are encoded as `0.535995`
- No counter was used in this case
- The node number of the computer that created this identifier is 7.
- The last 56 bits contain random data.

How do I know this? I know the original generator configuration, which specifies that nanosecond precision should occupy 16 bits, the counter — no more than eight bits, and the node number — 6 bits. Everything else is random data.

Furthermore, I know that `06115ad596-0873-0087-5764-c1f3730d90` was created later than `06115aa098-9277-0087-49a8-cb901fc2f7`, because `06115ad` is greater than `06115aa`. To know this, I don't even need to bother with parsing.

### Why version 7 and not 6?

The document actually describes three new identifier versions: 6, 7, and 8. Version six is backward-compatible with version 4 and stores the date in the old format. Version 8 is reserved for those punks who need to do everything their own way, and does not impose many constraints.

### So what do I do with this?

If you're a systems developer, join the discussion. We already have Brazilians, Hungarians, and Americans, and we're really missing some Russian representation.

Right now we are discussing the following question: "Should the number of bits for sub-second precision be fixed in the standard, or should we leave it up to the programmers?"

Next, if your fingers are itching, you can check out ready-made generators for various languages here. (Java, Dart, Python, Golang, JS, and so on.)

I wrote my own implementation in Golang. It's a rather unusual version, designed with the expectation that the standard will change, so the number of bits in each field can be adjusted.

On top of that, here's a toy website for you: http://www.new-uuid.info. A single-page site written in Go+WASM that uses my package to generate these identifiers online. You can tweak the knobs and see exactly where and how the bits of your UUID are laid out.

In short, join in — there are still plenty of questions to sort out, and over the next month we'll be submitting the third draft revision to the RFC. I have a feeling we can't do it without the wider community.
