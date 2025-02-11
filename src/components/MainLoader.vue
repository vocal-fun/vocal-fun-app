<template>
  <transition name="fade">
    <div v-if="loading" class="pixel-loader">
      <div class="pixel"></div>
      <div class="pixel"></div>
      <div class="pixel"></div>
      <div class="pixel"></div>
      <div class="pixel"></div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean;
}>();
</script>

<style scoped lang="scss">
$pixelSize: 1rem;
$pixelGap: 0.5rem;
$pixelRadius: 0.25rem;
$pixelsCount: 5;
$loaderHeight: $pixelSize;
$loaderWidth: $pixelSize * $pixelsCount + $pixelGap * ($pixelsCount - 1);

.pixel-loader {
  position: fixed;
  top: calc(50% - (#{$loaderHeight} / 2));
  left: calc(50% - (#{$loaderWidth} / 2));
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $pixelGap;
}

@keyframes pixelPulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
}

.pixel {
  width: $pixelSize;
  height: $pixelSize;
  background-color: var(--color-primary);
  border-radius: $pixelRadius;
  animation: pixelPulse 1.2s ease-in-out infinite;
  opacity: 0.5;
  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
  &:nth-child(4) {
    animation-delay: 0.6s;
  }
  &:nth-child(5) {
    animation-delay: 0.8s;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
