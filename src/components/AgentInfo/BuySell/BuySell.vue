<template>
	<div>
		<div v-if="!$isSmallScreen" class="buy-sell-tabs">
			<BuySellTabs :selectedTab="selectedTab" @update:selectedTab="selectedTab = $event" />
			<BalanceActionPanel :userBalance="formattedBalance" :amounts="amounts" :selectedTab="selectedTab" />
			<SlippageSettings @slippage-toggle="handleSlippageToggle" />
			<BondingCurve :progressPercentage="getPercentage(props.agent.mcap)" :slippageOpen="isSlippageOpen" />
		</div>

		<div v-else class="buy-sell-mobile">
			<button v-play-click-sound class="buy-sell-toggle" @click="handleMobileButtonClick">
				{{ selectedTab }}
			</button>

			<div v-if="isPanelOpen" class="mobile-buy-sell-panel">
				<BuySellTabs :selectedTab="selectedTab" @update:selectedTab="selectedTab = $event" @close="togglePanel" />
				<BalanceActionPanel :userBalance="formattedBalance" :amounts="amounts" :selectedTab="selectedTab" />
				<SlippageSettings />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import BuySellTabs from './BuySellTabs.vue';
import BalanceActionPanel from './BalanceActionPanel.vue';
import SlippageSettings from './SlippageSettings.vue';
import BondingCurve from './BondingCurve.vue';
import { getPercentage } from '~/utils/helpers'
import type { Agent } from '~/types';

const props = defineProps<{ agent: Agent }>()

const { $isSmallScreen } = useNuxtApp();
const balanceStore = useBalanceStore()
const selectedTab = ref('BUY');
const isPanelOpen = ref(false);
const isSlippageOpen = ref(false)

function togglePanel() {
	isPanelOpen.value = !isPanelOpen.value;
}

function handleSlippageToggle(isOpen: boolean) {
	isSlippageOpen.value = isOpen
}

function handleMobileButtonClick() {
	if (!isPanelOpen.value) {
		togglePanel();
	} else {
		if (selectedTab.value === 'BUY') {
			console.info('Calling BUY function...');
		} else if (selectedTab.value === 'SELL') {
			console.info('Calling SELL function...');
		}
		isPanelOpen.value = !isPanelOpen.value;
	}
}

const amounts = ref(['0.01', '0.02', '0.1', '0.2', 'MAX']);
const formattedBalance = computed(() => balanceStore.userBalance)

</script>

<style scoped lang="scss">
.buy-sell-tabs {
	display: flex;
	flex-direction: column;

	>*:not(:first-child) {
		padding: 0 24px;
	}

	> :nth-child(3) {
		padding-bottom: 24px;
	}

	@media (max-width: 1300px) {
		>*:not(:first-child) {
			padding: 0 12px;
		}

		> :nth-child(3) {
			padding-bottom: 24px;
		}
	}
}

.buy-sell-mobile {
	position: relative;
}

.buy-sell-toggle {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 25px;
	cursor: pointer;
	color: var(--color-deep);
	text-align: center;
	background-color: var(--color-secondary);
	z-index: 999;
}

.mobile-buy-sell-panel {
	position: fixed;
	bottom: 70px;
	width: 100%;
	background-color: var(--color-background);
	display: flex;
	flex-direction: column;
	gap: 1rem;
	overflow-y: auto;
	z-index: 1000;
	padding: unset;

	> :nth-child(2),
	> :nth-child(3) {
		padding-left: 16px;
		padding-right: 16px;
	}

	> :last-child {
		padding-bottom: 16px;
		border-bottom: unset;
	}
}
</style>
