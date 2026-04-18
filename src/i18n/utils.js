import en from './en.json';
import ru from './ru.json';

const translations = { en, ru };

export function getLangFromUrl(url) {
  const [, lang] = url.pathname.split('/');
  if (lang === 'ru') return 'ru';
  return 'en';
}

export function useTranslations(lang) {
  return function t(key) {
    const keys = key.split('.');
    let value = translations[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
}

export function getLocalePath(lang, path = '') {
  if (lang === 'en') return `/${path}`;
  return `/ru/${path}`;
}

export function getAlternateLang(lang) {
  return lang === 'en' ? 'ru' : 'en';
}

/**
 * Return the equivalent path in the other locale. Preserves the rest of the path.
 * Examples:
 *   /                       -> /ru/
 *   /ru/                    -> /
 *   /blog/                  -> /ru/blog/
 *   /ru/blog/               -> /blog/
 *   /blog/qualiflation/     -> /ru/blog/qualiflation/
 *   /ru/blog/qualiflation/  -> /blog/qualiflation/
 */
export function getAlternatePath(pathname) {
  if (!pathname || typeof pathname !== 'string') return '/';

  // Strip any leading slashes for easier reasoning, then rebuild
  const trimmed = pathname.replace(/^\/+/, '');
  const segments = trimmed.split('/');

  if (segments[0] === 'ru') {
    // RU -> EN: drop the /ru prefix
    const rest = segments.slice(1).join('/');
    return '/' + (rest ? rest : '');
  }

  // EN -> RU: prepend /ru
  return '/ru/' + trimmed;
}
