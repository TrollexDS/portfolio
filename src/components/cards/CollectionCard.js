import { defineComponent, h, ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import InteractiveTag from '../InteractiveTag.js'

/* ═══════════════════════════════════════════════════════════════
   CollectionCard — interactive Figma-style component demo
   Embedded in the Rayo Design System case study.
   Follows the same h()-render pattern as ColourVariables.js.
   ═══════════════════════════════════════════════════════════════ */

const P = 'cc' // CSS class prefix

/* ─── Local asset paths ── */
const ASSETS = {
  contentRail: 'src/assets/images/rayo/content-rail.png',
  fallbackBg:  'https://www.figma.com/api/mcp/asset/1187763d-e800-412f-b8a8-22e5035f2ef5',
}

const BG_PATH = 'src/assets/images/rayo/component-bg'
const GRADIENT_OPTIONS = ['Aqua', 'Yellow', 'Orange', 'Red', 'Primary']
const POSITION_OPTIONS = ['75%', '85%', '100%']
const CARD_SIZES = { small: { w: 375, h: 375 }, medium: { w: 834, h: 375 } }

function bgImageSrc(colour, position) {
  return `${BG_PATH}/Aqua=${colour}, Position=${position}.png`
}

/* ─── Sub-renderers ─────────────────────────────────────────── */

function renderArrowSvg() {
  return h('svg', { viewBox: '0 0 24 24', class: P+'-arrow-svg' },
    [h('path', { d: 'M5 12h14M13 6l6 6-6 6' })])
}

function renderSelect(modelRef, options, isValue) {
  return h('div', { class: P+'-figma-select' }, [
    h('select', {
      value: modelRef.value,
      onChange: e => { modelRef.value = e.target.value },
    }, options.map(opt => {
      const val = typeof opt === 'object' ? opt.value : opt
      const label = typeof opt === 'object' ? opt.label : opt
      return h('option', { value: val }, label)
    })),
  ])
}

function renderPanelRow(label, selectNode) {
  return h('div', { class: P+'-panel-row' }, [
    h('label', null, label),
    selectNode,
  ])
}

/* ─── Component ─────────────────────────────────────────────── */
export default defineComponent({
  name: 'CollectionCard',
  setup() {
    const image    = ref('Default')
    const device   = ref('small')
    const gradient = ref('Aqua')
    const position = ref('75%')

    const bgImagePath = computed(() => bgImageSrc(gradient.value, position.value))

    /* ── Scale to fit canvas ── */
    const canvasRef = ref(null)
    const scale = ref(1)

    function recalcScale() {
      if (!canvasRef.value) return
      const pad = 60
      const cw = canvasRef.value.clientWidth - pad
      const ch = canvasRef.value.clientHeight - pad
      const card = CARD_SIZES[device.value]
      scale.value = Math.min(1, cw / card.w, ch / card.h)
    }

    watch([gradient, position], () => { image.value = 'Default' })
    watch(device, () => nextTick(recalcScale))
    onMounted(() => { recalcScale(); window.addEventListener('resize', recalcScale) })
    onUnmounted(() => window.removeEventListener('resize', recalcScale))

    const scalerStyle = computed(() => {
      const card = CARD_SIZES[device.value]
      return {
        width: card.w + 'px',
        height: card.h + 'px',
        transform: `scale(${scale.value})`,
      }
    })

    /* ── Render ── */
    return () =>
      h('div', { class: P+'-outer' }, [
        h('div', { class: P+'-layout' }, [

          /* ═══ Canvas (left) ═══ */
          h('div', { class: P+'-canvas', ref: canvasRef }, [
            h('div', { class: P+'-scaler', style: scalerStyle.value }, [
              h('div', {
                class: P+'-card ' + P+'-size-' + device.value,
              }, [

                /* Gradient / Fallback background */
                image.value === 'Default'
                  ? h('div', { class: P+'-card-bg' }, [
                      h('img', { src: bgImagePath.value }),
                    ])
                  : h('div', { class: P+'-fallback-bg' }, [
                      h('img', { src: ASSETS.fallbackBg }),
                    ]),

                /* Card content */
                h('div', { class: P+'-card-content' }, [
                  h('div', { class: P+'-card-heading' }, [
                    h('div', { class: P+'-card-title' }, 'Your Party Is Starting'),
                    h('div', { class: P+'-icon-button' }, [renderArrowSvg()]),
                  ]),
                  h('img', {
                    class: P+'-content-rail',
                    src: ASSETS.contentRail,
                    alt: 'Content rail',
                  }),
                ]),
              ]),
            ]),
          ]),

          /* ═══ Control Panel (right) ═══ */
          h('div', { class: P+'-panel' }, [
            h('div', { class: P+'-panel-header' }, [
              h('h2', null, [
                'Collection Card ',
                h('span', { class: P+'-variant-tag' }, '(variant)'),
              ]),
            ]),
            renderPanelRow('Image', renderSelect(image, ['Default', 'Fallback'])),
            renderPanelRow('Device', renderSelect(device, [
              { value: 'small', label: 'small' },
              { value: 'medium', label: 'medium' },
            ])),
            h('div', { class: P+'-panel-section' }, [
              h('span', { class: P+'-section-caret' }),
              h('span', null, [
                'Card gradient bg ',
                h('span', { style: 'font-weight:400;color:#999;font-size:11px;' }, '(nested)'),
              ]),
            ]),
            renderPanelRow(gradient.value, renderSelect(gradient, GRADIENT_OPTIONS)),
            renderPanelRow('Position', renderSelect(position, POSITION_OPTIONS)),
          ]),
        ]),
        h(InteractiveTag, { hint: 'Change variant from the control panel' }),
      ])
  },
})
