import { defineComponent, h, ref, onMounted } from 'vue'

const NUM_RAYS   = 12
const RAY_DELAYS = [0, 0.72, 0.28, 1.05, 0.51, 0.18, 0.88, 0.42, 0.63, 0.95, 0.35, 0.77]

// Lottie animation data (toggle circle sliding left ↔ right, frames 0–14 @ 30 fps)
const TOGGLE_ANIM = {"v":"5.6.5","fr":30,"ip":0,"op":15,"w":32,"h":32,"nm":"toggle","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"toggle","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[16,16,0],"ix":2},"a":{"a":0,"k":[12,12,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-1.657,0],[0,-1.657],[1.657,0],[0,1.657]],"o":[[1.657,0],[0,1.657],[-1.657,0],[0,-1.657]],"v":[[0,-3],[3,0],[0,3],[-3,0]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0,0,0,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":2,"lj":2,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.337,"y":1},"o":{"x":0.666,"y":0},"t":0,"s":[8,12],"to":[1.333,0],"ti":[-1.333,0]},{"t":15,"s":[16,12]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"circle","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-3.866,0],[0,0],[0,-3.866],[3.866,0],[0,0],[0,3.866]],"o":[[0,0],[3.866,0],[0,3.866],[0,0],[-3.866,0],[0,-3.866]],"v":[[-4,-7],[4,-7],[11,0],[4,7],[-4,7],[-11,0]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0,0,0,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":2,"lj":2,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[12,12],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"toggle","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":15,"st":0,"bm":0}],"markers":[]}

export default defineComponent({
  name: 'BulbCard',

  setup() {
    const isDark   = ref(document.documentElement.dataset.theme === 'dark')
    const ripples  = ref([])
    const lottieEl = ref(null)
    let lottieAnim = null
    let nextId     = 0

    onMounted(() => {
      if (!window.lottie || !lottieEl.value) return
      lottieAnim = window.lottie.loadAnimation({
        container:     lottieEl.value,
        renderer:      'svg',
        loop:          false,
        autoplay:      false,
        animationData: TOGGLE_ANIM,
      })
      // Snap to the correct frame for the initial theme
      lottieAnim.goToAndStop(isDark.value ? 14 : 0, true)
    })

    function toggle(e) {
      isDark.value = !isDark.value
      document.documentElement.dataset.theme = isDark.value ? 'dark' : ''

      // Play forward (left→right) going dark, reverse (right→left) going light
      if (lottieAnim) {
        lottieAnim.setDirection(isDark.value ? 1 : -1)
        lottieAnim.goToAndPlay(isDark.value ? 0 : 14, true)
      }

      // Ripple from click position
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX ?? rect.left + rect.width  / 2) - rect.left
      const y = (e.clientY ?? rect.top  + rect.height / 2) - rect.top
      const id = nextId++
      ripples.value.push({ id, x, y })
      setTimeout(() => {
        ripples.value = ripples.value.filter(r => r.id !== id)
      }, 520)
    }

    return () => {
      const rayArms = Array.from({ length: NUM_RAYS }, (_, i) =>
        h('div', {
          class: 'ray-arm',
          style: { transform: `rotate(${i * (360 / NUM_RAYS)}deg)` },
        }, [
          h('div', {
            class: 'ray-bar',
            style: { animationDelay: RAY_DELAYS[i] + 's' },
          }),
        ])
      )

      return h('div', {
        class: ['bento-card', 'bulb-card', isDark.value ? 'is-dark' : ''],
        onClick: toggle,
        'data-tooltip': isDark.value ? 'Switch to light mode ☀️' : 'Switch to dark mode 🌙',
      }, [

        // ── Action icon (Lottie toggle) ────────────────────────
        h('div', { class: 'action-icon' }, [
          h('div', { class: 'bulb-lottie', ref: lottieEl }),
        ]),

        // ── Icon ──────────────────────────────────────────
        h('div', { class: 'icon-wrap' }, [

          // Sun — fades out + rotates away when hidden
          h('div', { class: isDark.value ? 'sun hidden' : 'sun' }, [
            ...rayArms,
            h('div', { class: 'sun-circle' }),
          ]),

          // Moon — fades in + rotates into view when visible
          h('div', { class: isDark.value ? 'moon visible' : 'moon' }, [
            h('div', { class: 'moon-stars' }, [
              h('div', { class: 'mstar' }),
              h('div', { class: 'mstar' }),
              h('div', { class: 'mstar' }),
            ]),
            h('div', { class: 'moon-shape' }),
          ]),
        ]),

        // ── Ripples ───────────────────────────────────────
        ...ripples.value.map(r =>
          h('div', {
            key:   r.id,
            class: 'card-ripple',
            style: {
              left:       r.x + 'px',
              top:        r.y + 'px',
              width:      '20px',
              height:     '20px',
              marginLeft: '-10px',
              marginTop:  '-10px',
            },
          })
        ),
      ])
    }
  },
})
