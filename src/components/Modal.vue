<template>
  <transition name="fade">
    <div v-show="isOpen" class="modal-overlay" @click.self="close">
      <div class="modal-dialog">
        <div class="modal-content">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { audioService } from '~/services/audio';

const props = defineProps<{ isOpen: boolean }>();

const emit = defineEmits(['close']);

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    close();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown);
});

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.documentElement.style.overflowY = 'hidden';
  } else {
    document.documentElement.style.overflowY = '';
  }
});

const close = () => {
  audioService.click();
  emit('close');
};
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  background: linear-gradient(
      180.47deg,
      rgba(21, 21, 33, 0.9) 22.14%,  /* First color with 90% opacity */
      rgba(48, 46, 75, 0.9) 53.56%,  /* Second color with 90% opacity */
      rgba(49, 48, 77, 0.9) 89.47%,  /* Third color with 90% opacity */
      rgba(27, 27, 43, 0.9) 113.03%  /* Fourth color with 90% opacity */
  );
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-dialog {
  overflow-y: auto;
  background: black; /* Base black background */
  background: linear-gradient(
      180deg, 
      rgba(55, 211, 57, 0) 0%, 
      rgba(55, 211, 57, 0.12) 100%
  ), black; /* Layering gradient over black */
  padding: 1.25rem;
  border-radius: 8px;
  max-width: 650px;
  height: 550px;
  width: 100%;
  box-shadow: 4px 4px 0 0 #68677C,
              -4px -4px 0 0 #00000040;
}

.modal-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 6vh;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

@media (max-width: 550px) {
  .modal-dialog {
    height: 100dvh;
    border-radius: 0;
  }
  @media (max-height: 670px) {
    .modal-content {
      padding-bottom: 0;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
