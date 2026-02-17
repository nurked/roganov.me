# Migration Guide: roganov.me — React+Vite to Astro Blog Engine

This document contains the complete technical instructions for migrating roganov.me from a React+Vite SPA to an Astro-based static blog engine with i18n (English/Russian), custom slugs, and S3 deployment.

---

## Table of Contents

1. [Current State Summary](#1-current-state-summary)
2. [Target Architecture](#2-target-architecture)
3. [Prerequisites & Installation](#3-prerequisites--installation)
4. [Project Structure — New Layout](#4-project-structure--new-layout)
5. [Configuration Files](#5-configuration-files)
6. [i18n System](#6-i18n-system)
7. [Content Collections (Blog)](#7-content-collections-blog)
8. [Layouts](#8-layouts)
9. [Pages — Routing](#9-pages--routing)
10. [Component Migration](#10-component-migration)
11. [Static Assets](#11-static-assets)
12. [Hash Route Backwards Compatibility](#12-hash-route-backwards-compatibility)
13. [SEO Migration](#13-seo-migration)
14. [Google Analytics](#14-google-analytics)
15. [Deploy Script Update](#15-deploy-script-update)
16. [Files to Delete](#16-files-to-delete)
17. [Migration Checklist](#17-migration-checklist)
18. [Testing Verification](#18-testing-verification)

---

## 1. Current State Summary

### Tech Stack Being Replaced
- React 18.3.1 + Vite 6.0.5
- React Router DOM 7.1.5 (HashRouter — all URLs are `/#/path`)
- React Helmet for SEO
- react-ga4 for Google Analytics
- framer-motion for animations

### Current Routes (HashRouter)
| Hash URL | Component | Description |
|---|---|---|
| `/#/` | Homepage | Hero, About, Banner, Superhero, Contact, Footer |
| `/#/birthday-2025` | Birthday.jsx | 2025 birthday event page (bilingual) |
| `/#/birthday-2026` | Birthday2026.jsx | 2026 birthday event page (bilingual) |

### In-page Anchors
- `/#superhero` — Portfolio section
- `/#contact` — Contact section
- `/#about` — About section

### Interactive Components (require client-side JS)
These MUST be hydrated as React islands in Astro:
1. **Contact.jsx** — QR code generation (qr-code-styling), vCard download, mobile detection, resize listener
2. **ContactDownload.jsx** — QR code generation, vCard download
3. **Banner.jsx** — framer-motion infinite scroll animation, resize measurement
4. **Birthday.jsx** — framer-motion animations, language toggle, platform detection, calendar event generation, mobile detection
5. **Birthday2026.jsx** — Same as Birthday.jsx but different event data
6. **NavBar.jsx** — Mobile hamburger menu toggle (useState), scroll-to-element navigation

### Static Components (can become pure Astro)
1. **Hero.jsx** — Scroll button can be plain `<a href="#about">`
2. **About.jsx** — Pure static HTML content
3. **Superhero.jsx** — Static card grid (no interactivity beyond layout)
4. **HeroCard.jsx** — Static card component
5. **HeroRow.jsx** — Static layout wrapper
6. **Footer.jsx** (currently `Footter.jsx`) — Static copyright line
7. **SEO.jsx** — Replaced by Astro's native `<head>` management

### Key Data Files
- `src/config/profile.js` — Centralized profile data (name, contact, social, SEO meta)
- `src/utils/contactUtils.js` — vCard generation, Apple Contacts URL
- `src/utils/calendarUtils.js` — Calendar event generation (Google Cal / iCal)

### External Dependencies to Keep
- `framer-motion` — Used in Banner and Birthday pages
- `qr-code-styling` — Used in Contact component
- `react-icons` — Used in Contact component (FaEnvelope, FaWhatsapp, etc.)
- `vcf` — Listed in package.json but not actually imported anywhere (can drop)

### Dependencies to Remove
- `react-router-dom` — Replaced by Astro file-based routing
- `react-helmet` — Replaced by Astro native `<head>`
- `react-ga4` — Replaced by inline script tag
- `mdb-react-ui-kit` — Not imported anywhere in current code (unused)

---

## 2. Target Architecture

### Framework
- **Astro 5.x** — Static site generator with React island support
- **@astrojs/react** — React component integration
- **Tailwind CSS** — Keep using Tailwind (via `@tailwindcss/vite` for v4, or `@astrojs/tailwind` for v3)
- **Static output** — Every page is a pre-built HTML file

### URL Structure After Migration

**English (default, no prefix):**
```
/                               → Homepage
/blog/                          → Blog listing
/blog/qualiflation/             → Blog post (custom slug)
/birthday-2025/                 → Birthday 2025 event
/birthday-2026/                 → Birthday 2026 event
```

**Russian (`/ru/` prefix):**
```
/ru/                            → Homepage (Russian)
/ru/blog/                       → Blog listing (Russian)
/ru/blog/qualiflation/          → Blog post (Russian version)
/ru/birthday-2025/              → Birthday 2025 (Russian)
/ru/birthday-2026/              → Birthday 2026 (Russian)
```

### Build Output
```
dist/
  index.html
  blog/index.html
  blog/qualiflation/index.html
  birthday-2025/index.html
  birthday-2026/index.html
  ru/index.html
  ru/blog/index.html
  ru/blog/qualiflation/index.html
  ru/birthday-2025/index.html
  ru/birthday-2026/index.html
  _astro/                        ← Bundled CSS/JS
  img/                           ← Static images
  ivan.png
  favicon.png
  robots.txt
  sitemap.xml
```

---

## 3. Prerequisites & Installation

### Step 1: Create a New Branch
```bash
git checkout -b astro-migration
```

### Step 2: Install Astro and Integrations
```bash
# Install Astro
npm install astro

# Install React integration
npx astro add react
# This installs: @astrojs/react, react, react-dom

# Install Tailwind integration
npx astro add tailwind
# For Tailwind 4: installs @tailwindcss/vite as a Vite plugin
# For Tailwind 3: installs @astrojs/tailwind integration

# Install sitemap integration (auto-generates sitemap.xml)
npx astro add sitemap
```

### Step 3: Keep Required Dependencies
These are already in package.json and should stay:
```bash
npm install framer-motion qr-code-styling react-icons
```

### Step 4: Remove Unused Dependencies
```bash
npm uninstall react-router-dom react-helmet react-ga4 mdb-react-ui-kit vcf @vitejs/plugin-react eslint-plugin-react-refresh
```

### Step 5: Update package.json Scripts
Replace the `scripts` section:
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "lint": "eslint ."
  }
}
```

---

## 4. Project Structure — New Layout

```
roganov.me/
├── astro.config.mjs                    ← NEW: Astro configuration
├── tsconfig.json                       ← NEW: TypeScript config (required by Astro)
├── package.json                        ← UPDATED
├── deploy.sh                           ← UPDATED (minor)
│
├── public/                             ← KEEP AS-IS (static assets)
│   ├── img/
│   │   ├── hero0.png ... hero4.png
│   ├── ivan.png
│   ├── park-2025.png
│   ├── park-2026.jpg
│   ├── favicon.png
│   └── robots.txt                      ← Keep (or let Astro generate)
│
├── src/
│   ├── content.config.ts               ← NEW: Content collections definition
│   │
│   ├── config/
│   │   └── profile.js                  ← KEEP AS-IS
│   │
│   ├── i18n/                           ← NEW: i18n strings
│   │   ├── en.json
│   │   ├── ru.json
│   │   └── utils.js                    ← Helper to get translations
│   │
│   ├── data/                           ← NEW: Content collections source
│   │   └── blog/
│   │       └── qualiflation/
│   │           ├── en.md               ← English blog post
│   │           └── ru.md               ← Russian blog post (optional)
│   │
│   ├── layouts/                        ← NEW: Astro layouts
│   │   ├── BaseLayout.astro            ← HTML shell, head, GA, etc.
│   │   ├── PageLayout.astro            ← NavBar + Footer wrapper
│   │   └── BlogPostLayout.astro        ← Blog post wrapper
│   │
│   ├── pages/                          ← NEW: File-based routing
│   │   ├── index.astro                 ← Homepage (EN)
│   │   ├── blog/
│   │   │   ├── index.astro             ← Blog listing (EN)
│   │   │   └── [slug].astro            ← Blog post dynamic route (EN)
│   │   ├── birthday-2025.astro         ← Birthday 2025 (EN)
│   │   ├── birthday-2026.astro         ← Birthday 2026 (EN)
│   │   └── ru/                         ← Russian locale prefix
│   │       ├── index.astro             ← Homepage (RU)
│   │       ├── blog/
│   │       │   ├── index.astro         ← Blog listing (RU)
│   │       │   └── [slug].astro        ← Blog post dynamic route (RU)
│   │       ├── birthday-2025.astro     ← Birthday 2025 (RU)
│   │       └── birthday-2026.astro     ← Birthday 2026 (RU)
│   │
│   ├── components/                     ← MIGRATED components
│   │   ├── NavBar.astro                ← NEW: Static Astro navbar
│   │   ├── NavBarMobile.jsx            ← NEW: React island for mobile menu
│   │   ├── Footer.astro                ← NEW: Static Astro footer
│   │   ├── Hero.astro                  ← NEW: Static Astro hero
│   │   ├── About.astro                 ← NEW: Static Astro about
│   │   ├── Banner.jsx                  ← KEEP: React island (framer-motion)
│   │   ├── Superhero.astro             ← NEW: Static Astro portfolio
│   │   ├── HeroCard.astro              ← NEW: Static Astro card
│   │   ├── HeroRow.astro              ← NEW: Static Astro row
│   │   ├── Contact.jsx                 ← KEEP: React island (QR code, vCard)
│   │   ├── Birthday.jsx                ← KEEP: React island (framer-motion, calendar)
│   │   ├── Birthday2026.jsx            ← KEEP: React island (framer-motion, calendar)
│   │   ├── LanguageSwitcher.astro      ← NEW: Language toggle link
│   │   └── BlogPostCard.astro          ← NEW: Blog listing card
│   │
│   ├── utils/                          ← KEEP
│   │   ├── calendarUtils.js
│   │   └── contactUtils.js
│   │
│   ├── assets/                         ← KEEP
│   │   └── Hero.jpeg
│   │
│   └── styles/
│       └── global.css                  ← NEW: Tailwind entry point
│
├── DELETED FILES:
│   ├── vite.config.js                  ← Replaced by astro.config.mjs
│   ├── postcss.config.js              ← Handled by Astro/Tailwind integration
│   ├── tailwind.config.js             ← Migrated into astro config or Tailwind v4 CSS
│   ├── src/main.jsx                   ← No longer needed
│   ├── src/App.jsx                    ← No longer needed
│   ├── src/App.css                    ← Empty, not needed
│   ├── src/index.css                  ← Replaced by src/styles/global.css
│   ├── src/components/SEO.jsx         ← Replaced by Astro head management
│   ├── src/components/ScrollToTop.jsx ← Not needed (no SPA routing)
│   ├── src/components/Clients.jsx     ← Unused
│   └── index.html                     ← Replaced by Astro layouts
```

---

## 5. Configuration Files

### astro.config.mjs
```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
// If using Tailwind 4:
// import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://roganov.me',

  integrations: [
    react(),
    sitemap(),
    // If using Tailwind 3 instead of 4:
    // tailwind(),
  ],

  // If using Tailwind 4:
  // vite: {
  //   plugins: [tailwindcss()],
  // },

  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false, // EN at /, RU at /ru/
    },
    fallback: {
      ru: 'en', // If /ru/ page missing, fall back to /en/ version
    },
  },
});
```

### tsconfig.json
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "strictNullChecks": true,
    "allowJs": true
  }
}
```

### src/styles/global.css

**If using Tailwind 4:**
```css
@import "tailwindcss";

/* Custom theme extensions (migrated from tailwind.config.js) */
@theme {
  --animate-blink: blink 4s steps(2, start) infinite;
  --color-brand-blue: #0F67B1;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

body {
  overflow-x: hidden;
}
```

**If staying on Tailwind 3:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  overflow-x: hidden;
}
```

If staying on Tailwind 3, also keep `tailwind.config.js` with content paths updated:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blink: 'blink 4s steps(2, start) infinite',
      },
      boxShadow: {
        'glow': '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)',
      },
      textColor: {
        glow: 'rgba(255, 255, 255, 0.8)',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
```

---

## 6. i18n System

### src/i18n/en.json
```json
{
  "nav": {
    "portfolio": "Portfolio",
    "contact": "Contact",
    "birthday2026": "Birthday 2026",
    "blog": "Blog"
  },
  "hero": {
    "greeting": "Hi there!",
    "subtitle": "My name is Ivan and I'm here to help you",
    "cta": "Let's get to know each other"
  },
  "about": {
    "name": "Ivan Roganov",
    "role": "Entrepreneur",
    "p1": "With 25 years of experience in IT, I've been programming since 1999, honing my skills and expertise across multiple areas of technology.",
    "p2": "Since 2004, I've gained hands-on programming experience. Over the years, I've developed a strong leading teams and managing projects, applying my knowledge to problem-solving approach, believing that every issue can be fixed.",
    "p3": "I have successfully managed over 20 failing IT projects in the past 15 years, turning them around and making them operational. I am confident in my ability to tackle any project, no matter how challenging.",
    "p4": "There isn't a program that can't be fixed, and there isn't an IT system that can't be made operational.",
    "p5": "In my career, I've learned that no program is beyond repair, and no IT system is beyond restoration. There's always a way to fix it and make it better."
  },
  "banner": {
    "items": [
      "25+ years of experience",
      "20 Projects",
      "6 teams",
      "Over $1M saved in production costs",
      "100+ articles",
      "3 companies founded",
      "6 years of education experience",
      "10000+ hours of volunteer work"
    ]
  },
  "superhero": {
    "roles": [
      {
        "title": "Problem Solver",
        "subtitle": "You can always fix this",
        "image": "/img/hero0.png",
        "description": "Veteran IT troubleshooter with over 20 recovered failing projects in 15 years. Specialized in modernizing legacy systems, from 1990s databases to modern architectures, with a perfect track record of making any system operational again. No IT challenge too complex to solve."
      },
      {
        "title": "Educator",
        "subtitle": "Teaching is about understanding",
        "image": "/img/hero1.png",
        "description": "Dedicated educator with 6 years of global teaching experience and over 5,000 hours of mentoring. From university lectures to one-on-one sessions, successfully guided thousands of students through computer programming and game development, maintaining a remarkable 97.5% success rate."
      },
      {
        "title": "Writer",
        "subtitle": "Every story deserves to be told",
        "image": "/img/hero2.png",
        "description": "Prolific writer with over 1 million words published and read. Distinguished contributor to habr.com with 100+ articles reaching over 1 million readers. Active writer across multiple platforms including LinkedIn, Medium, and Telegram, crafting content that ranges from technical documentation to personal narratives."
      },
      {
        "title": "Volunteer",
        "subtitle": "Making a difference, one person at a time",
        "image": "/img/hero3.png",
        "description": "Dedicated volunteer with over 1,000 hours of community service in three years, impacting over 10,000 lives. From pandemic relief efforts to community cleanup projects, committed to hands-on involvement in various humanitarian initiatives that make a real difference in people's lives."
      },
      {
        "title": "Hobby Enthusiast",
        "subtitle": "Life is meant to be enjoyed together",
        "image": "/img/hero4.png",
        "description": "Versatile enthusiast combining professional paintball experience with passion for bringing people together through games and events. Proven track record of organizing large-scale gatherings, including a 120-person event, and completing ambitious adventures like coast-to-coast drives."
      },
      {
        "title": "Entrepreneur",
        "subtitle": "Building solutions for tomorrow",
        "image": "",
        "description": "Founder of multiple successful ventures including IFC LLC, providing comprehensive IT solutions with a team of seven professionals, and IGAP LLC, specializing in arts and crafts services. Focused on delivering high-quality, client-centered solutions across diverse industries."
      }
    ]
  },
  "contact": {
    "title": "Get in Touch",
    "services": [
      "Software development. Solving any IT-related problems",
      "Business and entertainment event organization",
      "Professional in-time translation",
      "A/V equipment setups and training",
      "Personal consultation",
      "Anything I can help you with"
    ],
    "callText": "Just give me a call,",
    "callText2": "I would love to hear from you",
    "downloadCard": "Download Contact Card",
    "addToIOS": "Add to iOS Contacts",
    "scanToAdd": "Scan to add contact"
  },
  "footer": {
    "copyright": "IFC LLC. All rights reserved."
  },
  "blog": {
    "title": "Blog",
    "readMore": "Read more",
    "publishedOn": "Published on",
    "backToBlog": "Back to Blog"
  },
  "language": {
    "switchTo": "Показать по-русски",
    "current": "English"
  }
}
```

### src/i18n/ru.json
```json
{
  "nav": {
    "portfolio": "Портфолио",
    "contact": "Контакт",
    "birthday2026": "День Рождения 2026",
    "blog": "Блог"
  },
  "hero": {
    "greeting": "Привет!",
    "subtitle": "Меня зовут Иван и я здесь, чтобы помочь вам",
    "cta": "Давайте познакомимся"
  },
  "about": {
    "name": "Иван Роганов",
    "role": "Предприниматель",
    "p1": "С 25-летним опытом в IT, я программирую с 1999 года, оттачивая свои навыки и знания в различных областях технологий.",
    "p2": "С 2004 года я получил практический опыт программирования. За эти годы я развил сильные навыки в руководстве командами и управлении проектами, применяя свои знания к решению проблем, веря, что любую проблему можно решить.",
    "p3": "Я успешно управлял более чем 20 проваливающимися IT-проектами за последние 15 лет, разворачивая их и делая рабочими. Я уверен в своей способности справиться с любым проектом, каким бы сложным он ни был.",
    "p4": "Нет программы, которую нельзя исправить, и нет IT-системы, которую нельзя сделать рабочей.",
    "p5": "За свою карьеру я понял, что ни одна программа не является неисправимой, и ни одна IT-система не является невосстановимой. Всегда есть способ исправить и сделать лучше."
  },
  "banner": {
    "items": [
      "25+ лет опыта",
      "20 проектов",
      "6 команд",
      "Более $1M сэкономлено на производстве",
      "100+ статей",
      "3 компании основаны",
      "6 лет преподавательского опыта",
      "10000+ часов волонтёрской работы"
    ]
  },
  "contact": {
    "title": "Связаться",
    "services": [
      "Разработка программного обеспечения. Решение любых IT-задач",
      "Организация деловых и развлекательных мероприятий",
      "Профессиональный синхронный перевод",
      "Настройка аудио/видео оборудования и обучение",
      "Персональная консультация",
      "Всё, чем могу помочь"
    ],
    "callText": "Просто позвоните мне,",
    "callText2": "буду рад вашему звонку",
    "downloadCard": "Скачать контакт",
    "addToIOS": "Добавить в контакты iOS",
    "scanToAdd": "Сканируйте для добавления контакта"
  },
  "footer": {
    "copyright": "IFC LLC. Все права защищены."
  },
  "blog": {
    "title": "Блог",
    "readMore": "Читать далее",
    "publishedOn": "Опубликовано",
    "backToBlog": "Назад к блогу"
  },
  "language": {
    "switchTo": "Switch to English",
    "current": "Русский"
  }
}
```

**Note:** The Russian `superhero.roles` can be added later if you want to translate those descriptions. The `fallback` config in Astro means the English content will show if Russian pages don't exist.

### src/i18n/utils.js
```js
import en from './en.json';
import ru from './ru.json';

const translations = { en, ru };

export function getLangFromUrl(url) {
  const [, lang] = url.pathname.split('/');
  if (lang === 'ru') return 'ru';
  return 'en';
}

export function useTranslations(lang) {
  return function t(key) {
    const keys = key.split('.');
    let value = translations[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
}

export function getLocalePath(lang, path = '') {
  if (lang === 'en') return `/${path}`;
  return `/ru/${path}`;
}

export function getAlternateLang(lang) {
  return lang === 'en' ? 'ru' : 'en';
}
```

---

## 7. Content Collections (Blog)

### src/content.config.ts
```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    lang: z.enum(['en', 'ru']),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { blog };
```

### Blog Content Directory

Create the directory structure:
```
src/data/blog/
  qualiflation/
    en.md
    ru.md        ← optional, only if you translate it
  another-post/
    en.md
```

### Migrate Existing Blog Post

Move `public/blog/2020.04.01-qualiflation.md` to `src/data/blog/qualiflation/en.md` and add frontmatter at the top:

```markdown
---
title: "Qualiflation"
slug: "qualiflation"
date: 2020-04-01
description: "What happens when the result of your actions amounts to nothing? A look at how quality degradation affects our economy and our lives."
lang: "en"
tags: ["economics", "quality", "opinion"]
---

### My Kid

What happens when the result of your actions amounts to nothing? Let me demonstrate.

... (rest of the existing content, remove the `# Qualiflation` H1 heading since the layout will render the title)
```

### How Slugs Work

The `slug` field in frontmatter controls the URL. The file can be named anything — what matters is the `slug` value.

Example: A file at `src/data/blog/qualiflation/en.md` with `slug: "qualiflation"` produces:
- English: `/blog/qualiflation/`
- Russian: `/ru/blog/qualiflation/` (if `ru.md` exists with same slug)

---

## 8. Layouts

### src/layouts/BaseLayout.astro
The root HTML wrapper. All pages use this.

```astro
---
import '../styles/global.css';
import { profile } from '../config/profile.js';

interface Props {
  title?: string;
  description?: string;
  image?: string;
  lang?: string;
  canonicalPath?: string;
  alternateLangPath?: string;
  alternateLang?: string;
}

const {
  title = profile.meta.title,
  description = profile.meta.description,
  image = '/ivan.png',
  lang = 'en',
  canonicalPath = '',
  alternateLangPath,
  alternateLang,
} = Astro.props;

const siteUrl = 'https://roganov.me';
const canonicalUrl = `${siteUrl}${canonicalPath}`;
const imageUrl = `${siteUrl}${image}`;
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="canonical" href={canonicalUrl} />

    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={profile.meta.keywords.join(', ')} />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:type" content="website" />
    <meta property="og:image" content={imageUrl} />
    <meta property="og:site_name" content={profile.company} />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={imageUrl} />

    <!-- hreflang for i18n -->
    {alternateLangPath && alternateLang && (
      <link rel="alternate" hreflang={alternateLang} href={`${siteUrl}${alternateLangPath}`} />
    )}
    <link rel="alternate" hreflang={lang} href={canonicalUrl} />

    <!-- Structured Data (JSON-LD) -->
    <script type="application/ld+json" set:html={JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.name,
      alternateName: profile.aliases,
      url: siteUrl,
      image: imageUrl,
      sameAs: [
        profile.social.linkedin,
        profile.social.medium,
        profile.social.telegram,
      ],
      jobTitle: profile.position,
      worksFor: {
        "@type": "Organization",
        name: profile.company,
        alternateName: "IFCLLC",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Clearwater",
        addressRegion: "FL",
        addressCountry: "US",
      },
      email: profile.contact.email,
      telephone: profile.contact.phone,
    })} />

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-3WR8FYRV2N"></script>
    <script is:inline>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-3WR8FYRV2N');
    </script>

    <!-- Hash route redirect for backwards compatibility -->
    <script is:inline>
      if (window.location.hash && window.location.hash.startsWith('#/')) {
        var newPath = window.location.hash.slice(1);
        window.location.replace(newPath);
      }
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

### src/layouts/PageLayout.astro
Wraps pages with NavBar and Footer.

```astro
---
import BaseLayout from './BaseLayout.astro';
import NavBar from '../components/NavBar.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title?: string;
  description?: string;
  image?: string;
  lang?: string;
  canonicalPath?: string;
  alternateLangPath?: string;
  alternateLang?: string;
}

const props = Astro.props;
---

<BaseLayout {...props}>
  <div class="min-h-screen">
    <NavBar lang={props.lang || 'en'} />
    <slot />
    <Footer lang={props.lang || 'en'} />
  </div>
</BaseLayout>
```

### src/layouts/BlogPostLayout.astro
Layout for individual blog posts.

```astro
---
import PageLayout from './PageLayout.astro';
import { useTranslations, getLocalePath, getAlternateLang } from '../i18n/utils.js';

interface Props {
  title: string;
  date: Date;
  description: string;
  lang: string;
  slug: string;
  tags?: string[];
}

const { title, date, description, lang, slug, tags } = Astro.props;
const t = useTranslations(lang);
const altLang = getAlternateLang(lang);
---

<PageLayout
  title={`${title} | Blog`}
  description={description}
  lang={lang}
  canonicalPath={getLocalePath(lang, `blog/${slug}/`)}
  alternateLangPath={getLocalePath(altLang, `blog/${slug}/`)}
  alternateLang={altLang}
>
  <article class="max-w-3xl mx-auto px-4 py-16">
    <header class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
      <time class="text-gray-500" datetime={date.toISOString()}>
        {t('blog.publishedOn')}: {date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>
      {tags && tags.length > 0 && (
        <div class="flex gap-2 mt-2">
          {tags.map((tag) => (
            <span class="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">{tag}</span>
          ))}
        </div>
      )}
    </header>

    <div class="prose prose-lg max-w-none">
      <slot />
    </div>

    <footer class="mt-12 pt-8 border-t border-gray-200">
      <a href={getLocalePath(lang, 'blog/')} class="text-blue-600 hover:text-blue-800">
        &larr; {t('blog.backToBlog')}
      </a>
    </footer>
  </article>
</PageLayout>
```

**Note:** For `prose` class to work, install `@tailwindcss/typography`:
```bash
npm install @tailwindcss/typography
```
And add it to your Tailwind config plugins (Tailwind 3) or import it in your CSS (Tailwind 4).

---

## 9. Pages — Routing

### src/pages/index.astro (English Homepage)
```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import Hero from '../components/Hero.astro';
import About from '../components/About.astro';
import Banner from '../components/Banner.jsx';
import Superhero from '../components/Superhero.astro';
import Contact from '../components/Contact.jsx';
import { useTranslations } from '../i18n/utils.js';

const lang = 'en';
const t = useTranslations(lang);
---

<PageLayout
  lang={lang}
  canonicalPath="/"
  alternateLangPath="/ru/"
  alternateLang="ru"
>
  <Hero lang={lang} />
  <About lang={lang} />
  <Banner client:visible items={t('banner.items')} />
  <Superhero lang={lang} />
  <Contact client:visible lang={lang} />
</PageLayout>
```

### src/pages/ru/index.astro (Russian Homepage)
```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import Hero from '../../components/Hero.astro';
import About from '../../components/About.astro';
import Banner from '../../components/Banner.jsx';
import Superhero from '../../components/Superhero.astro';
import Contact from '../../components/Contact.jsx';
import { useTranslations } from '../../i18n/utils.js';

const lang = 'ru';
const t = useTranslations(lang);
---

<PageLayout
  lang={lang}
  canonicalPath="/ru/"
  alternateLangPath="/"
  alternateLang="en"
>
  <Hero lang={lang} />
  <About lang={lang} />
  <Banner client:visible items={t('banner.items')} />
  <Superhero lang={lang} />
  <Contact client:visible lang={lang} />
</PageLayout>
```

### src/pages/blog/index.astro (English Blog Listing)
```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import { getCollection } from 'astro:content';
import { useTranslations } from '../../i18n/utils.js';

const lang = 'en';
const t = useTranslations(lang);

const posts = (await getCollection('blog', ({ data }) => {
  return data.lang === 'en' && !data.draft;
})).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

<PageLayout
  title={`${t('blog.title')} | Ivan Roganov`}
  lang={lang}
  canonicalPath="/blog/"
  alternateLangPath="/ru/blog/"
  alternateLang="ru"
>
  <div class="max-w-3xl mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold text-gray-900 mb-8">{t('blog.title')}</h1>

    <div class="space-y-8">
      {posts.map((post) => (
        <article class="border-b border-gray-200 pb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            <a href={`/blog/${post.data.slug}/`} class="hover:text-blue-600">
              {post.data.title}
            </a>
          </h2>
          <time class="text-gray-500 text-sm" datetime={post.data.date.toISOString()}>
            {post.data.date.toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </time>
          <p class="mt-2 text-gray-700">{post.data.description}</p>
          <a href={`/blog/${post.data.slug}/`} class="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block">
            {t('blog.readMore')} &rarr;
          </a>
        </article>
      ))}
    </div>
  </div>
</PageLayout>
```

### src/pages/blog/[slug].astro (English Blog Post)
```astro
---
import BlogPostLayout from '../../layouts/BlogPostLayout.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => {
    return data.lang === 'en' && !data.draft;
  });

  return posts.map((post) => ({
    params: { slug: post.data.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<BlogPostLayout
  title={post.data.title}
  date={post.data.date}
  description={post.data.description}
  lang="en"
  slug={post.data.slug}
  tags={post.data.tags}
>
  <Content />
</BlogPostLayout>
```

### src/pages/ru/blog/index.astro (Russian Blog Listing)
Same pattern as English but with `lang = 'ru'` and filtering for `data.lang === 'ru'`. Links point to `/ru/blog/${slug}/`.

### src/pages/ru/blog/[slug].astro (Russian Blog Post)
Same pattern as English but filtering for `data.lang === 'ru'` and using `lang="ru"`.

### src/pages/birthday-2025.astro (English)
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import NavBar from '../components/NavBar.astro';
import Footer from '../components/Footer.astro';
import Birthday from '../components/Birthday.jsx';
---

<BaseLayout
  title="Ivan's Birthday Party 2025"
  description="Birthday celebration at Fred Howard Park"
  lang="en"
  canonicalPath="/birthday-2025/"
  alternateLangPath="/ru/birthday-2025/"
  alternateLang="ru"
>
  <div class="min-h-screen flex flex-col">
    <NavBar lang="en" />
    <Birthday client:load language="en" />
    <Footer lang="en" />
  </div>
</BaseLayout>
```

### src/pages/ru/birthday-2025.astro (Russian)
Same but with `lang="ru"`, `language="ru"`, swapped alternate paths.

### src/pages/birthday-2026.astro and src/pages/ru/birthday-2026.astro
Same pattern using Birthday2026 component.

---

## 10. Component Migration

### Components That Become Static Astro

#### src/components/NavBar.astro
```astro
---
import { useTranslations, getLocalePath, getAlternateLang } from '../i18n/utils.js';
import NavBarMobile from './NavBarMobile.jsx';

interface Props {
  lang?: string;
}

const { lang = 'en' } = Astro.props;
const t = useTranslations(lang);
const altLang = getAlternateLang(lang);
---

<div class="w-full z-50 bg-[#0F67B1] border border-transparent shadow-input flex justify-between items-center px-4 py-2 sm:px-8 sm:py-6 max-w-full mx-auto sticky top-0">
  <!-- Logo -->
  <div class="w-1/3 ml-4">
    <a href={getLocalePath(lang)} class="text-white font-bold text-xl"></a>
  </div>

  <!-- Desktop Menu -->
  <div class="hidden sm:flex items-center space-x-6 w-2/3 justify-end mr-4">
    <a href={`${getLocalePath(lang)}#superhero`} class="cursor-pointer text-white hover:opacity-[0.9]">
      {t('nav.portfolio')}
    </a>
    <a href={`${getLocalePath(lang)}#contact`} class="cursor-pointer text-white hover:opacity-[0.9]">
      {t('nav.contact')}
    </a>
    <a href={getLocalePath(lang, 'blog/')} class="cursor-pointer text-white hover:opacity-[0.9]">
      {t('nav.blog')}
    </a>
    <a href={getLocalePath(lang, 'birthday-2026/')} class="cursor-pointer text-white hover:opacity-[0.9]">
      {t('nav.birthday2026')}
    </a>
    <!-- Language Switch -->
    <a href={getLocalePath(altLang)} class="cursor-pointer text-white hover:opacity-[0.9] border border-white/30 px-2 py-1 rounded text-sm">
      {t('language.switchTo')}
    </a>
  </div>

  <!-- Mobile Menu (React island for interactivity) -->
  <NavBarMobile client:load lang={lang} />
</div>
```

#### src/components/NavBarMobile.jsx (NEW — React island)
```jsx
import { useState } from 'react';

export default function NavBarMobile({ lang }) {
  const [isOpen, setIsOpen] = useState(false);

  // Import translations inline to keep it simple
  const labels = lang === 'ru'
    ? { portfolio: 'Портфолио', contact: 'Контакт', blog: 'Блог', birthday: 'День Рождения 2026', switchLang: 'Switch to English' }
    : { portfolio: 'Portfolio', contact: 'Contact', blog: 'Blog', birthday: 'Birthday 2026', switchLang: 'Показать по-русски' };

  const base = lang === 'ru' ? '/ru' : '';
  const altBase = lang === 'ru' ? '' : '/ru';

  return (
    <>
      <div className="sm:hidden rounded-full flex items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>

      {isOpen && (
        <div className="sm:hidden absolute top-11 right-0 w-52 bg-[#0F67B1] shadow-lg z-50">
          <ul className="space-y-4 text-left">
            <li><a href={`${base}/#superhero`} className="cursor-pointer text-white hover:opacity-90 px-2 mt-2 block">{labels.portfolio}</a></li>
            <li><a href={`${base}/#contact`} className="cursor-pointer text-white hover:opacity-90 px-2 block">{labels.contact}</a></li>
            <li><a href={`${base}/blog/`} className="cursor-pointer text-white hover:opacity-90 px-2 block">{labels.blog}</a></li>
            <li><a href={`${base}/birthday-2026/`} className="cursor-pointer text-white hover:opacity-90 px-2 block">{labels.birthday}</a></li>
            <li><a href={`${altBase}/`} className="cursor-pointer text-white hover:opacity-90 px-2 mb-2 block border-t border-white/20 pt-2">{labels.switchLang}</a></li>
          </ul>
        </div>
      )}
    </>
  );
}
```

#### src/components/Hero.astro
```astro
---
import { useTranslations } from '../i18n/utils.js';
import heroImage from '../assets/Hero.jpeg';

interface Props {
  lang?: string;
}

const { lang = 'en' } = Astro.props;
const t = useTranslations(lang);
---

<div class="relative w-full h-[calc(100vh_-_74px)]">
  <div class="absolute inset-0 bg-cover bg-center" style={`background-image: url(${heroImage.src})`}></div>
  <div class="absolute inset-0 bg-blue-900/50"></div>

  <div class="relative h-full flex flex-col items-center justify-center p-6 md:p-16 space-y-6">
    <div class="flex flex-col items-center space-y-4 text-center max-w-3xl">
      <h1 class="text-[28px] md:text-[40px] text-white font-lexend-heading font-normal">
        {t('hero.greeting')}
      </h1>
      <h2 class="text-[24px] md:text-[32px] text-white font-lexend-subheading font-normal">
        {t('hero.subtitle')}
      </h2>
      <p class="text-[20px] md:text-[24px] text-white font-lexend-text font-normal">
        {t('hero.cta')}
      </p>
    </div>

    <a href="#about" class="bg-transparent text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:bg-[#504099] transition-all text-2xl md:text-3xl border-2 border-white mt-8" aria-label="Scroll to About section">
      &darr;
    </a>
  </div>
</div>
```

#### src/components/About.astro
```astro
---
import { useTranslations } from '../i18n/utils.js';

interface Props {
  lang?: string;
}

const { lang = 'en' } = Astro.props;
const t = useTranslations(lang);
---

<div id="about" class="bg-[#fafbfb] w-full h-auto md:h-screen flex flex-col md:flex-row">
  <div class="w-full md:mb-24 lg:mb-0 relative flex flex-col items-center justify-center">
    <img src="/ivan.png" alt={t('about.name')} class="w-2/3 h-2/3 mt-10 max-w-2/3 rounded-lg object-contain" />
    <div class="mt-4 text-center text-black">
      <p class="font-bold text-lg">{t('about.name')}</p>
      <p class="text-sm">{t('about.role')}</p>
    </div>
  </div>

  <div class="w-full flex flex-col items-center justify-center">
    <div class="w-3/4 md:w-3/4 md:mt-16 lg:mt-0 max-w-3xl">
      <p class="text-lg">{t('about.p1')}</p>
      <p class="mb-4 text-lg">{t('about.p2')}</p>
      <p class="mb-4 text-lg">{t('about.p3')}</p>
      <p class="mb-4 text-lg">{t('about.p4')}</p>
      <p class="lg:mb-10 md:mb-8 text-lg">{t('about.p5')}</p>
    </div>
  </div>
</div>
```

#### src/components/Footer.astro
```astro
---
import { useTranslations } from '../i18n/utils.js';

interface Props {
  lang?: string;
}

const { lang = 'en' } = Astro.props;
const t = useTranslations(lang);
const year = new Date().getFullYear();
---

<footer class="bg-gray-800 text-white py-4">
  <div class="container mx-auto text-center">
    <p>&copy; {year} {t('footer.copyright')}</p>
  </div>
</footer>
```

#### src/components/Superhero.astro
```astro
---
import HeroCard from './HeroCard.astro';
import HeroRow from './HeroRow.astro';
import { useTranslations } from '../i18n/utils.js';

interface Props {
  lang?: string;
}

const { lang = 'en' } = Astro.props;
const t = useTranslations(lang);
const roles = t('superhero.roles');

// If roles doesn't exist in translation (e.g., ru.json hasn't defined it yet),
// fall back to English
import en from '../i18n/en.json';
const heroesData = Array.isArray(roles) ? roles : en.superhero.roles;

const fallbackImage = "https://images.pexels.com/photos/1105379/pexels-photo-1105379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
const cardClassName = "h-auto sm:h-[300px] lg:h-[500px]";
---

<div id="superhero" class="min-h-screen bg-[#e4eef7] text-white flex flex-col">
  <HeroRow layout="split">
    <HeroCard heroData={heroesData[0]} fallbackImage={fallbackImage} className={cardClassName} />
    <HeroCard heroData={heroesData[1]} fallbackImage={fallbackImage} className={cardClassName} />
  </HeroRow>

  <HeroRow layout="full" className="bg-[#d4e2f5]">
    <HeroCard heroData={heroesData[3]} fallbackImage={fallbackImage} className={cardClassName} />
  </HeroRow>

  <HeroRow layout="split">
    <HeroCard heroData={heroesData[2]} fallbackImage={fallbackImage} className={cardClassName} />
    <HeroCard heroData={heroesData[4]} fallbackImage={fallbackImage} className={cardClassName} />
  </HeroRow>

  <HeroRow layout="full">
    <HeroCard heroData={heroesData[5]} fallbackImage={fallbackImage} className={cardClassName} />
  </HeroRow>
</div>
```

#### src/components/HeroCard.astro
```astro
---
interface Props {
  heroData: {
    title: string;
    subtitle: string;
    image?: string;
    description: string;
  };
  className?: string;
  fallbackImage?: string;
}

const { heroData, className = '', fallbackImage } = Astro.props;
const { image, description, title, subtitle } = heroData;
const displayImage = image || fallbackImage;
---

<div class={`flex flex-col m-5 md:flex-row rounded-lg overflow-hidden shadow-lg ${className}`}>
  {displayImage && (
    <div class="w-full md:w-1/2">
      <img src={displayImage} alt={title} class="w-full h-full object-cover" />
    </div>
  )}

  <div class={`w-full ${displayImage ? 'md:w-1/2' : 'w-full'} p-6 bg-gray-100 flex flex-col`}>
    {(title || subtitle) && (
      <div class="mb-4">
        {title && <h3 class="text-2xl font-bold text-gray-800 mb-1">{title}</h3>}
        {subtitle && <h4 class="text-lg text-gray-600 italic">{subtitle}</h4>}
      </div>
    )}
    <p class="text-gray-700 flex-grow">{description}</p>
  </div>
</div>
```

#### src/components/HeroRow.astro
```astro
---
interface Props {
  layout?: 'full' | 'split';
  className?: string;
}

const { layout = 'full', className = '' } = Astro.props;
const childClass = layout === 'split' ? 'md:w-1/2' : 'md:w-full';
---

<div class={`flex flex-col md:flex-row w-full gap-4 ${className}`}>
  <slot />
</div>
```

**Note about HeroRow:** In the Astro version, the `split` layout class won't automatically apply to slotted children the way React's `React.Children.map` does. Instead, wrap each HeroCard in a div with the appropriate class in Superhero.astro, or use CSS grid:

Alternative approach for Superhero.astro using grid:
```astro
<div id="superhero" class="min-h-screen bg-[#e4eef7] text-white flex flex-col">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <HeroCard heroData={heroesData[0]} fallbackImage={fallbackImage} className={cardClassName} />
    <HeroCard heroData={heroesData[1]} fallbackImage={fallbackImage} className={cardClassName} />
  </div>

  <div class="bg-[#d4e2f5]">
    <HeroCard heroData={heroesData[3]} fallbackImage={fallbackImage} className={cardClassName} />
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <HeroCard heroData={heroesData[2]} fallbackImage={fallbackImage} className={cardClassName} />
    <HeroCard heroData={heroesData[4]} fallbackImage={fallbackImage} className={cardClassName} />
  </div>

  <div>
    <HeroCard heroData={heroesData[5]} fallbackImage={fallbackImage} className={cardClassName} />
  </div>
</div>
```

### Components That Stay as React Islands

These components remain as `.jsx` files and are used with client directives in Astro pages.

#### Banner.jsx
Keep the existing `Banner.jsx` as-is. Use it in Astro pages with:
```astro
<Banner client:visible items={t('banner.items')} />
```

The `client:visible` directive means the JS only loads when the banner scrolls into view.

#### Contact.jsx
Modify the existing `Contact.jsx` to accept a `lang` prop and use translations from props or import the JSON directly:

```jsx
// At the top of Contact.jsx, add:
import en from '../i18n/en.json';
import ru from '../i18n/ru.json';

export const Contact = ({ lang = 'en' }) => {
  const strings = lang === 'ru' ? ru.contact : en.contact;
  // ... replace hardcoded strings with strings.title, strings.services, etc.
```

Use in Astro:
```astro
<Contact client:visible lang={lang} />
```

**Important:** Remove the `import { useNavigate } from "react-router-dom"` from any React component. Replace any `navigate()` calls with plain `<a href="...">` links.

#### Birthday.jsx and Birthday2026.jsx
These are already bilingual. Modify them to:
1. Remove `import { NavBar }` and `import { Footer }` — the Astro page wrapper handles those
2. Accept `language` as a prop instead of reading from URL params
3. Remove the NavBar and Footer rendering from within the component
4. Export as default: `export default function Birthday({ language = 'en' }) { ... }`

The Astro page wrapper provides NavBar/Footer. The component just renders the content area.

Use in Astro:
```astro
<Birthday client:load language="en" />
```

Use `client:load` (not `client:visible`) because birthday pages have above-the-fold interactive content.

---

## 11. Static Assets

### Files That Stay in `public/`
All of these are copied as-is to `dist/`:
- `public/img/` — hero images
- `public/ivan.png` — profile photo
- `public/park-2025.png` — birthday 2025 event image
- `public/park-2026.jpg` — birthday 2026 event image
- `public/favicon.png` — favicon
- `public/robots.txt` — SEO robots file

### Files That Move
- `public/blog/2020.04.01-qualiflation.md` → `src/data/blog/qualiflation/en.md` (with frontmatter added)

### Update robots.txt
```
User-agent: *
Allow: /
Sitemap: https://roganov.me/sitemap-index.xml
```

(Astro's sitemap integration generates `sitemap-index.xml` by default.)

### Delete the Old Static sitemap.xml
Remove `public/sitemap.xml` — Astro's `@astrojs/sitemap` integration will auto-generate it at build time based on all your pages.

---

## 12. Hash Route Backwards Compatibility

The old site uses HashRouter, so existing links look like:
- `https://roganov.me/#/birthday-2025`
- `https://roganov.me/#/birthday-2026`

The redirect script in `BaseLayout.astro` handles this:
```html
<script is:inline>
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    var newPath = window.location.hash.slice(1);
    window.location.replace(newPath);
  }
</script>
```

This converts:
- `/#/birthday-2025` → `/birthday-2025/`
- `/#/birthday-2026` → `/birthday-2026/`

The `is:inline` directive ensures Astro doesn't process or bundle this script — it runs immediately in the browser.

---

## 13. SEO Migration

### What Gets Replaced

| Old (React) | New (Astro) |
|---|---|
| `<SEO />` component with React Helmet | `<head>` in BaseLayout.astro |
| `react-ga4` initialization in App.jsx | Inline `<script>` in BaseLayout.astro |
| Static `public/sitemap.xml` | Auto-generated by `@astrojs/sitemap` |
| JSON-LD in React Helmet `<script>` | `<script type="application/ld+json">` in BaseLayout.astro |

### Per-Page SEO
Each page passes `title`, `description`, `canonicalPath`, and alternate language paths to the layout. Blog posts get their own title and description from frontmatter.

### hreflang Tags
Every page includes `<link rel="alternate" hreflang="...">` tags pointing to the other language version. This is handled in BaseLayout.astro via the `alternateLangPath` and `alternateLang` props.

---

## 14. Google Analytics

GA4 is set up as inline scripts in BaseLayout.astro (shown in Section 8). The tracking ID is `G-3WR8FYRV2N`.

No React dependency needed. The `is:inline` directive on the script tags ensures they work as traditional inline scripts that execute immediately.

---

## 15. Deploy Script Update

The existing `deploy.sh` needs minimal changes. Astro also outputs to `dist/` by default, so the S3 sync commands stay the same.

Update the build command:
```bash
# Change this line:
npm run build
# It now runs `astro build` instead of `vite build` (via package.json scripts)
```

No other changes needed. The sync logic, cache headers, and bucket name all stay the same.

---

## 16. Files to Delete

After migration is complete and verified, delete these files:

```
# Old Vite/React infrastructure
src/main.jsx
src/App.jsx
src/App.css
src/index.css
index.html
vite.config.js
postcss.config.js              # Only if using Tailwind 4 (handled by Vite plugin)

# Old components replaced by Astro equivalents
src/components/SEO.jsx
src/components/ScrollToTop.jsx
src/components/Clients.jsx     # Already unused
src/components/Footter.jsx     # Replaced by Footer.astro (fixing typo)
src/components/navbar/NavBar.jsx  # Replaced by NavBar.astro + NavBarMobile.jsx
src/components/hero/Hero.jsx   # Replaced by Hero.astro
src/components/About.jsx       # Replaced by About.astro
src/components/Superhero.jsx   # Replaced by Superhero.astro
src/components/hero/HeroCard.jsx  # Replaced by HeroCard.astro
src/components/hero/HeroRow.jsx   # Replaced by HeroRow.astro
src/components/contact/ContactDownload.jsx  # Functionality merged into Contact.jsx

# Old static content (moved to content collections)
public/blog/2020.04.01-qualiflation.md

# Old static sitemap (auto-generated now)
public/sitemap.xml
```

Keep `tailwind.config.js` if staying on Tailwind 3.

---

## 17. Migration Checklist

Execute in this order:

- [ ] 1. Create `astro-migration` branch
- [ ] 2. Install Astro, @astrojs/react, @astrojs/sitemap, Tailwind integration
- [ ] 3. Create `astro.config.mjs`
- [ ] 4. Create `tsconfig.json`
- [ ] 5. Create `src/styles/global.css` with Tailwind directives
- [ ] 6. Create `src/i18n/en.json`, `ru.json`, and `utils.js`
- [ ] 7. Create `src/content.config.ts`
- [ ] 8. Move blog post to `src/data/blog/qualiflation/en.md` with frontmatter
- [ ] 9. Create `src/layouts/BaseLayout.astro` (with GA, hash redirect, SEO)
- [ ] 10. Create `src/layouts/PageLayout.astro`
- [ ] 11. Create `src/layouts/BlogPostLayout.astro`
- [ ] 12. Create static Astro components: NavBar.astro, Footer.astro, Hero.astro, About.astro, Superhero.astro, HeroCard.astro, HeroRow.astro
- [ ] 13. Create NavBarMobile.jsx (React island)
- [ ] 14. Modify Banner.jsx — remove any React Router imports, ensure it works standalone
- [ ] 15. Modify Contact.jsx — add `lang` prop, remove React Router imports, import i18n strings
- [ ] 16. Modify Birthday.jsx — remove NavBar/Footer rendering, accept `language` prop, export as default
- [ ] 17. Modify Birthday2026.jsx — same as Birthday.jsx
- [ ] 18. Create English pages: `src/pages/index.astro`, `blog/index.astro`, `blog/[slug].astro`, `birthday-2025.astro`, `birthday-2026.astro`
- [ ] 19. Create Russian pages: `src/pages/ru/index.astro`, `ru/blog/index.astro`, `ru/blog/[slug].astro`, `ru/birthday-2025.astro`, `ru/birthday-2026.astro`
- [ ] 20. Update `package.json` scripts
- [ ] 21. Remove unused dependencies
- [ ] 22. Delete old files (listed in Section 16)
- [ ] 23. Update `public/robots.txt` sitemap URL
- [ ] 24. Remove `public/sitemap.xml`
- [ ] 25. Run `npm run build` — verify no errors
- [ ] 26. Run `npm run preview` — test all pages
- [ ] 27. Verify hash URL redirects work
- [ ] 28. Verify blog listing and post pages
- [ ] 29. Verify language switching on all pages
- [ ] 30. Verify mobile menu works
- [ ] 31. Verify contact QR code and vCard download
- [ ] 32. Verify birthday page calendar buttons
- [ ] 33. Run deploy

---

## 18. Testing Verification

After building, verify each of these:

### Pages Exist (check `dist/` directory)
```
dist/index.html
dist/blog/index.html
dist/blog/qualiflation/index.html
dist/birthday-2025/index.html
dist/birthday-2026/index.html
dist/ru/index.html
dist/ru/blog/index.html
dist/birthday-2025/index.html (Russian fallback or page)
dist/birthday-2026/index.html (Russian fallback or page)
dist/sitemap-index.xml
dist/robots.txt
```

### Functional Tests
1. **Homepage** — Hero, About, Banner (scrolling animation), Superhero cards, Contact section all render
2. **Blog listing** — Shows the qualiflation post with date and description
3. **Blog post** — Full article renders with proper formatting, heading, and back link
4. **Birthday pages** — Calendar buttons work (Google Calendar + iCal), maps render, bilingual content displays
5. **Navigation** — All nav links work, mobile hamburger menu opens/closes, links navigate correctly
6. **Language switching** — Clicking language switch navigates between `/` and `/ru/` versions
7. **Hash redirects** — Visiting `/#/birthday-2025` redirects to `/birthday-2025/`
8. **Contact** — QR code renders on desktop, vCard download works, Apple Contacts link works
9. **SEO** — Check `<head>` has correct title, description, OG tags, hreflang, canonical URL
10. **GA4** — Check Network tab for `gtag` request on page load
11. **Responsive** — All pages work on mobile viewports

### Performance Checks
- Blog post pages should ship **zero JavaScript** (no `client:` directives on static content)
- Homepage JS bundle should only contain: Banner (framer-motion), Contact (QR code), NavBarMobile (menu toggle)
- Birthday pages ship framer-motion JS for animations

---

## Adding New Blog Posts (Future Workflow)

To add a new blog post:

1. Create a directory under `src/data/blog/`:
```
src/data/blog/my-new-post/
  en.md
  ru.md    ← optional
```

2. Add frontmatter:
```markdown
---
title: "My New Post Title"
slug: "my-new-post"
date: 2026-02-17
description: "A short description for the listing page and SEO."
lang: "en"
tags: ["tag1", "tag2"]
---

Your markdown content here...
```

3. Build and deploy:
```bash
npm run build
bash deploy.sh
```

The post automatically appears in the blog listing and gets its own page at `/blog/my-new-post/`.
