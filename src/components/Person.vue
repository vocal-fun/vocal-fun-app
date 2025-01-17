<template>
  <div class="person">
    <div @click="openModal" class="avatar-block">
      <img class="avatar-img" :src="'/img/celebrity-logo/' + avatar" :alt="name">
      <img class="play-btn" src="/img/play-btn.png" alt="Play button">
    </div>
    <div class="info">
      <span>{{ name }}</span>
      <a class="twitter" href="#">
        <img src="/img/twitter-green.png" alt="Twitter logo">
        <span>{{ twitter }}</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  avatar: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  twitter: {
    type: String,
    required: true
  },
});

const emit = defineEmits(['open-modal']);

const openModal = () => {
  emit('open-modal');
};
</script>

<style scoped>
.person {
  color: #37D339;
  display: flex;
  width: 520px;
  transition: transform 0.3s ease-in-out;
  box-shadow:
      3px 3px 0 0 #59596D,
      3px 4.5px 0 0 #1B1B2A,
      -3px 3px 0 0 #1B1B2A,
      3px 0 0 0 #59596D,
      0 -1.5px 0 0 #000000;


  .avatar-block {
    cursor: pointer;
    position: relative;
    .play-btn {
      bottom: 0;
      right: 0;
      position: absolute;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;

    .twitter {
      display: inline-flex;
      align-items: center;
      gap: 15px;
      cursor: pointer;
    }

    .twitter:hover {
      span {
        color: white;
      }
    }
  }
}

.person:hover {
  transform: scale(1.035);
  z-index: 99;
}
</style>
