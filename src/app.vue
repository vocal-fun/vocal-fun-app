<template>
  <Header />
  <NuxtPage />
  <Toaster position="top-right" :style="toastStyle" :toastOptions="{ class: 'vocal-toast' }" />
</template>

<script setup lang="ts">
import { audioService } from './services/audio';
import type { CSSProperties } from 'vue';

const authStore = useAuthStore();
const { $toast } = useNuxtApp();

const toastStyle = {
  // Should be here cuz the height of the toast is calculated based on the letters size
  fontFamily: '"PixelMix", sans-serif',
} as CSSProperties;

onBeforeMount(async () => {
  audioService.initCache();
  try {
    await authStore.authorize();
  } catch (e) {
    $toast.info('Your session has expired. Please log in again.');
    console.info(e);
  }
});

onBeforeUnmount(() => {
  audioService.clearCache();
  authStore.destroy();
});
</script>
