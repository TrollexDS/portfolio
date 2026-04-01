import { defineComponent, h, onMounted, onUnmounted } from 'vue'

// ── Element data ──────────────────────────────────────────────────────────────
// Tokens pulled directly from tokens.css naming conventions
const TOKENS = [
  'color.primary', 'color.surface.card', 'color.text.primary', 'color.text.muted',
  'color.bg.gradient', 'color.shadow.card', 'color.backdrop', 'color.overlay',
  'color.brand.strava', 'color.brand.schedule',
  'spacing.4', 'spacing.8', 'spacing.16', 'spacing.24', 'spacing.32', 'spacing.40',
  'radius.sm', 'radius.md', 'radius.lg', 'radius.full',
  'shadow.card.rest', 'shadow.card.hover', 'shadow.nav',
  'font.size.sm', 'font.size.md', 'font.size.lg',
  'font.family.syne', 'font.weight.600', 'font.weight.700',
  'opacity.muted', 'opacity.dark', 'z.nav', 'z.backdrop', 'z.tooltip',
  'transition.base', 'transition.fast', 'transition.spring',
  'border.radius.card', 'blur.nav',
]

// Real component names from this portfolio's codebase
const COMPONENTS = [
  'BentoCard', 'NavBar', 'AboutCard', 'BulbCard',
  'GmailCard', 'PluginCard', 'RayoDSCard', 'AlexaCard',
  'ScheduleCard', 'DuolingoCard', 'StravaCard', 'QuoteCard',
  'CursorTooltip', 'ActionIcon', 'ProjectCard', 'IconCard',
]

// Brand colour swatches — from tokens.css primitives
const SWATCHES = [
  { hex: '#008B8B', name: 'primary',   r: 0,   g: 139, b: 139 },
  { hex: '#9b87f5', name: 'schedule',  r: 155, g: 135, b: 245 },
  { hex: '#7c5cfc', name: 'purple',    r: 124, g: 92,  b: 252 },
  { hex: '#38b3e8', name: 'duolingo',  r: 56,  g: 179, b: 232 },
  { hex: '#fc4c02', name: 'strava',    r: 252, g: 76,  b: 2   },
  { hex: '#f9f9f9', name: 'surface',   r: 249, g: 249, b: 249 },
  { hex: '#2c2c2c', name: 'text',      r: 44,  g: 44,  b: 44  },
]

// Build pool: 50% tokens, 35% components, 15% swatches
const ELEMENT_POOL = []
TOKENS.forEach(t     => ELEMENT_POOL.push({ kind: 'token',     label: t }))
TOKENS.forEach(t     => ELEMENT_POOL.push({ kind: 'token',     label: t })) // double weight
COMPONENTS.forEach(c => ELEMENT_POOL.push({ kind: 'component', label: c }))
SWATCHES.forEach(s   => ELEMENT_POOL.push({ kind: 'swatch',    ...s }))

// ── Physics constants ─────────────────────────────────────────────────────────
const ATTRACT_RADIUS = 200
const ATTRACT_FORCE  = 0.018
const SPRING         = 0.06
const DAMPING        = 0.82

export default defineComponent({
  name: 'MagneticBackground',

  setup() {
    let canvas, ctx, raf
    let W = 0, H = 0
    let mx = 0, my = 0
    let shapes = []

    // ── Shape init ──────────────────────────────────────────────────────────
    function initShapes() {
      shapes = []
      const count = Math.floor((W * H) / 20000)
      const pool  = [...ELEMENT_POOL].sort(() => Math.random() - 0.5)
      const cols  = Math.ceil(Math.sqrt(count * (W / H)))
      const rows  = Math.ceil(count / cols)

      for (let i = 0; i < count; i++) {
        const el  = pool[i % pool.length]
        const col = i % cols
        const row = Math.floor(i / cols)
        const hx  = (col + 0.5 + (Math.random() - 0.5) * 0.7) * (W / cols)
        const hy  = (row + 0.5 + (Math.random() - 0.5) * 0.7) * (H / rows)

        shapes.push({
          hx, hy, x: hx, y: hy,
          vx: 0, vy: 0,
          kind:  el.kind,
          label: el.label || '',
          hex:   el.hex   || '',
          name:  el.name  || '',
          cr: el.r || 0, cg: el.g || 0, cb: el.b || 0,
          opacity: 0.14 + Math.random() * 0.2,
        })
      }
    }

    // ── Draw helpers ────────────────────────────────────────────────────────
    function drawTokenChip(s) {
      ctx.font = `500 10px ui-monospace, 'Cascadia Code', monospace`
      const tw  = ctx.measureText(s.label).width
      const pad = 9
      const bw  = tw + pad * 2 + 14
      const bh  = 22
      const bx  = s.x - bw / 2
      const by  = s.y - bh / 2

      ctx.beginPath()
      ctx.roundRect(bx, by, bw, bh, bh / 2)
      ctx.fillStyle = 'rgba(0,139,139,0.07)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(0,139,139,0.32)'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(bx + pad + 3, s.y, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,139,139,0.6)'
      ctx.fill()

      ctx.fillStyle = 'rgba(0,120,120,0.85)'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(s.label, bx + pad + 11, s.y + 0.5)
    }

    function drawComponentChip(s) {
      ctx.font = `500 11px Inter, system-ui, sans-serif`
      const tw  = ctx.measureText(s.label).width
      const pad = 10
      const bw  = tw + pad * 2 + 16
      const bh  = 24
      const bx  = s.x - bw / 2
      const by  = s.y - bh / 2

      ctx.beginPath()
      ctx.roundRect(bx, by, bw, bh, 6)
      ctx.fillStyle = 'rgba(124,92,252,0.05)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(124,92,252,0.26)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Diamond component icon
      const ix = bx + pad + 4
      const iy = s.y
      const is = 4.5
      ctx.save()
      ctx.translate(ix, iy)
      ctx.beginPath()
      ctx.moveTo(0, -is); ctx.lineTo(is * 0.866, 0)
      ctx.lineTo(0, is);  ctx.lineTo(-is * 0.866, 0)
      ctx.closePath()
      ctx.strokeStyle = 'rgba(124,92,252,0.52)'
      ctx.lineWidth = 1.2
      ctx.stroke()
      ctx.restore()

      ctx.fillStyle = 'rgba(100,70,220,0.78)'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(s.label, bx + pad + 13, s.y + 0.5)
    }

    function drawSwatch(s) {
      const sr = 14

      ctx.beginPath()
      ctx.arc(s.x, s.y - 6, sr, 0, Math.PI * 2)
      ctx.fillStyle = s.hex
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(s.x, s.y - 6, sr + 1.5, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${s.cr},${s.cg},${s.cb},0.25)`
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.font = `500 9px ui-monospace, monospace`
      ctx.fillStyle = 'rgba(71,85,105,0.65)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText(s.name, s.x, s.y + sr - 2)
    }

    // ── Physics ─────────────────────────────────────────────────────────────
    function updateShape(s) {
      const dx   = mx - s.x
      const dy   = my - s.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < ATTRACT_RADIUS) {
        const strength = (1 - dist / ATTRACT_RADIUS) * ATTRACT_FORCE
        s.vx += dx * strength
        s.vy += dy * strength
      }

      s.vx += (s.hx - s.x) * SPRING
      s.vy += (s.hy - s.y) * SPRING
      s.vx *= DAMPING
      s.vy *= DAMPING
      s.x  += s.vx
      s.y  += s.vy
    }

    // ── Render loop ─────────────────────────────────────────────────────────
    function draw() {
      ctx.clearRect(0, 0, W, H)

      shapes.forEach(s => {
        updateShape(s)
        ctx.globalAlpha = s.opacity
        if      (s.kind === 'token')     drawTokenChip(s)
        else if (s.kind === 'component') drawComponentChip(s)
        else if (s.kind === 'swatch')    drawSwatch(s)
        ctx.globalAlpha = 1
      })

      raf = requestAnimationFrame(draw)
    }

    // ── Mouse tracking ──────────────────────────────────────────────────────
    function onMouseMove(e) { mx = e.clientX; my = e.clientY }

    function onResize() {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
      initShapes()
    }

    // ── Lifecycle ───────────────────────────────────────────────────────────
    onMounted(() => {
      canvas = document.getElementById('magnetic-bg')
      ctx    = canvas.getContext('2d')
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
      mx = W / 2
      my = H / 2

      initShapes()
      draw()

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('resize',    onResize)
    })

    onUnmounted(() => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize',    onResize)
    })

    return () =>
      h('canvas', {
        id: 'magnetic-bg',
        style: {
          position:      'fixed',
          inset:         '0',
          width:         '100%',
          height:        '100%',
          zIndex:        '0',
          pointerEvents: 'none',
        },
      })
  },
})
