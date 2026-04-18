/**
 * Metadata for blog post series. The key is the `series` slug declared in a
 * post's frontmatter; each series has a display title per locale.
 *
 * Posts in the same series render a "Part N of M" navigation box at the top
 * of the post page (see src/components/SeriesNav.astro).
 */
export const series = {
  'nvme-over-network': {
    en: 'NVMe over Network',
    ru: 'NVMe по сети',
  },
  goscheduler: {
    en: 'Go scheduler internals',
    ru: 'Внутренности планировщика Go',
  },
  'blazor-useful': {
    en: 'Making Blazor useful',
    ru: 'Как сделать Blazor полезным',
  },
  'rust-2021': {
    en: 'Rust deep dive (January 2021)',
    ru: 'Погружение в Rust (январь 2021)',
  },
  'bad-advice': {
    en: 'Bad advice',
    ru: 'Вредные советы',
  },
};

/**
 * Return the localized display title for a series slug, or null if unknown.
 */
export function getSeriesTitle(slug, lang = 'en') {
  return series[slug]?.[lang] ?? series[slug]?.en ?? null;
}
