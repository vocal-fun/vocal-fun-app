<template>
	<div class="balance-action-panel">
		<div class="balance-select">
			<div class="balance-user">
				<div class="amount">
					<input type="text" v-model="inputValue" placeholder="0.00" @input="validateInput" />
					<p>Balance {{ userBalance }} ETH</p>
				</div>
				<div class="token">
					<p>ETH</p>
					<NuxtImg class="eth" src="/img/sol.png" alt="ETH Blockchain" format="webp" loading="lazy" />
				</div>
			</div>
			<div class="select-amount">
				<button v-for="amount in amounts" :key="amount" class="select-amount-btn" @click="selectAmount(amount)">
					<NuxtImg class="solana-icon" alt="Solana icon" format="webp" loading="lazy" src="/img/solana.png" />
					<span>{{ amount }}</span>
				</button>
			</div>
		</div>

		<div class="action">
			<EQ class="equalizer" :repeatTimes="3" />
			<button @click="handleAction">
				{{ selectedTab === 'BUY' ? 'BUY' : 'SELL' }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue'
import EQ from '~/components/EQ.vue'

const props = defineProps<{
	userBalance: string
	amounts: string[]
	selectedTab: string
}>()

const inputValue = ref('')

function validateInput() {
	inputValue.value = inputValue.value.replace(/[^0-9.,]/g, '')
	const normalizedValue = inputValue.value.replace(/,/g, '.')
	const numberVal = parseFloat(normalizedValue)
	const balanceNum = parseFloat(props.userBalance)
	if (isNaN(numberVal)) return
	if (numberVal < 0) {
		inputValue.value = '0'
	}
	else if (numberVal > balanceNum) {
		inputValue.value = props.userBalance
	}
}

watch(inputValue, () => {
	validateInput()
})

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

	.balance-user {
		display: flex;
		flex-direction: row;
		padding: 20px;
		width: 100%;
		background-color: #59596d26;
		border: 1px solid #59596d;

		.amount {
			display: flex;
			flex-direction: column;
			gap: 16px;
			color: white;
			opacity: 0.5;
			font-size: 10px;
			border-right: 1px solid #59596d;
			max-width: 220px;

			input {
				background-color: transparent;
				border: unset;
				color: white;
				font-size: 18px;

				&::-webkit-inner-spin-button {
					-webkit-appearance: none;
				}

				&:focus-visible {
					outline: unset;
				}

				&::placeholder {
					color: white;
				}
			}
		}

		.token {
			display: flex;
			flex-direction: row;
			color: white;
			gap: 10px;
			align-items: center;
			margin-left: 22px;

			.eth {
				width: 24px;
				height: 24px;
			}
		}
	}

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
			transition: background-color 0.3s;

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

		&:hover {
			background-color: #37d339;
		}
	}
}

@media (max-width: 1100px) {
	.select-amount {
		flex-wrap: unset;

		&-btn {
			width: 100%;
		}
	}

	.balance-select {
		.balance-user {
			padding: 12px;

			.token {
				margin-left: auto;
			}
		}
	}

	.action {
		button {
			padding: 12px;
		}
	}
}

@media (max-width: 480px) {
	.select-amount {
		flex-wrap: wrap;
	}
}
</style>
