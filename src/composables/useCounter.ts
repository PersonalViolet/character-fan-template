import { ref } from 'vue'

const STORAGE_KEY = 'dania-click-counter'

export function useCounter() {
  const count = ref(loadCount())
  const isFirstClick = ref(count.value === 0)

  function loadCount(): number {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? parseInt(stored, 10) || 0 : 0
    } catch {
      return 0
    }
  }

  function increment(): number {
    count.value++
    isFirstClick.value = false
    persistCount()
    return count.value
  }

  function persistCount(): void {
    try {
      localStorage.setItem(STORAGE_KEY, count.value.toString())
    } catch {
      console.warn('Failed to persist counter to localStorage')
    }
  }

  function formatCount(): string {
    return count.value.toLocaleString()
  }

  return {
    count,
    isFirstClick,
    increment,
    formatCount,
  }
}
