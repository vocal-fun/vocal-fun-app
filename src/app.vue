<template>
  <Header />
  <NuxtPage />
</template>

<script setup lang="ts">
import { audioService } from './services/audio';
import { vocalService } from '~/services/vocal';

const authStore = useAuthStore();
const { info } = useNotification();

onBeforeMount(async () => {
  audioService.initCache();
  vocalService.initializeWebSocket();
  try {
    await authStore.authorize();
  } catch (e) {
    info('Your session has expired. Please log in again.');
    console.info(e);
  }
});

onBeforeUnmount(() => {
  audioService.clearCache();
});
</script>
