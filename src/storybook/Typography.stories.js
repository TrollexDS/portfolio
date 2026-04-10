import { h } from 'vue'

export default {
  title: 'Design Tokens/Typography',
}

/* ══════════════════════════════════════════════
   Shared styles (matching Tokens.stories)
   ══════════════════════════════════════════════ */

const S = {
  page: {
    padding: '32px',
    maxWidth: '920px',
    fontFamily: 'Inter, -apple-system, sans-serif',
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '28px',
    fontWeight: 700,
    marginBottom: '6px',
    color: '#2c2c2c',
  },
  subtitle: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '40px',
    lineHeight: '1.5',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    overflow: 'hidden',
    marginBottom: '24px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #f0f0f0',
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#008B8B',
  },
  count: {
    fontSize: '11px',
    color: '#aaa',
    background: '#f5f5f5',
    padding: '2px 10px',
    borderRadius: '20px',
  },
  tag: {
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: 500,
    padding: '2px 8px',
    borderRadius: '20px',
    background: '#f5f5f5',
    color: '#666',
    marginRight: '4px',
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
    color: '#2c2c2c',
  }

  return h('div', {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '24px',
      padding: '18px 20px',
      borderBottom: '1px solid rgba(0,0,0,0.04)',
      transition: 'background 0.15s',
    },
    onMouseenter: (e) => { e.currentTarget.style.background = 'rgba(0,139,139,0.03)' },
    onMouseleave: (e) => { e.currentTarget.style.background = 'transparent' },
  }, [
    /* Left: meta */
    h('div', { style: { width: '160px', flexShrink: 0 } }, [
      h('div', {
        style: { fontSize: '13px', fontWeight: 600, color: '#2c2c2c', marginBottom: '6px' },
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
      borderBottom: '1px solid rgba(0,0,0,0.04)',
    },
  }, [
    h('div', { style: { width: '160px', flexShrink: 0 } }, [
      h('div', {
        style: { fontSize: '13px', fontWeight: 600, color: '#2c2c2c', marginBottom: '2px' },
      }, item.name),
      h('div', {
        style: { fontSize: '11px', fontFamily: "'SF Mono', 'Fira Code', monospace", color: '#aaa' },
      }, item.var),
    ]),
    h('div', {
      style: {
        fontFamily: item.var,
        fontSize: '32px',
        fontWeight: 400,
        color: '#2c2c2c',
        flex: 1,
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
