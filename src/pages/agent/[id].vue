<template>
  <div class="agent-info" v-if="agent">
    <Coininfo  :agent="agent" />
    <p>graphic</p>
    <p>buy</p>
  </div>
  <p v-else>Agent not found or still loading...</p>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAgentsStore } from '~/stores/agents';
import Coininfo from '~/components/Coininfo.vue';
import type { Agent } from '~/types';

const route = useRoute();
const agentsStore = useAgentsStore();
const agent = ref<Agent | null>(null);

const defaultDetails = {
  contract: 'N/A',
  pricePerMin: 0,
  priceUsd: 0,
  priceTez: 0,
  age: 'Unknown',
  liquidity: '$0',
  change5m: 0,
  change1h: 0,
  change24h: 0,
  change7d: 0,
  holders: 0
};



onMounted(async () => {
  const { id } = route.params;
  const found = agentsStore.agents.find(agent => agent.id === id);
  if (found) {
    agent.value = { ...defaultDetails, ...found } as Agent;
  }
});
</script>


<style scoped lang="scss">
.agent-info {
  display: flex;
  gap: 1rem;
}

.agent-info > *:nth-child(1),
.agent-info > *:nth-child(3) { 
  flex: 1; 
}

.agent-info > *:nth-child(2) {
  flex: 2;
}

</style>