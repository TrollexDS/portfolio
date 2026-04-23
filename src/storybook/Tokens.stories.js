import { h, ref, onMounted, onUnmounted } from 'vue'

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

const T = 'transition: color 0.5s ease, background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease;'

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
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--color-text-subtle, #aaa)',
    textAlign: 'left',
    padding: '10px 20px',
    borderBottom: '1px solid var(--color-border-card, rgba(0,0,0,0.08))',
    transition: 'color 0.5s ease, border-color 0.5s ease',
  },
  td: {
    padding: '12px 20px',
    borderBottom: '1px solid var(--color-border-card, rgba(0,0,0,0.04))',
    verticalAlign: 'middle',
    fontSize: '13px',
    color: 'var(--color-text-primary, #2c2c2c)',
    transition: 'color 0.5s ease, border-color 0.5s ease',
  },
  swatch: (color, isAlpha) => ({
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    flexShrink: '0',
    border: '1px solid var(--color-border-card, rgba(0,0,0,0.06))',
    transition: 'border-color 0.5s ease',
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
    color: 'var(--color-text-primary, #2c2c2c)',
    transition: 'color 0.5s ease',
  },
  tokenVar: {
    fontSize: '11px',
    fontFamily: "var(--font-family-mono, 'SF Mono', 'Fira Code', monospace)",
    color: 'var(--color-text-subtle, #888)',
    marginTop: '1px',
    transition: 'color 0.5s ease',
  },
  tokenValue: {
    fontSize: '11px',
    fontFamily: "var(--font-family-mono, 'SF Mono', 'Fira Code', monospace)",
    color: 'var(--color-text-subtle, #aaa)',
    transition: 'color 0.5s ease',
  },
  copyBtn: {
    background: 'none',
    border: '1px solid var(--color-border-card, rgba(0,0,0,0.08))',
    borderRadius: '6px',
    padding: '3px 10px',
    fontSize: '10px',
    color: 'var(--color-text-subtle, #888)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family-system, Inter, sans-serif)',
    transition: 'color 0.3s ease, border-color 0.3s ease',
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
  const primary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#008B8B'
  btn.style.borderColor = primary
  btn.style.color = primary
  setTimeout(() => {
    btn.textContent = original
    btn.style.borderColor = ''
    btn.style.color = ''
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
        onMouseenter: (e) => {
          const primary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#008B8B'
          e.target.style.borderColor = primary
          e.target.style.color = primary
        },
        onMouseleave: (e) => { e.target.style.borderColor = ''; e.target.style.color = '' },
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

/* ── Theme-aware wrapper that re-renders when data-theme changes ── */
function useThemeReactive() {
  const tick = ref(0)
  let observer = null

  onMounted(() => {
    observer = new MutationObserver(() => { tick.value++ })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
  })

  onUnmounted(() => { if (observer) observer.disconnect() })

  return tick
}

export const SemanticColours = {
  render: () => ({
    setup() {
      const tick = useThemeReactive()

      return () => {
        // Force re-read when tick changes
        void tick.value

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
      }
    },
  }),
}

export const SemanticColoursMobile = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    chromatic: { viewports: [375] },
  },
  render: () => ({
    setup() {
      const tick = useThemeReactive()

      return () => {
        void tick.value

        const groups = [
          { title: 'Primary', prefix: '--color-primary' },
          { title: 'Surface', prefix: '--color-surface' },
          { title: 'Text', prefix: '--color-text' },
          { title: 'Border', prefix: '--color-border' },
        ]

        /* Mobile token row — compact, no copy button */
        function MobileTokenRow(token) {
          const alpha = isAlpha(token.value)
          return h('tr', {
            style: { transition: 'background 0.15s' },
          }, [
            h('td', { style: { ...S.td, padding: '10px 12px', width: '40px' } }, [
              h('div', { style: { ...S.swatch(token.value, !alpha), width: '28px', height: '28px', borderRadius: '8px' } },
                alpha ? [h('div', { style: { position: 'absolute', inset: 0, borderRadius: '8px', background: token.value } })] : []
              ),
            ]),
            h('td', { style: { ...S.td, padding: '10px 8px' } }, [
              h('div', { style: { ...S.tokenName, fontSize: '12px' } }, friendlyName(token.name)),
              h('div', { style: { ...S.tokenVar, fontSize: '10px', wordBreak: 'break-all' } }, token.name),
            ]),
            h('td', { style: { ...S.td, padding: '10px 12px', textAlign: 'right' } }, [
              h('span', { style: { ...S.tokenValue, fontSize: '10px' } }, token.value),
            ]),
          ])
        }

        function MobileTokenCard(title, tokens) {
          return h('div', { style: S.card }, [
            h('div', { style: { ...S.cardHeader, padding: '12px 16px' } }, [
              h('span', { style: S.cardTitle }, title),
              h('span', { style: S.count }, `${tokens.length}`),
            ]),
            h('table', { style: { ...S.table, fontSize: '12px' } }, [
              h('tbody', {}, tokens.map(t => MobileTokenRow(t))),
            ]),
          ])
        }

        return h('div', { style: { ...S.page, padding: '20px', maxWidth: '375px' } }, [
          h('h1', { style: { ...S.title, fontSize: '22px' } }, 'Colours — Mobile'),
          h('p', { style: S.subtitle }, 'Compact layout — no copy button, smaller swatches.'),
          ...groups.map(g => MobileTokenCard(g.title, getTokens(g.prefix))),
        ])
      }
    },
  }),
}

export const Primitives = {
  render: () => ({
    setup() {
      const tick = useThemeReactive()

      return () => {
        void tick.value

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
      }
    },
  }),
}
