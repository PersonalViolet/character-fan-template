<script setup lang="ts">
import { onMounted } from 'vue'
import { useConfig } from '@/composables/useConfig'
import PageHeader from '@/components/PageHeader.vue'
import CounterSection from '@/components/CounterSection.vue'
import VideoGallery from '@/components/VideoGallery.vue'
import ImageGallery from '@/components/ImageGallery.vue'
import PageFooter from '@/components/PageFooter.vue'

const { config, loading, error, loadConfig } = useConfig()

onMounted(() => {
  loadConfig()
})
</script>

<template>
  <!-- Loading state -->
  <div v-if="loading" class="loading-container">
    <p>Loading...</p>
  </div>

  <!-- Error state -->
  <div v-else-if="error" class="error-container">
    <div>
      <p>⚠️ Failed to load configuration</p>
      <p class="error-detail">{{ error }}</p>
      <p class="error-hint">
        Make sure <code>public/project.json</code> exists and is valid JSON.
      </p>
    </div>
  </div>

  <!-- Main content -->
  <div v-else-if="config" id="content">
    <PageHeader :config="config" />
    <CounterSection :config="config" />
    <VideoGallery :video-section="config.video" />
    <ImageGallery :image-section="config.img" />
    <PageFooter :footer="config.footer" />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
</style>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 2em;
  color: white;
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: white;
  text-align: center;
}

.error-detail {
  font-size: 0.8em;
  opacity: 0.7;
  margin-top: 10px;
}

.error-hint {
  font-size: 0.7em;
  opacity: 0.6;
  margin-top: 20px;
}

.error-hint code {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
