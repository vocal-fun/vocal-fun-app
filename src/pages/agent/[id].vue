<template>
  <div class="agent-info" v-if="agent">
    <Coininfo :agent="agent" />
    <Trades token="BONK" :holders="agent.holders"/>
    <p>buy</p>
  </div>
  <p v-else>Agent not found or still loading...</p>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAgentsStore } from '~/stores/agents';
import Coininfo from '~/components/Coininfo.vue';
import Trades from '~/components/Trades.vue';
import type { Agent } from '~/types';

const route = useRoute();
const agentsStore = useAgentsStore();
const agent = ref<Agent | null>(null);

const defaultDetails = {
  id: '',
  name: '',
  image: '',
  rate: 0,
  createdAt: '',
  createdBy: '',
  route: '',
  tokenName: '',
  mcap: 0,
  price: 0,
  contract: '',
  liquidity: 0,
  volume24h: 0,
  change5m: 0,
  change1h: 0,
  change24h: 0,
  change7d: 0,
  holders: 0,
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

  &>* {
    width: 100%;
  }

  &> :nth-child(1) {
    max-width: 320px;
    flex: 1;
    background-color: #212133;
  }

  &> :nth-child(2) {
    max-width: 900px;
    flex: 2;
    border-inline: 1px solid #59596D;
  }

  &> :nth-child(3) {
    max-width: 400px;
    flex: 1;
  }
}
</style>
