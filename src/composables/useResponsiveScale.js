import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * useResponsiveScale — reactive container width & scale factor.
 *
 * Replaces module-level ref() + window resize listener patterns
 * with a properly scoped composable that cleans up on unmount.
 *
 * @param {number} baseWidth — the Figma design width to scale against
 * @param {number} padding   — horizontal padding to subtract (default 48)
 *
 * Returns:
 *   containerW : Ref<number>  — clamped width
 *   scale      : ComputedRef<number> — containerW / baseWidth
 *   canHover   : ComputedRef<boolean> — true when at full design width
 */
export function useResponsiveScale(baseWidth, padding = 48) {
  const containerW = ref(Math.min(baseWidth, window.innerWidth - padding))
  const scale      = computed(() => containerW.value / baseWidth)
  const canHover   = computed(() => containerW.value >= baseWidth)

  function onResize() {
    containerW.value = Math.min(baseWidth, window.innerWidth - padding)
  }

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))

  return { containerW, scale, canHover }
}
