/**
 * Node module hooks used only by scripts/lib/render-card.mjs.
 *
 * - Files under src/ are browser ES modules, but package.json says
 *   "type": "commonjs", so force them to load as ESM.
 * - CaseStudyOverlay only renders its content slot once the card is expanded
 *   in a real browser, so swap it for a stub that renders the slot directly.
 */
const STUB = new URL('./overlay-stub.mjs', import.meta.url).href

export async function resolve(specifier, context, next) {
  if (specifier.endsWith('/CaseStudyOverlay.js')) {
    return { url: STUB, shortCircuit: true, format: 'module' }
  }
  return next(specifier, context)
}

export async function load(url, context, next) {
  if (url.includes('/src/') && url.endsWith('.js')) {
    return next(url, { ...context, format: 'module' })
  }
  return next(url, context)
}
