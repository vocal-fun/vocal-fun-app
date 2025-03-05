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
					<input type="number" placeholder="0.00" />
					<p>Balance 0.0053 ETH</p>
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
			<button>BUY</button>
		</div>
		<div class="slippage">
			<NuxtImg class="slippage" src="/img/slippage.png" alt="Slippage Settings" format="webp" loading="lazy" />
			<p>SLIPPAGE SETTINGS</p>
			<NuxtImg class="arrow-down" src="/img/arrow-up.png" alt="Down arrow" />
		</div>
		<div class="curve">
			<div class="title">
				<p>BONDING CURVE</p>
				<p>4%</p>
			</div>
			<div class="progress">
				<NuxtImg class="plane" src="/img/plane.png" alt="Plane Progress" />
			</div>
			<div class="description">
				<p>
					After graduating at $69,000 market cap, the token will take off to aerodrome
				</p>
				<NuxtImg class="aerodrome" src="/img/aerodrome.png" alt="Aerodrome" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedTab = ref('BUY')
const amounts = ref(['0.01', '0.02', '0.1', '0.2', 'MAX'])

const selectAmount = (amount: string) => {
	// Handle the click action (e.g., updating a value or logging the selection)
	console.log("Selected amount:", amount)
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
				cursor: pointer;
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
			.select-amount-btn {
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
					cursor: pointer;
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

		.equalizer {
			width: 100%;
			overflow: hidden;
			height: 40px;
		}
	}
}
</style>
