import { ref, onMounted, onUnmounted } from 'vue'

/**
 * useInView — true while the element is on (or near) screen AND the tab is
 * visible. Card faces use it to stop their loops when nobody can see them,
 * so a long page doesn't pay for every animation at once.
 *
 * @param {Ref<Element>} elRef
 * @param {object} opts  rootMargin: how early to wake before scrolling in
 * @param {Function} onChange  optional (visible) => void, called on each flip
 */
export function useInView(elRef, { rootMargin = '150px' } = {}, onChange) {
  const inView = ref(false)
  let onScreen = false
  let io = null

  const update = () => {
    const v = onScreen && document.visibilityState !== 'hidden'
    if (v === inView.value) return
    inView.value = v
    if (onChange) onChange(v)
  }
  const onVis = () => update()

  onMounted(() => {
    const el = elRef.value
    if (!el || typeof IntersectionObserver === 'undefined') { onScreen = true; update(); return }
    io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; update() }, { rootMargin })
    io.observe(el)
    document.addEventListener('visibilitychange', onVis)
  })
  onUnmounted(() => {
    if (io) io.disconnect()
    document.removeEventListener('visibilitychange', onVis)
  })

  return inView
}
