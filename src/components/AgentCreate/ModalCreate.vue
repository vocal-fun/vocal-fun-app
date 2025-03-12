<template>
	<div class="agent-info-modal">
		<button v-if="$isSmallScreen" v-play-click-sound class="close" @click="$emit('close')">X</button>
		<div class="header">

			<h3>TEST YOUR AGENT</h3>
			<div class="agent-info">
				<p>Review {{ props.agentData?.name }}'s response before tweaking or publishing</p>
				<AvatarCircle v-if="props.agentData?.image" :img="imageSrc" :size="$isSmallScreen ? 70 : 110" />
			</div>
		</div>
		<div class="body">
			<div class="input">
				<p>Prompt question <span>(you cannot change this)</span></p>
				<input placeholder="Who are you and what do you do?" v-model="inputValue" />
				<button v-play-click-sound @click="testResponse">
					Play agent's test response <span>▶</span>
				</button>
			</div>

			<div v-if="!isLoading" class="actions">
				<button v-play-click-sound @click="publishAgent">PUBLISH THIS.</button>
				<button v-play-click-sound @click="$emit('close')">NEED TO TWEAK.</button>
			</div>
			<div v-else class="loader"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import { useAgentsStore } from '@/stores/agents'
import { AvatarCircle } from '#components';

const agentsStore = useAgentsStore();
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
const emit = defineEmits(['close', 'closePublishAgent'])

const imageSrc = computed(() => {
	if (!props.agentData) return ''
	const img = props.agentData.image
	if (typeof img === 'string') return img
	if (img instanceof File) return URL.createObjectURL(img)
	return ''
})

const inputValue = ref('')
const isLoading = ref(false)

async function publishAgent() {
	console.log('Publishing agent with data:', props.agentData)
	if (!props.agentData) return
	isLoading.value = true
	try {
		const res = await agentsStore.createAgent(props.agentData)
		console.log('The result is', res)
		isLoading.value = false
		emit('closePublishAgent')
	} catch (error) {
		console.error('Error publishing agent', error)
		isLoading.value = false
	}
}

function testResponse() {
	console.log('test response input:', inputValue.value)
}
</script>

<style scoped lang="scss">
.agent-info-modal {
	display: flex;
	flex-direction: column;
	color: #00FA00;
	width: 100%;

	.close {
		text-align: right;
	}

	.header {
		margin-bottom: 30px;
		background: linear-gradient(180deg, rgba(55, 211, 57, 0) 0%, rgba(55, 211, 57, 0.12) 100%);

		h3 {
			font-size: 14px;
			color: #37D339;
			margin-bottom: 20px;
		}

		.agent-info {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 20px;
			border-top: 2px solid rgba(0, 250, 0, 0.2);
			text-align: left;
			position: relative;

			p {
				font-size: 19px;
				text-transform: uppercase;
			}
		}
	}

	.body {
		display: flex;
		flex-direction: column;

		.input {
			text-align: left;

			span {
				opacity: 0.5;
			}

			input {
				background: #00FA0014;
				border: 2px solid #00FA0033;
				padding: 16px 24px;
				width: 100%;
				margin: 24px 0px;
				color: #00FA00;
				transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;

				&:hover {
					background-color: #00FA0022;
					cursor: pointer;
					border-color: #00FA00;
				}
			}

			button {
				width: 100%;
				padding: 14px;
				text-align: center;
				color: black;
				background-color: #00FA00;
				border: 1.3px solid #00FA00;
				cursor: pointer;

				transition: background-color 0.3s ease-in-out;

				&:hover {
					background-color: #2ee12e;
				}

				span {
					opacity: 1;
				}
			}

			padding-bottom: 20px;
			border-bottom: 2px solid rgba(0, 250, 0, 0.2);
		}

		.actions {
			display: flex;
			flex-direction: row;
			width: 100%;
			gap: 40px;
			margin-top: 30px;

			button {
				background: #00FA0014;
				border: 1px solid #00FA00;
				padding: 22px;
				width: 100%;
				transition: background-color 0.3s ease-in-out;

				&:hover {
					cursor: pointer;
					background-color: #09ec0988;
				}
			}
		}

		.loader {
			margin-top: 30px;
			align-self: center;
			width: 44px;
			height: 44px;
			border: 4px solid rgba(0, 250, 0, 0.2);
			border-top: 4px solid #00FA00;
			border-radius: 50%;
			animation: spin 1s linear infinite;
		}
	}
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

@media (max-width: 600px) {
	.agent-info-modal .header .agent-info {
		p {
			font-size: 15px;
		}
	}
}
</style>
