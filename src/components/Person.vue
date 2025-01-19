<template>
  <div class="person shake-little" @click="openModal">
    <div class="avatar-block">
      <NuxtImg class="avatar-img" :src='avatarPath' :alt="displayName" width="100%"/>
      <button class="play-btn shake" :aria-label="`Go to ${displayName} AI agent`" />
    </div>
    <div class="info">
      <span>{{ displayName }}</span>
      <a class="twitter" target="_blank" rel="noopener noreferrer" :href="twitterLink" @click.stop>
        <img src="/img/twitter-green.png" alt="Twitter logo">
        <span>{{ twitter }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CelebrityItem } from '~/types';

const props = defineProps<Omit<CelebrityItem, 'audioFormat'>>();

const avatarPath = computed(() => `/img/celebrity-logo/${props.name}.${props.imgFormat || 'png'}`);
const twitterLink = computed(() => `https://x.com/${props.twitter.startsWith('@') ? props.twitter.slice(1) : props.twitter}`);

const emit = defineEmits(['open-modal']);

const openModal = () => {
  emit('open-modal');
};
</script>

<style scoped lang="scss">
.person {
  cursor: pointer;
  color: #37D339;
  display: flex;
  width: 430px;
  transition: transform 0.3s ease-in-out;
  box-shadow:
      3px 3px 0 0 #59596D,
      3px 4.5px 0 0 #1B1B2A,
      -3px 3px 0 0 #1B1B2A,
      3px 0 0 0 #59596D,
      0 -1.5px 0 0 #000000;

  .avatar-block {
    position: relative;
    width: 200px;
    .play-btn {
      bottom: 0;
      right: 0;
      position: absolute;
      background: url("/img/play-btn.png") no-repeat;
      height: 66px;
      width: 85px;
    }

    img {
      width: 200px;
      max-width: none;
      height: 100%;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
    width: 230px;

    .twitter {
      display: inline-flex;
      align-items: center;
      gap: 15px;
      cursor: pointer;
      span {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .twitter:hover {
      span {
        color: white;
      }
    }
  }
}

.person:hover {
  transform: scale(1.035);
  z-index: 99;
}

@media (max-width: 680px) {
  .person {
    flex-direction: column;
    width: 70%;
    align-items: center;

    .info {
      gap: 1rem;
      align-items: center;
    }

    .avatar-block {
      button.play-btn {
        height: 40px;
        width: 51px;
        background-size: 100% 100%;
        background-position: center;
      }
    }
  }
}

@media (max-width: 540px) {
  .person {
    width: 90%;

    .avatar-block {
      width: 100%;

      img {
        width: 100%;
      }
    }
  }
}
</style>
