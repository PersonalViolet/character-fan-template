<script setup lang="ts">
import type { ProjectConfig } from '@/types'

defineProps<{
  config: ProjectConfig
}>()
</script>

<template>
  <section class="header-section">
    <h1>{{ config.headerTitle }}</h1>
    <hr class="subtitle-separator" />
    <h2>{{ config.headerSubtitle }}</h2>
  </section>
</template>

<style scoped>
.header-section {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
