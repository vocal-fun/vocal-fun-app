import { audioService } from '~/services/audio';
import type { DirectiveBinding } from 'vue';

interface PlayClickSoundElement extends HTMLElement {
  __playSoundCleanup?: () => void;
}

const playClickSound = {
  mounted(el: PlayClickSoundElement, binding: DirectiveBinding) {
    const play = () => audioService.click();

    el.addEventListener('click', play, { passive: true });
    // Store the cleanup function for later unbinding
    el.__playSoundCleanup = () => {
      el.removeEventListener('click', play);
    };
  },

  unmounted(el: PlayClickSoundElement) {
    // Clean up event listeners
    if (el.__playSoundCleanup) {
      el.__playSoundCleanup();
      delete el.__playSoundCleanup;
    }
  },
}

export default playClickSound;
