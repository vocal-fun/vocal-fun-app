<template>
  <div class="person shake-little" :class="{ disabled: isDisabled }" @click="openModal('default')">
    <div class="info">
      <span>{{ name }}</span>
      <span>{{ tokenName }}</span>
      <span>mcap ${{ mcap }} </span>
      <span> {{ createdAt }}</span>
    </div>

    <div class="avatar-block">
      <NuxtImg class="avatar-img" sizes="90vw md:400px" format="webp" loading="lazy" width="100%"
        placeholder="/img/user-avatar.png" placeholder-class="image-placeholder" :src="image" :alt="name" />
    </div>

    <div class="buttons">
      <button class="preview shake" :disabled="isDisabled" @click.stop="openModal('preview')">PREVIEW</button>
      <button class="shake" :disabled="isDisabled" @click.stop="openModal('call')">CALL</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { audioService } from '~/services/audio';
import type { Agent, OpenModalState } from '~/types';

const props = defineProps<Omit<Agent, 'route' | 'id'> & { disabled: boolean }>();

const isDisabled = computed(() => props.disabled || !props.name);

const emit = defineEmits<{
  'open-modal': [state: OpenModalState],
}>();

const playClickSound = () => audioService.click();

const openModal = (state: OpenModalState = 'default') => {
  if (props.disabled) return;
  playClickSound();
  emit('open-modal', state);
};
</script>

<style scoped lang="scss">
$circle-gradient: linear-gradient(
  180deg,
  rgba(0, 250, 0, 0) 0%,
  rgba(0, 250, 0, 0.3) 54.12%,
  rgba(0, 250, 0, 0) 100%
);

@keyframes textShimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

.person {
  cursor: pointer;
  color: var(--color-primary);
  display: flex;
  flex-wrap: wrap;
  width: 380px;
  background-color: #000000;
  transition: transform 0.3s ease-in-out;
  padding-left: 18px;
  padding-top: 14px;
  box-shadow:
    3px 3px 0 0 #59596D,
    3px 4.5px 0 0 #1B1B2A,
    -3px 3px 0 0 #1B1B2A,
    3px 0 0 0 #59596D,
    0 -1.5px 0 0 #000000;

  >* {
    flex: 1 1 50%;
  }

  >.buttons {
    flex: 1 1 100%;
    display: flex;
    z-index: 1;

    >button {
      flex: 1 1 50%;
      padding: 1rem;
      background-color: var(--color-primary);
      color: #1B1B2A;
      border: none;
      cursor: pointer;
      justify-content: center;

      &[disabled] {
        cursor: not-allowed;
        color: #1b1b2a64;
        opacity: 0.8;
      }

      &:hover {
        transform: scale(1.035);
        z-index: 100;
      }
    }

    .preview {
      background-color: #37D33933;
      color: var(--color-primary);

      &[disabled] {
        color: #37d33a66;
      }
    }
  }

.avatar-block {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .avatar-img {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
    position: relative;
    z-index: 1;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-40%, -50%);
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: $circle-gradient;
    opacity: 0.3;
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-40%, -50%);
    width: 150px;  
    height: 150px;
    border-radius: 50%;
    background: $circle-gradient;
    opacity: 0.56;
  }
}



  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
  }

  &:hover {
    transform: scale(1.035);
    z-index: 99;
  }

  &.disabled {
    cursor: not-allowed;

    .info>span {
      height: 1.5rem;
      color: transparent;
      box-shadow: 0 0 1.4rem rgba(55, 211, 57, 0.3);
      border-radius: 4px;
      background: linear-gradient(90deg,
          rgba(42, 42, 46, 0.9) 25%,
          rgba(55, 211, 57, 0.2) 50%,
          rgba(42, 42, 46, 0.9) 75%);
      background-size: 200% 100%;
      animation: textShimmer 1.5s infinite;
    }
  }
}

@media (max-width: 680px) {
  .person {
    flex-direction: column;
    width: 70%;
    align-items: center;

    >* {
      flex: auto;
    }

    >.buttons {
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
      text-align: center;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
