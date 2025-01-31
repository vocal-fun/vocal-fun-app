<template>
  <div class="person shake-little" :class="{ disabled }" @click="openModal('default')">
    <div class="avatar-block">
      <NuxtImg
        class="avatar-img"
        sizes="90vw md:400px"
        format="webp"
        loading="lazy"
        width="100%"
        placeholder="/img/user-avatar.png"
        :src="image"
        :alt="name"
      />
    </div>
    <div class="info">
      <span>{{ name }}</span>
      <span>${{ rate }} / min</span>
    </div>
    <div class="buttons">
      <button class="preview shake" :disabled="disabled" @click="openModal('preview')">PREVIEW</button>
      <button class="shake" :disabled="disabled || !user" @click="openModal('call')">CALL</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { audioService } from '~/services/audio';
import type { AgentDto, OpenModalState } from '~/types';

const props = defineProps<Omit<AgentDto, '__v' | 'createdAt'> & { disabled: boolean }>();

const emit = defineEmits<{
  'open-modal': [state: OpenModalState],
}>();

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const playClickSound = () => audioService.click();

const openModal = (state: OpenModalState = 'default') => {
  if (props.disabled) return;
  if (state === 'call' && !user.value) return;
  playClickSound();
  emit('open-modal', state);
};
</script>

<style scoped lang="scss">
.person {
  cursor: pointer;
  color: var(--color-primary);
  display: flex;
  flex-wrap: wrap;
  width: 430px;
  transition: transform 0.3s ease-in-out;
  box-shadow:
      3px 3px 0 0 #59596D,
      3px 4.5px 0 0 #1B1B2A,
      -3px 3px 0 0 #1B1B2A,
      3px 0 0 0 #59596D,
      0 -1.5px 0 0 #000000;

  &.disabled {
    cursor: not-allowed;
  }

  > * {
    flex: 1 1 50%;
  }

  > .buttons {
    flex: 1 1 100%;
    display: flex;
    z-index: 1;

    > button {
      flex: 1 1 50%;
      padding: 1rem;
      background-color: var(--color-primary);
      color: #1B1B2A;
      border: none;
      cursor: pointer;
      justify-content: center;

      &[disabled] {
        cursor: not-allowed;
      }

      &:hover {
        transform: scale(1.035);
        z-index: 100;
      }
    }

    .preview {
      background-color: #37D33933;
      color: var(--color-primary);
    }
  }

  .avatar-block {
    position: relative;
    width: 200px;

    img {
      width: 200px;
      height: 100%;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
    width: 230px;
  }

  &:hover {
    transform: scale(1.035);
    z-index: 99;
  }
}

@media (max-width: 680px) {
  .person {
    flex-direction: column;
    width: 70%;
    align-items: center;

    > * {
      flex: auto;
    }

    > .buttons {
      flex: auto;
      width: 100%;
    }

    .info {
      gap: 1rem;
      align-items: center;
      width: 100%;
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
