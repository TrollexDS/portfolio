/**
 * Server-render a case study card's body without a browser.
 *
 *   renderCardRaw('AlexaCard')       → Vue SSR HTML of the case study body
 *   renderCardFallback('AlexaCard')  → cleaned, semantic HTML for the
 *                                      no-JS / crawler fallback page
 *
 * The card is rendered in "Detailed" mode (TL;DR off), so everything wrapped
 * in full(...) is included.
 */
import { register } from 'node:module'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

register('./ssr-loader.mjs', import.meta.url)

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')

// Some components touch browser globals at setup time; SSR never mounts, so
// inert stand-ins are enough.
globalThis.IntersectionObserver ??= class { observe() {} unobserve() {} disconnect() {} }
globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} }
globalThis.MutationObserver ??= class { observe() {} disconnect() {} }
globalThis.Image ??= class { set src(_) {} }
globalThis.window ??= {
  innerWidth: 1280, innerHeight: 800, devicePixelRatio: 1,
  addEventListener() {}, removeEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  location: { pathname: '/', hash: '' },
}
globalThis.document ??= {
  documentElement: { dataset: {}, classList: { contains: () => false } },
  addEventListener() {}, removeEventListener() {},
  querySelector: () => null, querySelectorAll: () => [], getElementById: () => null,
  createElement: () => ({ style: {}, setAttribute() {}, appendChild() {}, getContext: () => null }),
  head: { appendChild() {} }, body: { appendChild() {} },
}

export async function renderCardRaw(cardName) {
  const { createSSRApp, h } = await import('vue')
  const { renderToString } = await import('vue/server-renderer')
  const file = path.join(ROOT, 'src/components/cards', `${cardName}.js`)
  const { default: Card } = await import(pathToFileURL(file).href)
  const app = createSSRApp({ render: () => h(Card) })
  app.config.warnHandler = () => {}
  return renderToString(app)
}

export async function renderCardFallback(cardName) {
  return cleanForFallback(await renderCardRaw(cardName))
}

// ─────────────────────────────────────────────────────────────────────────────
// Cleaner. Vue SSR output is well-formed (text and attribute values are
// escaped, attributes are double-quoted), so a small tokenizer is enough.

const KEEP = new Set(['h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i',
  'code', 'a', 'dl', 'dt', 'dd', 'blockquote', 'br', 'table', 'thead', 'tbody', 'tr', 'th', 'td'])
const DROP = new Set(['button', 'video', 'svg', 'script', 'style', 'input', 'img', 'picture',
  'source', 'canvas', 'iframe', 'audio', 'template', 'noscript', 'select', 'label'])
const VOID = new Set(['br', 'img', 'input', 'source', 'hr', 'meta', 'link', 'wbr', 'area', 'col', 'embed', 'track'])
const BLOCK = new Set(['h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'blockquote', 'table', 'tr'])
// Interactive chrome that carries no case-study prose.
const DROP_CLASS = /\b(cs-readbar|tldr-bar|cs-review-stars|cs-zoom-controls)\b/

const hasClass = (node, c) => typeof node !== 'string' && new RegExp(`\\b${c}\\b`).test(node.attrs.class || '')
const textOf = node => typeof node === 'string' ? node : node.children.map(textOf).join('')
const find = (node, c) => typeof node === 'string' ? null
  : hasClass(node, c) ? node : node.children.reduce((hit, ch) => hit || find(ch, c), null)
const squash = s => s.replace(/\s+/g, ' ').trim()

function parse(html) {
  const root = { tag: '#root', attrs: {}, children: [] }
  const stack = [root]
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z0-9-]+)\s*>|<([a-zA-Z0-9-]+)((?:\s+[^\s=>\/]+(?:="[^"]*")?)*)\s*(\/?)>|([^<]+)/g
  let m
  while ((m = re.exec(html))) {
    const top = stack[stack.length - 1]
    if (m[0].startsWith('<!--')) continue
    if (m[1]) {
      const tag = m[1].toLowerCase()
      const i = stack.map(n => n.tag).lastIndexOf(tag)
      if (i > 0) stack.length = i
    } else if (m[2]) {
      const tag = m[2].toLowerCase()
      const attrs = {}
      for (const a of m[3].matchAll(/([^\s=]+)(?:="([^"]*)")?/g)) attrs[a[1]] = a[2] ?? ''
      const node = { tag, attrs, children: [] }
      top.children.push(node)
      if (!VOID.has(tag) && !m[4]) stack.push(node)
    } else if (m[5]) {
      top.children.push(m[5])
    }
  }
  return root
}

function serialize(node) {
  if (typeof node === 'string') return node
  const { tag, attrs } = node
  if (DROP.has(tag)) return ''
  if (attrs.class && DROP_CLASS.test(attrs.class)) return ''
  // The fallback carries what a screen reader would get: decorative or
  // duplicated content (aria-hidden) and anything explicitly opted out with
  // data-fallback="skip" (pure-UI demos) is left out.
  if (attrs['aria-hidden'] === 'true' || attrs['data-fallback'] === 'skip') return ''
  // "Interactive — click to explore" hints mean nothing without JS.
  if (hasClass(node, 'cs-hint') && find(node, 'cc-interactive-tag')) return ''
  // The page template already prints the title as <h1>.
  if (tag === 'h1') return ''
  // Big numbers in stat / result tiles.
  if (/(stat|result)-num(ber)?\b/.test(attrs.class || '')) return ` <strong>${squash(textOf(node))}</strong> `
  // Stat: "753 → 54" + label → one line.
  if (hasClass(node, 'cs-stat-item')) {
    const num = find(node, 'cs-stat-num'), lbl = find(node, 'cs-stat-lbl')
    if (num && lbl) return `\n<p><strong>${squash(textOf(num))}</strong> ${squash(textOf(lbl))}</p>\n`
  }
  // Image captions.
  if (hasClass(node, 'cs-hint') && !node.children.some(c => typeof c !== 'string' && BLOCK.has(c.tag))) {
    const t = squash(textOf(node))
    return t ? `\n<p><em>${t}</em></p>\n` : ''
  }
  // App store review → quote.
  if (hasClass(node, 'cs-review-card')) {
    const t = find(node, 'cs-review-title'), b = find(node, 'cs-review-body')
    if (t && b) return `\n<blockquote><p><strong>${squash(textOf(t))}</strong> ${squash(textOf(b))}</p></blockquote>\n`
  }
  const inner = node.children.map(serialize).join('')
  if (tag === '#root' || !KEEP.has(tag)) {
    // Unwrap containers (div, span, section, figure…). A container that holds
    // only loose text becomes a paragraph so the text isn't run together.
    const hasBlock = node.children.some(c => typeof c !== 'string' && (BLOCK.has(c.tag) || !KEEP.has(c.tag)))
    if (tag !== '#root' && !hasBlock && inner.trim() && /^(div|figcaption|section)$/.test(tag)) {
      return `\n<p>${squash(inner)}</p>\n`
    }
    // Keep adjacent inline pieces (e.g. <span>Finding</span><p>…) apart.
    return tag === 'span' ? ` ${inner} ` : inner
  }
  if (tag === 'br') return '<br>'
  const a = tag === 'a' && attrs.href ? ` href="${attrs.href}"` : ''
  const open = `<${tag}${a}>`
  const out = `${open}${tag === 'code' ? inner : inner.replace(/\s+/g, ' ').trim()}</${tag}>`
  if (!/^(p|li|dt|dd|h[1-4])$/.test(tag) || inner.trim()) return BLOCK.has(tag) ? `\n${out}\n` : out
  return ''
}

export function cleanForFallback(html) {
  return serialize(parse(html))
    .replace(/\n{2,}/g, '\n')
    .replace(/^\s+|\s+$/g, '')
    .split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean)
    // Loose inline text left over from unwrapped containers → paragraphs.
    .map(l => /^<(h[1-4]|p|ul|ol|li|dl|dt|dd|blockquote|table|tr)\b/.test(l) ? l : `<p>${l}</p>`)
    .join('\n')
    .replace(/\n(<h2>)/g, '\n\n$1')
}
