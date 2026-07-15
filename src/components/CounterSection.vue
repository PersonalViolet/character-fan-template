<script setup lang="ts">
import { ref } from 'vue'
import type { ProjectConfig } from '@/types'
import { useCounter } from '@/composables/useCounter'

const props = defineProps<{
  config: ProjectConfig
}>()

const { count, isFirstClick, increment, formatCount } = useCounter()

// Audio management
const audioCache = ref<Map<string, HTMLAudioElement>>(new Map())

function getAudioElement(filename: string): HTMLAudioElement {
  if (!audioCache.value.has(filename)) {
    const audio = new Audio(`/audio/${filename}`)
    audio.preload = 'auto'
    audioCache.value.set(filename, audio)
  }
  return audioCache.value.get(filename)!.cloneNode() as HTMLAudioElement
}

function playRandomAudio(): void {
  const files = props.config.audioFiles
  if (files.length === 0) return

  let audio: HTMLAudioElement

  if (isFirstClick.value && files.length > 1) {
    // On first click, try to play the first audio file
    const firstFile = files[0]!
    const ganbaruAudio = getAudioElement(firstFile)
    audio = ganbaruAudio
  } else {
    const randomIndex = Math.floor(Math.random() * files.length)
    const randomFile = files[randomIndex]!
    audio = getAudioElement(randomFile)
  }

  audio.play().catch(() => {
    // Audio file likely doesn't exist; that's OK
    console.warn(`Audio file not found or playback failed`)
  })

  audio.addEventListener('ended', () => {
    audio.remove()
  })
}

// Flying chibi animation
interface FlyingChibi {
  id: number
  element: HTMLImageElement
  pos: number
  scale: number
  intervalId: number
}

let chibiIdCounter = 0

function animateChibi(): void {
  const images = props.config.chibiImages
  if (images.length === 0) return

  const randomIndex = Math.floor(Math.random() * images.length)
  const imgSrc = `/img/${images[randomIndex]}`
  const scale: number = Math.random() < 0.5 ? -1 : 1

  const element = document.createElement('img')
  element.src = imgSrc
  element.style.position = 'fixed'
  element.style.transform = `scaleX(${scale})`
  element.style.zIndex = '9999'
  element.style.pointerEvents = 'none'
  element.style.width = '256px'
  element.style.height = 'auto'

  // Random Y position, clamped so image stays within viewport
  const startY = Math.floor(Math.random() * Math.max(1, window.innerHeight - 256))
  element.style.top = `${startY}px`

  // pos represents the CSS `right` value directly
  // scale=1: start just off right edge (right: -256), move left as pos increases
  // scale=-1: start just off left edge (right: w+256), move right as pos decreases
  let pos: number
  if (scale === 1) {
    pos = -256
  } else {
    pos = window.innerWidth + 256
  }

  document.body.appendChild(element)

  let intervalId: number
  intervalId = window.setInterval(() => {
    pos += scale * 20
    element.style.right = `${pos}px`

    // Remove when fully off the opposite side
    if (pos < -256 || pos > window.innerWidth + 256) {
      clearInterval(intervalId)
      element.remove()
    }
  }, 10)

  // Safety cleanup after 10 seconds
  setTimeout(() => {
    clearInterval(intervalId)
    if (element.parentNode) {
      element.remove()
    }
  }, 10000)
}

function handleClick(): void {
  increment()
  playRandomAudio()
  animateChibi()
}
</script>

<template>
  <div class="counter-container">
    <p>{{ config.counterLabel }}</p>
    <p class="counter-number">{{ formatCount() }}</p>
    <p>{{ config.counterUnit }}</p>
    <button class="counter-button" @click="handleClick">
      {{ config.buttonText }}
    </button>
  </div>
</template>

<style scoped>
.counter-container {
  text-align: center;
  font-weight: bold;
  margin: 64px 0;
  position: relative;
  z-index: 9999;
}

.counter-container > p {
  text-shadow: 0 0 10px currentColor;
}

.counter-number {
  color: #574f84;
  font-size: 2em;
}

.counter-button {
  background-color: #574f84;
  border: none;
  border-radius: 16px;
  color: white;
  padding: 16px 32px;
  text-decoration: none;
  font-size: 1em;
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  margin-top: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.counter-button:hover {
  background-color: #2d2463;
}

.counter-button:active {
  transform: scale(0.95);
}
</style>
