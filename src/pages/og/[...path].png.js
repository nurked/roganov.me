import { getCollection } from 'astro:content';
import { renderOgImage } from '../../utils/ogImage.js';

/**
 * Per-post Open Graph cards. Paths:
 *   /og/blog/<slug>.png           (EN)
 *   /og/ru/blog/<slug>.png        (RU)
 *
 * Using Astro's `[...path]` rest param so we can map both locales through
 * the same endpoint cleanly.
 */
export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: {
      path:
        post.data.lang === 'ru'
          ? `ru/blog/${post.data.slug}`
          : `blog/${post.data.slug}`,
    },
    props: { post },
  }));
}

export async function GET({ props }) {
  const { post } = props;
  const png = await renderOgImage({
    title: post.data.title,
    description: post.data.description,
    tags: post.data.tags,
    date: post.data.date,
    lang: post.data.lang,
  });
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
