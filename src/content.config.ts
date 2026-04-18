import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/data/blog',
    // Astro 5's default generateId uses `data.slug` from frontmatter, which
    // causes `<slug>/en.md` and `<slug>/ru.md` to collide (both share the same
    // slug value). Derive the id from the file path instead so each locale is
    // a distinct entry, e.g. `qualiflation/en` and `qualiflation/ru`.
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    lang: z.enum(['en', 'ru']),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional().default(false),
    // Series membership: `series` is a stable slug shared by sibling posts,
    // `seriesOrder` is 1-indexed position within the series. Metadata for
    // rendering (display titles) lives in src/config/series.js.
    series: z.string().optional(),
    seriesOrder: z.number().int().positive().optional(),
    // Optional schema.org HowTo: declare this on tutorial posts that walk
    // through concrete steps. `name` defaults to the post title; `steps` is a
    // list of { name, text } entries. `tools`, `supply`, `totalTime` are
    // optional enrichment. When present, a HowTo JSON-LD block is emitted
    // alongside BlogPosting.
    howto: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      totalTime: z.string().optional(), // ISO 8601 duration, e.g. "PT30M"
      tools: z.array(z.string()).optional(),
      supply: z.array(z.string()).optional(),
      steps: z.array(z.object({
        name: z.string(),
        text: z.string(),
        url: z.string().optional(),
      })),
    }).optional(),
    // Optional schema.org FAQPage: list of Q&A. When present, a FAQPage
    // JSON-LD block is emitted alongside BlogPosting.
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

export const collections = { blog };
