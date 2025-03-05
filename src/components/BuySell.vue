<template>
	<div class="buy-sell-tabs">
		<div class="buttons">
			<button :class="{ active: selectedTab === 'BUY' }" @click="selectedTab = 'BUY'">
				BUY
			</button>
			<button :class="{ active: selectedTab === 'SELL' }" @click="selectedTab = 'SELL'">
				SELL
			</button>
		</div>
		<div class="balance-select">
			<div class="balance-user">
				<div class="amount">
					<input type="number" v-model="inputValue" placeholder="0.00" />
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
			<EQ class="equalizer" />
			<button @click="selectedTab === 'BUY' ? buy() : sellFunction()">
				{{ selectedTab === 'BUY' ? 'BUY' : 'SELL' }}
			</button>
		</div>

		<!-- Slippage -->
		<div class="slippage">
			<div @click="toggleSlippageOptions">
				<NuxtImg class="slippage-img" src="/img/slippage.png" alt="Slippage Settings" format="webp" loading="lazy" />
				<p>{{ selectedSlippage !== null ? selectedSlippage + '%' : 'SLIPPAGE SETTINGS' }}</p>
				<p class="slippage-arrow">></p>
			</div>
			<div v-if="showSlippageOptions" class="slippage-options" @click.stop>
				<ul>
					<li v-for="option in slippageOptions" :key="option" @click.stop="selectSlippage(option)">
						{{ option }}%
					</li>
				</ul>
				<div class="custom-slippage">
					<input type="number" v-model.number="customSlippage" placeholder="Custom" @input="validateCustomSlippage" />
					<button @click="setCustomSlippage">Set</button>
				</div>
			</div>
		</div>

		<!-- Curve -->
		<div class="curve">
			<div class="title">
				<p>BONDING CURVE</p>
				<p>{{ progressPercentage }}%</p>
			</div>
			<div class="progress-bar">
				<div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
				<NuxtImg class="plane" src="/img/plane.png" alt="Plane Progress"
					:style="{ left: `calc(${progressPercentage}% - 15px)` }" />
			</div>
			<p class="description">
				After graduating at <span>$69,000 market cap,</span><br />
				the token will take off to
				<span class="inline-aero">
					aerodrome
					<NuxtImg class="aerodrome" src="/img/aerodrome.png" alt="Aerodrome" loading="lazy" />
				</span>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ethers } from 'ethers'
import { useBlockchain } from '~/composables/blockchain'
import { useWalletConnect } from '~/composables/useWalletConnect'

const selectedTab = ref('BUY')
const { getNativeBalance } = useBlockchain()
const { accountAddress, isConnected } = useWalletConnect()
const amounts = ref(['0.01', '0.02', '0.1', '0.2', 'MAX'])
const inputValue = ref('0.0')
const userBalance = ref('0.0')

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

function selectAmount(amount: string) {
	const balanceNum = parseFloat(userBalance.value)

	if (amount === 'MAX') {
		inputValue.value = userBalance.value
		return
	}

	const selectedNum = parseFloat(amount)
	if (selectedNum > balanceNum) {
		inputValue.value = userBalance.value
	} else {
		inputValue.value = amount
	}
}

function buy() {
	console.log('User wants to buy:', inputValue.value, 'ETH')
}
function sellFunction() {
	console.log('User wants to sell:', inputValue.value, 'ETH')
}

const showSlippageOptions = ref(false)
const slippageOptions = ref([0.1, 0.2, 0.5, 1, 2, 5])
const progressPercentage = ref(4)
const selectedSlippage = ref<number | null>(null)
const customSlippage = ref<number | null>(null)

function toggleSlippageOptions() {
	showSlippageOptions.value = !showSlippageOptions.value
}

function validateCustomSlippage() {
	if (customSlippage.value !== null) {
		if (customSlippage.value < 0) customSlippage.value = 0
		if (customSlippage.value > 50) customSlippage.value = 50
	}
}

function selectSlippage(option: number) {
	selectedSlippage.value = option
	showSlippageOptions.value = false
	console.log('Selected slippage:', option)
}

function setCustomSlippage() {
	if (customSlippage.value !== null) {
		selectedSlippage.value = customSlippage.value
		showSlippageOptions.value = false
		console.log('Selected custom slippage:', customSlippage.value)
	}
}
</script>

<style scoped lang="scss">
.buy-sell-tabs {
	display: flex;
	flex-direction: column;

	>*:not(:first-child) {
		padding: 0px 24px;

		@media (max-width: 1250px) {
			padding: 0 12px;
		}
	}

	.buttons {
		display: flex;
		flex-direction: row;

		button {
			width: 100%;
			text-align: center;
			padding: 20px;
			background-color: #212133;
			border: none;
			cursor: pointer;
			font-size: 15px;
			transition: background 0.3s;

			&.active {
				background: linear-gradient(348.34deg, #00fa00 -14.85%, rgba(0, 250, 0, 0) 93.01%);
			}

			&:not(.active):hover {
				background: #2c2c3d;
			}
		}
	}

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
			background-color: #59596D26;
			border: 1px solid #59596D;

			.amount {
				display: flex;
				flex-direction: column;
				gap: 16px;
				color: white;
				opacity: 0.5;
				font-size: 10px;
				border-right: 1px solid #59596D;
				max-width: 220px;

				@media (max-width: 1250px) {
					max-width: 135px;
				}

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

			@media (max-width: 1250px) {
				flex-wrap: wrap;
			}

			&-btn {
				display: flex;
				align-items: center;
				font-size: 12px;
				gap: 8px;
				padding: 12px;
				border: 1px solid #59596D;
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

		.equalizer {
			width: 100%;
			overflow: hidden;
			height: 40px;
		}

		button {
			padding: 24px;
			width: 100%;
			color: #121212;
			background-color: #00FA00;
			text-align: center;

			&:hover {
				background-color: #37D339;
			}
		}
	}

	.slippage {
		position: relative;
		padding-bottom: 24px;
		border-bottom: 1px solid #59596D;

		div {
			background: #59596D26;
			border: 1px solid #59596D;
			padding: 18px;
			display: flex;
			flex-direction: row;
			align-items: center;
			color: white;
			cursor: pointer;
			transition: background 0.3s;

			&:hover {
				background: #73737326;
			}

			.slippage-img {
				margin-right: 16px;
				width: 24px;
				height: 24px;
			}

			.slippage-arrow {
				opacity: 0.5;
				display: inline-block;
				transform: rotate(90deg);
				margin-left: auto;
			}
		}

		.slippage-options {
			padding: 10px;
			margin-top: 5px;
			display: flex;
			flex-direction: column;

			ul {
				list-style: none;
				padding: 0;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				width: 100%;

				li {
					padding: 4px;
					border: 1px solid #59596D;
					cursor: pointer;

					&:hover {
						background-color: rgba(89, 89, 109, 0.2);
					}
				}
			}

			.custom-slippage {
				background-color: transparent;
				border: unset;

				input {
					background-color: transparent;

					&::-webkit-inner-spin-button {
						-webkit-appearance: none;
					}

					border: 1px solid #59596D;
					padding: 4px;
					margin-right: 8px;
					color: white;

					&:focus-visible {
						outline: unset;
					}
				}
			}
		}
	}

	.curve {
		display: flex;
		flex-direction: column;
		color: white;
		margin-top: 24px;
		margin-bottom: 22px;
		border-bottom: 1px solid #59596D;

		.title {
			display: flex;
			justify-content: space-between;

			p {
				&:last-child {
					color: #00FA00;
				}
			}
		}

		.progress-bar {
			position: relative;
			width: 100%;
			height: 43px;
			background-color: #59596D80;
			overflow: hidden;
			margin-top: 10px;
			margin-bottom: 20px;
		}

		.progress-fill {
			position: absolute;
			height: 100%;
			background-color: #00FA00;
			transition: width 0.5s ease-in-out;
		}

		.plane {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			width: 45px;
			height: 32px;
			margin-left: 10px;
		}

		.description {
			color: rgba(255, 255, 255, 0.5);
			padding-bottom: 18px;

			span {
				color: white;
			}

			.inline-aero {
				white-space: nowrap;
			}

			.aerodrome {
				display: inline-block;
				width: 24px;
				height: 24px;
				vertical-align: middle;
				margin-left: 6px;
			}
		}
	}


}
</style>
