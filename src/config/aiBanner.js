import { createRequire } from 'node:module';
import { profile } from './profile.js';

// Build-time only (used by the rehype plugin): createRequire keeps JSON
// loading compatible with the Node context astro.config plugins run in.
const require = createRequire(import.meta.url);
const translations = {
  en: require('../i18n/en.json'),
  ru: require('../i18n/ru.json'),
};

// Posts tagged with any of these (lowercased) get the AI-services banner
// injected into the article body. AI topics plus core software/engineering
// topics, EN and RU spellings.
export const BANNER_TAGS = new Set([
  'ai', 'ии', 'llm', 'machine learning', 'машинное обучение', 'нейросети',
  'agents', 'агенты', 'chatgpt', 'claude',
  'programming', 'программирование', 'systems programming', 'системное программирование',
  'web development', 'веб-разработка', 'frontend', 'blazor', 'vugu',
  'sysadmin', 'system administration', 'системное администрирование',
  'administration', 'администрирование', 'devops', 'infrastructure',
  'docker', 'virtualization', 'qemu', 'backup', 'console', 'powershell',
  'debian', 'linux', 'windows', 'windows 8', 'windows 11', 'winapi', 'winrt',
  'interop', 'rdp', 'it',
  'databases', 'базы данных', 'entity framework', 'nvme', 'uuid',
  'compilers', 'компиляторы', 'llvm', 'assembler', 'nasm', 'x64',
  'wasm', 'webassembly',
  'networking', 'sockets', 'сокеты', 'tcp', 'protocols',
  'go', 'goroutines', 'горутины', 'rust', 'ruby', 'ruby on rails', 'c#', '.net',
  'scheduler', 'планировщик задач',
  'information security', 'информационная безопасность',
]);

export function isBannerPost(tags) {
  return (tags ?? []).some((t) => BANNER_TAGS.has(String(t).toLowerCase()));
}

// Markup mirrors the site's component idiom (Tailwind utility classes; this
// file is in tailwind.config content globs so the classes are retained).
// `not-prose` keeps @tailwindcss/typography from restyling the banner when
// it lands inside the article's prose container.
export function bannerHtml(lang) {
  const t = (translations[lang] ?? translations.en).aiBanner;
  const href = `${profile.companySite}/?utm_source=roganov.me&utm_medium=blog&utm_campaign=ai-articles`;
  return [
    `<aside class="not-prose my-12 rounded-lg border border-brand-accent/30 bg-brand-accent/5 p-6 sm:p-8" aria-label="${t.title}">`,
    `<p class="text-brand-accent text-xs font-mono uppercase tracking-[0.2em] mb-3">${t.label}</p>`,
    `<p class="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">${t.title}</p>`,
    `<p class="text-gray-400 leading-relaxed mb-5">${t.body}</p>`,
    `<a href="${href}" rel="noopener" class="inline-flex items-center gap-2 font-mono text-sm text-brand-accent hover:text-white transition-colors underline decoration-1 underline-offset-[3px] decoration-brand-accent/50 hover:decoration-white/70 py-2">${t.cta} &rarr;</a>`,
    `</aside>`,
  ].join('');
}
