<template>
	<div class="balance-action-panel">
		<div class="balance-select">
			<UserBalance v-model="inputValue" />
			<div class="select-amount">
				<button v-play-click-sound v-for="amount in amounts" :key="amount" class="select-amount-btn"
					@click="selectAmount(amount)">
					<NuxtImg class="solana-icon" alt="Solana icon" format="webp" loading="lazy" src="/img/solana.png" />
					<span>{{ amount }}</span>
				</button>
			</div>
		</div>

		<div v-if="!$isSmallScreen" class="action">
			<EQ class="equalizer" :repeatTimes="3" />
			<button v-play-click-sound @click="handleAction">
				{{ selectedTab === 'BUY' ? 'BUY' : 'SELL' }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import EQ from '~/components/EQ.vue'
import UserBalance from '~/components/UserBalance.vue'

const { $isSmallScreen } = useNuxtApp()

const props = defineProps<{
	userBalance: string
	amounts: string[]
	selectedTab: string
}>()

const inputValue = ref('')
function selectAmount(amount: string) {
	const balanceNum = parseFloat(props.userBalance)
	if (amount === 'MAX') {
		inputValue.value = props.userBalance
		return
	}
	const selectedNum = parseFloat(amount)
	inputValue.value = selectedNum > balanceNum ? props.userBalance : amount
}

function buy() {
	console.log('User wants to buy:', inputValue.value, 'ETH')
}

function sellFunction() {
	console.log('User wants to sell:', inputValue.value, 'ETH')
}

function handleAction() {
	if (props.selectedTab === 'BUY') {
		buy()
	} else {
		sellFunction()
	}
}
</script>


<style scoped lang="scss">
.balance-select {
	display: flex;
	flex-direction: column;
	margin-top: 18px;
	margin-bottom: 32px;

	.select-amount {
		display: flex;
		gap: 8px;
		margin-top: 12px;

		&-btn {
			display: flex;
			align-items: center;
			font-size: 12px;
			gap: 8px;
			padding: 12px;
			border: 1px solid #59596d;
			background-color: transparent;
			color: white;
			cursor: pointer;

			transition: background-color 0.3s ease-in-out;

			&:hover {
				background-color: rgba(89, 89, 109, 0.2);
			}

			.solana-icon {
				width: 12px;
				height: 12px;
			}
		}
	}
}

.action {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	margin-bottom: 20px;

	& :deep(.equalizer) {
		width: 100%;
		height: 40px;
		overflow: hidden;
	}

	button {
		padding: 24px;
		width: 100%;
		color: #121212;
		background-color: #00fa00;
		text-align: center;

		transition: background-color 0.3s ease-in-out;

		&:hover {
			background-color: #3cdb3c;
		}
	}
}

@media (max-width: 1250px) {
	.select-amount {
		flex-wrap: wrap;
	}
}

@media (max-width: 1100px) {
	.select-amount {
		flex-wrap: unset;

		&-btn {
			width: 100%;
		}
	}

	.action {
		button {
			padding: 12px;
		}
	}
}

@media (max-width: 600px) {
	.select-amount {
		flex-wrap: wrap;

		.select-amount-btn {
			width: unset;
		}
	}
}
</style>
