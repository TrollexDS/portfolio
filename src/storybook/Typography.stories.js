import { h } from 'vue'

export default {
  title: 'Design Tokens/Typography',
}

/* ══════════════════════════════════════════════
   Shared styles — theme-aware via CSS variables
   ══════════════════════════════════════════════ */

const S = {
  page: {
    padding: '32px',
    maxWidth: '920px',
    fontFamily: 'var(--font-family-system, Inter, -apple-system, sans-serif)',
    color: 'var(--color-text-primary, #2c2c2c)',
    transition: 'color 0.5s ease',
  },
  title: {
    fontFamily: "var(--font-family-primary, 'Syne', sans-serif)",
    fontSize: '28px',
    fontWeight: 700,
    marginBottom: '6px',
    color: 'var(--color-text-primary, #2c2c2c)',
    transition: 'color 0.5s ease',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--color-text-subtle, #888)',
    marginBottom: '40px',
    lineHeight: '1.5',
    transition: 'color 0.5s ease',
  },
  card: {
    background: 'var(--color-surface-card, #fff)',
    borderRadius: '16px',
    border: '1px solid var(--color-border-card, rgba(0,0,0,0.08))',
    boxShadow: '0 1px 3px var(--color-shadow-card-rest, rgba(0,0,0,0.06))',
    overflow: 'hidden',
    marginBottom: '24px',
    transition: 'background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid var(--color-border-card, rgba(0,0,0,0.08))',
    transition: 'border-color 0.5s ease',
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--color-primary, #008B8B)',
    transition: 'color 0.5s ease',
  },
  count: {
    fontSize: '11px',
    color: 'var(--color-text-subtle, #aaa)',
    background: 'var(--color-surface-card-white, #f5f5f5)',
    padding: '2px 10px',
    borderRadius: '20px',
    transition: 'color 0.5s ease, background 0.5s ease',
  },
  tag: {
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: 500,
    padding: '2px 8px',
    borderRadius: '20px',
    background: 'var(--color-surface-card-white, #f5f5f5)',
    color: 'var(--color-text-subtle, #666)',
    marginRight: '4px',
    transition: 'color 0.5s ease, background 0.5s ease',
  },
}

/* ══════════════════════════════════════════════
   Type specimen row
   ══════════════════════════════════════════════ */

function TypeRow(item) {
  const sampleStyle = {
    fontFamily: item.family || "var(--font-family-primary, 'Syne', sans-serif)",
    fontWeight: item.weight || 400,
    fontSize: item.size,
    lineHeight: item.lineHeight || 'normal',
    letterSpacing: item.letterSpacing || 'normal',
    textTransform: item.textTransform || 'none',
    color: 'var(--color-text-primary, #2c2c2c)',
    transition: 'color 0.5s ease',
  }

  return h('div', {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '24px',
      padding: '18px 20px',
      borderBottom: '1px solid var(--color-border-card, rgba(0,0,0,0.04))',
      transition: 'background 0.15s, border-color 0.5s ease',
    },
    onMouseenter: (e) => { e.currentTarget.style.background = 'rgba(0,139,139,0.03)' },
    onMouseleave: (e) => { e.currentTarget.style.background = 'transparent' },
  }, [
    /* Left: meta */
    h('div', { style: { width: '160px', flexShrink: 0 } }, [
      h('div', {
        style: {
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--color-text-primary, #2c2c2c)',
          marginBottom: '6px',
          transition: 'color 0.5s ease',
        },
      }, item.name),
      h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '3px' } }, [
        h('span', { style: S.tag }, item.familyLabel || 'Syne'),
        h('span', { style: S.tag }, String(item.weight || 400)),
        h('span', { style: S.tag }, `${item.size}${item.lineHeight ? ' / ' + item.lineHeight : ''}`),
        ...(item.letterSpacing && item.letterSpacing !== 'normal'
          ? [h('span', { style: S.tag }, item.letterSpacing)]
          : []),
        ...(item.textTransform && item.textTransform !== 'none'
          ? [h('span', { style: S.tag }, item.textTransform)]
          : []),
      ]),
    ]),

    /* Center: sample */
    h('div', { style: { ...sampleStyle, flex: 1, minWidth: 0 } },
      item.sampleText || 'The quick brown fox jumps over the lazy dog'
    ),
  ])
}

/* ══════════════════════════════════════════════
   Font family specimen
   ══════════════════════════════════════════════ */

function FamilyRow(item) {
  return h('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      padding: '20px',
      borderBottom: '1px solid var(--color-border-card, rgba(0,0,0,0.04))',
      transition: 'border-color 0.5s ease',
    },
  }, [
    h('div', { style: { width: '160px', flexShrink: 0 } }, [
      h('div', {
        style: {
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--color-text-primary, #2c2c2c)',
          marginBottom: '2px',
          transition: 'color 0.5s ease',
        },
      }, item.name),
      h('div', {
        style: {
          fontSize: '11px',
          fontFamily: "var(--font-family-mono, 'SF Mono', 'Fira Code', monospace)",
          color: 'var(--color-text-subtle, #aaa)',
          transition: 'color 0.5s ease',
        },
      }, item.var),
    ]),
    h('div', {
      style: {
        fontFamily: item.var,
        fontSize: '32px',
        fontWeight: 400,
        color: 'var(--color-text-primary, #2c2c2c)',
        flex: 1,
        transition: 'color 0.5s ease',
      },
    }, 'AaBbCc 0123456789'),
  ])
}

/* ══════════════════════════════════════════════
   Stories
   ══════════════════════════════════════════════ */

export const TypeScale = {
  render: () => {
    const categories = [
      {
        title: 'Case Study',
        styles: [
          { name: 'CS / Title', weight: 700, size: '32px', lineHeight: '48px', sampleText: 'Station & Presenter Pages' },
          { name: 'CS / Section Title', weight: 700, size: '24px', lineHeight: '36px', sampleText: 'Research & Discovery' },
          { name: 'CS / Subsection Title', weight: 700, size: '18px', lineHeight: '27px', sampleText: 'Workshop Findings' },
          { name: 'CS / Body', weight: 400, size: '18px', lineHeight: '27px' },
        ],
      },
      {
        title: 'Quote',
        styles: [
          { name: 'Quote / Card', weight: 500, size: '20px', lineHeight: '31px', sampleText: '\u201CDesign is not just what it looks like\u201D' },
          { name: 'Quote / Expanded', weight: 500, size: '22px', lineHeight: '33px', sampleText: '\u201CSimplicity is the ultimate sophistication\u201D' },
          { name: 'Quote / Body', weight: 400, size: '17px', lineHeight: '28.05px' },
        ],
      },
      {
        title: 'Navigation & Actions',
        styles: [
          { name: 'Nav / Pill', weight: 500, size: '16px', sampleText: 'Work' },
          { name: 'Action / Default', weight: 500, size: '15px', sampleText: 'View case study' },
        ],
      },
      {
        title: 'About',
        styles: [
          { name: 'About / Bio', weight: 400, size: '17px', lineHeight: '26.35px' },
          { name: 'About / Expanded', weight: 400, size: '18px', lineHeight: '28.8px' },
        ],
      },
      {
        title: 'Labels',
        styles: [
          { name: 'Label / Principle', weight: 600, size: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', sampleText: 'MY DESIGN PRINCIPLE' },
          { name: 'Label / Project', weight: 700, size: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', sampleText: 'PROJECT LABEL' },
          { name: 'Label / Tag', weight: 600, size: '12px', letterSpacing: '0.02em', textTransform: 'uppercase', sampleText: 'INTERACTIVE' },
        ],
      },
      {
        title: 'Data & Reviews',
        styles: [
          { name: 'Data / Streak', weight: 600, size: '48px', lineHeight: '48px', familyLabel: 'Fredoka', family: "var(--font-family-display, 'Fredoka', sans-serif)", sampleText: '820' },
          { name: 'Data / Strava Distance', weight: 700, size: '16px', letterSpacing: '-0.01em', sampleText: '42.8 km' },
          { name: 'Data / Strava Elevation', weight: 500, size: '12px', sampleText: '340 m' },
          { name: 'Review / Title', weight: 700, size: '16px', sampleText: 'Brilliant designer, highly recommend' },
          { name: 'Review / Body', weight: 400, size: '14px', lineHeight: '21px' },
          { name: 'Tooltip', weight: 400, size: '18px', lineHeight: '23.4px', sampleText: 'Click to expand' },
        ],
      },
    ]

    return h('div', { style: S.page }, [
      h('h1', { style: S.title }, 'Typography'),
      h('p', { style: S.subtitle }, 'Semantic text styles mapped to component roles. Primary: Syne. Display: Fredoka. System: Inter.'),
      ...categories.map(cat =>
        h('div', { style: S.card }, [
          h('div', { style: S.cardHeader }, [
            h('span', { style: S.cardTitle }, cat.title),
            h('span', { style: S.count }, `${cat.styles.length} styles`),
          ]),
          ...cat.styles.map(s => TypeRow(s)),
        ])
      ),
    ])
  },
}

export const TypeScaleMobile = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    chromatic: { viewports: [375] },
  },
  render: () => {
    const categories = [
      {
        title: 'Case Study',
        styles: [
          { name: 'CS / Title', weight: 700, size: '32px', lineHeight: '48px', sampleText: 'Station & Presenter Pages' },
          { name: 'CS / Body', weight: 400, size: '18px', lineHeight: '27px' },
        ],
      },
      {
        title: 'Navigation & Actions',
        styles: [
          { name: 'Nav / Pill', weight: 500, size: '16px', sampleText: 'Work' },
          { name: 'Action / Default', weight: 500, size: '15px', sampleText: 'View case study' },
        ],
      },
      {
        title: 'Labels',
        styles: [
          { name: 'Label / Principle', weight: 600, size: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', sampleText: 'MY DESIGN PRINCIPLE' },
          { name: 'Label / Tag', weight: 600, size: '12px', letterSpacing: '0.02em', textTransform: 'uppercase', sampleText: 'INTERACTIVE' },
        ],
      },
    ]

    /* Mobile: stacked layout instead of side-by-side */
    function MobileTypeRow(item) {
      const sampleStyle = {
        fontFamily: item.family || "var(--font-family-primary, 'Syne', sans-serif)",
        fontWeight: item.weight || 400,
        fontSize: item.size,
        lineHeight: item.lineHeight || 'normal',
        letterSpacing: item.letterSpacing || 'normal',
        textTransform: item.textTransform || 'none',
        color: 'var(--color-text-primary, #2c2c2c)',
        transition: 'color 0.5s ease',
        marginTop: '8px',
      }

      return h('div', {
        style: {
          padding: '14px 16px',
          borderBottom: '1px solid var(--color-border-card, rgba(0,0,0,0.04))',
        },
      }, [
        h('div', {
          style: {
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-text-primary, #2c2c2c)',
            marginBottom: '4px',
          },
        }, item.name),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '6px' } }, [
          h('span', { style: S.tag }, item.familyLabel || 'Syne'),
          h('span', { style: S.tag }, String(item.weight || 400)),
          h('span', { style: S.tag }, `${item.size}`),
        ]),
        h('div', { style: sampleStyle },
          item.sampleText || 'The quick brown fox jumps over the lazy dog'
        ),
      ])
    }

    return h('div', { style: { ...S.page, padding: '20px', maxWidth: '375px' } }, [
      h('h1', { style: { ...S.title, fontSize: '22px' } }, 'Typography — Mobile'),
      h('p', { style: S.subtitle }, 'Stacked layout for narrow viewports.'),
      ...categories.map(cat =>
        h('div', { style: S.card }, [
          h('div', { style: S.cardHeader }, [
            h('span', { style: S.cardTitle }, cat.title),
            h('span', { style: S.count }, `${cat.styles.length} styles`),
          ]),
          ...cat.styles.map(s => MobileTypeRow(s)),
        ])
      ),
    ])
  },
}

export const FontFamilies = {
  render: () => {
    const families = [
      { name: 'Primary', var: "'Syne', sans-serif" },
      { name: 'Display', var: "'Fredoka', sans-serif" },
      { name: 'System', var: "Inter, -apple-system, sans-serif" },
      { name: 'Mono', var: "'SF Mono', 'Fira Code', monospace" },
    ]

    return h('div', { style: S.page }, [
      h('h1', { style: S.title }, 'Font Families'),
      h('p', { style: S.subtitle }, 'The four typeface stacks used across the portfolio.'),
      h('div', { style: S.card }, [
        h('div', { style: S.cardHeader }, [
          h('span', { style: S.cardTitle }, 'Families'),
          h('span', { style: S.count }, `${families.length} fonts`),
        ]),
        ...families.map(f => FamilyRow(f)),
      ]),
    ])
  },
}
