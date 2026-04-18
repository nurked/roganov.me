import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { profile } from '../../config/profile.js';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => {
    return data.lang === 'ru' && !data.draft;
  })).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: `${profile.name} — Блог`,
    description:
      'Статьи об инженерии, инструментах, письме и собственных мнениях — Иван Роганов.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/ru/blog/${post.data.slug}/`,
      categories: post.data.tags ?? [],
      author: `${profile.contact.email} (${profile.name})`,
    })),
    customData: `<language>ru-ru</language>
<atom:link href="${context.site}ru/rss.xml" rel="self" type="application/rss+xml" />`,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    stylesheet: '/rss/styles.xsl',
  });
}
