<template>
  <button class="modal-button">
    <span>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" :class="icon">
        <path :d="d" fill="black"/>
      </svg>
    </span>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { icons } from '~/consts';

const props = defineProps<{
  icon: 'play' | 'stop' | 'call',
}>();

const d = computed(() => icons[props.icon]);
</script>

<style scoped lang="scss">
.modal-button {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
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
        margin-top: .1875rem;
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
