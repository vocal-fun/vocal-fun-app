<template>
  <section class="header">
    <div class="socials">
      <a v-play-click-sound class="social shake-little" href="https://t.me/vocal_fun_official" target="_blank" rel="noopener noreferrer">
        <img src="/img/telegram.png" alt="Telegram Logo" width="24" height="22">
        TELEGRAM
      </a>
      <a v-play-click-sound class="social shake-little" href="https://x.com/vocalfun" target="_blank" rel="noopener noreferrer">
        <img src="/img/twitter.png" alt="Twitter Logo" width="23" height="18">
        TWITTER
      </a>
    </div>

    <button class="logo" @click="toggleBackgroundSound">
      <span class="logo-bar-element"></span>
      vocal.fun
      <span class="logo-bar-element"></span>
    </button>

    <div class="wallet-connect">
      <a v-play-click-sound href="#">connect wallet</a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { audioService } from '~/services/audio';

const isPlaying = ref<boolean>(false);

const toggleBackgroundSound = () => {
  audioService.click();
  if (isPlaying.value) {
    audioService.pauseBgMusic();
  } else {
    audioService.playBgMusic();
  }
  isPlaying.value = !isPlaying.value;
};
</script>

<style scoped lang="scss">
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 1.25em;
  height: 41px;

  .logo {
    cursor: pointer;
    font-size: 1.2rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;

    .logo-bar-element {
      width: 6rem;
      border-radius: 2px;
      height: 0.5rem;
      background: linear-gradient(180deg, #ECCF7A 0%, #ECCF7A 20%, #FFFFFF 21%, #FFFFFF 40%, #3F422B 41%, #3F422B 60%, #A3956A 61%, #A3956A 80%, #ECCF7A 81%, #ECCF7A 100%);

      &:first-child {
        margin-right: 2px;
      }
    }
  }

  .socials {
    display: flex;
    flex-direction: row;
    gap: 10px;
    text-transform: uppercase;

    a.social {
      display: inline-flex;
      cursor: pointer;
      box-shadow: -3px 3px 0 0 #7B8494 inset,
                  -1.5px -1.5px 0 0 #4A5A6B inset,
                  3px 3px 0 0 #EFFFFF inset,
                  1.5px 1.5px 0 0 #ADB5C6 inset,
                  -1.5px -1.5px 0 0 #4A5A6B inset;
      padding: .375rem;
      color: #2E3F4B;
      background: #BDCED6;

      img {
        margin-right: .1875rem;
      }
    }
  }

  .wallet-connect {
    text-align: center;
    a {
      cursor: pointer;
      transition: color 0.3s ease-in-out;
    }
    a:hover {
      text-decoration: underline;
      color: white;
    }
  }
}

@media (max-width: 840px) {
  .header {
    height: auto;
    margin-bottom: 2.1875rem;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;

    .socials {
      order: 1;
      flex-grow: 1;
    }

    .wallet-connect {
      order: 1;
      flex-grow: 1;
      text-align: right;
      margin-left: 1.25rem;
    }

    .logo {
      order: 2;
      flex-grow: 2;
      justify-content: center;

      .logo-bar-element {
        height: 0.6rem;
      }
    }
  }
}

@media (max-width: 500px) {
  .header {
    .wallet-connect {
      margin-left: 0;
    }
  }
}

@media (max-width: 475px) {
  .header {
    margin-bottom: 1.56rem;
    .socials {
      justify-content: center;
    }
    .logo {
      margin: .625rem 0;
    }
    .wallet-connect {
      text-align: center;
    }
  }
}
</style>
