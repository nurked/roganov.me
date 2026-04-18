import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { profile } from '../config/profile.js';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => {
    return data.lang === 'en' && !data.draft;
  })).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: `${profile.name} — Blog`,
    description:
      'Writing on engineering, tools, writing itself, and the occasional opinion — by Ivan Roganov.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.data.slug}/`,
      categories: post.data.tags ?? [],
      author: `${profile.contact.email} (${profile.name})`,
    })),
    customData: `<language>en-us</language>
<atom:link href="${context.site}rss.xml" rel="self" type="application/rss+xml" />`,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    stylesheet: '/rss/styles.xsl',
  });
}
