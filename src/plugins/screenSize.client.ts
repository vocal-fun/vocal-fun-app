import { computed, ref, onUnmounted } from 'vue';

export default defineNuxtPlugin((nuxtApp) => {
  const isSmallScreen = ref(false);

  const updateScreenSize = () => {
    isSmallScreen.value = window.innerWidth < 600;
  };

  // Initialize
  updateScreenSize();
  window.addEventListener('resize', updateScreenSize);
  onUnmounted(() => {
    window.removeEventListener('resize', updateScreenSize);
  });

  nuxtApp.provide('isSmallScreen', computed(() => isSmallScreen.value));
});
