<template>
  <div class="header">
    <button v-play-click-sound class="close" @click="onModalClose">X</button>
  </div>
  <div class="info">
    <div class="balance">YOUR VOCAL: 0.18</div>
    <button v-play-click-sound class="buy-more">
      BUY MORE
    </button>
  </div>
  <div class="content">
    <template v-if="idleOrError">
      <div class="avatar">
        <NuxtImg
          alt="Selected AI Celebrity Avatar"
          sizes="90vw md:400px"
          format="webp"
          loading="lazy"
          :src="imagePath"
        />
      </div>
      <div class="name">{{ person.displayName }}</div>
      <div class="price">10 $vocal/min</div>
      <div v-if="callStatus === 'error'" class="error alert-color">some error happened</div>
    </template>

    <transition name="fade">
      <div v-if="callingOrOnCall" class="calling-dialog">
        <div class="person">
          <NuxtImg
            class="dialog-avatar"
            alt="Selected AI Celebrity Avatar"
            sizes="90vw md:400px"
            format="webp"
            loading="lazy"
            :src="imagePath"
          />
          <div class="name">{{ person.displayName }}</div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="36"
          viewBox="0 0 10 10"
          alt="Call Icon"
          :class="['call-icon', calling ? 'shake shake-constant' : '']"
        >
          <path :d="callD" fill="#00FA00"/>
        </svg>
        <div class="user-info">
          <NuxtImg
            class="dialog-avatar"
            src="/img/user-avatar.png"
            alt="Your avatar"
            sizes="90vw md:400px"
            format="webp"
            loading="lazy"
            quality="100"
          />
          <div class="name">You</div>
        </div>
      </div>
    </transition>
  </div>
  <div :class="['footer', callingOrOnCall ? 'footer-on-call' : 'footer-idle']">
    <template v-if="idleOrError">
      <GreenModalButton icon="call" @click="startCall">Call</GreenModalButton>
      <GreenModalButton v-if="audio" icon="stop" @click="stopPreview">Stop</GreenModalButton>
      <GreenModalButton v-else icon="play" @click="playPreview">Preview</GreenModalButton>
    </template>

    <template v-else-if="callingOrOnCall">
      <GreenModalButton class="time-on-call" icon="call" :class="{ 'calling': calling }">
        <span>{{ timerText }}</span>
      </GreenModalButton>
      <span>&#183;</span>
      <span v-if="calling">calling <LoadingDots /></span>
      <button
        v-if="onCall"
        class="hang-up-button alert-color"
        @click="hangUpWithClickSound"
      >
        hang up
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { audioService } from '~/services/audio';
import { icons } from '~/consts';
import type { CelebrityItem } from '~/types';
import type { Howl } from 'howler';

type callStatusType = 'calling' | 'error' | 'idle' | 'on-call';

const props = defineProps<{
  person: CelebrityItem,
}>();

const emit = defineEmits(['close']);

let seconds = 0;
let timer: ReturnType<typeof setInterval> | null = null;
let cancelCall: (() => void) | null = null;
const callD = icons.call;
const audio = shallowRef<Howl | null>(null);

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

const play = async (path: string) => {
  try {
    audioService.interruptBgMusic();
    stop();
    audioService.load(path);
    audio.value = audioService.play(path);
    if (audio) {
      audio.value?.on('end', () => {
        audio.value = null;
        audioService.resumeBgMusic();
      });
    }
  } catch (error) {
    audio.value = null;
    console.warn('[VOCAL.FUN] Error playing audio:', error);
  }
};

const stop = () => {
  if (audio) {
    audio.value?.pause?.();
    audio.value = null;
  }
};

const onModalClose = () => {
  emit('close');
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
  const controller = new AbortController(); // Create an AbortController
  const signal = controller.signal; // Get the signal

  // Handle cleanup in case of cancellation
  const cancelCall = () => {
    controller.abort(); // Abort the call when needed
  };

  await audioService.click();
  callStatus.value = 'calling';

  // For demo purposes: Play the calling audio
  play(audioService.callingUrl);

  // Add the abort signal to your Promise
  new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(() => resolve(), 9_000); // Simulate a delay of 9 seconds
    // Check if the operation should be aborted
    signal.addEventListener('abort', () => {
      clearTimeout(timeoutId); // Clear the timeout if aborted
      reject(new Error('Call was cancelled')); // Reject with an error
    });
  }).then(() => {
    callStatus.value = 'on-call';
    resetTimer();
    console.info(`[VOCAL.FUN] Call with ${props.person.name} started`);
    timer = setInterval(() => {
      seconds++;
      updateTimerDisplay();
    }, 1_000);
  }).catch((error) => {
    if ((error as Error).message === 'Call was cancelled') {
      console.log('Call was cancelled before completion');
    } else {
      callStatus.value = 'error';
      console.warn('[VOCAL.FUN] Error during call:', error);
    }
  });

  return cancelCall; // Return the cancel function for later use
};

const startCall = async () => {
  cancelCall = await call();
}

const hangUp = () => {
  stop();
  cancelCall?.();
  callStatus.value = 'idle';
  resetTimer();
  audioService.resumeBgMusic();
}

const hangUpWithClickSound = () => {
  audioService.click();
  hangUp();
}

const playPreview = async () => {
  await audioService.click();
  play(previewPath.value);
}

const stopPreview = async () => {
  await audioService.click();
  audioService.resumeBgMusic();
  stop();
}

const updateTimerDisplay = () => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  timerText.value = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

defineExpose({
  hangUp,
});
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
  margin: 1rem 0;
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

  @media (max-width: 550px) {
    flex-direction: column;
    gap: 1rem;
  }

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
  margin: 1rem 0;
  display: flex;
  gap: 1rem;
  width: 240px;

  &.footer-idle {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  &.footer-on-call {
    width: 100%;
    justify-content: center;
  }

  .hang-up-button {
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.3s ease-in-out;
    &:hover {
      border-bottom-color: #FA6400;
    }
  }
}

.time-on-call {
  &.calling {
    width: 121px;
    justify-content: end;
  }
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

.fade-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-leave-active {
  transition: none; /* No transition for leave */
}
.fade-leave-from,
.fade-leave-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
