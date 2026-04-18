# CLAUDE.md — roganov.me

## Working Directives (read first)

- **NEVER create a new branch unless the user explicitly asks for one.** Do not auto-branch. Do not create `claude/*` branches or worktrees off them. If the harness spins one up automatically, stop and tell the user before doing any work — do not proceed against an auto-branch.
- **Active branch is `astro-migration`.** All current work lives here. `main` is the legacy Vite/React site and must not be touched.
- The main checkout at `/Users/ivan/source/roganov.me` is already on `astro-migration` — edit files there directly. Do not create a new worktree to "isolate" changes.
- Do not commit unless explicitly asked.

## Current Priority — Ship the Astro Rebuild

We are moving the live site from the old Vite/React codebase (`main`) over to the Astro build on this branch. Until that migration is shipped, everything else is secondary.

Roadmap in priority order:

1. **Fix the blog.** It's broken in the current state. Diagnose and stabilize — `/blog/` listing and `/blog/<slug>/` posts should render cleanly for both EN and RU, with working links, dates, and prose styling.
2. **Finish the article import.** We started pulling legacy posts from `old_files/` into `src/data/blog/<slug>/{en,ru}.md`; some imports did not complete. Identify what's outstanding (there's an untracked `src/data/blog/docker-mail-server/` dir sitting around as evidence) and finish importing the backlog.
3. **Remove the Birthday pages.** Delete `src/pages/birthday-2025.astro`, `src/pages/birthday-2026.astro`, their `/ru/` counterparts, `src/components/Birthday.jsx` and `Birthday2026.jsx`, plus any nav / profile / i18n entries. Redirects from old URLs are fine; the content goes.
4. **Redesign for appeal.** The current look is flat and bleak. Target a superb, premium feel across hero, portfolio grid, blog listing, and blog post pages — typography, layout rhythm, motion, imagery all need a pass. Not generic AI-template aesthetic.
5. **SEO — heavy.** Per-page `<title>` + meta description, Open Graph + Twitter cards, JSON-LD (`Person` + `Article`), canonical URLs, RU↔EN `hreflang`, complete sitemap, proper `robots.txt`, internal linking between posts, semantic headings, image `alt`s.

Items 1–3 must land before 4 ships. 5 can run in parallel with 4.

## Project Overview

Personal portfolio and website for Ivan Roganov. Astro static site with React islands, hosted on AWS S3.

## Tech Stack

- Astro 5.x — static site generator
- @astrojs/react — React component integration (islands architecture)
- Tailwind CSS 3 (utility-first, via @astrojs/tailwind)
- @tailwindcss/typography — prose styling for blog posts
- Framer Motion — animations (React islands only)
- React 18 — interactive components only (Contact, Banner, mobile nav)

## Commands

- `npm run dev` — Start Astro dev server
- `npm run build` — Production build to `./dist`
- `npm run preview` — Preview production build locally
- `npm run lint` — ESLint
- `bash deploy.sh` — Build + deploy to S3 bucket `s3://roganov.me`

## Project Structure

```
src/
  content.config.ts         # Content collections definition (blog)
  config/profile.js         # Centralized profile data (name, links, SEO, contact)
  i18n/
    en.json, ru.json        # Translation strings
    utils.js                # getLangFromUrl, useTranslations, getLocalePath, getAlternateLang
  data/blog/                # Blog content (Markdown with frontmatter)
    qualiflation/en.md      # Blog posts organized by slug/lang.md
  layouts/
    BaseLayout.astro        # HTML shell, <head>, GA, SEO, hash redirect
    PageLayout.astro        # BaseLayout + NavBar + Footer wrapper
    BlogPostLayout.astro    # Blog post wrapper with prose styling
  pages/                    # File-based routing
    index.astro             # Homepage (EN)
    blog/index.astro        # Blog listing (EN)
    blog/[slug].astro       # Blog post (EN)
    ru/                     # Russian locale prefix
      index.astro           # Homepage (RU)
      blog/index.astro, blog/[slug].astro
  components/
    NavBar.astro            # Static navbar (desktop links)
    NavBarMobile.jsx        # React island — mobile hamburger menu
    Footer.astro            # Static footer
    Hero.astro              # Static hero section
    About.astro             # Static about section
    Superhero.astro         # Static portfolio card grid
    HeroCard.astro          # Static card component
    Banner.jsx              # React island — framer-motion scrolling banner
    contact/Contact.jsx     # React island — QR code, vCard, contact info
  utils/
    contactUtils.js         # vCard and contact URL generation
  styles/global.css         # Tailwind entry point
  assets/Hero.jpeg          # Hero background image (processed by Astro)
public/
  img/                      # Static images (hero0-4.png)
  ivan.png, robots.txt
```

## Routing

File-based routing with i18n:
- `/` — English homepage
- `/ru/` — Russian homepage
- `/blog/` — English blog listing
- `/blog/qualiflation/` — English blog post
- `/ru/blog/` — Russian blog listing

Hash route backwards compatibility: old `/#/path` URLs redirect to `/path/` via inline script in BaseLayout.

## i18n

- English is default (no prefix), Russian uses `/ru/` prefix
- Translation strings in `src/i18n/en.json` and `ru.json`
- `useTranslations(lang)` returns a `t('key.path')` function
- `getLocalePath(lang, path)` generates locale-prefixed URLs
- Astro config has `fallback: { ru: 'en' }` — missing RU pages fall back to EN

## Blog

- Content collections defined in `src/content.config.ts`
- Posts live in `src/data/blog/<slug>/<lang>.md` with frontmatter
- Required frontmatter: `title`, `slug`, `date`, `description`, `lang`
- Optional: `tags`, `draft`
- Blog post pages use `@tailwindcss/typography` prose classes

## Key Patterns

- All site-wide data lives in `src/config/profile.js` — edit there first for name/contact/SEO changes
- Static components are `.astro` files (zero JS shipped)
- Interactive components are `.jsx` React islands with `client:visible` or `client:load` directives
- Styling is Tailwind utility classes; custom extensions in `tailwind.config.js` (blink animation, glow, custom colors)
- SEO handled natively in BaseLayout.astro `<head>` — no React Helmet
- Google Analytics via inline script in BaseLayout.astro (ID: G-3WR8FYRV2N)
- Sitemap auto-generated by @astrojs/sitemap

## Conventions

- No TypeScript for components — plain JSX for React, .astro for static
- Component files use PascalCase
- React islands must use `export default function` (not named exports)
- Astro pages pass `lang` prop to components for i18n
