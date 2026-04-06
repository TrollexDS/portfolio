import { defineComponent, h, ref, computed, onMounted, onUnmounted } from 'vue'
import CaseStudyOverlay from '../CaseStudyOverlay.js'
import TldrToggle from '../TldrToggle.js'
import InteractiveTag from '../InteractiveTag.js'
import { useResponsiveScale } from '../../composables/useResponsiveScale.js'

const VIDEO_SRC = 'src/assets/videos/rayo-schedule.mp4'

// ── Image assets ──
const IMG_MOCKUP         = 'src/assets/images/rayo/schedule/schedule-iphone-mockup.png'
const IMG_STATION_EPIC   = 'src/assets/images/rayo/schedule/station-page-epic.png'
const IMG_IA_EXPLORATIONS = 'src/assets/images/rayo/schedule/IA-Explorations.jpg'
const IMG_TREE_TEST_IA   = 'src/assets/images/rayo/schedule/tree-test-IA.jpg'
const IMG_JOURNEY_MAP    = 'src/assets/images/rayo/schedule/user-journey-mapping.jpg'
const IMG_BOARD_KNOW     = 'src/assets/images/rayo/schedule/workshop-what-we-know.png'
const IMG_BOARD_HUB      = 'src/assets/images/rayo/schedule/workshop-station-hub.jpg'
const IMG_BOARD_NEEDS    = 'src/assets/images/rayo/schedule/user story.jpg'
const IMG_RADIO_A        = 'src/assets/images/rayo/schedule/radio-page-a.png'
const IMG_RADIO_B        = 'src/assets/images/rayo/schedule/radio-page-b.png'
const IMG_RADIO_C        = 'src/assets/images/rayo/schedule/radio-page-c.png'
const IMG_PROTO_HEADER       = 'src/assets/images/rayo/schedule/prototype-header.png'
const IMG_PROTO_HEADER_MAGIC = 'src/assets/images/rayo/schedule/prototype-header-magic.png'
const IMG_PROTO_NAV          = 'src/assets/images/rayo/schedule/prototype-nav.png'
const IMG_STATION_HOME       = 'src/assets/images/rayo/schedule/station-page-home.png'
const IMG_STATION_TRACKLIST  = 'src/assets/images/rayo/schedule/station-page-tracklist.png'
const IMG_STATION_SHOWS      = 'src/assets/images/rayo/schedule/station-page-shows.png'
const IMG_SCHEDULE_PAGE  = 'src/assets/images/rayo/schedule/schedule-page.png'

// ── Schedule antonym annotation cards ──
// Positions at 680px design width. Phone screenshot centred at 225×488.
const SCH_ANTONYM_H            = 580
const SCH_ANTONYM_SCREENSHOT_W = 225
const SCH_ANTONYM_SCREENSHOT_H = 488
const SCH_ANTONYM_CARD_W       = 172

const SCH_CARDS = [
  { id: 'station-switcher', title: 'Station switcher',  desc: 'Quickly jump between stations without leaving the schedule.',                                  left: 22,  top: 80 },
  { id: 'local-split',      title: 'Local split',       desc: 'Switch between local splits so listeners always find their regional schedule.',                  left: 486, top: 52  },
  { id: 'date-picker',      title: 'Date picker',       desc: 'Scroll back for catch-up or forward to see what\u2019s on next - all from one row of tabs.', left: 486, top: 198 },
  { id: 'on-air',           title: 'On-air',            desc: 'The live show stands out instantly so listeners can tap and tune in without thinking.',           left: 22,  top: 240 },
  { id: 'play-button',      title: 'Play button',       desc: 'One tap to start any show - live or catch-up - straight from the schedule.',           left: 486, top: 360 },
]

const SCH_MOBILE_CARDS = SCH_CARDS

// Hover zones on the screenshot (percentages of 375×812 image)
const SCH_ZONES = [
  { id: 'local-split',      left: '84%', top: '5.5%',  width: '12%', height: '6%'  },
  { id: 'station-switcher', left: '5%',  top: '13%',   width: '90%', height: '8%'  },
  { id: 'date-picker',      left: '2%',  top: '22%',   width: '96%', height: '7%'  },
  { id: 'on-air',           left: '3%',  top: '40%',   width: '94%', height: '13%' },
  { id: 'play-button',      left: '78%', top: '41%',   width: '18%', height: '10%' },
]

const ScheduleAntonym = defineComponent({
  name: 'ScheduleAntonym',
  setup() {
    const { containerW: schW, scale: schScale, canHover: schCanHover } = useResponsiveScale(680)
    const active = ref(null)

    return () => {
      const s = schScale.value
      const hover = schCanHover.value

      // ── Mobile: flex layout ──
      if (!hover) {
        return h('div', {
          class: 'cs-antonym-section cs-antonym-section--mobile',
          style: { width: schW.value + 'px' },
        }, [
          h('div', { class: 'cs-antonym-mobile-cards' },
            SCH_MOBILE_CARDS.map(card =>
              h('div', { key: card.id, class: 'cs-antonym-card' }, [
                h('p', { class: 'cs-antonym-card-title' }, card.title),
                h('p', { class: 'cs-antonym-card-desc' }, card.desc),
              ])
            )
          ),
          h('div', { class: 'cs-antonym-mobile-screenshot' }, [
            h('img', {
              class: 'cs-antonym-screenshot',
              src: IMG_SCHEDULE_PAGE,
              alt: 'Schedule page design',
            }),
          ]),
        ])
      }

      // ── Desktop: absolute positioning ──
      return h('div', {
        class: 'cs-antonym-section',
        style: { width: schW.value + 'px', height: Math.round(SCH_ANTONYM_H * s) + 'px' },
        onMouseleave: () => { active.value = null },
      }, [
        h('div', {
          class: 'cs-antonym-screenshot-wrap',
          style: {
            left: 'calc(50% - ' + Math.round(SCH_ANTONYM_SCREENSHOT_W * s / 2) + 'px)',
            top:  Math.round(50 * s) + 'px',
            width:  Math.round(SCH_ANTONYM_SCREENSHOT_W * s) + 'px',
            height: Math.round(SCH_ANTONYM_SCREENSHOT_H * s) + 'px',
          },
        }, [
          h('img', {
            class: 'cs-antonym-screenshot',
            src: IMG_SCHEDULE_PAGE,
            alt: 'Schedule page design',
          }),
          // Hover zones over the screenshot — highlight when zone or its card is active
          ...SCH_ZONES.map(zone =>
            h('div', {
              key: zone.id,
              class: ['cs-antonym-zone', active.value === zone.id ? 'cs-antonym-zone--active' : ''].filter(Boolean).join(' '),
              style: {
                position: 'absolute',
                left: zone.left, top: zone.top,
                width: zone.width, height: zone.height,
              },
              onMouseenter: () => { active.value = zone.id },
              onMouseleave: () => { active.value = null },
            })
          ),
        ]),

        ...SCH_CARDS.map(card =>
          h('div', {
            key: card.id,
            class: 'cs-antonym-card-wrapper',
            style: {
              left:  Math.round(card.left * s) + 'px',
              top:   Math.round(card.top * s)  + 'px',
              width: Math.round(SCH_ANTONYM_CARD_W * s) + 'px',
            },
            onMouseenter: () => { active.value = card.id },
            onMouseleave: () => { active.value = null },
          }, [
            h('div', {
              class: 'cs-antonym-card',
              style: { opacity: active.value && active.value !== card.id ? 0.3 : 1 },
            }, [
              h('p', { class: 'cs-antonym-card-title' }, card.title),
              h('p', { class: 'cs-antonym-card-desc' }, card.desc),
            ]),
          ])
        ),
      ])
    }
  },
})

// ── Zoomable/pannable image viewer ──
const ZOOM_STEPS = 3  // number of clicks from min to max

const ZoomableImage = defineComponent({
  name: 'ZoomableImage',
  props: {
    src:  { type: String, required: true },
    alt:  { type: String, default: '' },
  },
  setup(props) {
    // Only these refs trigger Vue re-renders
    const btnState = ref({ canIn: false, canOut: false })
    const loaded = ref(false)

    const EDGE_PAD = 24
    let vpW = 680
    let vpH = 448
    let baseWidth = 100
    let maxWidth  = 632
    let curWidth  = 100
    let imgNatW = 1
    let imgNatH = 1
    let resizeObs = null
    let scrollEl = null  // the .cs-zoom-scroll container
    let imgEl = null

    function stepSize() { return (maxWidth - baseWidth) / ZOOM_STEPS }

    function updateBtnState() {
      btnState.value = {
        canIn:  curWidth < maxWidth - 0.5,
        canOut: curWidth > baseWidth + 0.5,
      }
    }

    function recalc() {
      // baseWidth: image width when entire image fits in container with padding
      const fitScale = Math.min((vpW - EDGE_PAD * 2) / imgNatW, (vpH - EDGE_PAD * 2) / imgNatH)
      baseWidth = imgNatW * fitScale
      // maxWidth: image width fills container minus padding
      maxWidth = vpW - EDGE_PAD * 2
    }

    function applyWidth(w) {
      curWidth = w
      if (!imgEl) return
      imgEl.style.width = w + 'px'
    }

    function centreInContainer() {
      if (!scrollEl || !imgEl) return
      // Centre horizontally and vertically in the scroll container
      const imgH = (curWidth / imgNatW) * imgNatH
      const padLeft = Math.max(EDGE_PAD, (vpW - curWidth) / 2)
      const padTop  = Math.max(EDGE_PAD, (vpH - imgH) / 2)
      imgEl.style.marginLeft = padLeft + 'px'
      imgEl.style.marginRight = padLeft + 'px'
      imgEl.style.marginTop = padTop + 'px'
      imgEl.style.marginBottom = padTop + 'px'
    }

    function fit() {
      if (imgNatW <= 1 || vpW === 0) return
      recalc()
      applyWidth(baseWidth)
      centreInContainer()
      loaded.value = true
      // Scroll to centre
      if (scrollEl) {
        scrollEl.scrollTop = (scrollEl.scrollHeight - vpH) / 2
        scrollEl.scrollLeft = (scrollEl.scrollWidth - vpW) / 2
      }
      updateBtnState()
    }

    function zoom(newWidth) {
      if (!scrollEl) return
      // Remember centre point before zoom
      const oldW = curWidth
      const oldH = (oldW / imgNatW) * imgNatH
      const centreY = (scrollEl.scrollTop + vpH / 2) / (oldH + Math.max(EDGE_PAD, (vpH - oldH) / 2) * 2)
      const centreX = (scrollEl.scrollLeft + vpW / 2) / (oldW + Math.max(EDGE_PAD, (vpW - oldW) / 2) * 2)

      applyWidth(newWidth)
      centreInContainer()

      // Restore centre point after zoom
      const newH = (newWidth / imgNatW) * imgNatH
      const totalH = newH + Math.max(EDGE_PAD, (vpH - newH) / 2) * 2
      const totalW = newWidth + Math.max(EDGE_PAD, (vpW - newWidth) / 2) * 2
      scrollEl.scrollTop  = centreY * totalH - vpH / 2
      scrollEl.scrollLeft = centreX * totalW - vpW / 2

      updateBtnState()
    }

    function zoomIn() {
      if (curWidth >= maxWidth - 0.5) return
      zoom(Math.min(maxWidth, curWidth + stepSize()))
    }

    function zoomOut() {
      if (curWidth <= baseWidth + 0.5) return
      zoom(Math.max(baseWidth, curWidth - stepSize()))
    }

    function onImgLoad(e) {
      imgEl   = e.target
      imgNatW = e.target.naturalWidth
      imgNatH = e.target.naturalHeight
      fit()
    }

    // Pinch-to-zoom via trackpad (fires as wheel + ctrlKey)
    let pinchTimer = null
    function onWheel(e) {
      if (!e.ctrlKey) return          // normal scroll — let it through
      e.preventDefault()
      // Disable CSS transition during continuous pinch for instant feedback
      if (imgEl) imgEl.style.transition = 'none'
      clearTimeout(pinchTimer)
      pinchTimer = setTimeout(() => {
        if (imgEl) imgEl.style.transition = ''
      }, 150)

      const sensitivity = 2
      const delta = -e.deltaY * sensitivity
      const newWidth = Math.min(maxWidth, Math.max(baseWidth, curWidth + delta))
      if (Math.abs(newWidth - curWidth) < 0.1) return
      zoom(newWidth)
    }

    onMounted(() => {
      scrollEl = document.querySelector('.cs-zoom-scroll')
      // Attach wheel listener with { passive: false } so we can preventDefault on pinch
      if (scrollEl) {
        scrollEl.addEventListener('wheel', onWheel, { passive: false })
      }
      resizeObs = new ResizeObserver(entries => {
        const cr = entries[0].contentRect
        vpW = cr.width
        vpH = cr.height
        if (imgNatW > 1) fit()
      })
      const el = document.querySelector('.cs-zoom-viewer')
      if (el) resizeObs.observe(el)
    })

    onUnmounted(() => {
      if (scrollEl) scrollEl.removeEventListener('wheel', onWheel)
      if (resizeObs) resizeObs.disconnect()
    })

    return () =>
      h('div', { class: 'cs-zoom-viewer cs-cover-img' }, [
        h('div', { class: 'cs-zoom-scroll' }, [
          h('img', {
            src: props.src,
            alt: props.alt,
            class: 'cs-zoom-img',
            draggable: false,
            onLoad: onImgLoad,
            style: { opacity: loaded.value ? 1 : 0 },
          }),
        ]),
        h('div', { class: 'cs-zoom-controls' }, [
          h('button', {
            class: ['cs-zoom-btn', !btnState.value.canIn ? 'cs-zoom-btn--disabled' : ''].filter(Boolean).join(' '),
            onClick: zoomIn,
            disabled: !btnState.value.canIn,
            'aria-label': 'Zoom in',
          }, '+'),
          h('button', {
            class: ['cs-zoom-btn', !btnState.value.canOut ? 'cs-zoom-btn--disabled' : ''].filter(Boolean).join(' '),
            onClick: zoomOut,
            disabled: !btnState.value.canOut,
            'aria-label': 'Zoom out',
          }, '\u2212'),
        ]),
      ])
  },
})

// ── Miro-style board viewer with multiple positioned boards ──
// Layout from the workshop screenshot:
//   Left column:  "What we know so far" (tall, narrow)
//   Right top:    "What is the Station Hub" (wide)
//   Right bottom: User needs / user stories
//
// Canvas size chosen so boards fit with spacing between them.
// Board positions (in canvas px) derived from the reference screenshot.

const MIRO_BOARDS = [
  { src: IMG_BOARD_KNOW,  x: 40,  y: 40,  w: 825,  h: 1576, alt: 'What we know so far' },
  { src: IMG_BOARD_HUB,   x: 920, y: 40,  w: 1350, h: 1172, alt: 'What is the Station Hub' },
  { src: IMG_BOARD_NEEDS, x: 920, y: 1270, w: 1350, h: 960, alt: 'User needs and user stories' },
]
const MIRO_CANVAS_W = 2340
const MIRO_CANVAS_H = 2290

const MiroBoard = defineComponent({
  name: 'MiroBoard',
  setup() {
    const btnState = ref({ canIn: false, canOut: false })
    const loaded = ref(false)

    const EDGE_PAD = 24
    const ZOOM_STEPS_M = 4
    let vpW = 680, vpH = 448
    let baseScale = 0.2, maxScale = 1, curScale = 0.2
    let resizeObs = null
    let scrollEl = null
    let canvasEl = null
    let loadCount = 0

    // Multiplicative step ratio so each click feels the same proportional jump
    // 4 clicks from 1x to 5x → each click multiplies by 5^(1/4) ≈ 1.495
    let stepRatio = Math.pow(5, 1 / ZOOM_STEPS_M)

    function updateBtnState() {
      btnState.value = {
        canIn:  curScale < maxScale - 0.001,
        canOut: curScale > baseScale + 0.001,
      }
    }

    function recalc() {
      baseScale = Math.min((vpW - EDGE_PAD * 2) / MIRO_CANVAS_W, (vpH - EDGE_PAD * 2) / MIRO_CANVAS_H)
      maxScale = baseScale * 5
    }

    let wrapperEl = null

    function applyScale(s) {
      curScale = s
      if (!canvasEl || !wrapperEl) return
      // Transform scales the canvas visually; wrapper provides scroll dimensions
      canvasEl.style.transform = 'scale(' + s + ')'
      wrapperEl.style.width  = (MIRO_CANVAS_W * s) + 'px'
      wrapperEl.style.height = (MIRO_CANVAS_H * s) + 'px'
    }

    function centreCanvas() {
      if (!scrollEl || !wrapperEl) return
      const cw = MIRO_CANVAS_W * curScale
      const ch = MIRO_CANVAS_H * curScale
      const padLeft = Math.max(EDGE_PAD, (vpW - cw) / 2)
      const padTop  = Math.max(EDGE_PAD, (vpH - ch) / 2)
      wrapperEl.style.marginLeft  = padLeft + 'px'
      wrapperEl.style.marginRight = padLeft + 'px'
      wrapperEl.style.marginTop   = padTop + 'px'
      wrapperEl.style.marginBottom = padTop + 'px'
    }

    function fit() {
      if (vpW === 0) return
      recalc()
      applyScale(baseScale)
      centreCanvas()
      loaded.value = true
      if (scrollEl) {
        scrollEl.scrollTop  = (scrollEl.scrollHeight - vpH) / 2
        scrollEl.scrollLeft = (scrollEl.scrollWidth  - vpW) / 2
      }
      updateBtnState()
    }

    // Snap zoom — no animation, used by pinch and by animated zoom per-frame
    function zoomSnap(newScale) {
      if (!scrollEl) return
      const oldCW = MIRO_CANVAS_W * curScale
      const oldCH = MIRO_CANVAS_H * curScale
      const oldPadL = Math.max(EDGE_PAD, (vpW - oldCW) / 2)
      const oldPadT = Math.max(EDGE_PAD, (vpH - oldCH) / 2)
      const centreX = (scrollEl.scrollLeft + vpW / 2) / (oldCW + oldPadL * 2)
      const centreY = (scrollEl.scrollTop  + vpH / 2) / (oldCH + oldPadT * 2)

      applyScale(newScale)
      centreCanvas()

      const newCW = MIRO_CANVAS_W * newScale
      const newCH = MIRO_CANVAS_H * newScale
      const newPadL = Math.max(EDGE_PAD, (vpW - newCW) / 2)
      const newPadT = Math.max(EDGE_PAD, (vpH - newCH) / 2)
      scrollEl.scrollLeft = centreX * (newCW + newPadL * 2) - vpW / 2
      scrollEl.scrollTop  = centreY * (newCH + newPadT * 2) - vpH / 2

      updateBtnState()
    }

    // Animated zoom — eases from current scale to target over ~300ms
    let animId = null
    function zoomAnimated(targetScale) {
      if (animId) cancelAnimationFrame(animId)
      const startScale = curScale
      const startTime = performance.now()
      const duration = 300

      function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3) }

      function tick(now) {
        const t = Math.min(1, (now - startTime) / duration)
        const s = startScale + (targetScale - startScale) * easeOutCubic(t)
        zoomSnap(s)
        if (t < 1) {
          animId = requestAnimationFrame(tick)
        } else {
          animId = null
        }
      }
      animId = requestAnimationFrame(tick)
    }

    function zoomIn() {
      if (curScale >= maxScale - 0.001) return
      zoomAnimated(Math.min(maxScale, curScale * stepRatio))
    }
    function zoomOut() {
      if (curScale <= baseScale + 0.001) return
      zoomAnimated(Math.max(baseScale, curScale / stepRatio))
    }

    function onBoardLoad() {
      loadCount++
      if (loadCount >= MIRO_BOARDS.length) fit()
    }

    // Pinch-to-zoom (instant snap — continuous gesture doesn't need easing)
    function onWheel(e) {
      if (!e.ctrlKey) return
      e.preventDefault()
      if (animId) { cancelAnimationFrame(animId); animId = null }
      const sensitivity = 0.002
      const delta = -e.deltaY * sensitivity
      const newScale = Math.min(maxScale, Math.max(baseScale, curScale + delta))
      if (Math.abs(newScale - curScale) < 0.0001) return
      zoomSnap(newScale)
    }

    onMounted(() => {
      scrollEl  = document.querySelector('.cs-miro-scroll')
      wrapperEl = document.querySelector('.cs-miro-wrapper')
      canvasEl  = document.querySelector('.cs-miro-canvas')
      if (scrollEl) scrollEl.addEventListener('wheel', onWheel, { passive: false })
      resizeObs = new ResizeObserver(entries => {
        const cr = entries[0].contentRect
        vpW = cr.width; vpH = cr.height
        if (loaded.value) fit()
      })
      const el = document.querySelector('.cs-miro-viewer')
      if (el) resizeObs.observe(el)
    })

    onUnmounted(() => {
      if (scrollEl) scrollEl.removeEventListener('wheel', onWheel)
      if (resizeObs) resizeObs.disconnect()
    })

    return () =>
      h('div', { class: 'cs-miro-viewer cs-cover-img' }, [
        h('div', { class: 'cs-miro-scroll' }, [
          h('div', { class: 'cs-miro-wrapper' }, [
            h('div', {
              class: 'cs-miro-canvas',
              style: { opacity: loaded.value ? 1 : 0 },
            },
              MIRO_BOARDS.map((board, i) =>
                h('img', {
                  key: i,
                  src: board.src,
                  alt: board.alt,
                  draggable: false,
                  onLoad: onBoardLoad,
                  class: 'cs-miro-board',
                  style: {
                    position: 'absolute',
                    left: board.x + 'px',
                    top:  board.y + 'px',
                    width: board.w + 'px',
                    height: board.h + 'px',
                  },
                })
              )
            ),
          ]),
        ]),
        h('div', { class: 'cs-zoom-controls' }, [
          h('button', {
            class: ['cs-zoom-btn', !btnState.value.canIn ? 'cs-zoom-btn--disabled' : ''].filter(Boolean).join(' '),
            onClick: zoomIn,
            disabled: !btnState.value.canIn,
            'aria-label': 'Zoom in',
          }, '+'),
          h('button', {
            class: ['cs-zoom-btn', !btnState.value.canOut ? 'cs-zoom-btn--disabled' : ''].filter(Boolean).join(' '),
            onClick: zoomOut,
            disabled: !btnState.value.canOut,
            'aria-label': 'Zoom out',
          }, '\u2212'),
        ]),
      ])
  },
})

// ── Prototype phone with sticky header + nav ──
const ProtoPhone = defineComponent({
  name: 'ProtoPhone',
  props: { src: String, alt: String, header: { type: String, default: IMG_PROTO_HEADER } },
  setup(props) {
    const headerVisible = ref(false)
    let scrollEl = null

    function onScroll() {
      if (!scrollEl) return
      // Clamp to top — prevent upward overscroll
      if (scrollEl.scrollTop < 0) scrollEl.scrollTop = 0
      headerVisible.value = scrollEl.scrollTop > 8
    }

    function onWheel(e) {
      if (!scrollEl) return
      // Block scroll-up when already at top to prevent top rubber-band
      if (e.deltaY < 0 && scrollEl.scrollTop <= 0) {
        e.preventDefault()
      }
    }

    let touchStartY = 0
    function onTouchStart(e) {
      touchStartY = e.touches[0].clientY
    }
    function onTouchMove(e) {
      if (!scrollEl) return
      const dy = e.touches[0].clientY - touchStartY
      // Pulling down while at top → block
      if (dy > 0 && scrollEl.scrollTop <= 0) {
        e.preventDefault()
      }
    }

    onMounted(() => {
      scrollEl = document.querySelector('.cs-proto-phone-' + props.alt.replace(/\s+/g, '-'))
      if (scrollEl) {
        scrollEl = scrollEl.querySelector('.cs-proto-scroll')
        if (scrollEl) {
          scrollEl.addEventListener('scroll', onScroll, { passive: true })
          scrollEl.addEventListener('wheel', onWheel, { passive: false })
          scrollEl.addEventListener('touchstart', onTouchStart, { passive: true })
          scrollEl.addEventListener('touchmove', onTouchMove, { passive: false })
        }
      }
    })

    onUnmounted(() => {
      if (scrollEl) {
        scrollEl.removeEventListener('scroll', onScroll)
        scrollEl.removeEventListener('wheel', onWheel)
        scrollEl.removeEventListener('touchstart', onTouchStart)
        scrollEl.removeEventListener('touchmove', onTouchMove)
      }
    })

    return () =>
      h('div', { class: 'cs-proto-phone cs-proto-phone-' + props.alt.replace(/\s+/g, '-') }, [
        // Header — fades in on scroll
        h('img', {
          src: props.header,
          alt: 'App header',
          class: ['cs-proto-header', headerVisible.value ? 'cs-proto-header--visible' : ''].filter(Boolean).join(' '),
          draggable: false,
        }),
        // Scrollable content
        h('div', { class: 'cs-proto-scroll' }, [
          h('img', { src: props.src, alt: props.alt, class: 'cs-proto-img', draggable: false }),
        ]),
        // Bottom nav — always fixed
        h('img', {
          src: IMG_PROTO_NAV,
          alt: 'App navigation',
          class: 'cs-proto-nav',
          draggable: false,
        }),
      ])
  },
})

// ── Placeholders — uncomment when images are ready ──
// const IMG_BRIEF          = 'src/assets/images/rayo/schedule/brief-overview.png'
// const IMG_WORKSHOP       = 'src/assets/images/rayo/schedule/workshop-miro.png'
// const IMG_PERSONAS       = 'src/assets/images/rayo/schedule/user-personas.png'
// const IMG_JOURNEY_MAP    = 'src/assets/images/rayo/schedule/journey-map.png'
// const IMG_TREE_TEST      = 'src/assets/images/rayo/schedule/tree-test.png'
// const IMG_TESTING        = 'src/assets/images/rayo/schedule/user-testing.png'
// const IMG_SCHEDULE_PROTO = 'src/assets/images/rayo/schedule/schedule-prototype.png'
// const IMG_SCOPE_COMPARE  = 'src/assets/images/rayo/schedule/scope-comparison.png'
// const IMG_SHIPPED_1      = 'src/assets/images/rayo/schedule/shipped-schedule.png'
// const IMG_SHIPPED_2      = 'src/assets/images/rayo/schedule/shipped-catchup.png'

export default defineComponent({
  name: 'ScheduleCard',
  setup() {
    const { canHover: schCanHover } = useResponsiveScale(680)
    const tldr   = ref(false)
    const isDark = ref(document.documentElement.dataset.theme === 'dark')

    // Watch for theme changes (toggled by BulbCard)
    const themeObserver = new MutationObserver(() => {
      isDark.value = document.documentElement.dataset.theme === 'dark'
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    onUnmounted(() => themeObserver.disconnect())

    const full = (...nodes) =>
      h('div', {
        class: ['tldr-collapsible', tldr.value ? 'tldr-collapsible--hidden' : ''].filter(Boolean).join(' '),
      }, [h('div', null, nodes)])

    return () =>
      h(CaseStudyOverlay, {
        cardClass: 'schedule-card',
        videoSrc: VIDEO_SRC,
        videoClass: 'schedule-video',
        tooltip: 'Utilising research to kill a feature\nbefore we build the wrong thing ↩️',
        heroSize: 448,
      }, {
        content: () => [

          // ── TL;DR toggle ──
          h(TldrToggle, { modelValue: tldr.value, 'onUpdate:modelValue': v => { tldr.value = v } }),

          // ══════════════════════════════════════════════
          // ── Title, intro, role, impact ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body' }, [

            h('h1', { class: 'cs-title' },
              'Challenging the Brief: From Station Pages to Schedule'),

            h('p', { class: 'cs-body-text' },
              'How user research redirected a major feature toward what listeners actually needed - a schedule-first approach to catchup radio.'),

            h('h2', { class: 'cs-section-title' }, 'My role'),
            h('p', { class: 'cs-body-text' }, 'Product Design'),

            h('h2', { class: 'cs-section-title' }, 'Impact'),

            h('h3', { class: 'cs-subsection-title' }, '\uD83D\uDCCA Redirected the project scope'),
            full(
              h('p', { class: 'cs-body-text' },
                'User testing evidence led the team to pivot from a station page to a schedule-first catchup experience, avoiding development of a feature users wouldn\u2019t navigate to.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, '\uD83D\uDCFB Designed and shipped the schedule feature'),
            full(
              h('p', { class: 'cs-body-text' },
                'The schedule shipped across the Rayo app, giving listeners a direct path to find catchup shows - the core need that research uncovered.'),
            ),

            h('h3', { class: 'cs-subsection-title' }, '\uD83D\uDCA1 Uncovered a fundamental listening insight'),
            full(
              h('p', { class: 'cs-body-text' },
                'Users navigate radio by date and time, not by episode. This insight reshaped product strategy and informed how catchup content is structured across the app.'),
            ),
          ]),

          // ── Schedule iPhone mockup ──
          h('img', {
            class: 'cs-cover-img',
            src: IMG_MOCKUP,
            alt: 'Schedule feature on iPhone',
          }),
          h('p', { class: 'cs-hint' }, 'Schedule feature on iPhone'),

          // ══════════════════════════════════════════════
          // ── Problem ──
          // ══════════════════════════════════════════════

          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'Problem'),
              h('p', { class: 'cs-body-text' },
                'The product team wanted to build dedicated station pages in the Rayo app - a hub for each radio brand with schedules, presenter info, social links, and featured content. On paper, it made sense. But no one had asked whether users actually wanted a station page, or whether it would solve their real problem: finding something to listen to when their favourite show has already aired.'),
          ]),

          // ── Zoomable station page epic ──
          h(ZoomableImage, {
            src: IMG_STATION_EPIC,
            alt: 'Station page epic overview',
          }),
          h(InteractiveTag, { hint: 'Station page epic' }),

          // ══════════════════════════════════════════════
          // ── The starting point ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'The starting point'),

            full(
              h('p', { class: 'cs-body-text' },
                'The brief was ambitious. Station pages, presenter pages, hero content, social links, contact forms - a feature set that would touch every corner of the app. The goal was to improve engagement and increase average time spent listening by giving each radio station a proper home in the app.'),

              h('p', { class: 'cs-body-text' },
                'Our lead UX researcher had already been raising questions about whether this was the right direction. A co-creation workshop the previous year had surfaced an important stat: live radio accounted for 97.9% of all listening on the platform. If almost all listening was live, what problem was a content-heavy station page actually solving?'),

              h('p', { class: 'cs-body-text' },
                'Rather than diving into wireframes, we decided to build understanding first.'),
            ),
          ]),

          // ── Miro workshop boards ──
          h(MiroBoard),
          h(InteractiveTag, { hint: 'Design workshop boards' }),

          // ══════════════════════════════════════════════
          // ── Building the evidence ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'Building the evidence'),

            full(
              h('p', { class: 'cs-body-text' },
                'Over several weeks, the design team worked through a series of research and discovery activities, each adding a layer of understanding.'),

              h('p', { class: 'cs-body-text' },
                'We ran a design workshop to define what a station page could be. We mapped out user personas - from devoted station fans to casual rainbow listeners - and created content tiers (Gold, Silver, Bronze) based on how much content each station could realistically support. But even here, the team raised concerns: if V1 was too far from the vision, we\u2019d set a poor direction that would be expensive to correct.'),
            ),
          ]),

          // ── IA Explorations image (full width, outside cs-body) ──
          h('img', {
            class: 'cs-cover-img',
            src: IMG_IA_EXPLORATIONS,
            alt: 'Information architecture explorations',
          }),
          h('p', { class: 'cs-hint' }, 'Information architecture explorations'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            full(
              h('p', { class: 'cs-body-text' },
                'We dug into the information architecture, running tree tests to see how users expected to navigate station content. We mapped user journeys for three core scenarios - finding a specific show, checking an upcoming schedule, and discovering new content. The third journey, discovery, was flagged as too ambiguous to even map properly. That was a signal.'),
            ),
          ]),

          // ── Tree test IA image (full width, outside cs-body) ──
          h('img', {
            class: 'cs-cover-img',
            src: IMG_TREE_TEST_IA,
            alt: 'Information architecture tree test',
          }),
          h('p', { class: 'cs-hint' }, 'Information architecture tree test'),

          h('div', { class: 'cs-body cs-body--continued' }, [
            full(
              h('p', { class: 'cs-body-text' },
                'We also uncovered technical and structural constraints - schedule data only went 30 days back and 7 days forward, brand-station hierarchies were complex, and content teams hadn\u2019t been consulted on editorial needs. These weren\u2019t blockers, but they shaped what was realistic for a V1.'),

              h('p', { class: 'cs-body-text' },
                'Throughout all of this, a question kept surfacing in our discussions: what value does a full station page provide versus just building the schedule?'),
            ),
          ]),

          // ── User journey mapping image (full width) ──
          h('img', {
            class: 'cs-cover-img',
            src: IMG_JOURNEY_MAP,
            alt: 'User journey mapping for three scenarios',
          }),
          h('p', { class: 'cs-hint' }, 'User journey mapping'),

          // ══════════════════════════════════════════════
          // ── What users actually told us ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'What users actually told us'),

            full(
              h('p', { class: 'cs-body-text' },
                'I built prototypes of the station page and schedule, and ran testing sessions with real listeners. This is where everything clicked.'),
            ),
          ]),

          // ── Prototype phone containers ──
          h(InteractiveTag, { hint: 'Radio page prototypes' }),
          h('div', { class: 'cs-proto-row cs-cover-img' }, [
            [IMG_RADIO_A, 'Option 1', 'Radio page prototype A'],
            [IMG_RADIO_B, 'Option 2', 'Radio page prototype B'],
            [IMG_RADIO_C, 'Option 3', 'Radio page prototype C'],
          ].map(([src, label, alt]) =>
            h('div', { class: 'cs-proto-col', key: alt }, [
              h(ProtoPhone, { src, alt }),
              h('p', { class: 'cs-hint' }, label),
            ])
          )),

          h('div', { class: 'cs-body cs-body--continued' }, [
            full(
              h('p', { class: 'cs-body-text' },
                'The schedule page was the standout. Multiple participants described it as \u201Cperfect\u201D - easy to navigate, clear information, exactly what they needed. When I asked how they\u2019d find a show they\u2019d missed, they went straight to the schedule. They thought in terms of \u201CI missed the breakfast show this morning\u201D - a specific day and time - not \u201CI want to listen to episode 47.\u201D'),
            ),
          ]),

          // ── Schedule antonym annotation widget ──
          h(ScheduleAntonym),
          schCanHover.value ? h(InteractiveTag, { hint: 'Hover cards to highlight features' }) : null,

          h('div', { class: 'cs-body cs-body--continued' }, [
            full(
              h('p', { class: 'cs-body-text' },
                'The station page itself didn\u2019t land. Users found the navigation between a Radio Page and a Station Page confusing and suggested combining them. The For You Page was too long, with entry points to schedules buried under irrelevant content. Terminology was another friction point - \u201Con-demand\u201D and \u201Cepisodes\u201D didn\u2019t match how people thought about radio. They called it \u201Ccatch-up.\u201D'),
            ),
          ]),

          // ── Station page prototypes ──
          h(InteractiveTag, { hint: 'Station page prototypes' }),
          h('div', { class: 'cs-proto-row cs-cover-img' }, [
            [IMG_STATION_HOME,      'Home',      'Station page home'],
            [IMG_STATION_TRACKLIST, 'Tracklist', 'Station page tracklist'],
            [IMG_STATION_SHOWS,     'Shows',     'Station page shows'],
          ].map(([src, label, alt]) =>
            h('div', { class: 'cs-proto-col', key: alt }, [
              h(ProtoPhone, { src, alt, header: IMG_PROTO_HEADER_MAGIC }),
              h('p', { class: 'cs-hint' }, label),
            ])
          )),

          h('div', { class: 'cs-body cs-body--continued' }, [
            full(
              h('p', { class: 'cs-body-text' },
                'One phrase from testing stuck with me. A participant said what they really wanted was to \u201Cpick the phone up, hit play, and put the phone down.\u201D That was it. Minimal friction to live radio, and a clear path to catch-up when they\u2019d missed something. A station page with social links, presenter bios, and featured content was solving a problem they didn\u2019t have.'),
            ),
          ]),

          h('img', {
            class: 'cs-cover-img cs-cover-img--full',
            src: 'src/assets/images/rayo/schedule/schedule-page-affinity-map.jpg',
            alt: 'User testing synthesis affinity map',
          }),
          h('p', { class: 'cs-hint' }, 'User testing synthesis affinity map'),

          // ══════════════════════════════════════════════
          // ── Changing direction ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'Changing direction'),

            full(
              h('p', { class: 'cs-body-text' },
                'Together with our UX research team, we presented the findings to the product team, and I supported the case with the prototypes and testing evidence. The recommendation was clear: don\u2019t build a standalone station page. Instead, take the components that tested well - primarily schedule, and integrate them into the journeys users were already on.'),

              h('p', { class: 'cs-body-text' },
                'This wasn\u2019t about saying no to the brief. It was about solving the right problem. Users didn\u2019t need a destination page for a radio station. They needed:'),
              h('ul', { class: 'cs-body-list' }, [
                h('li', null, 'Quick access to live radio'),
                h('li', null, 'A schedule-based path to catchup content'),
                h('li', null, 'Consistent language and interaction patterns - \u201Ccatchup\u201D not \u201Cepisodes.\u201D'),
              ]),

              h('p', { class: 'cs-body-text' },
                'The new direction was to distribute station page components - schedule access, presenter information, now-playing context - into the maxi player and the For You Page, rather than isolating them behind a dedicated page users would never navigate to.'),
            ),
          ]),

          h('img', {
            class: 'cs-cover-img',
            src: 'src/assets/images/rayo/schedule/schedule-wireframe.png',
            alt: 'Schedule wireframe',
          }),
          h('p', { class: 'cs-hint' }, 'Schedule wireframe'),

          // Placeholder: uncomment when image is ready
          // h('img', { class: 'cs-cover-img', src: IMG_SCOPE_COMPARE, alt: 'Before and after scope comparison' }),
          // h('p', { class: 'cs-hint' }, 'From isolated station page to distributed components across existing touchpoints'),

          // ══════════════════════════════════════════════
          // ── What we shipped ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'What we shipped'),

            full(
              h('p', { class: 'cs-body-text' },
                'The schedule feature shipped as part of the Rayo app. Instead of a station page you\u2019d have to find, schedule access lives where listeners already are - surfaced in context, within the flows they naturally use.'),

              h('p', { class: 'cs-body-text' },
                'Listeners can see what\u2019s on now, browse upcoming shows, and tap into catchup content from the schedule directly. The experience uses language that matches how people actually talk about radio - \u201Ccatch-up\u201D instead of \u201Con-demand,\u201D shows identified by time and date rather than episode numbers. It\u2019s a small shift that removes a real point of confusion.'),
            ),
          ]),

          h('img', {
            class: 'cs-cover-img cs-cover-img--full',
            src: isDark.value
              ? 'src/assets/images/rayo/schedule/schedule-mockups-dark.png'
              : 'src/assets/images/rayo/schedule/schedule-mockups.png',
            alt: 'Schedule feature mockups',
            style: { marginBottom: '-64px', marginTop: '-16px' },
          }),

          // ══════════════════════════════════════════════
          // ── What I took away ──
          // ══════════════════════════════════════════════
          h('div', { class: 'cs-body cs-body--continued' }, [

            h('h2', { class: 'cs-section-title' }, 'What I took away'),

            h('p', { class: 'cs-body-text' }, [
              'The biggest lesson from this project was about ',
              h('strong', null, 'the value of pausing'),
              ' before you build. The original brief was well-intentioned and logically sound - but it was based on an assumption about what users wanted, not evidence. By investing in research upfront, we avoided shipping a feature that would have been technically correct but practically unused.',
            ]),

            h('p', { class: 'cs-body-text' }, [
              'I also learned something specific about radio listeners that I hadn\u2019t expected: they don\u2019t think about radio the way they think about podcasts or streaming. There\u2019s no concept of \u201Cepisodes\u201D or \u201Cbrowsing.\u201D Radio is live, and when it\u2019s not live, it\u2019s catch-up - anchored to a time they missed. Designing for that ',
              h('strong', null, 'mental model'),
              ', rather than imposing a content-library pattern, was the difference between a feature that tested as \u201Cperfect\u201D and one that confused people.',
            ]),

            h('p', { class: 'cs-body-text' }, [
              'The schedule is now live, and we\u2019re tracking engagement and average time spent listening to measure its impact. But regardless of the numbers, the outcome I\u2019m most proud of is the process - a design team that used research to ask the right questions, ',
              h('strong', null, 'challenge assumptions constructively'),
              ', and ship something that genuinely matches how people listen to radio.',
            ]),
          ]),
        ],
      })
  },
})
