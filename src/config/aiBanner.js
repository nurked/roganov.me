import { createRequire } from 'node:module';

// Build-time only (used by the rehype plugin): createRequire keeps JSON
// loading compatible with the Node context astro.config plugins run in.
const require = createRequire(import.meta.url);
const translations = {
  en: require('../i18n/en.json'),
  ru: require('../i18n/ru.json'),
};

export const SKYPECK_URL = 'https://skypeck.fun';

// SkyPeck promo banner, injected into the body of every published post.
// Markup mirrors the hero promo (Hero.astro); the gradient + glow animation
// lives in global.css as `.skypeck-promo` so both share it. `not-prose`
// keeps @tailwindcss/typography from restyling the banner inside the
// article's prose container. This file is in tailwind.config content globs
// so the utility classes are retained.
export function bannerHtml(lang) {
  const t = (translations[lang] ?? translations.en).skypeckBanner;
  const href = `${SKYPECK_URL}/?utm_source=roganov.me&utm_medium=blog&utm_campaign=articles`;
  return [
    `<aside class="not-prose my-12" aria-label="${t.title}">`,
    `<a href="${href}" target="_blank" rel="noopener" class="skypeck-promo group relative flex items-center gap-4 sm:gap-6 pl-5 pr-10 sm:pr-14 py-4 sm:py-5 rounded-2xl -rotate-1 hover:rotate-0 hover:scale-[1.02] transition-transform duration-300 no-underline">`,
    `<img src="/img/skypeck.png" alt="" width="96" height="96" loading="lazy" class="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-4 border-white/80 shadow-xl animate-bounce shrink-0" />`,
    `<span class="text-left leading-tight">`,
    `<span class="block text-lg sm:text-2xl font-extrabold uppercase tracking-wide text-[#052e0f]">${t.title}</span>`,
    `<span class="block text-sm sm:text-base font-semibold text-[#0a4d1c]">${t.body}</span>`,
    `<span class="mt-1 block font-mono text-xs sm:text-sm text-[#052e0f]/80">${t.cta} &rarr;</span>`,
    `</span>`,
    `<span class="absolute -top-3 -right-3 rotate-12 bg-red-500 text-white text-xs sm:text-sm font-black px-3 py-1 rounded-full shadow-lg animate-pulse">${t.badge}</span>`,
    `</a>`,
    `</aside>`,
  ].join('');
}
