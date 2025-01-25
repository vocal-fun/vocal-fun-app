<template>
  <Header />
  <NuxtPage />
</template>

<script setup lang="ts">
import { audioService } from './services/audio';
import {vocalService} from "~/services/vocal";

onBeforeMount(() => {
  audioService.initCache();
  vocalService.initializeWebSocket();
});

onBeforeUnmount(() => {
  audioService.clearCache();
});
</script>
