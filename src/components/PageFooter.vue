<script setup lang="ts">
import type { FooterConfig } from '@/types'

defineProps<{
  footer: FooterConfig
}>()

// Map Iconify icon names to brand colors
const brandIconColors: Record<string, string> = {
  'mdi:twitter': '#1d9bf0',
  'mdi:github': '#000000',
  'mdi:discord': '#5662f6',
  'ic:baseline-discord': '#5662f6',
  'mdi:youtube': '#ff0000',
  'mdi:instagram': '#e4405f',
  'mdi:email': '#ea4335',
  'mdi:web': '#4caf50',
}

function iconColor(iconName: string): string {
  return brandIconColors[iconName] || 'inherit'
}
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

      <!-- Contacts with icons -->
      <p v-for="(contact, index) in footer.contacts" :key="'c-' + index" class="footer-contact">
        <a
          v-if="contact.url"
          :href="contact.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <iconify-icon
            v-if="contact.icon"
            :icon="contact.icon"
            :style="{ color: iconColor(contact.icon) }"
            class="footer-icon"
          />
          <span class="footer-icon-text">{{ contact.label }}</span>
        </a>
        <span v-else class="footer-icon-text">{{ contact.label }}</span>
      </p>

      <!-- Custom HTML content -->
      <div v-if="footer.customContent" class="footer-custom" v-html="footer.customContent" />

      <!-- Repository link -->
      <p class="footer-repo-text">{{ footer.repoText }}</p>
      <p class="footer-contact">
        <a
          v-if="footer.repoUrl"
          :href="footer.repoUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <iconify-icon icon="mdi:github" style="color: #000000" class="footer-icon" />
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

.footer-contact {
  margin-bottom: 4px;
}

.footer-icon {
  display: inline-block;
  vertical-align: middle;
  font-size: 2em;
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

.footer-custom {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px dashed #ddd;
}

.footer-custom :deep(a) {
  color: #1d9bf0;
  text-decoration: underline;
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
