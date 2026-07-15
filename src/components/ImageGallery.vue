<script setup lang="ts">
import type { ImageSection } from '@/types'

defineProps<{
  imageSection: ImageSection
}>()
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
      >
        <img
          :src="item.img"
          :alt="`Gallery image ${index + 1}`"
          loading="lazy"
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

.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  padding: 0 5px;
}

.grid-item {
  display: block;
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
  aspect-ratio: 1;
  object-fit: cover;
}

.empty-text {
  grid-column: 1 / -1;
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
    grid-template-columns: repeat(5, 1fr);
  }
}

@media screen and (max-width: 1920px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media screen and (max-width: 1280px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 854px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 500px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
