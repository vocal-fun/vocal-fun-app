<template>
  <div class="header">
    <button class="close" @click="$emit('close')">X</button>
  </div>
  <div class="info">
    <div class="balance">YOUR VOCAL: 0.18</div>
    <button class="buy-more">
      BUY MORE
    </button>
  </div>
  <div class="content">
    <div class="avatar">
      <img :src="imagePath" alt="Selected AI Celebrity Avatar">
    </div>
    <div class="name">{{ person.displayName }}</div>
    <div class="price">10 $vocal/min</div>
  </div>
  <div class="footer">
    <GreenModalButton text="Call" icon="call" @click="call" />
    <GreenModalButton v-if="audio" text="Stop" icon="stop" @click="stopAudio" />
    <GreenModalButton v-else text="Preview" icon="play" @click="playAudio" />
  </div>
</template>

<script setup lang="ts">
import type { CelebrityItem } from '~/types';

const props = defineProps<{
  person: CelebrityItem,
}>();

const audio = ref<HTMLAudioElement | null>(null);

const imagePath = computed(() => `/img/celebrity-logo/${props.person.name}.${props.person.imgFormat || 'png'}`);
const audioPath = computed(() => `/audio/${props.person.name}.${props.person.audioFormat || 'mp3'}`);

const playAudio = async () => {
  try {
    stopAudio();
    audio.value = new Audio(audioPath.value);
    await audio.value.play();
    audio.value.onended = () => {
      audio.value = null;
    };
  } catch (error) {
    audio.value = null;
    console.warn('[VOCAL.FUN] Error playing audio:', error);
  }
};

const stopAudio = () => {
  if (audio.value) {
    audio.value.pause();
    audio.value = null;
  }
};

const call = () => {
  console.log('Calling', props.person.displayName);
  // TODO: Implement calling logic & add missing views here
};
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  .close {
    padding: 0.5rem 1rem;
    transition: color 0.3s ease-in-out;
    &:hover {
      color: white;
    }
  }
}
.info {
  display: inline-flex;
  gap: 1rem;

  .buy-more {
    text-shadow: 0px 0.55px 6.65px #0ADC0F;
    transition: color 0.3s ease-in-out, border-bottom 0.3s ease-in-out;
    &:hover {
      color: white;
      border-bottom: 1px solid white;
    }
  }
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .6rem;

  .avatar {
    margin-bottom: 20px;
    img {
      height: 175px;
    }
  }

  .name {
    text-transform: uppercase;
  }
}

.footer {
  display: flex;
  gap: 2rem;
}
</style>
