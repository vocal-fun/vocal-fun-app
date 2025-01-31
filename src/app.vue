<template>
  <Header />
  <NuxtPage />
</template>

<script setup lang="ts">
import { audioService } from './services/audio';

const authStore = useAuthStore();

onBeforeMount(async () => {
  audioService.initCache();
  try {
    await authStore.authorize();
  } catch (e) {
    // info('Your session has expired. Please log in again.');
    console.info(e);
  }
});

onBeforeUnmount(() => {
  audioService.clearCache();
});
</script>
