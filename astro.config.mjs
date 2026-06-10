import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { readdirSync, readFileSync } from 'node:fs';
import rehypeAiBanner from './src/plugins/rehype-ai-banner.mjs';

// Per-page lastmod for the sitemap, read from blog frontmatter. A blanket
// `lastmod: new Date()` stamps every URL with the build time, which tells
// crawlers "all 380 pages changed" on every deploy — they learn to ignore
// the sitemap and burn crawl budget re-fetching unchanged pages.
const blogDir = new URL('./src/data/blog', import.meta.url);
const postDates = {};
let latestPostDate = null;
for (const entry of readdirSync(blogDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  for (const locale of ['en', 'ru']) {
    let raw;
    try {
      raw = readFileSync(new URL(`./src/data/blog/${entry.name}/${locale}.md`, import.meta.url), 'utf8');
    } catch {
      continue; // post not published in this locale
    }
    const slug = raw.match(/^slug:\s*["']?([^"'\r\n]+?)["']?\s*$/m)?.[1];
    const date = raw.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m)?.[1];
    if (!slug || !date) continue;
    const path = locale === 'ru' ? `/ru/blog/${slug}/` : `/blog/${slug}/`;
    postDates[path] = date;
    if (!latestPostDate || date > latestPostDate) latestPostDate = date;
  }
}
// Listing pages change whenever a post is published.
for (const path of ['/', '/ru/', '/blog/', '/ru/blog/']) {
  postDates[path] = latestPostDate;
}

export default defineConfig({
  site: 'https://roganov.me',

  markdown: {
    rehypePlugins: [rehypeAiBanner],
  },

  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          ru: 'ru-RU',
        },
      },
      // Tag pages are thin navigation; keeping them out of the sitemap
      // focuses crawl budget on posts (they remain linked and crawlable).
      filter: (page) => !page.includes('/blog/tags/'),
      serialize(item) {
        const date = postDates[new URL(item.url).pathname];
        if (date) item.lastmod = date;
        return item;
      },
    }),
    tailwind(),
  ],

  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
    fallback: {
      ru: 'en',
    },
  },
});
