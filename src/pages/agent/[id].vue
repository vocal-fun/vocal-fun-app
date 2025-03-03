<template>
  <div class="agent-info" v-if="agent">
    <Coininfo :agent="agent" />
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

onBeforeMount(async () => {
  await agentsStore.getAgents()
  const { id } = route.params;
  const found = agentsStore.agents.find(agent => agent.id === id);
  if (found) {
    agent.value = { ...defaultDetails, ...found } as Agent;
  }
})

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

  &>* {
    width: 100%;
  }

  &> :nth-child(1) {
    max-width: 320px;
    flex: 1;
  }

  &> :nth-child(2) {
    max-width: 900px;
    flex: 2;
  }

  &> :nth-child(3) {
    max-width: 400px;
    flex: 1;
  }
}
</style>
