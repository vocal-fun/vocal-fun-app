<template>
	<div class="main-page">
		<h1>Launch your AI Agent</h1>
		<h2>
			A coin will be launched for free.
			50% of call earnings will go towards buyback & burn.
		</h2>

		<div class="form-creating">
			<!-- 1) Basics Info -->
			<AgentCreateInfo />

			<!-- 2) Profile Pic -->
			<AgentCreatePic />

			<!-- 3) Voice Sample (with OR divider inline) -->
			<AgentCreateVoice />

			<!-- Create Button -->
			<button class="create-btn">Fill in details to create agent</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import AgentCreateInfo from './AgentCreateInfo.vue';
import AgentCreatePic from './ AgentCreatePic.vue';
import AgentCreateVoice from './AgentCreateVoice.vue'
</script>

<style scoped lang="scss">
.main-page {
	display: flex;
	flex-direction: column;
	max-width: 600px;
	color: white;
	text-align: center;
	margin: 0 auto;
	/* Centers horizontally if desired */

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
			2.78px 2.78px 0px 0px #59596D,
			2.78px -4.17px 0px 0px #1B1B2A,
			-2.78px -2.78px 0px 0px #1B1B2A,
			2.78px 0px 0px 0px #59596D,
			0px -1.39px 0px 0px #000000;

		.create-btn {
			padding: 14px;
			color: #00FA00;
			border: 1.3px solid #00FA0033;
			width: 100%;
			text-align: center;
			margin-top: 32px;
			transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;

			&:hover {
				background-color: rgba(0, 250, 0, 0.1);
				border-color: #00FA00;
				transform: scale(1.02);
			}
		}
	}
}
</style>
