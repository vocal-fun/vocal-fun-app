<template>
	<div class="agent-details-card">
		<AgentHeader :agent="agent" />
		<CoinInfo v-if="!$isSmallScreen" :agent="agent" />
	</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Agent } from '~/types'
import AgentHeader from './AgentHeader.vue';
import CoinInfo from './CoinInfo.vue';
const { $isSmallScreen } = useNuxtApp();
const props = defineProps<{ agent: Agent }>()
</script>

<style scoped lang="scss">
.agent-details-card {
	color: var(--color-secondary);
	border-bottom: 1px solid var(--color-tertiary);
	display: flex;
	flex-direction: column;
}
</style>
