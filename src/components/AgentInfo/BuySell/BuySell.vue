<template>
	<div class="buy-sell-tabs">
		<BuySellTabs :selectedTab="selectedTab" @update:selectedTab="selectedTab = $event" />
		<BalanceActionPanel :userBalance="userBalance" :amounts="amounts" :selectedTab="selectedTab" />
		<SlippageSettings />
		<BondingCurve v-if="!$isSmallScreen" :progressPercentage="progressPercentage" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ethers } from 'ethers'
import { useBlockchain } from '~/composables/blockchain'
import { useWalletConnect } from '~/composables/useWalletConnect'
import BuySellTabs from './BuySellTabs.vue'
import BalanceActionPanel from './BalanceActionPanel.vue'
import SlippageSettings from './SlippageSettings.vue'
import BondingCurve from './BondingCurve.vue'

const selectedTab = ref('BUY')
const { $isSmallScreen } = useNuxtApp();
const { getNativeBalance } = useBlockchain()
const { accountAddress, isConnected } = useWalletConnect()
const amounts = ref(['0.01', '0.02', '0.1', '0.2', 'MAX'])
const userBalance = ref('0.0')
const progressPercentage = ref(4)

async function fetchBalance() {
	try {
		if (!isConnected.value || !accountAddress.value) {
			userBalance.value = '0.0'
			return
		}
		const balanceBigInt = await getNativeBalance(accountAddress.value)
		userBalance.value = ethers.formatEther(balanceBigInt)
	} catch (error) {
		console.error('Error fetching native balance:', error)
	}
}

onMounted(() => {
	fetchBalance()
})

watch([isConnected, accountAddress], () => {
	fetchBalance()
})
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
		}
	}
}
</style>
