import { defineComponent, h, ref, computed, Transition } from 'vue'
import InteractiveTag from '../InteractiveTag.js'

/* ─────────────────────────────────────────────────────────────
   Rayo Colour Variables — interactive Figma-style panel
   4 : 3 ratio, embedded in the Design System case study
   ───────────────────────────────────────────────────────────── */

// ── Primitives (Value.tokens.json) ──────────────────────────
const PRIMITIVES = {
  colour: {
    neutral: {
      'neutral-1000': { hex:'#160E21', alpha:1 },
      'neutral-900':  { hex:'#352A41', alpha:1 },
      'neutral-850':  { hex:'#42374E', alpha:1 },
      'neutral-750':  { hex:'#584F63', alpha:1 },
      'neutral-650':  { hex:'#6E6678', alpha:1 },
      'neutral-350':  { hex:'#B1ADB6', alpha:1 },
      'neutral-150':  { hex:'#DEDCE0', alpha:1 },
      'neutral-50':   { hex:'#F4F3F5', alpha:1 },
      'neutral-10':   { hex:'#FEFEFE', alpha:1 },
      'neutral-0':    { hex:'#FFFFFF', alpha:1 },
    },
    primary: {
      'purple-900': { hex:'#502485', alpha:1 },
      'purple-700': { hex:'#682FAD', alpha:1 },
      'purple-600': { hex:'#8E09FD', alpha:1 },
      'purple-500': { hex:'#9945FF', alpha:1 },
      'purple-300': { hex:'#C28FFF', alpha:1 },
      'purple-100': { hex:'#EBDAFF', alpha:1 },
      'purple-50':  { hex:'#F5ECFF', alpha:1 },
    },
    secondary: {
      'pink-600': { hex:'#F94DFD', alpha:1 },
      'pink-500': { hex:'#E367C0', alpha:1 },
      'aqua-500': { hex:'#4BF0F0', alpha:1 },
    },
    system: {
      'red-900':   { hex:'#2B181A', alpha:1 },
      'red-500':   { hex:'#DC3044', alpha:1 },
      'red-300':   { hex:'#E76E7C', alpha:1 },
      'red-100':   { hex:'#FCEAEC', alpha:1 },
      'green-500': { hex:'#28DE9C', alpha:1 },
      'green-300': { hex:'#237668', alpha:1 },
    },
    transparency: {
      'neutral-1000-90': { hex:'#160E21', alpha:0.9 },
      'neutral-1000-80': { hex:'#160E21', alpha:0.8 },
      'neutral-1000-25': { hex:'#160E21', alpha:0.25 },
      'neutral-1000-12': { hex:'#160E21', alpha:0.12 },
      'neutral-1000-0':  { hex:'#160E21', alpha:0 },
      'purple-900-0':    { hex:'#502485', alpha:0 },
      'neutral-750-50':  { hex:'#584F63', alpha:0.5 },
      'neutral-150-50':  { hex:'#DEDCE0', alpha:0.5 },
      'neutral-0-90':    { hex:'#FFFFFF', alpha:0.9 },
      'neutral-0-80':    { hex:'#FFFFFF', alpha:0.8 },
      'neutral-0-25':    { hex:'#FFFFFF', alpha:0.25 },
      'neutral-0-12':    { hex:'#FFFFFF', alpha:0.12 },
      'neutral-0-0':     { hex:'#FFFFFF', alpha:0 },
      'pink-500-25':     { hex:'#E367C0', alpha:0.25 },
      'purple-50-0':     { hex:'#F5ECFF', alpha:0 },
    },
    premium: {
      'premium-purple-200': { hex:'#260267', alpha:1 },
      'premium-purple-100': { hex:'#7606DC', alpha:1 },
      'premium-gold-200':   { hex:'#BA7F28', alpha:1 },
      'premium-gold-100':   { hex:'#FFCB46', alpha:1 },
    },
    switcher: {
      'left-pink-100':    { hex:'#F3E5FD', alpha:1 },
      'left-pink-0':      { hex:'#F1E1FD', alpha:0 },
      'right-pink-100':   { hex:'#F1E4FF', alpha:1 },
      'right-pink-0':     { hex:'#EBD9FF', alpha:0 },
      'left-purple-100':  { hex:'#57268B', alpha:1 },
      'left-purple-0':    { hex:'#57258C', alpha:0 },
      'right-purple-100': { hex:'#52238A', alpha:1 },
      'right-purple-0':   { hex:'#582193', alpha:0 },
    },
    iOS26: {
      'glass-light-top':    { hex:'#FFFFFF', alpha:0.16 },
      'glass-light-bottom': { hex:'#FFFFFF', alpha:0.34 },
      'glass-dark-top':     { hex:'#000000', alpha:0.16 },
      'glass-dark-bottom':  { hex:'#000000', alpha:0.34 },
    },
  },
  spacing: {
    'half':{ v:4 },'1':{ v:8 },'2':{ v:16 },'3':{ v:24 },'4':{ v:32 },
    '5':{ v:40 },'6':{ v:48 },'7':{ v:56 },'8':{ v:64 },'9':{ v:72 },'10':{ v:80 },
  },
  radius: {
    'sm':{ v:4 },'md':{ v:8 },'lg':{ v:16 },'xl':{ v:32 },'2xl':{ v:128 },'3xl':{ v:360 },
  },
}

// ── Tokens (Light.tokens.json / Dark.tokens.json) ──────────
const LIGHT = {
  Primary: {
    'primary':          { hex:'#9945FF', alpha:1, alias:'colour/primary/purple-500' },
    'primary-light':    { hex:'#C28FFF', alpha:1, alias:'colour/primary/purple-300' },
    'primary-lightest': { hex:'#F5ECFF', alpha:1, alias:'colour/primary/purple-50' },
    'primary-dark':     { hex:'#682FAD', alpha:1, alias:'colour/primary/purple-700' },
    'primary-darker':   { hex:'#502485', alpha:1, alias:'colour/primary/purple-900' },
  },
  Secondary: {
    'pink': { hex:'#E367C0', alpha:1, alias:'colour/secondary/pink-500' },
    'aqua': { hex:'#4BF0F0', alpha:1, alias:'colour/secondary/aqua-500' },
  },
  Neutral: {
    'neutral-constant-1000': { hex:'#160E21', alpha:1, alias:'colour/neutral/neutral-1000' },
    'neutral-constant-50':   { hex:'#F4F3F5', alpha:1, alias:'colour/neutral/neutral-50' },
    'neutral-constant-150':  { hex:'#DEDCE0', alpha:1, alias:'colour/neutral/neutral-150' },
    'neutral-constant-0':    { hex:'#FFFFFF', alpha:1, alias:'colour/neutral/neutral-0' },
    'neutral':               { hex:'#160E21', alpha:1, alias:'colour/neutral/neutral-1000' },
    'neutral-invert':        { hex:'#FFFFFF', alpha:1, alias:'colour/neutral/neutral-0' },
    'neutral-lightest':      { hex:'#FEFEFE', alpha:1, alias:'colour/neutral/neutral-10' },
    'neutral-light':         { hex:'#F4F3F5', alpha:1, alias:'colour/neutral/neutral-50' },
    'neutral-dark':          { hex:'#DEDCE0', alpha:1, alias:'colour/neutral/neutral-150' },
    'neutral-darker':        { hex:'#6E6678', alpha:1, alias:'colour/neutral/neutral-650' },
    'neutral-opaque':        { hex:'#160E21', alpha:0.25, alias:'colour/transparency/neutral-1000-25' },
    'neutral-80':            { hex:'#160E21', alpha:0.8, alias:'colour/transparency/neutral-1000-80' },
  },
  System: {
    'red':       { hex:'#DC3044', alpha:1, alias:'colour/system/red-500' },
    'red-light': { hex:'#FCEAEC', alpha:1, alias:'colour/system/red-100' },
    'green':     { hex:'#28DE9C', alpha:1, alias:'colour/system/green-500' },
  },
  Gradient: {
    'Gradient-0':          { hex:'#FFFFFF', alpha:0,    alias:'colour/transparency/neutral-0-0' },
    'Gradient-25':         { hex:'#FFFFFF', alpha:0.25, alias:'colour/transparency/neutral-0-25' },
    'Gradient-80':         { hex:'#FFFFFF', alpha:0.8,  alias:'colour/transparency/neutral-0-80' },
    'Gradient-90':         { hex:'#FFFFFF', alpha:0.9,  alias:'colour/transparency/neutral-0-90' },
    'Gradient-100':        { hex:'#FFFFFF', alpha:1,    alias:'colour/neutral/neutral-0' },
    'gradient-purple-0':   { hex:'#502485', alpha:0,    alias:'colour/transparency/purple-900-0' },
    'gradient-purple-100': { hex:'#502485', alpha:1,    alias:'colour/primary/purple-900' },
    'gradient-pink-0':     { hex:'#E367C0', alpha:0.25, alias:'colour/transparency/pink-500-25' },
    'gradient-surface-0':  { hex:'#F5ECFF', alpha:0,    alias:'colour/transparency/purple-50-0' },
  },
  Switcher: {
    'left-100':  { hex:'#F3E5FD', alpha:1, alias:'colour/switcher/left-pink-100' },
    'left-0':    { hex:'#F1E1FD', alpha:0, alias:'colour/switcher/left-pink-0' },
    'right-100': { hex:'#F1E4FF', alpha:1, alias:'colour/switcher/right-pink-100' },
    'right-0':   { hex:'#EBD9FF', alpha:0, alias:'colour/switcher/right-pink-0' },
  },
  iOS26: {
    'glass-top':    { hex:'#FFFFFF', alpha:0.16, alias:'colour/iOS26/glass-light-top' },
    'glass-bottom': { hex:'#FFFFFF', alpha:0.34, alias:'colour/iOS26/glass-light-bottom' },
  },
}

const DARK = {
  Primary: {
    'primary':          { hex:'#C28FFF', alpha:1, alias:'colour/primary/purple-300' },
    'primary-light':    { hex:'#9945FF', alpha:1, alias:'colour/primary/purple-500' },
    'primary-lightest': { hex:'#502485', alpha:1, alias:'colour/primary/purple-900' },
    'primary-dark':     { hex:'#EBDAFF', alpha:1, alias:'colour/primary/purple-100' },
    'primary-darker':   { hex:'#EBDAFF', alpha:1, alias:'colour/primary/purple-100' },
  },
  Secondary: {
    'pink': { hex:'#E367C0', alpha:1, alias:'colour/secondary/pink-500' },
    'aqua': { hex:'#4BF0F0', alpha:1, alias:'colour/secondary/aqua-500' },
  },
  Neutral: {
    'neutral-constant-1000': { hex:'#160E21', alpha:1, alias:'colour/neutral/neutral-1000' },
    'neutral-constant-50':   { hex:'#F4F3F5', alpha:1, alias:'colour/neutral/neutral-50' },
    'neutral-constant-150':  { hex:'#DEDCE0', alpha:1, alias:'colour/neutral/neutral-150' },
    'neutral-constant-0':    { hex:'#FFFFFF', alpha:1, alias:'colour/neutral/neutral-0' },
    'neutral':               { hex:'#FFFFFF', alpha:1, alias:'colour/neutral/neutral-0' },
    'neutral-invert':        { hex:'#160E21', alpha:1, alias:'colour/neutral/neutral-1000' },
    'neutral-lightest':      { hex:'#352A41', alpha:1, alias:'colour/neutral/neutral-900' },
    'neutral-light':         { hex:'#42374E', alpha:1, alias:'colour/neutral/neutral-850' },
    'neutral-dark':          { hex:'#584F63', alpha:1, alias:'colour/neutral/neutral-750' },
    'neutral-darker':        { hex:'#B1ADB6', alpha:1, alias:'colour/neutral/neutral-350' },
    'neutral-opaque':        { hex:'#FFFFFF', alpha:0.25, alias:'colour/transparency/neutral-0-25' },
    'neutral-80':            { hex:'#FFFFFF', alpha:0.8, alias:'colour/transparency/neutral-0-80' },
  },
  System: {
    'red':       { hex:'#E76E7C', alpha:1, alias:'colour/system/red-300' },
    'red-light': { hex:'#2B181A', alpha:1, alias:'colour/system/red-900' },
    'green':     { hex:'#237668', alpha:1, alias:'colour/system/green-300' },
  },
  Gradient: {
    'Gradient-0':          { hex:'#160E21', alpha:0,    alias:'colour/transparency/neutral-1000-0' },
    'Gradient-25':         { hex:'#160E21', alpha:0.25, alias:'colour/transparency/neutral-1000-25' },
    'Gradient-80':         { hex:'#160E21', alpha:0.8,  alias:'colour/transparency/neutral-1000-80' },
    'Gradient-90':         { hex:'#160E21', alpha:0.9,  alias:'colour/transparency/neutral-1000-90' },
    'Gradient-100':        { hex:'#160E21', alpha:1,    alias:'colour/neutral/neutral-1000' },
    'gradient-purple-0':   { hex:'#502485', alpha:0,    alias:'colour/transparency/purple-900-0' },
    'gradient-purple-100': { hex:'#502485', alpha:1,    alias:'colour/primary/purple-900' },
    'gradient-pink-0':     { hex:'#E367C0', alpha:0.25, alias:'colour/transparency/pink-500-25' },
    'gradient-surface-0':  { hex:'#F5ECFF', alpha:0,    alias:'colour/transparency/purple-50-0' },
  },
  Switcher: {
    'left-100':  { hex:'#57268B', alpha:1, alias:'colour/switcher/left-purple-100' },
    'left-0':    { hex:'#57258C', alpha:0, alias:'colour/switcher/left-purple-0' },
    'right-100': { hex:'#52238A', alpha:1, alias:'colour/switcher/right-purple-100' },
    'right-0':   { hex:'#582193', alpha:0, alias:'colour/switcher/right-purple-0' },
  },
  iOS26: {
    'glass-top':    { hex:'#000000', alpha:0.16, alias:'colour/iOS26/glass-dark-top' },
    'glass-bottom': { hex:'#000000', alpha:0.34, alias:'colour/iOS26/glass-dark-bottom' },
  },
}

// ── Helpers ─────────────────────────────────────────────────
function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha ?? 1})`
}

// ── Build flat row arrays ───────────────────────────────────
function buildPrimitiveRows() {
  const rows = []
  const colourGroups = ['neutral','primary','secondary','system','transparency','premium','switcher','iOS26']
  for (const gName of colourGroups) {
    const vars = PRIMITIVES.colour[gName]
    if (!vars) continue
    rows.push({ t:'h', label: gName, parent:'colour', group:'colour/'+gName })
    for (const [name, val] of Object.entries(vars)) {
      rows.push({ t:'v', name, dt:'color', val, group:'colour/'+gName, top:'colour' })
    }
  }
  for (const cat of ['spacing','radius']) {
    const vars = PRIMITIVES[cat]
    if (!vars) continue
    rows.push({ t:'h', label: cat, parent:null, group: cat })
    for (const [name, val] of Object.entries(vars)) {
      rows.push({ t:'v', name, dt:'number', val: val.v, group: cat, top: cat })
    }
  }
  return rows
}

function buildTokenRows() {
  const rows = []
  const allGroups = [...new Set([...Object.keys(LIGHT), ...Object.keys(DARK)])]
  for (const gName of allGroups) {
    const lg = LIGHT[gName] || {}
    const dg = DARK[gName]  || {}
    const allVars = [...new Set([...Object.keys(lg), ...Object.keys(dg)])]
    rows.push({ t:'h', label: gName, parent:null, group: gName })
    for (const name of allVars) {
      const lv = lg[name], dv = dg[name]
      const isColor = (lv && typeof lv === 'object') || (dv && typeof dv === 'object')
      rows.push({
        t:'v', name, dt: isColor ? 'color' : 'number',
        lv: isColor ? (lv||null) : (lv??null),
        dv: isColor ? (dv||null) : (dv??null),
        la: isColor && lv ? lv.alias : null,
        da: isColor && dv ? dv.alias : null,
        group: gName, top: gName,
      })
    }
  }
  return rows
}

const primRows = buildPrimitiveRows()
const tokRows  = buildTokenRows()

// ── Sub-renderers ───────────────────────────────────────────
const SG = 'cv'  // style scope prefix

function swatch(hex, alpha) {
  return h('span', { class: SG+'-swatch' }, [
    h('span', { class: SG+'-swatch-fill', style: { background: hexToRgba(hex, alpha) } }),
  ])
}

function aliasPill(val) {
  return h('span', { class: SG+'-alias' }, [
    swatch(val.hex, val.alpha),
    val.alias,
  ])
}

// ── Component ───────────────────────────────────────────────
export default defineComponent({
  name: 'ColourVariables',
  setup() {
    const col    = ref('primitives')   // 'primitives' | 'tokens'
    const group  = ref('All')
    const search = ref('')

    // sidebar
    const sidebar = computed(() => {
      if (col.value === 'primitives') {
        const items = []
        const children = ['neutral','primary','secondary','system','transparency','premium','switcher','iOS26']
        const colourCount = primRows.filter(r => r.t === 'v' && r.top === 'colour').length
        items.push({ key:'colour', label:'colour', count: colourCount, indent:0 })
        for (const c of children) {
          const n = primRows.filter(r => r.t === 'v' && r.group === 'colour/'+c).length
          if (n) items.push({ key:'colour/'+c, label: c, count: n, indent:1 })
        }
        const sp = primRows.filter(r => r.t === 'v' && r.group === 'spacing').length
        if (sp) items.push({ key:'spacing', label:'spacing', count: sp, indent:0 })
        const rd = primRows.filter(r => r.t === 'v' && r.group === 'radius').length
        if (rd) items.push({ key:'radius', label:'radius', count: rd, indent:0 })
        return items
      }
      const items = []
      const seen = new Set()
      for (const r of tokRows) { if (r.t === 'v' && !seen.has(r.group)) seen.add(r.group) }
      for (const g of seen) {
        items.push({ key: g, label: g, count: tokRows.filter(r => r.t === 'v' && r.group === g).length, indent:0 })
      }
      return items
    })

    const total = computed(() => {
      const rows = col.value === 'primitives' ? primRows : tokRows
      return rows.filter(r => r.t === 'v').length
    })

    const rows = computed(() => {
      const src = col.value === 'primitives' ? primRows : tokRows
      const q   = search.value.toLowerCase().trim()
      const g   = group.value
      return src.filter(r => {
        if (g !== 'All') {
          if (col.value === 'primitives' && g === 'colour') {
            if (r.t === 'v' && r.top !== 'colour') return false
            if (r.t === 'h' && !r.group?.startsWith('colour/')) return false
          } else {
            if (r.group !== g) return false
          }
        }
        if (q) {
          if (r.t === 'h') return true
          const nm = r.name.toLowerCase().includes(q)
          let vm = false
          if (r.val && r.val.hex) vm = r.val.hex.toLowerCase().includes(q)
          if (r.la) vm = vm || r.la.toLowerCase().includes(q)
          if (r.da) vm = vm || r.da.toLowerCase().includes(q)
          if (r.lv && r.lv.hex) vm = vm || r.lv.hex.toLowerCase().includes(q)
          if (r.dv && r.dv.hex) vm = vm || r.dv.hex.toLowerCase().includes(q)
          return nm || vm
        }
        return true
      })
    })

    // ── render ──
    // aria-hidden on the demo wrap: decorative interactive Variables explorer.
    // Token names, hex values, and tab labels would otherwise leak into
    // Reader Mode and screen readers as run-on noise alongside the prose.
    return () =>
      h('div', { class: SG+'-outer' }, [
      h('div', { class: SG+'-wrap', 'aria-hidden': 'true' }, [

        // ── Top bar ──
        h('div', { class: SG+'-topbar' }, [
          h('div', { class: SG+'-topbar-left' }, [
            h('span', { class: SG+'-title' }, 'Variables'),
            h('span', {
              class: SG+'-tab' + (col.value === 'primitives' ? ' '+SG+'-tab--on' : ''),
              onClick: () => { col.value = 'primitives'; group.value = 'All'; search.value = '' },
            }, 'Primitives'),
            h('span', {
              class: SG+'-tab' + (col.value === 'tokens' ? ' '+SG+'-tab--on' : ''),
              onClick: () => { col.value = 'tokens'; group.value = 'All'; search.value = '' },
            }, 'Tokens'),
          ]),
          h('div', { class: SG+'-search' }, [
            h('svg', { width:13, height:13, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':2, innerHTML:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' }),
            h('input', {
              value: search.value,
              placeholder: 'Search',
              onInput: e => { search.value = e.target.value },
            }),
          ]),
        ]),

        // ── Body ──
        h('div', { class: SG+'-body' }, [

          // Sidebar
          h('div', { class: SG+'-side' }, [
            h('div', { class: SG+'-side-label' }, 'Groups'),
            h('div', {
              class: SG+'-side-item' + (group.value === 'All' ? ' '+SG+'-side-item--on' : ''),
              onClick: () => { group.value = 'All' },
            }, [
              h('span', null, 'All'),
              h('span', { class: SG+'-side-count' }, String(total.value)),
            ]),
            ...sidebar.value.map(s =>
              h('div', {
                class: SG+'-side-item'
                  + (group.value === s.key ? ' '+SG+'-side-item--on' : '')
                  + (s.indent ? ' '+SG+'-side-item--i'+s.indent : ''),
                onClick: () => { group.value = s.key },
              }, [
                h('span', null, s.label),
                h('span', { class: SG+'-side-count' }, String(s.count)),
              ])
            ),
          ]),

          // Table
          h('div', { class: SG+'-table' }, [

            // Column header
            h('div', { class: SG+'-thead' }, [
              h('span', { class: SG+'-col-name' }, 'Name'),
              ...(col.value === 'primitives'
                ? [h('span', { class: SG+'-col-val' }, 'Value')]
                : [h('span', { class: SG+'-col-val' }, 'Light'), h('span', { class: SG+'-col-val' }, 'Dark')]
              ),
            ]),

            // Rows
            h('div', { class: SG+'-rows' },
              rows.value.length
                ? rows.value.map((r, i) =>
                    r.t === 'h'
                      ? h('div', { class: SG+'-gh', key:'h'+i }, [
                          r.parent ? h('span', { class: SG+'-gh-path' }, r.parent + ' / ') : null,
                          h('span', { class: SG+'-gh-name' }, r.label),
                        ])
                      : h('div', { class: SG+'-row', key:'v'+i }, [
                          h('span', { class: SG+'-col-name '+SG+'-row-name' }, r.name),

                          ...(col.value === 'primitives'
                            ? [
                                h('span', { class: SG+'-col-val' },
                                  r.dt === 'color'
                                    ? [swatch(r.val.hex, r.val.alpha), h('span',null,r.val.hex), r.val.alpha < 1 ? h('span',{class:SG+'-muted'},' '+Math.round(r.val.alpha*100)+'%') : null]
                                    : [h('span',{class:SG+'-num'},String(r.val))]
                                ),
                              ]
                            : [
                                h('span', { class: SG+'-col-val' },
                                  r.dt === 'color' && r.lv ? [aliasPill(r.lv)] : r.lv != null ? [h('span',{class:SG+'-num'},String(r.lv))] : null
                                ),
                                h('span', { class: SG+'-col-val' },
                                  r.dt === 'color' && r.dv ? [aliasPill(r.dv)] : r.dv != null ? [h('span',{class:SG+'-num'},String(r.dv))] : null
                                ),
                              ]
                          ),
                        ])
                  )
                : [h('div', { class: SG+'-empty' }, 'No variables match your search.')]
            ),
          ]),
        ]),
      ]),
      h(InteractiveTag, { hint: 'Explore our colour variables' }),
      ])
  },
})
