import { h } from 'vue'

export default {
  title: 'Design Tokens/Colours',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/cu42F3CA8K4oPKioorp49Q/Portfolio---Design-Tokens',
    },
  },
}

/* ══════════════════════════════════════════════
   Shared styles
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
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#aaa',
    textAlign: 'left',
    padding: '10px 20px',
    borderBottom: '1px solid #f0f0f0',
  },
  td: {
    padding: '12px 20px',
    borderBottom: '1px solid rgba(0,0,0,0.03)',
    verticalAlign: 'middle',
    fontSize: '13px',
  },
  swatch: (color, isAlpha) => ({
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    flexShrink: '0',
    border: '1px solid rgba(0,0,0,0.06)',
    ...(isAlpha
      ? {
          backgroundImage:
            'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), ' +
            'linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), ' +
            'linear-gradient(45deg, transparent 75%, #e0e0e0 75%), ' +
            'linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)',
          backgroundSize: '8px 8px',
          backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0',
          position: 'relative',
          overflow: 'hidden',
        }
      : { background: color }),
  }),
  tokenName: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#2c2c2c',
  },
  tokenVar: {
    fontSize: '11px',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
    color: '#888',
    marginTop: '1px',
  },
  tokenValue: {
    fontSize: '11px',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
    color: '#aaa',
  },
  copyBtn: {
    background: 'none',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    padding: '3px 10px',
    fontSize: '10px',
    color: '#888',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
}

/* ══════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════ */

function getTokens(prefix) {
  const style = getComputedStyle(document.documentElement)
  const seen = new Set()
  const tokens = []
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.selectorText === ':root' || rule.selectorText === '[data-theme="dark"]') {
          for (const prop of rule.style) {
            if (prop.startsWith(prefix) && !seen.has(prop)) {
              seen.add(prop)
              tokens.push({
                name: prop,
                value: style.getPropertyValue(prop).trim(),
              })
            }
          }
        }
      }
    } catch (_) { /* cross-origin sheets */ }
  }
  return tokens
}

function friendlyName(varName) {
  return varName
    .replace(/^--color-primitive-/, '')
    .replace(/^--color-/, '')
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}

function isAlpha(value) {
  return value.includes('rgba')
}

function handleCopy(e, varName) {
  navigator.clipboard.writeText(`var(${varName})`)
  const btn = e.target
  const original = btn.textContent
  btn.textContent = 'Copied!'
  btn.style.borderColor = '#008B8B'
  btn.style.color = '#008B8B'
  setTimeout(() => {
    btn.textContent = original
    btn.style.borderColor = '#e0e0e0'
    btn.style.color = '#888'
  }, 1200)
}

/* ── Swatch cell (handles alpha checkerboard) ── */
function SwatchCell(color, alpha) {
  if (alpha) {
    return h('td', { style: S.td }, [
      h('div', { style: S.swatch(color, true) }, [
        h('div', {
          style: {
            position: 'absolute',
            inset: '0',
            borderRadius: '10px',
            background: color,
          },
        }),
      ]),
    ])
  }
  return h('td', { style: S.td }, [
    h('div', { style: S.swatch(color, false) }),
  ])
}

/* ── Single table row ── */
function TokenRow(token) {
  const alpha = isAlpha(token.value)
  return h('tr', {
    style: { transition: 'background 0.15s' },
    onMouseenter: (e) => { e.currentTarget.style.background = 'rgba(0,139,139,0.03)' },
    onMouseleave: (e) => { e.currentTarget.style.background = 'transparent' },
  }, [
    SwatchCell(token.value, alpha),
    h('td', { style: S.td }, [
      h('div', { style: S.tokenName }, friendlyName(token.name)),
      h('div', { style: S.tokenVar }, token.name),
    ]),
    h('td', { style: S.td }, [
      h('span', { style: S.tokenValue }, token.value),
    ]),
    h('td', { style: { ...S.td, textAlign: 'right' } }, [
      h('button', {
        style: S.copyBtn,
        onClick: (e) => handleCopy(e, token.name),
        onMouseenter: (e) => { e.target.style.borderColor = '#008B8B'; e.target.style.color = '#008B8B' },
        onMouseleave: (e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.color = '#888' },
      }, 'Copy'),
    ]),
  ])
}

/* ── Card-wrapped table for a group ── */
function TokenCard(title, tokens) {
  return h('div', { style: S.card }, [
    h('div', { style: S.cardHeader }, [
      h('span', { style: S.cardTitle }, title),
      h('span', { style: S.count }, `${tokens.length} tokens`),
    ]),
    h('table', { style: S.table }, [
      h('thead', {}, [
        h('tr', {}, [
          h('th', { style: { ...S.th, width: '60px' } }, 'Swatch'),
          h('th', { style: S.th }, 'Token'),
          h('th', { style: { ...S.th, width: '200px' } }, 'Value'),
          h('th', { style: { ...S.th, width: '60px', textAlign: 'right' } }, ''),
        ]),
      ]),
      h('tbody', {}, tokens.map(t => TokenRow(t))),
    ]),
  ])
}

/* ══════════════════════════════════════════════
   Stories
   ══════════════════════════════════════════════ */

export const SemanticColours = {
  render: () => {
    const groups = [
      { title: 'Primary', prefix: '--color-primary' },
      { title: 'Surface', prefix: '--color-surface' },
      { title: 'Text', prefix: '--color-text' },
      { title: 'Border', prefix: '--color-border' },
      { title: 'Shadow', prefix: '--color-shadow' },
    ]

    return h('div', { style: S.page }, [
      h('h1', { style: S.title }, 'Semantic Colours'),
      h('p', { style: S.subtitle }, 'Intent-based aliases — these are what components consume. Toggle the background to see dark mode values.'),
      ...groups.map(g => TokenCard(g.title, getTokens(g.prefix))),
    ])
  },
}

export const Primitives = {
  render: () => {
    /* Group primitives by hue family */
    const allTokens = getTokens('--color-primitive')
    const groups = {}
    const order = []

    allTokens.forEach(t => {
      const parts = t.name.replace('--color-primitive-', '').split('-')
      const family = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
      if (!groups[family]) {
        groups[family] = []
        order.push(family)
      }
      groups[family].push(t)
    })

    return h('div', { style: S.page }, [
      h('h1', { style: S.title }, 'Colour Primitives'),
      h('p', { style: S.subtitle }, 'Raw values named by hue and scale. Do not use directly in components — use semantic tokens instead.'),
      ...order.map(family => TokenCard(family, groups[family])),
    ])
  },
}
