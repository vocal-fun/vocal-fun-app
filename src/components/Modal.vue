<template>
  <transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="close" @keydown.esc="close">
      <div class="modal-dialog">
        <div class="modal-content">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close']);

const handleKeyDown = (event) => {
  event.key === 'Escape' && close();
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown);
});

watch(
    () => props.isOpen,
    (newVal) => {
      if (newVal) {
        document.addEventListener('keydown', handleKeyDown);
      } else {
        document.removeEventListener('keydown', handleKeyDown);
      }
    }
);

const close = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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
  background: black;
  padding: 20px;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
