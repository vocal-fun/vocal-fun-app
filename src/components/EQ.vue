<template>
  <div class="winamp-equalizer">
    <div class="winamp-band" v-for="(freq, index) in frequencies" :key="index">
      <input type="range" class="winamp-slider" min="-12" max="12" v-model="values[index]" />
      <label>{{ freq }} Hz</label>
    </div>
  </div>
</template>

<script setup>
const frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000]; // Frequency bands
const values = ref(Array(frequencies.length).fill(0)); // Equalizer values for each band
</script>

<style scoped>
.winamp-equalizer {
  display: flex;
  gap: 8px;
  padding: 20px;
  background: linear-gradient(45deg, #1a1a1a, #444, #1a1a1a);
  border: 4px solid #00ff00;
  box-shadow: 0 0 15px #00ff00;
  border-radius: 10px;
  width: fit-content;
  font-family: 'Press Start 2P', monospace; /* Pixel-style font */
}

.winamp-band {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
  gap: 8px;
}

.winamp-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 180px;
  background: transparent;
  transform: rotate(-90deg);
  margin: 0;
  border: 2px solid #00ff00;
  border-radius: 4px;
  box-shadow: inset 0 0 10px #00ff00, 0 0 5px #ff00ff;
}

.winamp-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: linear-gradient(to right, #ff0000, #ffff00, #00ff00);
  border: 2px solid #000;
  border-radius: 50%;
  box-shadow: 0 0 8px #ff00ff, 0 0 5px #00ffff;
  cursor: pointer;
}

.winamp-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  background: linear-gradient(to bottom, #ff00ff, #00ff00, #00ffff);
  border-radius: 3px;
  box-shadow: 0 0 10px #ff00ff, inset 0 0 5px #00ff00;
}

label {
  color: #00ff00;
  text-shadow: 0 0 5px #00ff00, 0 0 10px #ff00ff;
  font-size: 12px;
}
</style>
