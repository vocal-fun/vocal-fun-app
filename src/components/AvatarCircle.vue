<template>
	<div class="avatar-block" :style="avatarStyles">
		<NuxtImg class="avatar-img" :src="img" :width="size"
			:height="size"
			format="webp"
			loading="lazy"
			placeholder="/img/user-avatar.png"
			placeholder-class="image-placeholder"
			alt="Avatar agent"
			/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	img: string
	size?: number
}>()

const size = props.size || 110

const avatarStyles = computed(() => ({
	'--avatar-size': `${size}px`,
	'--before-size': `calc(${size}px + 40px)`,
	'--after-size': `calc(${size}px + 20px)`
}))
</script>


<style scoped lang="scss">
.avatar-block {
	width: var(--avatar-size);
	height: var(--avatar-size);
	border-radius: 50%;
	position: relative;
	margin-right: 16px;
	flex-shrink: 0;

	.avatar-img {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
		z-index: 1;
	}

	&::before,
	&::after {
		content: "";
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		background: linear-gradient(180deg,
				rgba(0, 250, 0, 0) 0%,
				rgba(0, 250, 0, 0.3) 54.12%,
				rgba(0, 250, 0, 0) 100%);
	}

	&::before {
		width: var(--before-size);
		height: var(--before-size);
		opacity: 0.3;
	}

	&::after {
		width: var(--after-size);
		height: var(--after-size);
		opacity: 0.5;
	}
}
</style>
