<template>
  <Header />
  <NuxtPage />
</template>

<script setup lang="ts">
import { audioService } from './services/audio';

onBeforeMount(() => {
  audioService.initCache();
});

onBeforeUnmount(() => {
  audioService.clearCache();
});
</script>
