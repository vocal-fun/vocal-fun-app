<template>
	<div class="balance-user" :class="variantClass">
		<div class="amount">
			<input type="text" :value="modelValue" placeholder="0.00" @input="onInput" />
			<p class="balance-amount">Balance {{ displayBalance }} ETH</p>
		</div>
		<div class="token">
			<p class="token-label">ETH</p>
			<NuxtImg class="eth" src="/img/eth.png" alt="ETH Blockchain" format="webp" loading="lazy" />
		</div>
	</div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps<{
	modelValue: string;
	variant?: 'default' | 'green';
}>()

const emit = defineEmits(['update:modelValue'])
const balanceStore = useBalanceStore()
const userBalance = computed(() => balanceStore.userBalance)

const displayBalance = computed(() => {
	const bal = parseFloat(userBalance.value)
	if (isNaN(bal)) return '0.000000'
	const available = bal - 0.001
	return (available < 0 ? 0 : available).toFixed(6)
})


function onInput(event: Event) {
	const inputEl = event.target as HTMLInputElement
	let val = inputEl.value

	// Remove any characters except digits, comma, and dot
	val = val.replace(/[^0-9.,]/g, '')
	// Replace commas with dots
	val = val.replace(/,/g, '.')
	// Allow only one dot in the number
	const firstDotIndex = val.indexOf('.')
	if (firstDotIndex !== -1) {
		val = val.substring(0, firstDotIndex + 1) + val.substring(firstDotIndex + 1).replace(/\./g, '')
	}

	const endsWithDot = val.endsWith('.')
	const parsedVal = parseFloat(val)
	let balanceNum = parseFloat(userBalance.value)

	if (!endsWithDot && !isNaN(parsedVal)) {
		if (parsedVal < 0) {
			val = '0'
		} else if (parsedVal > balanceNum) {
			balanceNum -= 0.001
			val = (Math.floor(balanceNum * 1e5) / 1e5).toString()
		}
	}
	inputEl.value = val
	emit('update:modelValue', val)
}

const variant = props.variant || 'default'
const variantClass = computed(() => (variant === 'green' ? 'green' : ''))
</script>


<style scoped lang="scss">
.balance-user {
	display: flex;
	flex-direction: row;
	padding: 20px;
	width: 100%;
	background-color: var(--color-tertiary-faded);
	border: 1px solid var(--color-tertiary);

	.amount {
		display: flex;
		flex-direction: column;
		gap: 16px;
		color: white;
		opacity: 0.5;
		font-size: 10px;
		border-right: 1px solid var(--color-tertiary);
		max-width: 220px;

		input {
			background-color: transparent;
			border: unset;
			color: white;
			font-size: 18px;

			/* Hide native number spinner if any */
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

		.balance-amount {
			text-align: left;
		}
	}

	.token {
		display: flex;
		flex-direction: row;
		color: white;
		gap: 10px;
		align-items: center;
		margin-left: auto;

		.eth {
			width: 24px;
			height: 24px;
		}
	}
}

.balance-user.green {
	background-color: #00fa001f;
	border: none;

	.amount {
		opacity: 1;
		border-right: 1px solid var(--color-secondary);

		input {
			color: var(--color-secondary);

			&::placeholder {
				color: rgba(0, 250, 0, 0.5);
			}
		}

		.balance-amount {
			color: rgba(0, 250, 0, 0.5);
		}
	}

	.token {
		color: var(--color-secondary);
	}
}

@media (max-width: 1300px) {
	.balance-user {
		padding: 12px;

		.amount {
			max-width: 150px;
		}
	}
}

@media (max-width: 1100px) {
	.balance-user:not(.green) {
		padding: 12px;

		.token {
			margin-left: auto;
		}
	}
}
</style>
