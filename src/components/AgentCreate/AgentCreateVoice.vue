<template>
  <div class="profile-voice">
    <p class="warning">
      Upload a 10-15s clip of voice you want to clone. High quality only.
      Or pick one of the existing ones.
    </p>
    <div v-play-click-sound class="upload-voice" :class="{ selected: selectedVoice === 'uploaded', loaded: voiceFile }"
      @click="selectUploadedVoice">
      <NuxtImg v-if="!voiceFile" class="speaker" src="/logo/logo.png" alt="Speaker logo" format="webp" loading="lazy" />
      <button v-play-click-sound v-else class="speaker" @click.stop="togglePlayPause">
        <NuxtImg v-if="!isPlaying" class="play" src="/img/play.png" alt="Play" format="webp" loading="lazy" />
        <span v-else>||</span>
      </button>
      <div class="description">
        <p v-if="voiceFileName">{{ displayVoiceFileName }}</p>
        <template v-else>
          <p>Upload a voice sample</p>
          <p>.mp4, wav, mp3</p>
        </template>
      </div>
      <button v-play-click-sound @click.stop="handleVoiceButtonClick">
        {{ voiceFile ? "Remove" : "Upload" }}
      </button>
      <input ref="voiceInput" type="file" accept="audio/*,video/mp4" @change="onVoiceChange" style="display: none;" />
      <audio ref="uploadedAudio" :src="uploadedAudioUrl || ''" style="display: none;" />
    </div>
    <div class="divider">
      <span>OR</span>
    </div>
    <div v-play-click-sound v-for="ex in examples" :key="ex.id" class="example-voice"
      :class="{ selected: selectedVoice === ex.id }" @click="selectExampleVoice(ex)">
      <button @click.stop="toggleExample(ex)">
        <NuxtImg v-if="!ex.isPlaying" class="play" src="/img/play.png" alt="Play" format="webp" loading="lazy" />
        <span v-else>||</span>
      </button>
      <div class="description">
        <p>{{ ex.label }}</p>
        <p>{{ ex.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, onMounted } from 'vue'
import { NuxtImg } from '#components'
import type { ExampleVoice } from '~/types';

const emit = defineEmits<{
  (e: 'update:voiceFile', file: File | null): void;
  (e: 'update:exampleVoice', voice: string | null): void;
}>();

const selectedVoice = ref<string | null>(null);
const voiceFile = ref<File | null>(null);
const voiceFileName = ref('');
const voiceInput = ref<HTMLInputElement | null>(null);
const uploadedAudioUrl = ref<string | null>(null);
const uploadedAudio = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);

const examples = ref<ExampleVoice[]>([
  {
    id: 'kawaii',
    file: 'example.mp3',
    label: 'Kawaii',
    description: 'cute japanese girl',
    isPlaying: false,
    audio: null,
  },
  {
    id: 'robotic',
    file: 'example.mp3',
    label: 'Robotic',
    description: 'futuristic robot voice',
    isPlaying: false,
    audio: null,
  },
  {
    id: 'oldman',
    file: 'example.mp3',
    label: 'Old Man',
    description: 'wise old man voice',
    isPlaying: false,
    audio: null,
  },
]);

const displayVoiceFileName = computed(() => {
  if (!voiceFileName.value) return '';
  if (voiceFileName.value.length <= 5) return voiceFileName.value;
  const dotIndex = voiceFileName.value.lastIndexOf('.');
  if (dotIndex !== -1) {
    const namePart = voiceFileName.value.slice(0, 5);
    const ext = voiceFileName.value.slice(dotIndex);
    return namePart + '...' + ext;
  }
  return voiceFileName.value.slice(0, 5) + '...';
});

function toggleExample(ex: ExampleVoice) {
  if (!ex.audio) {
    ex.audio = new Audio(`/audio/${ex.file}`);
    ex.audio.addEventListener('ended', () => {
      ex.isPlaying = false;
    });
  }
  if (ex.audio.paused) {
    examples.value.forEach((other) => {
      if (other !== ex && other.audio && !other.audio.paused) {
        other.audio.pause();
        other.isPlaying = false;
      }
    });
    ex.audio.play().catch((err) => {
      console.warn(`Error playing example audio ${ex.file}:`, err);
    });
    ex.isPlaying = true;
  } else {
    ex.audio.pause();
    ex.isPlaying = false;
  }
}

function selectExampleVoice(ex: ExampleVoice) {
  selectedVoice.value = ex.id;
  emit('update:exampleVoice', ex.file);
}

function handleVoiceButtonClick() {
  if (voiceFile.value) {
    voiceFile.value = null;
    voiceFileName.value = '';
    uploadedAudioUrl.value = null;
    isPlaying.value = false;
    if (voiceInput.value) {
      voiceInput.value.value = '';
    }
    emit('update:voiceFile', null);
    if (selectedVoice.value === 'uploaded') {
      selectedVoice.value = null;
    }
  } else {
    voiceInput.value?.click();
  }
}

function onVoiceChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const selectedFile = target.files ? target.files[0] : null;
  if (selectedFile) {
    voiceFile.value = selectedFile;
    voiceFileName.value = selectedFile.name;
    uploadedAudioUrl.value = URL.createObjectURL(selectedFile);
    isPlaying.value = false;
    emit('update:voiceFile', selectedFile);
    selectedVoice.value = 'uploaded';
  }
}

function togglePlayPause() {
  const audioEl = uploadedAudio.value;
  if (!audioEl) return;
  if (audioEl.paused) {
    audioEl.play().catch(err => {
      console.warn('Error playing uploaded audio:', err);
    });
    isPlaying.value = true;
  } else {
    audioEl.pause();
    isPlaying.value = false;
  }
}

onMounted(() => {
  const audioEl = uploadedAudio.value;
  if (audioEl) {
    audioEl.addEventListener('ended', () => {
      isPlaying.value = false;
    });
  }
});

function selectUploadedVoice() {
  if (voiceFile.value) {
    selectedVoice.value = "uploaded";
    emit('update:exampleVoice', null);
  }
}
</script>

<style scoped lang="scss">
.profile-voice {
  display: flex;
  flex-direction: column;
  width: 100%;

  .warning {
    color: #fa6400;
    margin-top: 16px;
    margin-bottom: 24px;
    font-size: 12px;
  }

  /* Upload voice block */
  .upload-voice {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: #59596d26;
    border: 1.8px solid #59596d33;

    transition: background-color 0.3s ease-in-out, border 0.3s ease-in-out;

    &.selected {
      background-color: #00fa000F;
      border: 1.82px solid #00fa00;
    }

    /* Hover effect for upload block only when file is loaded */
    &.loaded:hover {
      cursor: pointer;
      background-color: #00fa001F;
    }

    .speaker {
      width: 63px;
      height: 63px;
      padding: 12px;
      border: 1px solid #59596d33;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      cursor: pointer;

      img {
        width: 22px;
        height: 22px;
      }
    }

    .description {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-right: auto;

      p:last-child {
        opacity: 0.5;
      }
    }

    button {
      position: relative;

      &::after {
        content: '';
        display: block;
        height: 1px;
        background-color: white;
        margin-top: 6px;
      }

      transition: color 0.3s ease-in-out;

      &:hover {
        color: rgb(201, 195, 195);

      }

      &:hover::after {
        background-color: rgb(201, 195, 195);
      }
    }

    audio {
      display: none;
    }
  }

  /* Divider inline */
  .divider {
    display: flex;
    align-items: center;
    color: white;
    margin-top: 28px;
    margin-bottom: 24px;

    &::before,
    &::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid white;
      opacity: 0.2;
    }

    &::before {
      margin-right: 32px;
    }

    &::after {
      margin-left: 32px;
    }
  }

  /* Example voices */
  .example-voice {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px;
    background-color: #59596d26;
    border: 1.8px solid #59596d33;
    margin-bottom: 12px;

    transition: background-color 0.3s ease-in-out, border 0.3s ease-in-out;

    &.selected {
      background-color: #00fa000F;
      border: 1.82px solid #00fa00;
    }

    /* Add hover effect for all example voices */
    &:hover {
      background-color: #00fa001F;
      cursor: pointer;
    }

    button:first-child {
      border: 1px solid #59596d33;
      margin: unset;
      width: 63px;
      height: 63px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 24px;
      color: #ffffff;

      img {
        width: 22px;
        height: 22px;
      }
    }

    .description {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-left: 32px;

      p:last-child {
        opacity: 0.5;
      }
    }
  }
}
</style>
