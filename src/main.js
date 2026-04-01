import { createApp } from 'vue'
import App from './App.js'

// ── Smooth scroll ─────────────────────────────────────────────────────────────
// Intercepts wheel events and lerps the scroll position for an inertia feel.
;(function initSmoothScroll() {
  const LERP    = 0.09   // lower = slower / more buttery
  const SPEED   = 1.0    // wheel delta multiplier

  let current = window.scrollY
  let target  = window.scrollY
  let rafId   = null

  function tick() {
    const dist = target - current
    if (Math.abs(dist) < 0.5) {
      current = target
      window.scrollTo(0, Math.round(current))
      rafId = null
      return
    }
    current += dist * LERP
    window.scrollTo(0, current)
    rafId = requestAnimationFrame(tick)
  }

  window.addEventListener('wheel', (e) => {
    // Let expanded overlay cards handle their own scrolling
    if (e.target.closest('.about-expanded-card') || e.target.closest('.cs-expanded')) return

    e.preventDefault()

    // Normalise across deltaMode (pixel / line / page)
    let delta = e.deltaY
    if (e.deltaMode === 1) delta *= 40
    if (e.deltaMode === 2) delta *= window.innerHeight

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    target = Math.max(0, Math.min(target + delta * SPEED, maxScroll))

    if (!rafId) rafId = requestAnimationFrame(tick)
  }, { passive: false })

  // Keep current in sync if scroll happens another way (keyboard, etc.)
  window.addEventListener('scroll', () => {
    if (!rafId) current = window.scrollY
  }, { passive: true })
})()

// ── iOS :active fix ──────────────────────────────────────────────────────────
// iOS Safari won't fire :active on touch without a touchstart listener.
document.addEventListener('touchstart', () => {}, { passive: true })

// ── App ───────────────────────────────────────────────────────────────────────
createApp(App).mount('#app')
