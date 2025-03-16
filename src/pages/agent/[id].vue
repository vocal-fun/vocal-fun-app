<template>
  <div class="agent-info" v-if="agent">
    <AgentDetailsCard :agent="agent" />
    <Trades :agent="agent" />
    <BuySell />
  </div>
  <p v-else>Agent not found or still loading...</p>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAgentsStore } from '~/stores/agents';
import AgentDetailsCard from '~/components/AgentInfo/AgentDetailsCard/AgentDetailsCard.vue';
import Trades from '~/components/AgentInfo/Trades.vue';
import BuySell from '~/components/AgentInfo/BuySell/BuySell.vue';
import type { Agent } from '~/types';
import { defaultAgent } from '~/consts';

const route = useRoute();
const agentsStore = useAgentsStore();
const agent = ref<Agent | null>(null);

onBeforeMount(async () => {
  await agentsStore.getAgents()
  const { id } = route.params;
  const found = agentsStore.agents.find(agent => agent.id === id);
  if (found) {
    agent.value = { ...defaultAgent, ...found } as Agent;
  }
})

onMounted(async () => {
  const { id } = route.params;
  const found = agentsStore.agents.find(agent => agent.id === id);
  if (found) {
    agent.value = { ...defaultAgent, ...found } as Agent;
  }
});
</script>


<style scoped lang="scss">
.agent-info {
  display: flex;
  background-color: #161622;
  min-height: 100vh;

  &>* {
    width: 100%;
    height: 100%;
  }

  &> :nth-child(1) {
    max-width: 320px;
    background-color: #212133;
  }

  &> :nth-child(2) {
    min-width: 0;
    border-inline: 1px solid #59596D;
  }

  &> :nth-child(3) {
    max-width: 400px
  }

  @media (max-width: 1300px) {
    &> :nth-child(1) {
      max-width: 250px;
      background-color: #212133;
    }

    &> :nth-child(3) {
      max-width: 300px;
    }
  }

  @media (max-width: 1100px) {
    flex-direction: column;

    &> :nth-child(1),
    &> :nth-child(3) {
      min-width: 100%
    }

    &> :nth-child(3) {
      border-top: 1px solid #59596D
    }
  }

}
</style>
