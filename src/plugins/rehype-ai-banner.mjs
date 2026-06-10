import { isBannerPost, bannerHtml } from '../config/aiBanner.js';

// Injects the AI-services banner into the article body of AI/software posts:
// after the 4th top-level paragraph when the post is long enough to keep
// reading past it (6+ paragraphs), otherwise at the end of the body.
export default function rehypeAiBanner() {
  return (tree, file) => {
    const fm = file.data?.astro?.frontmatter;
    if (!fm || fm.draft || !isBannerPost(fm.tags)) return;

    const banner = { type: 'raw', value: bannerHtml(fm.lang ?? 'en') };
    const kids = tree.children;

    let paragraphs = 0;
    let insertAt = -1;
    for (let i = 0; i < kids.length; i++) {
      const n = kids[i];
      if (n.type === 'element' && n.tagName === 'p') {
        paragraphs++;
        if (paragraphs === 4) insertAt = i + 1;
      }
    }

    if (paragraphs >= 6 && insertAt >= 0) {
      kids.splice(insertAt, 0, banner);
    } else {
      kids.push(banner);
    }
  };
}
