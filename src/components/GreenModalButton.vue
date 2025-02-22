<template>
  <component
    :is="tag"
    class="modal-button"
    target="_blank"
    rel="noopener noreferrer"
    :class="tag"
    :disabled="disabled || loading"
    :href="href"
  >
    <span>
      <svg v-if="loading" width="22" height="22" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000" stroke-width="8">
        <circle cx="25" cy="25" r="20" stroke-dasharray="140" stroke-dashoffset="90" stroke-linecap="round" stroke-opacity="1">
          <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
        </circle>
      </svg>
      <svg v-else :width="w" :height="h" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" :class="icon">
        <path :d="d" fill="black"/>
      </svg>
    </span>
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { icons } from '~/consts';

const props = withDefaults(
  defineProps<{
    icon: 'play' | 'stop' | 'call' | 'download' | 'twitter',
    tag?: 'button' | 'a',
    disabled?: boolean,
    loading?: boolean,
    href?: string,
  }>(),
  {
    tag: 'button',
  }
);

const d = computed(() => icons[props.icon]);

const w = computed(() => {
  switch (props.icon) {
    case 'download':
    case 'twitter':
      return '13';
    default:
      return '10';
  }
});

const h = computed(() => {
  switch (props.icon) {
    case 'download':
      return '14';
    case 'twitter':
      return '13';
    default:
      return '10';
  }
});
</script>

<style scoped lang="scss">
.modal-button {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  transition: color 0.3s ease-in-out;
  &.button[disabled] {
    cursor: not-allowed;
  }
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
