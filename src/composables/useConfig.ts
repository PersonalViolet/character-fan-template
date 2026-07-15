import { ref, type Ref } from 'vue'
import type { ProjectConfig } from '@/types'

const config: Ref<ProjectConfig | null> = ref(null)
const loading = ref(true)
const error = ref<string | null>(null)

export function useConfig() {
  async function loadConfig(): Promise<void> {
    try {
      const response = await fetch('/project.json')
      if (!response.ok) {
        throw new Error(`Failed to load project.json: ${response.status}`)
      }
      const data: ProjectConfig = await response.json()
      config.value = data
      applyConfig(data)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('Failed to load project.json:', e)
    } finally {
      loading.value = false
    }
  }

  function applyConfig(data: ProjectConfig): void {
    // Set document title
    document.title = data.title

    // Set favicon
    const faviconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (faviconLink) {
      faviconLink.href = data.favicon
    }

    // Set background color
    document.body.style.backgroundColor = data.backgroundColor
  }

  function getVideoThumbnailUrl(item: { id: string; platform: string }): string {
    if (item.platform === 'youtube') {
      return `https://img.youtube.com/vi/${item.id}/maxresdefault.jpg`
    }
    // bilibili - return a placeholder; actual thumbnail would need bilibili API
    return `https://api.bilibili.com/x/web-interface/view?bvid=${item.id}`
  }

  function getVideoEmbedUrl(item: { id: string; platform: string }): string {
    if (item.platform === 'youtube') {
      return `https://www.youtube.com/embed/${item.id}?autoplay=1&playsinline=1`
    }
    // bilibili
    return `//player.bilibili.com/player.html?bvid=${item.id}&autoplay=1`
  }

  return {
    config,
    loading,
    error,
    loadConfig,
    getVideoThumbnailUrl,
    getVideoEmbedUrl,
  }
}
