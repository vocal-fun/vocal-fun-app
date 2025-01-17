<template>
  <div class="equalizer">
    <div v-for="(item, index) in eqData" :key="index" :class="['row', 'row-' + ((index % 7) +1)]">
      <div class="end-bar"></div>
      <div v-for="blockItemNumber in reversedNumbers(item.quantity)" :class="['block', 'tone-' + blockItemNumber]"></div>
    </div>
  </div>
</template>

<script setup>

const reversedNumbers = (number) => {
  return Array.from({ length: number }, (_, i) => number - i);
}

const eqData = [
  {quantity: 4, delay: 1},
  {quantity: 6, delay: 1},
  {quantity: 7, delay: 1},
  {quantity: 6, delay: 1},
  {quantity: 1, delay: 1},
  {quantity: 6, delay: 1},
  {quantity: 7, delay: 1},
  {quantity: 1, delay: 1},
  {quantity: 7, delay: 1},
  {quantity: 6, delay: 1},
  {quantity: 7, delay: 1},
  {quantity: 6, delay: 1},
  {quantity: 1, delay: 1},
  {quantity: 6, delay: 1},
  {quantity: 7, delay: 1},
  {quantity: 1, delay: 1},
  {quantity: 4, delay: 1},
  {quantity: 6, delay: 1},
  {quantity: 7, delay: 1},
  {quantity: 6, delay: 1}
]
</script>

<style scoped>
@use 'sass:math';

@keyframes changeMargin {
  0% {
    margin-bottom: math.random(20)+px;
  }
  50% {
    margin-bottom: math.random(20)+px;
  }
  100% {
    margin-bottom: math.random(20)+px;
  }
}

@keyframes changeHeight {
  0% {
    height: 10px;
  }
  50% {
    height: 25px;
  }

  100% {
    height: 10px;
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
  height: 10px;
  width: 12px;
}

.row-1 {
  .block {
    animation: changeHeight .8s infinite ease-in-out;
    animation-delay: .4s;
  }
}

.row-2 {
  .block {
    animation: changeHeight .6s infinite ease-in-out;
    animation-delay: .6s;
  }
}

.row-3 {
  .block {
    animation: changeHeight .6s infinite ease-in-out;
    animation-delay: .5s;
  }
}

.row-4 {
  .block {
    animation: changeHeight .7s infinite ease-in-out;
    animation-delay: .5s;
  }
}

.row-5 {
  .block {
    animation: changeHeight .6s infinite ease-in-out;
    animation-delay: .2s;
  }
}

.row-6 {
  .block {
    animation: changeHeight .9s infinite ease-in-out;
    animation-delay: .2s;
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
  margin-bottom: 10px;
  height: 7px;
  width: 12px;

  animation: changeMargin .5s infinite ease-in-out;
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
