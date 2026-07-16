<script setup lang="ts">
import type { ImageSection } from '@/types'
import { reactive, onMounted, onUnmounted, ref, nextTick } from 'vue'

defineProps<{
  imageSection: ImageSection
}>()

const gridRef = ref<HTMLElement | null>(null)

// 图片加载状态：null=未进入视口, false=加载中, true=已加载
const imageState = reactive<Record<number, boolean | null>>({})
// 记录是否已进入视口（防止重复触发）
const visibleSet = new Set<number>()

let observer: IntersectionObserver | null = null

function setupObserver() {
  if (!gridRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const img = entry.target as HTMLImageElement
        const index = Number(img.dataset.index)
        if (visibleSet.has(index)) return

        visibleSet.add(index)
        // 标记为加载中
        imageState[index] = false
        // 将 data-src 写入 src，触发真实加载
        const src = img.dataset.src
        if (src) {
          img.src = src
        }
        observer!.unobserve(img)
      })
    },
    {
      // 提前 200px 开始加载，用户滚动到附近时图片已经好了
      rootMargin: '200px',
      threshold: 0,
    },
  )

  // 观察所有图片
  const imgs = gridRef.value.querySelectorAll<HTMLImageElement>('img[data-src]')
  imgs.forEach((img) => observer!.observe(img))
}

function onLoad(index: number) {
  imageState[index] = true
}

function onError(event: Event, index: number) {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  imageState[index] = null
}

onMounted(() => {
  nextTick(() => setupObserver())
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <section class="gallery-section">
    <h2>{{ imageSection.title }}</h2>
    <p class="gallery-subtitle">{{ imageSection.subtitle }}</p>
    <hr />
    <div ref="gridRef" class="grid">
      <a
        v-for="(item, index) in imageSection.items"
        :key="index"
        :href="item.link"
        target="_blank"
        rel="noopener noreferrer"
        class="grid-item"
        :class="{ 'grid-item--loaded': imageState[index] === true }"
      >
        <!-- 骨架占位，图片未加载或加载中时显示 -->
        <div
          v-if="imageState[index] !== true"
          class="skeleton"
          :class="{ 'skeleton--loading': imageState[index] === false }"
        />
        <img
          :data-src="item.img"
          :data-index="index"
          :alt="`Gallery image ${index + 1}`"
          referrerpolicy="no-referrer"
          @load="onLoad(index)"
          @error="onError($event, index)"
        />
      </a>
      <p v-if="imageSection.items.length === 0" class="empty-text">
        No images configured. Add images to <code>project.json</code>.
      </p>
    </div>
  </section>
</template>

<style scoped>
.gallery-section {
  margin-bottom: 64px;
}

.gallery-subtitle {
  margin-bottom: 10px;
  text-align: center;
}

.grid {
  column-count: 6;
  column-gap: 10px;
  padding: 0 5px;
}

.grid-item {
  display: block;
  break-inside: avoid;
  margin-bottom: 10px;
  position: relative;
  perspective: 800px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  /* 未加载时给一个最小高度占位 */
  min-height: 120px;
  border-radius: 16px;
  overflow: hidden;
}

.grid-item:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

/* 骨架占位 */
.skeleton {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(
    110deg,
    rgba(255, 255, 255, 0.06) 30%,
    rgba(255, 255, 255, 0.14) 50%,
    rgba(255, 255, 255, 0.06) 70%
  );
  background-size: 200% 100%;
  z-index: 1;
}

.skeleton--loading {
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.grid-item img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 16px;
  vertical-align: middle;
  transform: rotateY(90deg);
  opacity: 0;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.4s ease;
  /* 未加载时隐藏 img，显示骨架 */
  position: relative;
  z-index: 0;
}

/* 图片未进入视口/加载中：隐藏 img，显示骨架 */
.grid-item:not(.grid-item--loaded) img {
  position: absolute;
  inset: 0;
  opacity: 0;
  visibility: hidden;
}

.grid-item--loaded img {
  transform: rotateY(0deg);
  opacity: 1;
  visibility: visible;
}

.grid-item--loaded .skeleton {
  display: none;
}

.empty-text {
  column-span: all;
  text-align: center;
  padding: 32px;
  opacity: 0.7;
}

.empty-text code {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
}

@media screen and (max-width: 2240px) {
  .grid { column-count: 5; }
}
@media screen and (max-width: 1920px) {
  .grid { column-count: 4; }
}
@media screen and (max-width: 1280px) {
  .grid { column-count: 3; }
}
@media screen and (max-width: 854px) {
  .grid { column-count: 2; }
}
@media screen and (max-width: 500px) {
  .grid { column-count: 1; }
}
</style>
