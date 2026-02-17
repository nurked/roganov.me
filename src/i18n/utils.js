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
