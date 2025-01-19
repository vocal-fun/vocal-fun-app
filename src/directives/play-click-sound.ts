import type { DirectiveBinding } from 'vue';

interface PlayClickSoundElement extends HTMLElement {
  __playSoundCleanup?: () => void;
}

const playClickSound = {
  mounted(el: PlayClickSoundElement, binding: DirectiveBinding) {
    const audio = new Audio('/audio/click.mp3');

    const playAudio = () => {
      try {
        audio.currentTime = 0; // Reset the audio to start
        audio.play();
      } catch (err) {
        console.warn('[VOCAL.FUN] [CLICK] Audio playback failed:', err);
      }
    };

    // Add event listeners for click and touchstart
    el.addEventListener('click', playAudio);
    el.addEventListener('touchstart', playAudio);

    // Store the cleanup function for later unbinding
    el.__playSoundCleanup = () => {
      el.removeEventListener('click', playAudio);
      el.removeEventListener('touchstart', playAudio);
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
