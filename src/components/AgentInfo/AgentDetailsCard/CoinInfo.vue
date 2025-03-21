<template>
	<div class="coin-info">
		<div class="prices">
			<div class="titles">
				<p v-for="(title, index) in pricesData.titles" :key="`title-${index}`" :class="{ 'img-solana': index === 1 }">
					<span>
						<NuxtImg v-if="index === 1" class="solana-icon" alt="Solana icon" format="webp" loading="lazy"
							src="/img/eth.png" />
					</span>{{ title }}
				</p>
			</div>
			<div class="values">
				<p v-for="(value, index) in pricesData.values" :key="`value-${index}`">
					{{ value }}
				</p>
			</div>
		</div>
		<div class="stats">
			<div class="titles">
				<p v-for="(title, index) in statsData.titles" :key="`stat-title-${index}`">
					{{ title }}
				</p>
			</div>
			<div class="values">
				<p v-for="(value, index) in statsData.values" :key="`stat-value-${index}`">
					{{ value }}
				</p>
			</div>
		</div>
		<div class="changes">
			<div v-for="(item, index) in changesData" :key="index">
				<p :style="{ color: item.color }">{{ item.formatted }}</p>
				<p>{{ item.label }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { NuxtImg } from '#components'
import { formatShortNumber, timeAgo } from '~/utils/formatters'
import type { Agent } from '~/types'

const props = defineProps<{ agent: Agent }>()

const statsData = computed(() => ({
	titles: ['MKAT CAP', 'LIQUIDITY', 'HOLDERS'],
	values: [
		`$${formatShortNumber(props.agent.mcap)}`,
		`$${formatShortNumber(props.agent.liquidity)}`,
		`${props.agent.tokenHolders.holders.total}`
	]
}))

const pricesData = computed(() => ({
	titles: ['$ PRICE', 'PRICE', 'AGE'],
	values: [
		`$${props.agent.price}`,
		`$${props.agent.price}`,
		timeAgo(props.agent.createdAt).toUpperCase()
	]
}))

const changesData = computed(() => [
	{ label: '5m', ...formatChange(props.agent.change5m) },
	{ label: '1h', ...formatChange(props.agent.change1h) },
	{ label: '24h', ...formatChange(props.agent.change24h) },
	{ label: '7d', ...formatChange(props.agent.change7d) }
])

function formatChange(value: number): { formatted: string; color: string } {
	const absValue = Math.abs(value)
	if (value >= 0) {
		return { formatted: `+${absValue}%`, color: '#00FA00' }
	} else {
		return { formatted: `-${absValue}%`, color: '#FF886A' }
	}
}
</script>

<style scoped lang="scss">
.coin-info {
	padding-top: 20px;
	display: flex;
	flex-direction: column;
	background-color: var(--color-background);
	gap: 28px;

	.prices,
	.stats {
		margin-left: 20px;
		margin-right: 10px;
		font-size: 12px;
		color: white;
		display: grid;
		gap: 14px;
		grid-template-columns: 1fr 1fr 1fr;

		.titles,
		.values {
			display: contents;

			img {
				width: 13px;
				height: 13px;
			}
		}

		.titles {
			.img-solana {
				display: flex;
				align-items: center;
				gap: 8px;
			}

			p {
				opacity: 0.5;
			}
		}
	}

	.changes {
		display: flex;
		flex-direction: row;
		border-block: 1px solid var(--color-tertiary);
		justify-content: space-between;
		color: white;
		font-size: 11px;
		flex-wrap: wrap;
		border-bottom: unset;

		div {
			display: flex;
			flex-direction: column;
			gap: 8px;
			padding: 14px;
			align-items: center;

			&:not(:last-child) {
				border-right: 1px solid var(--color-tertiary);
			}

			p {
				&:last-child {
					opacity: 0.5;
				}
			}
		}
	}
}

@media (max-width: 600px) {
	.coin-info {
		gap: 16px;
	}
}
</style>
