<template>
  <section class="header" :class="{ 'header--with-account': user }">
    <div class="socials">
      <a v-play-click-sound class="social shake-little" href="https://t.me/vocalfunofficial" target="_blank" rel="noopener noreferrer">
        <NuxtImg
          class="telegram"
          src="/img/telegram.png"
          alt="Telegram Logo"
          format="webp"
          sizes="44px"
          loading="lazy"
        />
        TELEGRAM
      </a>
      <a v-play-click-sound class="social shake-little" href="https://x.com/vocal_fun" target="_blank" rel="noopener noreferrer">
        <NuxtImg
          class="twitter"
          src="/img/twitter.png"
          alt="Twitter Logo"
          format="webp"
          sizes="48px"
          loading="lazy"
        />
        TWITTER
      </a>
    </div>

    <a v-play-click-sound class="logo" href="https://vocal.fun" aria-label="Home" target="_blank" rel="noopener noreferrer">
      <span class="logo-bar"><span class="logo-bar-element"></span></span>
      <NuxtImg
        class="shake-little shake-constant"
        src="/logo/logo.png"
        alt="Logo"
        width="24"
        height="24"
        format="webp"
        sizes="48px"
        loading="lazy"
      />
      vocal.fun
      <span class="logo-bar"><span class="logo-bar-element"></span></span>
    </a>

    <div class="user">
      <button v-if="false" v-play-click-sound class="account" @click="buyStore.openBuyModal">
        BALANCE: ${{ user?.balance }}
      </button>
      <span v-if="user" class="account">BALANCE: ${{ user.balance }}</span>
      <ConnectWallet v-if="false" class="wallet" />
    </div>

    <Modal :isOpen="isBuyModalOpen" @close="buyStore.closeBuyModal">
      <BuyModalContent @close="buyStore.closeBuyModal" />
    </Modal>
  </section>
</template>

<script setup lang="ts">
// import { audioService } from '~/services/audio';

// let isPlaying = false;

const buyStore = useBuyStore();
const authStore = useAuthStore();

const user = computed(() => authStore.user);
const isBuyModalOpen = computed(() => buyStore.isBuyModalOpen);

// const toggleBackgroundSound = () => {
//   audioService.click();
//   if (isPlaying) {
//     audioService.pauseBgMusic();
//   } else {
//     audioService.playBgMusic();
//   }
//   isPlaying = !isPlaying;
// };
</script>

<style scoped lang="scss">
@mixin responsive-header($without-account: false) {
  & {
    height: auto;
    margin-bottom: 2.1875rem;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;

    .socials {
      order: 1;
    }

    .user {
      order: 1;
      text-align: right;
      @if ($without-account == true) {
        margin-left: 1.25rem;
        justify-content: end;
      }
    }

    .logo {
      order: 2;
      flex-basis: 100%;
      justify-content: center;

      .logo-bar-element {
        height: 0.6rem;
      }
    }
  }
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 1.25rem;

  .logo {
    flex: 1;
    cursor: pointer;
    margin: 0.5rem;
    font-size: 1.2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-transform: uppercase;

    .logo-bar {
      flex: 1;
      display: flex;
      flex-direction: row;
      max-width: 6rem;

      &-element {
        flex: 1;
        width: 100%;
        border-radius: 2px;
        height: 0.5rem;
        padding: 2px;
        background: linear-gradient(180deg, #ECCF7A 0%, #ECCF7A 20%, #FFFFFF 21%, #FFFFFF 40%, #3F422B 41%, #3F422B 60%, #A3956A 61%, #A3956A 80%, #ECCF7A 81%, #ECCF7A 100%);
      }

      &:first-child {
        margin-right: 2px;
      }

      &:last-child {
        margin-left: 2px;
      }
    }
  }

  .socials {
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 10px;
    text-transform: uppercase;

    a.social {
      display: inline-flex;
      align-items: center;
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
        display: block;
      }
      .telegram {
        width: 22px;
        aspect-ratio: 29 / 25;
      }
      .twitter {
        width: 24px;
        aspect-ratio: 9 / 8;
        object-fit: none;
      }
    }
  }

  .user {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    gap: 1.25rem;
  }

  .account {
    text-align: center;
    white-space: nowrap;
    text-decoration: none;
    // transition: color 0.3s ease-in-out, text-decoration 0.3s ease-in-out;
    // &:hover {
    //   text-decoration: underline;
    //   color: white;
    // }
  }
}

@media (max-width: 1048px) {
  .header--with-account {
    @include responsive-header;
  }
}

@media (max-width: 840px) {
  .header:not(.header--with-account) {
    @include responsive-header($without-account: true);
  }
}

@media (max-width: 724px) {
  .header.header--with-account {
    .user,
    .socials {
      flex-basis: 100%;
      justify-content: center;
    }
  }
}

@media (max-width: 655px) {
  .header:not(.header--with-account),
  .header.header--with-account {
    .socials,
    .user {
      justify-content: center;
    }
    .user {
      flex-basis: 100%;
      margin-left: 0;
    }
  }
}

@media (max-width: 475px) {
  .header {
    margin-bottom: 1.56rem;
    .logo {
      margin: .625rem 0;
    }
    .user {
      flex-direction: column;
      text-align: center;
    }
  }
}
</style>
