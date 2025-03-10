<template>
	<div class="main-page">
		<h1>Launch your AI Agent</h1>
		<h2>
			A coin will be launched for free.
			50% of call earnings will go towards buyback & burn.
		</h2>

		<div class="form-creating">
			<AgentCreateInfo v-model:agentInfo="agentInfo" />
			<AgentCreatePic v-model:imageFile="imageFile" />
			<AgentCreateVoice v-model:voiceFile="voiceFile" v-model:exampleVoice="exampleVoice" />
			<button class="create-btn" :class="{ filled: isInfoFilled }" :disabled="!isInfoFilled" @click="handleCreateAgent">
				{{ isInfoFilled ? "Generate Agent Preview" : "Fill in details to create agent" }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AgentCreateInfo from './AgentCreateInfo.vue';
import AgentCreatePic from './AgentCreatePic.vue';
import AgentCreateVoice from './AgentCreateVoice.vue';
import { useAgentsStore } from '~/stores/agents';

const agentsStore = useAgentsStore();

interface AgentInfo {
	name: string;
	ticker: string;
	description: string;
}

const agentInfo = ref<AgentInfo>({ name: '', ticker: '', description: '' });
const imageFile = ref<File | null>(null);
const voiceFile = ref<File | null>(null);
const exampleVoice = ref<string | null>(null);

const isInfoFilled = computed(() => {
	return (
		agentInfo.value.name.trim() !== '' &&
		agentInfo.value.ticker.trim() !== '' &&
		agentInfo.value.description.trim() !== '' &&
		imageFile.value !== null &&
		(voiceFile.value !== null || exampleVoice.value !== null)
	);
});

async function handleCreateAgent() {
	if (!isInfoFilled.value) return;

	try {
		const imageParam: File | string = imageFile.value ? imageFile.value : '/img/grid.png';
		const voiceParam: File | string = voiceFile.value
			? voiceFile.value
			: exampleVoice.value
				? `/audio/${exampleVoice.value}`
				: '';
		const res = await agentsStore.createAgent({
			name: agentInfo.value.name,
			symbol: agentInfo.value.ticker,
			description: agentInfo.value.description,
			systemPrompt: agentInfo.value.name,
			twitter: '',
			website: '',
			image: imageParam,
			voiceSample: voiceParam,
		});
	} catch (error) {
		console.error('Error creating agent:', error);
	}
}
</script>


<style scoped lang="scss">
.main-page {
	display: flex;
	flex-direction: column;
	max-width: 600px;
	color: white;
	text-align: center;
	margin: 0 auto;

	h1 {
		font-size: 24px;
		font-weight: 400;
	}

	h2 {
		margin-top: 20px;
		margin-bottom: 48px;
		font-size: 14px;
		font-weight: 400;
		opacity: 0.5;
	}

	.form-creating {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #161622;
		text-align: left;
		padding: 34px 28px;
		box-shadow:
			2.78px 2.78px 0px 0px #59596d,
			2.78px -4.17px 0px 0px #1b1b2a,
			-2.78px -2.78px 0px 0px #1b1b2a,
			2.78px 0px 0px 0px #59596d,
			0px -1.39px 0px 0px #000000;

		.create-btn {
			padding: 14px;
			color: #00fa00;
			border: 1.3px solid #00fa0033;
			width: 100%;
			text-align: center;
			margin-top: 32px;
			transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;

			&:disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}

			&:hover:not(:disabled) {
				background-color: rgba(0, 250, 0, 0.1);
				border-color: #00fa00;
			}
		}

		.filled {
			background-color: #00fa00;
			color: black;

			&:hover:not(:disabled) {
				background-color: #1fe71f;
				color: black;
			}
		}
	}
}
</style>
