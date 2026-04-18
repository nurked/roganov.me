/**
 * Estimate reading time from raw markdown body.
 *
 * Strips fenced code blocks (they skew word counts upward when they're
 * dominated by identifiers) and inline code, then counts remaining word-ish
 * tokens. Uses locale-appropriate words-per-minute defaults.
 *
 * Returns `{ words, minutes }`. `minutes` is rounded up and never below 1.
 */
const WPM = {
  en: 220,
  ru: 180,
};

export function computeReadingTime(body = '', lang = 'en') {
  if (!body || typeof body !== 'string') {
    return { words: 0, minutes: 1 };
  }

  // Drop fenced code blocks entirely
  const stripped = body
    .replace(/```[\s\S]*?```/g, ' ')
    // Drop inline code spans
    .replace(/`[^`\n]+`/g, ' ')
    // Drop HTML tags that might sneak into MD
    .replace(/<[^>]+>/g, ' ');

  // Split on unicode whitespace and punctuation; count non-empty tokens that
  // contain at least one letter or digit.
  const tokens = stripped.split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t));
  const words = tokens.length;
  const wpm = WPM[lang] ?? WPM.en;
  const minutes = Math.max(1, Math.ceil(words / wpm));
  return { words, minutes };
}
