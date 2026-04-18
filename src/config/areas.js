/**
 * Operating areas — the six buckets the portfolio section organizes the
 * back catalog into. Each bucket is matched by a list of tag slugs;
 * Portfolio.astro cross-references this against the live content
 * collection to produce live counts, so new posts slot in automatically.
 *
 * `featured` is the slug shown as the writing sample. `primaryTags` are
 * the chips rendered at the bottom of each card — they link to the tag
 * pages we ship in src/pages/blog/tags/.
 */

import { tagSlug } from '../utils/tagUtils.js';

export const areas = [
  {
    id: 'systems',
    featured: 'goscheduler-part-1',
    tagMatchers: [
      'systems-programming',
      'scheduler',
      'compilers',
      'assembly',
      'nvme',
      'protocols',
      'llvm',
      'goroutines',
      'x64',
      'tcp',
    ],
    primaryTags: ['Rust', 'Go', 'systems programming', 'NVMe', 'compilers'],
    i18n: {
      en: {
        title: 'Systems & Low-Level',
        pitch:
          'How things actually work under the abstractions — schedulers, compilers, protocols, assembly, the paths CPUs take when nobody\'s looking.',
      },
      ru: {
        title: 'Системы и low-level',
        pitch:
          'Как всё на самом деле устроено под абстракциями — планировщики, компиляторы, протоколы, ассемблер и маршруты, по которым ходит процессор.',
      },
    },
  },
  {
    id: 'infra',
    featured: 'qemu-iron-fist',
    tagMatchers: [
      'sysadmin',
      'linux',
      'debian',
      'email',
      'docker',
      'virtualization',
      'qemu',
      'backup',
      'networking',
      'rdp',
      'windows',
      'tutorial',
    ],
    primaryTags: ['sysadmin', 'Linux', 'virtualization', 'docker', 'networking'],
    i18n: {
      en: {
        title: 'Infrastructure & Sysadmin',
        pitch:
          'Production systems, networks, mail servers, virtualization. The plumbing that keeps companies running — usually held together with duct tape and resolve.',
      },
      ru: {
        title: 'Инфраструктура и sysadmin',
        pitch:
          'Производственные системы, сети, почтовые серверы, виртуализация. Та самая сантехника, на которой держится бизнес — обычно скотчем и упрямством.',
      },
    },
  },
  {
    id: 'languages',
    featured: 'rust-compiler-deep-dive',
    tagMatchers: [
      'rust',
      'go',
      'dotnet',
      'csharp',
      'blazor',
      'webassembly',
      'entity-framework',
      'ruby-on-rails',
      'programming',
      'powershell',
      'databases',
    ],
    primaryTags: ['Rust', 'Go', '.NET', 'WebAssembly', 'Blazor'],
    i18n: {
      en: {
        title: 'Languages & Frameworks',
        pitch:
          'Rust, Go, .NET, and whatever else is solving the problem at hand. Pragmatic and hands-on, with receipts.',
      },
      ru: {
        title: 'Языки и фреймворки',
        pitch:
          'Rust, Go, .NET и всё остальное, что решает задачу сейчас. Прагматично, руками, с примерами из реальной жизни.',
      },
    },
  },
  {
    id: 'career',
    featured: 'grand-circus-it-hiring',
    tagMatchers: [
      'career',
      'hiring',
      'hr',
      'management',
      'leadership',
      'industry',
      'it',
      'mindset',
      'ux',
      'ui',
    ],
    primaryTags: ['career', 'hiring', 'management', 'industry', 'UX'],
    i18n: {
      en: {
        title: 'Career & Industry',
        pitch:
          'Hiring, ownership, and the politics of shipping software at scale. Mostly grumpy, occasionally useful.',
      },
      ru: {
        title: 'Карьера и индустрия',
        pitch:
          'Найм, ответственность и внутренняя политика компаний, которые пишут софт. Обычно ворчу. Иногда полезно.',
      },
    },
  },
  {
    id: 'ai',
    featured: 'will-ai-steal-your-job',
    tagMatchers: ['ai', 'llm', 'machine-learning'],
    primaryTags: ['AI', 'LLM', 'programming'],
    i18n: {
      en: {
        title: 'AI & The Hype Cycle',
        pitch:
          'What AI actually does, what it pretends to do, and where the two diverge. I\'m not selling you anything.',
      },
      ru: {
        title: 'AI и цикл хайпа',
        pitch:
          'Что AI делает на самом деле, что притворяется, что делает, и где эти две версии расходятся. Ничего не продаю.',
      },
    },
  },
  {
    id: 'craft',
    featured: 'how-to-write-articles',
    tagMatchers: [
      'writing',
      'articles',
      'education',
      'language',
      'communication',
      'mathematics',
      'creativity',
    ],
    primaryTags: ['writing', 'education', 'creativity', 'mathematics'],
    i18n: {
      en: {
        title: 'Writing & Craft',
        pitch:
          'On the craft itself — how to write, teach, and get people to actually read you. Over a hundred articles of receipts.',
      },
      ru: {
        title: 'Письмо и ремесло',
        pitch:
          'О самом ремесле — как писать, учить и добиваться, чтобы тебя реально читали. Больше сотни статей опыта.',
      },
    },
  },
];

/**
 * Count how many posts match each area from a given set of collection entries
 * (already filtered by lang + draft). Returns a Map<areaId, { count, postsBySlug }>
 * so the component can also cross-reference the featured post.
 */
export function computeAreaStats(posts) {
  const byArea = new Map();
  for (const area of areas) {
    const matcherSet = new Set(area.tagMatchers.map((m) => m.toLowerCase()));
    const matching = posts.filter((p) => {
      const postTagSlugs = (p.data.tags ?? []).map((t) => tagSlug(t));
      return postTagSlugs.some((slug) => matcherSet.has(slug));
    });
    byArea.set(area.id, {
      count: matching.length,
      postsBySlug: new Map(matching.map((p) => [p.data.slug, p])),
    });
  }
  return byArea;
}
