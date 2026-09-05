// Products Ivan ships, shown on the homepage and emitted as an ItemList in the
// site-wide JSON-LD so search engines and LLMs tie both to the same author.
export const projects = [
  {
    id: 'kiddos',
    url: 'https://kiddos.dev',
    schemaType: 'SoftwareApplication',
    schemaId: 'https://kiddos.dev/#app',
    i18n: {
      en: {
        name: 'KidDOS',
        tagline: 'A computer small enough for a kid to explore',
        pitch:
          'A fake computer inside your real one, for kids about 7 to 13: a fullscreen CRT terminal with a real Unix shell, a virtual drive, a manual, BASIC, C and Go in a sandbox, and games whose source the kid can read and change. No internet, nothing to break. Free and open source.',
        links: [
          { label: 'kiddos.dev', href: 'https://kiddos.dev/' },
          { label: 'How to teach your kid programming', href: 'https://kiddos.dev/how-to-teach-kids-programming/' },
        ],
      },
      ru: {
        name: 'KidDOS',
        tagline: 'Компьютер, достаточно маленький, чтобы ребёнок изучил его целиком',
        pitch:
          'Ненастоящий компьютер внутри настоящего, для детей примерно 7–13 лет: полноэкранный ЭЛТ-терминал с настоящим Unix-шеллом, виртуальный диск, мануал, Бейсик, C и Go в песочнице и игры, исходники которых ребёнок может прочитать и поменять. Без интернета, ломать нечего. Бесплатно, с открытым кодом.',
        links: [
          { label: 'kiddos.dev', href: 'https://kiddos.dev/' },
          { label: 'Как учить ребёнка программировать (англ.)', href: 'https://kiddos.dev/how-to-teach-kids-programming/' },
        ],
      },
    },
  },
  {
    id: 'skypeck',
    url: 'https://skypeck.fun',
    schemaType: 'VideoGame',
    schemaId: 'https://skypeck.fun/#game',
    i18n: {
      en: {
        name: 'SkyPeck',
        tagline: 'A flying game kids control with their whole body',
        pitch:
          'Spread your wings in front of the camera, lean to turn, flap to fly. Pose detection runs entirely on the device, so the camera never uploads anything. For iPad, iPhone, Mac and PC.',
        links: [{ label: 'skypeck.fun', href: 'https://skypeck.fun/' }],
      },
      ru: {
        name: 'SkyPeck',
        tagline: 'Летаешь всем телом',
        pitch:
          'Расправь руки перед камерой, наклонись, чтобы повернуть, махни, чтобы взлететь. Распознавание позы работает целиком на устройстве, камера ничего никуда не отправляет. Для iPad, iPhone, Mac и PC.',
        links: [{ label: 'skypeck.fun', href: 'https://skypeck.fun/' }],
      },
    },
  },
];

export function projectsItemList(siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${siteUrl}/#projects`,
    name: 'Projects by Ivan Roganov',
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': p.schemaType,
        '@id': p.schemaId,
        name: p.i18n.en.name,
        url: p.url,
        description: p.i18n.en.pitch,
        author: { '@id': `${siteUrl}/#person` },
        creator: { '@id': `${siteUrl}/#person` },
      },
    })),
  };
}
