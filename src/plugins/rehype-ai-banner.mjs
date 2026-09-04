import { bannerHtml } from '../config/aiBanner.js';

// Injects the SkyPeck promo banner into the body of every published post:
// after the 4th top-level paragraph when the post is long enough to keep
// reading past it (6+ paragraphs), otherwise at the end of the body.
export default function rehypeAiBanner() {
  return (tree, file) => {
    const fm = file.data?.astro?.frontmatter;
    if (!fm || fm.draft) return;

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
