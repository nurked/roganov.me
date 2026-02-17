# roganov.me

Personal portfolio and blog for Ivan Roganov. Built with [Astro](https://astro.build/) and hosted on AWS S3.

## Quick Start

```bash
npm install
npm run dev       # Start dev server at localhost:4321
npm run build     # Build to ./dist
npm run preview   # Preview the build locally
```

## Deploy

```bash
bash deploy.sh    # Builds and syncs to S3
```

Requires AWS CLI configured with access to the `s3://roganov.me` bucket.

---

## Writing Blog Posts

### 1. Create a new post directory

```
src/data/blog/my-post-slug/
  en.md       # English version (required)
  ru.md       # Russian version (optional)
```

The directory name doesn't matter for the URL — the `slug` field in frontmatter controls the URL.

### 2. Add frontmatter

Every post needs this frontmatter block at the top:

```markdown
---
title: "My Post Title"
slug: "my-post-slug"
date: 2026-02-17
description: "A short description for the blog listing and SEO."
lang: "en"
tags: ["tag1", "tag2"]
---

Your markdown content here...
```

**Required fields:**
- `title` — Display title
- `slug` — URL slug (produces `/blog/my-post-slug/`)
- `date` — Publication date (YYYY-MM-DD)
- `description` — Short description for listing page and meta tags
- `lang` — `"en"` or `"ru"`

**Optional fields:**
- `tags` — Array of tag strings
- `draft` — Set to `true` to hide from listings

### 3. Build and deploy

```bash
npm run build     # Post automatically appears in blog listing
bash deploy.sh    # Push to production
```

The post will appear at:
- English: `/blog/my-post-slug/`
- Russian: `/ru/blog/my-post-slug/` (only if `ru.md` exists)

### Example post

```
src/data/blog/my-first-post/en.md
```

```markdown
---
title: "My First Post"
slug: "my-first-post"
date: 2026-03-01
description: "This is my first blog post on the new site."
lang: "en"
tags: ["personal"]
---

## Hello World

This is the content of my first post. You can use all standard Markdown:

- **Bold text**
- *Italic text*
- [Links](https://example.com)
- Code blocks, blockquotes, images, etc.
```

---

## Updating Site Content

### Profile / Contact Info
Edit `src/config/profile.js` — this controls name, contact details, social links, and SEO meta across the entire site.

### Navigation Links
Edit `src/components/NavBar.astro` (desktop) and `src/components/NavBarMobile.jsx` (mobile).

### Translation Strings
Edit `src/i18n/en.json` and `src/i18n/ru.json`. These control all text on the homepage, about section, contact section, nav labels, footer, and blog UI.

### Adding a New Birthday Page
1. Create the React component: `src/components/Birthday2027.jsx` (copy from Birthday2026.jsx, update event details)
2. Create the page files:
   - `src/pages/birthday-2027.astro` (English)
   - `src/pages/ru/birthday-2027.astro` (Russian)
3. Update nav links in `NavBar.astro` and `NavBarMobile.jsx`
4. Update `en.json` / `ru.json` nav labels

### Static Images
Drop files in `public/img/` — they're served as-is at `/img/filename.ext`.

---

## Architecture

- **Astro 5** — Static site generator, file-based routing
- **React islands** — Interactive components (Banner animation, Contact QR code, Birthday pages, mobile menu) hydrate client-side via `client:visible` or `client:load`
- **Static components** — Hero, About, Superhero, NavBar (desktop), Footer are pure `.astro` files that ship zero JavaScript
- **i18n** — English at `/`, Russian at `/ru/`. Translation strings in JSON files
- **Blog** — Astro content collections with Markdown files and frontmatter
- **Tailwind CSS 3** — Utility-first styling with `@tailwindcss/typography` for blog prose
- **S3 hosting** — Static files deployed to `s3://roganov.me`
