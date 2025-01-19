<template>
  <div class="header">
    <button class="close" @click="onModalClose">X</button>
  </div>
  <div class="info">
    <div class="balance">YOUR VOCAL: 0.18</div>
    <button class="buy-more">
      BUY MORE
    </button>
  </div>
  <div class="content">

    <template v-if="idleOrError">
      <div class="avatar">
        <img :src="imagePath" alt="Selected AI Celebrity Avatar">
      </div>
      <div class="name">{{ person.displayName }}</div>
      <div class="price">10 $vocal/min</div>
      <div v-if="callStatus === 'error'" class="error alert-color">some error happened</div>
    </template>

    <template v-if="callingOrOnCall">
      <div class="calling-dialog">
        <div class="person">
          <img class="dialog-avatar" :src="imagePath" alt="Selected AI Celebrity Avatar">
          <div class="name">{{ person.displayName }}</div>
        </div>

        <img
            :class="['call-icon', calling ? 'shake shake-constant' : '']"
            src="/img/call-icon.png"
            alt="Call Icon"
            height="30"
            width="30"
        >

        <div class="user-info">
          <img class="dialog-avatar" src="/img/user-avatar.png" alt="Your avatar">
          <div class="name">You</div>
        </div>
      </div>
    </template>
  </div>
  <div :class="['footer', callingOrOnCall ? 'footer-on-call' : '']">
    <template v-if="idleOrError">
      <GreenModalButton icon="call" @click="call">Call</GreenModalButton>
      <GreenModalButton v-if="audio" icon="stop" @click="stopAudio">Stop</GreenModalButton>
      <GreenModalButton v-else icon="play" @click="playAudio(previewPath)">Preview</GreenModalButton>
    </template>

    <template v-if="callingOrOnCall">
      <GreenModalButton class="time-on-call" icon="call">
        <span>{{ timerText }}</span>
      </GreenModalButton>
      <span>&#183;</span>
      <span v-if="calling">calling <LoadingDots /></span>
      <button
          v-if="onCall"
          @click="hangUp"
          class="hang-up-button alert-color"
      >
        hang up
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CelebrityItem } from '~/types';

const emit = defineEmits(['close']);

const props = defineProps<{
  person: CelebrityItem,
}>();

type callStatusType = 'calling' | 'error' | 'idle' | 'on-call';

let seconds = 0;
let timer: ReturnType<typeof setInterval> | null = null;

const audio = ref<HTMLAudioElement | null>(null);
const callStatus = ref<callStatusType>('idle');
const timerText = ref<string>('00:00');

const idle = computed(() => callStatus.value === 'idle');
const calling = computed(() => callStatus.value === 'calling');
const error = computed(() => callStatus.value === 'error');
const onCall = computed(() => callStatus.value === 'on-call');

const idleOrError = computed(() => idle.value || error.value);
const callingOrOnCall = computed(() => calling.value || onCall.value);

const imagePath = computed(() => `/img/celebrity-logo/${props.person.name}.${props.person.imgFormat || 'png'}`);
const previewPath = computed(() => `/audio/${props.person.name}.${props.person.audioFormat || 'mp3'}`);

const playAudio = async (path: string) => {
  try {
    stopAudio();
    audio.value = new Audio(path);
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

// TODO: function to be called in parent component
const onModalClose = () => {
  emit('close');
  stopAudio();
  hangUp();
}

const resetTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  seconds = 0;
  timerText.value = '00:00';
}

const call = async () => {
  callStatus.value = 'calling';
  // for demo purposes
  await new Promise((resolve) => setTimeout(resolve, 3_500));
  callStatus.value = 'on-call';
  resetTimer();
  timer = setInterval(() => {
    seconds++;
    updateTimerDisplay();
  }, 1000);
};

const hangUp = () => {
  callStatus.value = 'idle';
  resetTimer();
}

const updateTimerDisplay = () => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  timerText.value = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
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
    border-bottom: 1px solid transparent;
    transition: color 0.3s ease-in-out, border-bottom 0.3s ease-in-out;
    &:hover {
      color: white;
      border-bottom-color: white;
    }
  }
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  .avatar {
    margin-bottom: 1.25rem;
    img {
      height: 175px;
    }
  }

  .name {
    text-transform: uppercase;
  }

  .error {
    margin-top: 1.25rem;
  }
}

.calling-dialog {
  display: flex;
  align-items: center;
  gap: 3rem;

  .dialog-avatar {
    height: 175px;
  }

  .person, .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
}

.footer {
  display: flex;
  gap: 1rem;

  .hang-up-button {
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.3s ease-in-out;
    &:hover {
      border-bottom-color: #FA6400;
    }
  }
}

.time-on-call {
  > span {
    width: 50px;
  }
  &:hover {
    cursor: default;
  }
}

.alert-color {
  color: #FA6400;
  text-shadow: 0 0 6.09px 0 #FA6400,
  0 0.55px 6.65px 0 #FA6400;
}
</style>
