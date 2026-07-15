<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { VideoSection, VideoItem } from '@/types'
import { useConfig } from '@/composables/useConfig'

const props = defineProps<{
  videoSection: VideoSection
}>()

const { getVideoEmbedUrl } = useConfig()

const activeVideoId = ref<string | null>(null)
const bilibiliCovers = ref<Record<string, string>>({})

/**
 * Call Bilibili API via JSONP to bypass CORS (works on pure static hosting).
 * Requires `jsonp=jsonp` param alongside `callback`.
 */
function bilibiliJsonp<T>(bvid: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const callbackName = `__bili_cb_${bvid.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`
    const script = document.createElement('script')
    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error('Bilibili JSONP timeout'))
    }, 8000)

    function cleanup(): void {
      clearTimeout(timeout)
      delete (window as unknown as Record<string, unknown>)[callbackName]
      if (script.parentNode) script.remove()
    }

    ;(window as unknown as Record<string, unknown>)[callbackName] = (data: T) => {
      cleanup()
      resolve(data)
    }

    script.src = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}&jsonp=jsonp&callback=${callbackName}`
    script.onerror = () => {
      cleanup()
      reject(new Error('Bilibili JSONP script load failed'))
    }
    document.head.appendChild(script)
  })
}

interface BilibiliApiData {
  code: number
  message?: string
  data?: { pic: string; title: string }
}

onMounted(() => {
  fetchBilibiliCovers()
})

async function fetchBilibiliCovers(): Promise<void> {
  const bilibiliItems = props.videoSection.items.filter(
    (item) => item.platform === 'bilibili' && !item.thumbnail
  )
  if (bilibiliItems.length === 0) return

  const results = await Promise.allSettled(
    bilibiliItems.map(async (item) => {
      const data = await bilibiliJsonp<BilibiliApiData>(item.id)
      if (data.code !== 0 || !data.data?.pic) {
        throw new Error(data.message || 'No cover')
      }
      // http → https
      const pic = data.data.pic.replace(/^http:\/\//, 'https://')
      return { bvid: item.id, cover: pic }
    })
  )

  for (const result of results) {
    if (result.status === 'fulfilled') {
      bilibiliCovers.value[result.value.bvid] = result.value.cover
    }
  }
}

function playVideo(itemId: string): void {
  activeVideoId.value = itemId
}

function thumbnailUrl(item: VideoItem): string {
  if (item.thumbnail) return item.thumbnail
  if (item.platform === 'youtube') {
    return `https://img.youtube.com/vi/${item.id}/maxresdefault.jpg`
  }
  return bilibiliCovers.value[item.id] || ''
}

/** Whether we have a usable thumbnail URL. */
function hasThumbnail(item: VideoItem): boolean {
  return !!thumbnailUrl(item)
}
</script>

<template>
  <section class="video-section">
    <h2>{{ videoSection.title }}</h2>
    <p class="video-subtitle">{{ videoSection.subtitle }}</p>
    <hr />
    <div class="video-item-container">
      <div
        v-for="item in videoSection.items"
        :key="item.id"
        class="video-item"
      >
        <!-- Thumbnail -->
        <img
          v-if="activeVideoId !== item.id && hasThumbnail(item)"
          :src="thumbnailUrl(item)"
          :alt="`Video ${item.id}`"
          loading="lazy"
          class="video-cover"
          referrerpolicy="no-referrer"
          @click="playVideo(item.id)"
        />

        <!-- Fallback placeholder -->
        <div
          v-else-if="activeVideoId !== item.id"
          class="video-thumbnail"
          :class="item.platform === 'bilibili' ? 'bilibili-placeholder' : 'youtube-placeholder'"
          @click="playVideo(item.id)"
        >
          <div class="play-overlay">
            <svg viewBox="0 0 24 24" width="64" height="64" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span v-if="item.platform === 'bilibili'">Bilibili · {{ item.id }}</span>
            <span v-else>Click to play</span>
          </div>
        </div>

        <!-- Embedded player -->
        <iframe
          v-if="activeVideoId === item.id"
          :src="getVideoEmbedUrl(item)"
          allow="autoplay; fullscreen"
          allowfullscreen
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.video-section {
  margin-bottom: 64px;
}

.video-subtitle {
  margin-bottom: 10px;
  text-align: center;
}

.video-item-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.video-item {
  width: calc(80vw / 3 - 10px);
  height: calc((80vw / 3 - 10px) / 16 * 9);
  margin: 10px 5px 0 5px;
  position: relative;
}

.video-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  border-radius: 16px;
  transition: transform 0.2s ease;
}

.video-cover:hover {
  transform: scale(1.02);
}

.video-item > iframe {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  border: none;
}

.video-thumbnail {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.2s ease;
}

.video-thumbnail:hover {
  filter: brightness(1.1);
}

.bilibili-placeholder {
  background: linear-gradient(135deg, #fb7299, #ff6b9d);
}

.youtube-placeholder {
  background: linear-gradient(135deg, #ff0000, #cc0000);
}

.play-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 1.1em;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

@media screen and (max-width: 1280px) {
  .video-item {
    width: calc(40vw - 10px);
    height: calc((40vw - 10px) / 16 * 9);
  }
}

@media screen and (max-width: 854px) {
  .video-item {
    width: calc(80vw - 10px);
    height: calc((80vw - 10px) / 16 * 9);
  }
}
</style>
