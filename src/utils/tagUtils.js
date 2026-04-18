/**
 * Slugify a tag string into a URL-safe path segment.
 *
 * Keeps it simple: lowercase, map non-alphanumerics to hyphens, collapse,
 * trim. A couple of human-readable special cases to avoid meaningless slugs
 * (`.NET` alone would become empty after stripping dots).
 */
export function tagSlug(tag) {
  if (!tag) return '';
  const lower = String(tag).toLowerCase().trim();

  // Manual remaps for ambiguous / stripped-to-empty cases.
  const remap = {
    '.net': 'dotnet',
    'c#': 'csharp',
    'c++': 'cpp',
  };
  if (remap[lower]) return remap[lower];

  return lower
    .normalize('NFKD')
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Given an array of post entries, return a Map<slug, { label, posts }>
 * aggregating posts by tag slug. The label is the first-seen original tag
 * string (we preserve casing from the frontmatter for display).
 */
export function aggregateTags(posts) {
  const byTag = new Map();
  for (const post of posts) {
    const tags = post.data.tags ?? [];
    for (const tag of tags) {
      const slug = tagSlug(tag);
      if (!slug) continue;
      if (!byTag.has(slug)) {
        byTag.set(slug, { slug, label: tag, posts: [] });
      }
      byTag.get(slug).posts.push(post);
    }
  }
  return byTag;
}
