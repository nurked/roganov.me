import { profile } from '../config/profile.js';

const siteUrl = 'https://roganov.me';

// Service JSON-LD for the homepage: tells search and answer engines that
// Ivan/IFC LLC offer AI integration work, with the company site as the
// service URL. Shared by the EN and RU homepages.
export function aiServiceLd(lang) {
  const ru = lang === 'ru';
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/#ai-integration-service`,
    name: ru ? "Интеграция ИИ для бизнеса" : "AI Integration for Business",
    serviceType: "AI Integration & Enterprise Software Consulting",
    description: ru
      ? "Внедрение LLM, ИИ-агентов и автоматизации рабочих процессов в действующий бизнес: от аудита legacy-систем до работающих в продакшене ИИ-решений."
      : "LLM, AI-agent, and workflow-automation integration for operating businesses: from legacy-system audit to AI solutions running in production.",
    provider: { "@id": `${siteUrl}/#organization` },
    url: profile.companySite,
    areaServed: "Worldwide (remote), United States (on-site)",
    inLanguage: ru ? 'ru-RU' : 'en-US',
  };
}
