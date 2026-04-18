import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import { profile } from '../config/profile.js';

// Load Inter fonts once per process.
const fontsDir = path.resolve('src/assets/fonts');
const boldFont = fs.readFileSync(path.join(fontsDir, 'Inter-Bold.ttf'));
const regularFont = fs.readFileSync(path.join(fontsDir, 'Inter-Regular.ttf'));

const COLORS = {
  bg: '#0A0F1A',
  card: '#111827',
  accent: '#22D3EE',
  white: '#FFFFFF',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
};

/**
 * Render a post's Open Graph card as a 1200x630 PNG buffer.
 *
 * Takes an object with `{ title, description, tags, date, lang }`. Uses a
 * dark editorial layout with an accent stripe, title, author byline, and
 * tag chips. Fonts are embedded; the output is deterministic per input.
 */
export async function renderOgImage({
  title,
  description,
  tags = [],
  date,
  lang = 'en',
}) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : '';

  // JSX tree without needing a JSX transform (use createElement-ish objects).
  const jsx = {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        background: COLORS.bg,
        backgroundImage: `radial-gradient(ellipse 900px 600px at 0% 0%, rgba(15, 103, 177, 0.35), transparent 60%), radial-gradient(ellipse 700px 500px at 100% 100%, rgba(34, 211, 238, 0.2), transparent 60%)`,
        padding: '72px 80px',
        fontFamily: 'Inter',
        color: COLORS.white,
        position: 'relative',
      },
      children: [
        // Accent stripe
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '6px',
              background: `linear-gradient(90deg, ${COLORS.accent} 0%, #3B82F6 100%)`,
            },
          },
        },
        // Header row: brand + eyebrow
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '48px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '28px',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: COLORS.white,
                    display: 'flex',
                  },
                  children: [
                    'Ivan',
                    {
                      type: 'span',
                      props: { style: { color: COLORS.accent }, children: '.' },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '16px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: COLORS.accent,
                    fontWeight: 700,
                  },
                  children: lang === 'ru' ? 'Блог' : 'Blog',
                },
              },
            ],
          },
        },
        // Title block (flex-grow to fill)
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '64px',
                    lineHeight: 1.1,
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: COLORS.white,
                    marginBottom: '24px',
                    // Clamp long titles
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  },
                  children: title,
                },
              },
              description
                ? {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: '28px',
                        lineHeight: 1.4,
                        color: COLORS.gray400,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      },
                      children: description,
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
        // Footer: author + date + tags
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: `1px solid rgba(255, 255, 255, 0.12)`,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '22px',
                          fontWeight: 700,
                          color: COLORS.white,
                        },
                        children: profile.name,
                      },
                    },
                    formattedDate
                      ? {
                          type: 'div',
                          props: {
                            style: {
                              fontSize: '18px',
                              color: COLORS.gray500,
                            },
                            children: formattedDate,
                          },
                        }
                      : null,
                  ].filter(Boolean),
                },
              },
              tags && tags.length > 0
                ? {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        gap: '16px',
                        color: COLORS.gray500,
                        fontSize: '18px',
                      },
                      children: tags
                        .slice(0, 4)
                        .map((tag) => ({
                          type: 'div',
                          props: { children: `#${tag}` },
                        })),
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
      ],
    },
  };

  const svg = await satori(jsx, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: regularFont, weight: 400, style: 'normal' },
      { name: 'Inter', data: boldFont, weight: 700, style: 'normal' },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });
  return resvg.render().asPng();
}
