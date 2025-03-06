<template>
	<div class="tabs">
		<button :class="{ active: selectedTab === 'BUY' }" @click="$emit('update:selectedTab', 'BUY')">
			BUY
		</button>
		<button :class="{ active: selectedTab === 'SELL' }" @click="$emit('update:selectedTab', 'SELL')">
			SELL
		</button>
	</div>
</template>

<script setup lang="ts">
defineProps<{ selectedTab: string }>()
</script>

<style scoped lang="scss">
.tabs {
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
</style>
