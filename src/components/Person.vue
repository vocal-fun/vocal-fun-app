<template>
  <div class="person shake-little" :class="{ disabled: isDisabled }" @click="goToAgentPage">
    <div class="info">
      <div>
        <p>{{ name }}</p>
        <p>{{ tokenName }}</p>
      </div>
      <p><span class="dim">mcap </span>${{ formatShortNumber(mcap) }} </p>
      <p class="dim">
        {{ timeAgo(createdAt, true) }} by <span>{{ createdBy.slice(0, 4) + '...' }}</span>
      </p>
    </div>

    <div class="avatar-block">
      <NuxtImg class="avatar-img" format="webp" loading="lazy" placeholder="/img/user-avatar.png"
        placeholder-class="image-placeholder" :src="image" :alt="name" />
    </div>

    <div class="buttons">
      <button class="preview shake" :disabled="isDisabled" @click.stop="openModal('preview')">PREVIEW</button>
      <button class="preview shake" :disabled="isDisabled" @click.stop="openModal('call')">CALL</button>
      <button class="shake" @click.stop="handleBuy">BUY</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { audioService } from '~/services/audio';
import type { Agent, OpenModalState } from '~/types';
import { formatShortNumber, timeAgo } from '~/utils/formatters';

type PersonProps = Pick<Agent, 'id' | 'name' | 'createdAt' | 'createdBy' | 'image' | 'rate' | 'tokenName' | 'mcap'> & {
  disabled: boolean;
};

const props = defineProps<PersonProps>();
const isDisabled = computed(() => props.disabled || !props.name);
const router = useRouter();
const emit = defineEmits<{
  'open-modal': [state: OpenModalState],
}>();

function goToAgentPage() {
  if (isDisabled.value) return;
  router.push(`/agent/${props.id}`);
}

function openModal(state: OpenModalState = 'default') {
  if (props.disabled) return;
  audioService.click();
  emit('open-modal', state);
}

function handleBuy() {
  console.log("Buy button clicked!");
}
</script>

<style scoped lang="scss">
$circle-gradient: linear-gradient(180deg,
    rgba(0, 250, 0, 0) 0%,
    rgba(0, 250, 0, 0.3) 54.12%,
    rgba(0, 250, 0, 0) 100%);

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
  max-width: 480px;
  width: 100%;
  background-color: #000000;
  transition: transform 0.3s ease-in-out;
  padding-top: 14px;
  box-shadow:
    3px 3px 0 0 #59596D,
    3px 4.5px 0 0 #1B1B2A,
    -3px 3px 0 0 #1B1B2A,
    3px 0 0 0 #59596D,
    0 -1.5px 0 0 #000000;

  .info {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 18px;
    padding-bottom: 24px;

    div {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 12px;
    }

    .dim {
      opacity: 0.5;

      &:last-of-type {
        margin-top: 20px;
      }
    }
  }

  .avatar-block {
    flex: 0 0 auto;
    margin-right: 16px;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;

    .avatar-img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 110px;
      height: 110px;
      border-radius: 50%;
      z-index: 1;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: $circle-gradient;
    }

    &::before {
      width: 150px;
      height: 150px;
      opacity: 0.3;
    }

    &::after {
      width: 130px;
      height: 130px;
      opacity: 0.5;
    }
  }

  .buttons {
    flex: 1 1 100%;
    display: flex;
    z-index: 1;
    border-top: 1px solid rgba(55, 211, 57, 0.4);

    >button {
      flex: 1 1 50%;
      padding: 1rem;
      background-color: var(--color-primary);
      color: #1B1B2A;
      border: none;
      cursor: pointer;
      justify-content: center;

      &:first-child {
        border-right: 1px solid rgba(55, 211, 57, 0.4)
      }

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
    flex-direction: row;
    width: 90%;
    align-items: center;

    .buttons {
      flex: auto;
      width: 100%;
    }

    .info {
      font-size: 12px;
      gap: 1rem;
      align-items: start;
    }
  }

  .avatar-block {
    margin-right: 6px !important;

    .avatar-img {
      width: 90px !important;
      height: 90px !important;
    }

    &::after {
      width: 105px !important;
      height: 105px !important;
    }

    &::before {
      width: 130px !important;
      height: 130px !important;
    }
  }
}

@media (max-width: 540px) {
  .shake {
    padding: 6px !important;
  }
}
</style>
