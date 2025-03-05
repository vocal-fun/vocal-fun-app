<template>
	<div class="header-info">
		<div class="header">
			<NuxtImg class="avatar-img" :src="agent.image" alt="Agent Avatar" />
			<div class="header-text">
				<h3>{{ agent.tokenName }} OFFICIAL COIN</h3>
				<p class="token">${{ agent.tokenName }}</p>
			</div>
		</div>
		<div class="contract-info">
			<div class="info-row">
				<p class="label">CONTRACT</p>
				<p class="value">{{ formatContract(agent.contract) }}</p>
			</div>
			<div class="info-row">
				<p class="label">PRICE / MIN</p>
				<p class="value">{{ agent.rate }} VOCAL</p>
			</div>
		</div>
		<div class="actions">
			<!-- <button @click="openModal(agent, 'preview')" class="preview">PREVIEW</button>
			<button @click="openModal(agent, 'call')" class="call">CALL</button> -->
			<button class="preview">PREVIEW</button>
			<button class="call">CALL</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { NuxtImg } from '#components'
import { formatContract } from '~/utils/formatters'
import type { Agent } from '~/types'

const props = defineProps<{ agent: Agent }>()
</script>

<style scoped lang="scss">
.header-info {
	background: linear-gradient(180deg, rgba(0, 255, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%);

	.header {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 24px 18px 22px;
		border-bottom: 1px solid #37D339;

		.avatar-img {
			border-radius: 50%;
			object-fit: cover;
			width: 74px;
			height: 74px;
		}

		.header-text {
			display: flex;
			flex-direction: column;
			gap: 12px;

			h3 {
				font-size: 14px;
			}

			p {
				font-size: 12px;
			}
		}
	}

	.contract-info {
		display: flex;
		flex-direction: column;
		margin-top: 12px;
		gap: 0.8rem;

		.info-row {
			display: flex;
			justify-content: space-between;

			&:first-child {
				padding: 0px 14px 16px 14px;
				border-bottom: 1px solid #37D339;
			}

			&:last-child {
				padding: 0px 14px 0px 14px;
			}

			.value {
				cursor: pointer;

				&:hover {
					text-decoration: underline;
				}
			}
		}
	}

	.actions {
		display: flex;
		flex-direction: row;
		margin-top: 18px;

		button {
			width: 100%;
			overflow: visible;
			text-align: center;
			cursor: pointer;
			background-color: #37D33933;
			padding: 22px;
			transition: background 0.2s;

			&:hover {
				background-color: #37D339;
				color: #121212;
			}

			&:first-child {
				border-right: 1px solid #00FA00;
			}
		}
	}
}
</style>
