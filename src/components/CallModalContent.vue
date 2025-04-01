<template>
  <div class="header">
    <button v-play-click-sound class="close" @click="onModalClose">X</button>
  </div>
  <div class="info">
    <template v-if="user">
      <div class="balance">BALANCE: ${{ user.balance }}</div>
      <button v-if="false" v-play-click-sound class="buy-more" @click="openBuyModal">
        BUY MORE
      </button>
    </template>
    <ConnectWallet v-else class="buy-more" @click="onModalClose" />
  </div>
  <div class="content">
    <template v-if="idleOrError">
      <div class="avatar">
        <NuxtImg alt="Selected AI Celebrity Avatar" sizes="90vw md:400px" format="webp" loading="lazy"
          :src="personSafe.image" />
      </div>
      <div class="name">{{ personSafe.name }}</div>
      <div class="price">${{ personSafe.rate }} / min</div>
      <div v-show="hasError" class="error alert-color">some error happened</div>
    </template>

    <transition name="fade">
      <div v-if="callingOrOnCall" class="calling-dialog">
        <div class="person">
          <NuxtImg class="dialog-avatar" alt="Selected AI Celebrity Avatar" sizes="90vw md:400px" format="webp"
            loading="lazy" :src="personSafe.image" />
          <div class="name">{{ personSafe.name }}</div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="36" viewBox="0 0 10 10" alt="Call Icon"
          :class="['call-icon', calling ? 'shake shake-constant' : '']">
          <path :d="callD" fill="#00FA00" />
        </svg>
        <div class="user-info">
          <NuxtImg class="dialog-avatar" src="/img/user-avatar.png" alt="Your avatar" sizes="90vw md:400px"
            format="webp" loading="lazy" quality="100" />
          <div class="name">You</div>
        </div>
      </div>
    </transition>
  </div>
  <div :class="['footer', callingOrOnCall ? 'footer-on-call' : 'footer-idle']">
    <template v-if="idleOrError">
      <GreenModalButton icon="call" @click="startCall">Call</GreenModalButton>
      <GreenModalButton v-if="audio" icon="stop" @click="stopPreview">Stop</GreenModalButton>
      <GreenModalButton v-else icon="play" :loading="previewLoading" :disabled="!preview" @click="playPreview">Preview
      </GreenModalButton>
      <template v-if="isDownloadable">
        <GreenModalButton icon="download" :loading="isDownloading" @click="download">Download</GreenModalButton>
        <GreenModalButton v-if="isShareAvailable" icon="twitter" :loading="isDownloading" @click="share">Share
        </GreenModalButton>
        <GreenModalButton v-else tag="a" icon="twitter" :href="tweetHref">Tweet</GreenModalButton>
      </template>
    </template>

    <template v-else-if="callingOrOnCall">
      <GreenModalButton class="time-on-call" icon="call" :class="{ 'calling': calling }">
        <span>{{ timerText }}</span>
      </GreenModalButton>
      <span>&#183;</span>
      <span v-if="calling">calling
        <LoadingDots />
      </span>
      <button v-if="onCall" class="hang-up-button alert-color" @click="hangUpWithClickSound">
        hang up
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useShare } from '@vueuse/core';
import type { Howl } from 'howler';

import { meta } from '~~/meta';
import { icons } from '~/consts';
import { audioService } from '~/services/audio';
import type { Agent, OpenModalState, Preview } from '~/types';
import { defaultAgent } from '~/consts';

type CallStatusType = 'calling' | 'idle' | 'on-call';

const props = withDefaults(
  defineProps<{
    person?: Agent,
    modalType?: string,
  }>(),
  {
    person: () => ({ ...defaultAgent }),
    modalType: 'default',
  }
);


const personSafe = computed(() => props.person || { name: '', image: '', rate: 1, createdAt: '', id: '', route: '' });
const emit = defineEmits(['close']);

let seconds = 0;
let timer: ReturnType<typeof setInterval> | null = null;
let callInit = false;
let cancelCurrentCall: (() => void) | null = null;
const callD = icons.call;
const audio = shallowRef<Howl | null>(null);

const callStatus = ref<CallStatusType>('idle');
const timerText = ref<string>('00:00');
const previewLoading = ref(false);

const idle = computed(() => callStatus.value === 'idle');
const calling = computed(() => callStatus.value === 'calling');
const onCall = computed(() => callStatus.value === 'on-call');

const idleOrError = computed(() => idle.value || hasError.value);
const callingOrOnCall = computed(() => (calling.value || onCall.value) && !hasError.value);

const agentsStore = useAgentsStore();
const preview = computed<Preview | null>(() =>
  agentsStore.previews[personSafe.value.id]
    ? { ...agentsStore.previews[personSafe.value.id], agentId: personSafe.value.id }
    : null
);

const buyStore = useBuyStore();
const authStore = useAuthStore();
const { handleConnectClick } = useWalletConnect();

const user = computed(() => authStore.user);

const tweetHref = computed(() => {
  const pageUrl = encodeURIComponent(url.value);
  return `https://twitter.com/intent/tweet?text=I had a legendary call with ${personSafe.value.name} on VOCAL.FUN... You gotta try this!&url=${pageUrl}`;
});
const { share: _share, isSupported: _isShareAvailable } = useShare();

const {
  hasError,
  hasCallError,
  isDownloadable,
  isDownloading,
  audioChunks,
  initCallSession,
  closeCallSession,
  startRecording,
  stopRecording,
  downloadMp4
} = useCallApi();

const { $device } = useNuxtApp();

const isShareAvailable = computed(() => _isShareAvailable.value && $device.isMobileOrTablet);

const url = computed(() => `${meta.url}/${personSafe.value.route}`);

const share = async () => {
  if (!isShareAvailable.value) {
    return;
  }
  const options: ShareData = {
    title: 'VOCAL.FUN',
    text: `I had a legendary call with ${personSafe.value.name} on VOCAL.FUN... You gotta try this!\n${url.value}`,
    url: url.value,
  };
  try {
    const mp4Blob = await downloadMp4(personSafe.value.image);
    if (mp4Blob) {
      options.files = [new File([mp4Blob], `${personSafe.value.route}.mp4`, { type: 'video/mp4' })];
    }
    await _share(options);
  } catch (error) {
    console.warn('[SHARE] Error sharing:', error);
  }
};

const download = async () => {
  const mp4Blob = await downloadMp4(personSafe.value.image);
  if (!mp4Blob) {
    return;
  }
  const url = URL.createObjectURL(mp4Blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${personSafe.value.route}.mp4`;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

const playCurrentSound = async (path: string, withoutResume = false) => {
  try {
    audioService.interruptBgMusic();
    stopCurrentSound();
    audioService.load(path);
    audio.value = audioService.play(path);
    if (audio) {
      audio.value?.on('end', () => {
        audio.value = null;
        if (!withoutResume) {
          audioService.resumeBgMusic();
        }
      });
    }
  } catch (error) {
    audio.value = null;
    console.warn('[VOCAL.FUN] Error playing audio:', error);
  }
};

const openBuyModal = () => {
  buyStore.openBuyModal();
  onModalClose();
};

const stopCurrentSound = () => {
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

const resetCallData = (keepError = false) => {
  resetTimer();
  stopRecording();
  if (!keepError) {
    hasCallError.value = false;
  }
}

const call = async (signal: AbortSignal) => {
  callInit = true;
  callStatus.value = 'calling';
  playCurrentSound(audioService.callingUrl, true); // Play the calling audio in parallel
  const startInitTime = Date.now();
  try {
    // Initiate the call session and web socket connection
    await initCallSession(personSafe.value.id);
    signal.throwIfAborted(); // Check if the call was cancelled
    const callDurationLeft = 2_000 - (Date.now() - startInitTime);
    await new Promise<void>((resolve) => setTimeout(resolve, callDurationLeft < 0 ? 0 : callDurationLeft));
    callStatus.value = 'on-call';
    stopCurrentSound();
    signal.throwIfAborted(); // Check if the call was cancelled
    console.info(`[VOCAL.FUN] Call with ${personSafe.value.name} started`);
    await startRecording();
    timer = setInterval(() => {
      seconds++;
      updateTimerDisplay();
    }, 1_000);
  } catch (error) {
    if (error == 'cancelled') {
      console.log('[VOCAL.FUN] Call was cancelled before completion');
    } else {
      hasCallError.value = true;
      console.warn('[VOCAL.FUN] Error during call:', error);
    }
  } finally {
    callInit = false;
  }
}

const startCall = async (click = true) => {
  if (click) {
    await audioService.click();
  }
  if (!user.value) {
    handleConnectClick();
    onModalClose();
    return; // Do nothing if user is not logged in
  }
  const controller = new AbortController(); // Create an AbortController
  const signal = controller.signal; // Get the signal
  // Handle cleanup in case of cancellation
  const _cancelCurrentCall = () => {
    controller.abort('cancelled'); // Abort the call when needed
  };
  resetCallData();
  call(signal);
  cancelCurrentCall = _cancelCurrentCall;
}

const hangUp = (keepError = false) => {
  cancelCurrentCall?.();
  stopCurrentSound();
  waitForCallInit().then(() => {
    resetCallData(keepError);
    closeCallSession();
    callStatus.value = 'idle';
    audioService.resumeBgMusic();
  });
}

const hangUpWithClickSound = () => {
  audioService.click();
  hangUp();
}

const playPreview = async (click = true) => {
  if (click) {
    await audioService.click();
  }
  if (personSafe.value.id) {
    await playCurrentSound(personSafe.value.id);
  }
}

const stopPreview = async () => {
  await audioService.click();
  audioService.resumeBgMusic();
  stopCurrentSound();
}

const updateTimerDisplay = () => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  timerText.value = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const waitForCallInit = async () => {
  while (callInit) {
    await new Promise<void>((resolve) => setTimeout(resolve, 500));
  }
}

const onOpen = async (state: OpenModalState) => {
  await nextTick();
  audioChunks.value = new Float32Array(0);
  cancelCurrentCall = null;
  previewLoading.value = true;
  await agentsStore.getAgentPreview(personSafe.value);
  if (preview.value) {
    audioService.load(preview.value);
  }
  previewLoading.value = false;
  switch (state) {
    case 'default':
      break;
    case 'preview':
      await playPreview(false);
      if (!preview.value) {
        stopCurrentSound(); // to show play button again if no preview
      }
      break;
    case 'call':
      await startCall(false);
      break;
  }
}

watch(hasError, (value) => {
  if (value) {
    hangUp(true);
  }
});

defineExpose({
  onOpen,
  onClose: hangUp,
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
    text-shadow: 0 0.55px 6.65px #0ADC0F;
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

  .person,
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
}

.recognition {
  margin: 0.5rem 1rem;
  text-align: center;
  transition: visibility 0.3s ease-in-out;

  &.hidden {
    visibility: hidden;
  }
}

.footer {
  margin: 1rem 0;
  display: flex;
  gap: 1rem;
  width: 240px;

  &.footer-idle {
    display: grid;
    grid-template-columns: repeat(2, 2fr);
  }

  &.footer-on-call {
    width: 100%;
    justify-content: center;
  }

  .hang-up-button {
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.3s ease-in-out;

    &:hover {
      border-bottom-color: var(--color-warn);
    }
  }
}

.time-on-call {
  &.calling {
    width: 121px;
    justify-content: end;
  }

  >span {
    width: 50px;
    font-variant-numeric: tabular-nums;
  }

  &:hover {
    cursor: default;
  }
}

.alert-color {
  color: var(--color-warn);
  text-shadow: 0 0 6.09px 0 var(--color-warn),
    0 0.55px 6.65px 0 var(--color-warn);
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
  transition: none;
  /* No transition for leave */
}

.fade-leave-from,
.fade-leave-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
