<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { VideoSection, VideoItem } from '@/types'
import { useConfig } from '@/composables/useConfig'

const props = defineProps<{
  videoSection: VideoSection
}>()

const { getVideoEmbedUrl } = useConfig()

// Track which video is currently playing
const activeVideoId = ref<string | null>(null)

// Cache bilibili cover URLs: bvid -> cover image URL
const bilibiliCovers = ref<Record<string, string>>({})

onMounted(() => {
  fetchBilibiliCovers()
})

async function fetchBilibiliCovers(): Promise<void> {
  const bilibiliItems = props.videoSection.items.filter(
    (item) => item.platform === 'bilibili' && !item.thumbnail
  )
  if (bilibiliItems.length === 0) return

  // Fetch covers in parallel
  const results = await Promise.allSettled(
    bilibiliItems.map(async (item) => {
      const resp = await fetch(
        `https://api.bilibili.com/x/web-interface/view?bvid=${item.id}`
      )
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const data = await resp.json()
      if (data.code !== 0) throw new Error(data.message || 'API error')
      return { bvid: item.id, cover: data.data.pic as string }
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

function getThumbnail(item: VideoItem): string {
  if (item.thumbnail) return item.thumbnail
  if (item.platform === 'youtube') {
    return `https://img.youtube.com/vi/${item.id}/maxresdefault.jpg`
  }
  // bilibili - use cached cover or empty (triggers fallback)
  return bilibiliCovers.value[item.id] || ''
}

function hasThumbnail(item: VideoItem): boolean {
  if (item.thumbnail) return true
  if (item.platform === 'youtube') return true
  return !!bilibiliCovers.value[item.id]
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
        <!-- Thumbnail: shown when video is NOT playing and we have a cover -->
        <img
          v-if="activeVideoId !== item.id && hasThumbnail(item)"
          :src="getThumbnail(item)"
          :alt="`Video ${item.id}`"
          loading="lazy"
          class="video-cover"
          @click="playVideo(item.id)"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        />

        <!-- Fallback placeholder: bilibili without cover loaded yet, or cover failed to load -->
        <div
          v-else-if="activeVideoId !== item.id"
          class="video-thumbnail video-thumbnail-bilibili"
          @click="playVideo(item.id)"
        >
          <div class="play-overlay">
            <svg viewBox="0 0 24 24" width="64" height="64" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Click to play</span>
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
}

.video-thumbnail-bilibili {
  background: linear-gradient(135deg, #fb7299, #ff6b9d);
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 1.2em;
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
