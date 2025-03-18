<template>
	<div class="optional-buy-modal">
		<div class="header">
			<div class="spacer"></div>
			<p>OPTIONAL TOKEN BUY</p>
			<button v-if="$isSmallScreen" v-play-click-sound class="close" @click="$emit('close')">X</button>
		</div>
		<div class="agent-info">
			<AvatarCircle v-if="props.agentData?.image" :img="imageSrc" :size="$isSmallScreen ? 70 : 110" />
			<p>you can buy a small supply of {{ props.agentData?.symbol }}. this is optional.</p>
			<p>buying a small supply will help protect your coin from snipers (you already know?)</p>
			<UserBalance v-model="inputValue" variant="green" />
		</div>
		<button class="create-btn" @click="createCoin">Create coin</button>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import { AvatarCircle, UserBalance } from '#components';

const props = defineProps<{
	agentData?: {
		name: string
		symbol: string
		description: string
		systemPrompt: string
		twitter: string
		website: string
		image: File | string
		voiceSample: File | string
	}
}>()
const { $isSmallScreen } = useNuxtApp();
const emit = defineEmits(['close'])

const imageSrc = computed(() => {
	if (!props.agentData) return ''
	const img = props.agentData.image
	if (typeof img === 'string') return img
	if (img instanceof File) return URL.createObjectURL(img)
	return ''
})

const inputValue = ref('')

function createCoin() {
	console.log(`User will create coin with ${inputValue.value} ETH`)
	emit('close')
}
</script>

<style scoped lang="scss">
.optional-buy-modal {
	color: var(--color-primary);
	display: flex;
	flex-direction: column;

	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: 20px;
		border-bottom: 2px solid rgba(0, 250, 0, 0.2);

		.spacer,
		.close {
			width: 40px;
			flex-shrink: 0;
		}

		p {
			flex: 1;
			text-align: center;
			margin: 0;
			text-transform: uppercase;
			font-size: 14px;
		}

		.close {
			background: none;
			border: none;
			cursor: pointer;
		}
	}

	.agent-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		margin-top: 26px;

		.img {
			margin-bottom: 22px;
		}

		p {
			text-transform: uppercase;

			&:first-of-type {
				font-size: 17px;
				margin-bottom: 18px;
				max-width: 400px;
			}

			&:last-of-type {
				font-size: 14px;
				opacity: 0.6;
				margin-bottom: 16px;
			}
		}
	}

	.create-btn {
		margin-top: 30px;
		background: rgba(0, 250, 0, 1);
		box-shadow: 0px 0px 12.19px 0px rgba(10, 220, 15, 1), 0px 1.11px 13.29px 0px rgba(10, 220, 15, 1);
		color: black;
		padding: 24px;
		transition: background-color 0.3s ease, box-shadow 0.3s ease;
		&:hover {
			background: rgba(0, 250, 0, 0.9);
			box-shadow: 0px 0px 20px 0px rgba(10, 220, 15, 0.8),
				0px 2px 20px 0px rgba(10, 220, 15, 0.8);
		}
	}
}
</style>
