<template>
	<div class="agent-details-card">
		<AgentHeader :agent="agent" />
		<CoinInfo :agent="agent" />
	</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Agent } from '~/types'
import AgentHeader from './AgentHeader.vue';
import CoinInfo from './CoinInfo.vue';

const props = defineProps<{ agent: Agent }>()
</script>

<style scoped lang="scss">
.agent-details-card {
	color: #00FA00;
	border-bottom: 1px solid #59596D;
	display: flex;
	flex-direction: column;
}
</style>
