<template>
  <div class="agent-info" v-if="agent">
    <AgentDetailsCard :agent="agent" />
    <Trades :agent="agent" />
    <BuySell :agent="agent" />
  </div>
  <p v-else>Agent not found or still loading...</p>
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { useAgentsStore } from '~/stores/agents';
import AgentDetailsCard from '~/components/AgentInfo/AgentDetailsCard/AgentDetailsCard.vue';
import Trades from '~/components/AgentInfo/Trades.vue';
import BuySell from '~/components/AgentInfo/BuySell/BuySell.vue';
import { defaultAgent } from '~/consts';
import type { Agent } from '~/types';

const route = useRoute();
const agentsStore = useAgentsStore();

const agent = computed((): Agent => {
  const id = route.params.id as string;
  return agentsStore.agents.find(a => a.id === id) || defaultAgent;
});

onBeforeMount(async () => {
  if (!agentsStore.agents.length) {
    await agentsStore.getAgents();
  }
  const id = route.params.id as string;
  const found = agentsStore.agents.find(a => a.id === id);
  if (found) {
    if (
      !found.comments.comments.length ||
      !found.tokenHolders.holders.holders.length ||
      !found.trades.trades.length
    ) {
      await agentsStore.loadAgentDetails(found.id);
    }
  }
});
</script>

<style scoped lang="scss">
.agent-info {
  display: flex;
  background-color: var(--color-background);
  min-height: 100vh;

  &>* {
    width: 100%;
    height: 100%;
  }

  &> :nth-child(1) {
    max-width: 320px;
    background-color: var(--color-surface);
  }

  &> :nth-child(2) {
    min-width: 0;
    border-inline: 1px solid var(--color-tertiary);
  }

  &> :nth-child(3) {
    max-width: 400px
  }

  @media (max-width: 1300px) {
    &> :nth-child(1) {
      max-width: 250px;
      background-color: var(--color-surface);
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
      border-top: 1px solid var(--color-tertiary)
    }
  }

}
</style>
