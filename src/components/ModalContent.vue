<template>
  <div class="header">
    <div class="balance">YOUR VOCAL: 0.18</div>
    <div class="buy-more">
      <button>BUY MORE</button>
    </div>
  </div>
  <div class="content">
    <div class="avatar">
      <img :src="'/img/celebrity-logo/' + person.avatar" alt="person.name">
    </div>
    <div class="name">{{ person.name }}</div>
    <div class="price">10 $vocal/min</div>
  </div>
  <div class="footer">
    <button class="footer-button">
      <img src="/img/call-button.png" alt="Call button" width="40" height="40">
      Call now
    </button>
    <button class="footer-button">
      <img src="/img/preview-button.png" alt="Preview button" width="40" height="40">
      Preview
    </button>
  </div>
</template>

<script setup>
import {defineProps} from "vue";

defineProps({
  person: Object,
});
</script>

<style scoped>
.header {
  display: inline-flex;
  gap: 1rem;

  .buy-more:hover {
    color: white;
    border-bottom: 1px solid white;
  }
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .6rem;

  .avatar {
    margin-bottom: 20px;
    img {
      height: 175px;
    }
  }

  .name {
    text-transform: uppercase;
  }
}

.footer {
  display: flex;
  gap: 2rem;

  .footer-button {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
  }
}

</style>
