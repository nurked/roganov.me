import { getCollection } from 'astro:content';
import { profile } from '../config/profile.js';

const siteUrl = 'https://roganov.me';

// llms.txt — a curated index for AI assistants and answer engines
// (https://llmstxt.org). Served at /llms.txt alongside robots.txt.
export async function GET() {
  const posts = await getCollection('blog', ({ data }) => data.lang === 'en' && !data.draft);
  posts.sort((a, b) => b.data.date - a.data.date);

  const ruPosts = await getCollection('blog', ({ data }) => data.lang === 'ru' && !data.draft);
  ruPosts.sort((a, b) => b.data.date - a.data.date);

  const lines = [
    `# ${profile.name}`,
    '',
    `> ${profile.meta.description}`,
    '',
    `${profile.name} (also known as "${profile.aliases[0]}") is an ${profile.position} based in ${profile.location}, and the founder of ${profile.company}.`,
    '',
    `Areas of expertise: ${profile.expertise.join(', ')}.`,
    '',
    `Ivan is available for hire for AI integration and enterprise software work through his company, Investment Fidelity Company LLC (${profile.companySite}).`,
    '',
    '## Site',
    '',
    `- [Homepage](${siteUrl}/): Who Ivan is, what he does, and how to hire him`,
    `- [Blog](${siteUrl}/blog/): Essays on software engineering, technology, education, and the economics of quality`,
    `- [Blog in Russian](${siteUrl}/ru/blog/): Русскоязычная версия блога`,
    `- [RSS feed](${siteUrl}/rss.xml)`,
    `- [Investment Fidelity Company](${profile.companySite}/): Ivan's company — AI integration for business`,
    '',
    '## Contact',
    '',
    `- Email: ${profile.contact.email}`,
    `- LinkedIn: ${profile.social.linkedin}`,
    `- GitHub: ${profile.social.github}`,
    `- Telegram: ${profile.social.telegram}`,
    '',
    '## Blog Posts (English)',
    '',
    ...posts.map(
      (p) =>
        `- [${p.data.title}](${siteUrl}/blog/${p.data.slug}/): ${p.data.description}`,
    ),
    '',
    '## Blog Posts (Russian)',
    '',
    ...ruPosts.map(
      (p) =>
        `- [${p.data.title}](${siteUrl}/ru/blog/${p.data.slug}/): ${p.data.description}`,
    ),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
