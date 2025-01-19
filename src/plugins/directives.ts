import { defineNuxtPlugin } from '#app';
import playClickSound from '~/directives/play-click-sound';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('play-click-sound', playClickSound);
});
