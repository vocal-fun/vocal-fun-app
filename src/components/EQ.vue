<template>
  <div class="equalizer">
    <div v-for="(item, index) in repeatedEqData" :key="index" :class="['row', 'row-' + ((index % 7) + 1)]">
      <div class="end-bar"></div>
      <div v-for="blockItemNumber in reversedNumbers(item.quantity)" :key="'tone-' + blockItemNumber"
        :class="['block', 'tone-' + blockItemNumber]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps<{
  repeatTimes?: number
}>();

const baseEqData = [
  { quantity: 4, delay: 1 },
  { quantity: 6, delay: 1 },
  { quantity: 7, delay: 1 },
  { quantity: 6, delay: 1 },
  { quantity: 1, delay: 1 },
  { quantity: 6, delay: 1 },
  { quantity: 7, delay: 1 },
  { quantity: 1, delay: 1 },
  { quantity: 7, delay: 1 },
  { quantity: 6, delay: 1 },
  { quantity: 7, delay: 1 },
  { quantity: 6, delay: 1 },
  { quantity: 1, delay: 1 },
  { quantity: 6, delay: 1 },
  { quantity: 7, delay: 1 },
  { quantity: 1, delay: 1 },
  { quantity: 4, delay: 1 },
  { quantity: 6, delay: 1 },
  { quantity: 7, delay: 1 },
  { quantity: 6, delay: 1 },
];

const repeatedEqData = computed(() => {
  const times = props.repeatTimes ?? 1;
  const out = [];
  for (let i = 0; i < times; i++) {
    out.push(...baseEqData);
  }
  return out;
});

function reversedNumbers(num: number) {
  return Array.from({ length: num }, (_, i) => num - i);
}
</script>

<style scoped lang="scss">
@keyframes changeScale {
  0% {
    transform: scaleY(1);
  }

  50% {
    transform: scaleY(2.5);
  }

  100% {
    transform: scaleY(1);
  }
}

@keyframes changeMargin {
  0% {
    margin-bottom: 2px;
  }

  50% {
    margin-bottom: 10px;
  }

  100% {
    margin-bottom: 2px;
  }
}

.equalizer {
  display: flex;
  gap: 10px;
}

.row {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}


.block {
  height: 16px;
  width: 12px;
  transform-origin: bottom;
  will-change: transform;
  animation: changeScale 0.8s infinite ease-in-out;
}

.row-1 {
  .block {
    animation-duration: 0.8s;
    animation-delay: 0.4s;
  }
}

.row-2 {
  .block {
    animation-duration: 0.6s;
    animation-delay: 0.6s;
  }
}

.row-3 {
  .block {
    animation-duration: 0.6s;
    animation-delay: 0.5s;
  }
}

.row-4 {
  .block {
    animation-duration: 0.7s;
    animation-delay: 0.5s;
  }
}

.row-5 {
  .block {
    animation-duration: 0.6s;
    animation-delay: 0.2s;
  }
}

.row-6 {
  .block {
    animation-duration: 0.9s;
    animation-delay: 0.2s;
  }
}

.tone-1 {
  background: #197e0c;
}

.tone-2 {
  background: #278f0a;
}

.tone-3 {
  background: #37d339;
}

.tone-4 {
  background: #8bdd29;
}

.tone-5 {
  background: #bade39;
}

.tone-6 {
  background: #cab836;
}

.tone-7 {
  background: #ca9836;
}

.end-bar {
  background: #99989d;
  margin-bottom: 0.625rem;
  height: 7px;
  width: 12px;
  will-change: margin-bottom;
  animation: changeMargin 0.5s infinite ease-in-out;
  animation-delay: 1s;
}

@media (max-width: 500px) {
  .row:nth-child(-n+5) {
    display: none;
  }
}

@media (max-width: 390px) {
  .row:nth-child(-n+7) {
    display: none;
  }
}
</style>
