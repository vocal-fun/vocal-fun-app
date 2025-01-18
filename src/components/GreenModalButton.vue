<template>
  <button class="modal-button">
    <span>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" :class="icon">
        <path v-if="icon === 'play'" d="M9.43993 4.13143C10.1867 4.51529 10.1867 5.48477 9.43992 5.86863L1.66142 9.86696C0.920935 10.2476 -3.72704e-08 9.76612 0 8.99836V1.00164C3.72705e-08 0.233881 0.920939 -0.247589 1.66143 0.133044L9.43993 4.13143Z" fill="black"/>
        <path v-else-if="icon === 'stop'" d="M0.5 0.5H9.5V9.5H0.5V0.5Z" fill="black"/>
        <path v-else d="m2.973 1.325.479.57c.663.786.594 1.97-.158 2.723l-.408.408a.396.396 0 0 0-.092.416c.149.406.528.914 1.137 1.522.609.61 1.116.988 1.522 1.138a.396.396 0 0 0 .416-.092l.408-.408c.752-.753 1.937-.822 2.724-.16l.57.48c.649.546.715 1.531.146 2.2-.31.358-.748.584-1.22.63-1.818.244-3.726-.632-5.724-2.63C.776 6.124-.1 4.216.143 2.398a1.844 1.844 0 0 1 .63-1.22c.67-.568 1.654-.503 2.2.147Z" fill="black"/>
      </svg>
    </span>
    {{ text }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  text: string,
  icon: 'play' | 'stop' | 'call',
}>();
</script>

<style scoped lang="scss">
.modal-button {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  min-width: 128px;
  transition: color 0.3s ease-in-out;
  > span {
    display: inline-flex;
    width: 22px;
    height: 22px;
    background: #00FA00;
    box-shadow: 0px 0.484656px 7px #0ADC0F, 0px 0px 8px #0ADC0F;
    border-radius: 100px;
    transition: background 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    svg {
      margin: auto;
      &.call {
        height: 14px;
        width: 12px;
        margin-top: 3px;
      }
    }
  }
  &:hover {
    color: white;
    > span {
      background: white;
      box-shadow: 0px 0.484656px 7px white, 0px 0px 8px white;
    }
  }
}
</style>
