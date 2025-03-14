import type { ComputedRef } from 'vue';

declare module '#app' {
  interface NuxtApp {
    $isSmallScreen: ComputedRef<boolean>;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $isSmallScreen: ComputedRef<boolean>;
  }
}
