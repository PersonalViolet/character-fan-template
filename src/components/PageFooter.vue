<script setup lang="ts">
import type { FooterConfig } from '@/types'

defineProps<{
  footer: FooterConfig
}>()
</script>

<template>
  <footer class="footer">
    <img
      class="footer-profile"
      loading="lazy"
      :src="footer.profileImage"
      :alt="`Profile image`"
      @error="($event.target as HTMLImageElement).style.display = 'none'"
    />
    <div class="footer-text">
      <p class="footer-header-text">{{ footer.headerText }}</p>
      <p v-for="(contact, index) in footer.contacts" :key="index">
        <a
          v-if="contact.url"
          :href="contact.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="footer-icon-text">{{ contact.label }}</span>
        </a>
        <span v-else class="footer-icon-text">{{ contact.label }}</span>
      </p>
      <p class="footer-repo-text">{{ footer.repoText }}</p>
      <p>
        <a
          v-if="footer.repoUrl"
          :href="footer.repoUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="footer-icon-text">{{ footer.repoUrl }}</span>
        </a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: white;
  color: black;
  padding: 16px 10vw;
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
}

.footer-profile {
  min-width: 256px;
  max-width: 720px;
  height: auto;
  border-radius: 2% 3.5%;
}

.footer-text {
  flex: 1;
}

.footer-header-text {
  margin-bottom: 16px;
}

.footer-icon-text {
  display: inline-block;
  vertical-align: middle;
  font-weight: bold;
  margin-left: 6px;
}

.footer a {
  color: inherit;
  text-decoration: none;
  transition: opacity 0.2s;
}

.footer a:hover {
  opacity: 0.7;
}

.footer-repo-text {
  margin-top: 32px;
  margin-bottom: 16px;
}

@media screen and (max-width: 1280px) {
  .footer {
    flex-wrap: wrap;
  }
  .footer-text {
    text-align: center;
  }
  .footer-header-text {
    margin-bottom: 8px;
  }
  .footer-repo-text {
    margin-top: 16px;
    margin-bottom: 8px;
  }
}
</style>
