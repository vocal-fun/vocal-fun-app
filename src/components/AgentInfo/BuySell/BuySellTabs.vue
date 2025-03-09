<template>
	<div :class="['tabs', { 'small-screen': $isSmallScreen }]">
		<button :class="{ active: selectedTab === 'BUY' }" @click="handleClick('BUY')">
			BUY
		</button>
		<button :class="{ active: selectedTab === 'SELL' }" @click="handleClick('SELL')">
			SELL
		</button>
		<button v-if="$isSmallScreen" @click="$emit('close')" class="close-btn">x</button>
	</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { useNuxtApp } from '#app';

interface Props {
	selectedTab: string;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:selectedTab', 'close']);
const { $isSmallScreen } = useNuxtApp();
const selectedTab = computed(() => props.selectedTab);

function handleClick(tab: 'BUY' | 'SELL') {
	if (!$isSmallScreen) {
		if (tab === 'BUY') {
			console.info('Calling BUY function...');
		} else {
			console.info('Calling SELL function...');
		}
	} else {
		emit('update:selectedTab', tab);
	}
}
</script>

<style scoped lang="scss">
.tabs {
	display: flex;
	flex-direction: row;
	position: relative;

	button {
		flex: 1;
		text-align: center;
		padding: 20px;
		background-color: #212133;
		border: none;
		cursor: pointer;
		font-size: 15px;
		transition: background 0.3s;
		color: #fff;

		&.active {
			background: linear-gradient(348.34deg, #00fa00 -14.85%, rgba(0, 250, 0, 0) 93.01%);
			border-bottom: 1px solid #00fa00;
		}

		&:not(.active):hover {
			background: #2c2c3d;
		}
	}

	&.small-screen {
		position: relative;

		.close-btn {
			max-width: 40px;
		}
	}
}
</style>
