<template>
	<div>
		<div v-if="!$isSmallScreen" class="buy-sell-tabs">
			<BuySellTabs :selectedTab="selectedTab" @update:selectedTab="selectedTab = $event" />
			<BalanceActionPanel :userBalance="userBalance" :amounts="amounts" :selectedTab="selectedTab" />
			<SlippageSettings />
			<BondingCurve :progressPercentage="progressPercentage" />
		</div>

		<div v-else class="buy-sell-mobile">
			<button v-play-click-sound class="buy-sell-toggle" @click="handleMobileButtonClick">
				{{ selectedTab }}
			</button>

			<div v-if="isPanelOpen" class="mobile-buy-sell-panel">
				<BuySellTabs :selectedTab="selectedTab" @update:selectedTab="selectedTab = $event" @close="togglePanel" />
				<BalanceActionPanel :userBalance="userBalance" :amounts="amounts" :selectedTab="selectedTab" />
				<SlippageSettings />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { ethers } from 'ethers';
import { useNuxtApp } from '#app';
import { useBlockchain } from '~/composables/blockchain';
import { useWalletConnect } from '~/composables/useWalletConnect';

import BuySellTabs from './BuySellTabs.vue';
import BalanceActionPanel from './BalanceActionPanel.vue';
import SlippageSettings from './SlippageSettings.vue';
import BondingCurve from './BondingCurve.vue';

const { $isSmallScreen } = useNuxtApp();
const selectedTab = ref('BUY');
const isPanelOpen = ref(false);

function togglePanel() {
	isPanelOpen.value = !isPanelOpen.value;
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

const { getNativeBalance } = useBlockchain();
const { accountAddress, isConnected } = useWalletConnect();
const amounts = ref(['0.01', '0.02', '0.1', '0.2', 'MAX']);
const userBalance = ref('0.0');
const progressPercentage = ref(4);

async function fetchBalance() {
	try {
		if (!isConnected.value || !accountAddress.value) {
			userBalance.value = '0.0';
			return;
		}
		const balanceBigInt = await getNativeBalance(accountAddress.value);
		userBalance.value = ethers.formatEther(balanceBigInt);
	} catch (error) {
		console.error('Error fetching native balance:', error);
	}
}

onMounted(() => {
	fetchBalance();
});

watch([isConnected, accountAddress], () => {
	fetchBalance();
});
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

	@media (max-width: 1250px) {
		>*:not(:first-child) {
			padding: 0 12px;
		}

		> :nth-child(3) {
			padding-bottom: 24px;
			border-left: 1px solid #59596D;
		}
	}

	@media (max-width: 1100px) {
		> :nth-child(3) {
			border-left: unset
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
	padding: 24px;
	cursor: pointer;
	color: #121212;
	text-align: center;
	background-color: #00FA00;
	z-index: 999;
}

.mobile-buy-sell-panel {
	position: fixed;
	bottom: 70px;
	width: 100%;
	background-color: #161622;
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
