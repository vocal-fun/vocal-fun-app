<template>
  <div class="token" :class="{ 'icon-right': iconPosition === 'right' }">
    <NuxtImg
      v-show="logo"
      format="webp"
      sizes="44px"
      loading="lazy"
      :src="logo"
      :width="size"
      :height="size"
      :alt="name"
    />
    <span v-if="withName">{{ name }}</span>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    token: string;
    size?: string;
    withName?: boolean;
    iconPosition?: 'left' | 'right';
  }>(),
  {
    size: '13px',
    withName: false,
    iconPosition: 'left',
  }
);

const logo = computed(() => props.token ? `/img/token/${props.token.toLowerCase()}.svg` : '');
const name = computed(() => props.token.toUpperCase());
</script>

<style lang="scss" scoped>
.token {
  display: flex;
  align-items: center;
  gap: 4px;
  > img {
    border-radius: 50%;
    background-color: #303149;
  }
  > span {
    font-weight: 500;
  }
  &.icon-right {
    flex-direction: row-reverse;
  }
}
</style>
