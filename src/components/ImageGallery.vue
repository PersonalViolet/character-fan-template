<script setup lang="ts">
import type { ImageSection } from '@/types'
import { reactive } from 'vue'

defineProps<{
  imageSection: ImageSection
}>()

const loadedMap = reactive<Record<number, boolean>>({})

function onLoad(index: number) {
  loadedMap[index] = true
}
</script>

<template>
  <section class="gallery-section">
    <h2>{{ imageSection.title }}</h2>
    <p class="gallery-subtitle">{{ imageSection.subtitle }}</p>
    <hr />
    <div class="grid">
      <a
        v-for="(item, index) in imageSection.items"
        :key="index"
        :href="item.link"
        target="_blank"
        rel="noopener noreferrer"
        class="grid-item"
        :class="{ 'grid-item--loaded': loadedMap[index] }"
      >
        <img
          :src="item.img"
          :alt="`Gallery image ${index + 1}`"
          loading="lazy"
          referrerpolicy="no-referrer"
          @load="onLoad(index)"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
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

/* Masonry layout: 瀑布流，每张图保持原始宽高比 */
.grid {
  column-count: 6;
  column-gap: 10px;
  padding: 0 5px;
}

.grid-item {
  display: block;
  break-inside: avoid;
  margin-bottom: 10px;
  /* 3D 翻转透视 */
  perspective: 800px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.grid-item:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.grid-item img {
  width: 100%;
  height: auto;
  border-radius: 16px;
  vertical-align: middle;
  /* 翻转加载动画：初始旋转 90° + 透明 */
  transform: rotateY(90deg);
  opacity: 0;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.4s ease;
}

.grid-item--loaded img {
  transform: rotateY(0deg);
  opacity: 1;
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
  .grid {
    column-count: 5;
  }
}

@media screen and (max-width: 1920px) {
  .grid {
    column-count: 4;
  }
}

@media screen and (max-width: 1280px) {
  .grid {
    column-count: 3;
  }
}

@media screen and (max-width: 854px) {
  .grid {
    column-count: 2;
  }
}

@media screen and (max-width: 500px) {
  .grid {
    column-count: 1;
  }
}
</style>
