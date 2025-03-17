<template>
	<div class="curve" :class="{ 'slippage-open': slippageOpen }">
		<div class="title">
			<p>BONDING CURVE</p>
			<p>{{ progressPercentage.toFixed() }}%</p>
		</div>
		<div class="progress-bar">
			<div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
			<NuxtImg class="plane" src="/img/plane.png" loading="lazy" alt="Plane Progress"
				:style="{ left: `calc(${progressPercentage}% - 15px)` }" />
		</div>
		<p class="description">
			After graduating at <span>$69,000 market cap,</span><br />
			the token will take off to
			<span class="inline-aero">
				aerodrome
				<NuxtImg class="aerodrome" src="/img/aerodrome.png" alt="Aerodrome" loading="lazy" />
			</span>
		</p>
	</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
defineProps<{ progressPercentage: number, slippageOpen?: boolean }>()
</script>

<style scoped lang="scss">
.curve {
	display: flex;
	flex-direction: column;
	color: white;
	margin-top: 24px;
	margin-bottom: 22px;
	border-bottom: 1px solid #59596D;

	&.slippage-open {
		border-left: 1px solid #59596D;
	}

	.title {
		display: flex;
		justify-content: space-between;

		p {
			&:last-child {
				color: #00fa00;
			}
		}
	}

	.progress-bar {
		position: relative;
		width: 100%;
		height: 43px;
		background-color: #59596d80;
		overflow: hidden;
		margin-top: 10px;
		margin-bottom: 20px;
	}

	.progress-fill {
		position: absolute;
		height: 100%;
		background-color: #00fa00;
		transition: width 0.5s ease-in-out;
	}

	.plane {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 45px;
		height: 32px;
		margin-left: 10px;
	}

	.description {
		color: rgba(255, 255, 255, 0.5);
		padding-bottom: 18px;

		span {
			color: white;
		}

		.inline-aero {
			white-space: nowrap;
		}

		.aerodrome {
			display: inline-block;
			width: 24px;
			height: 24px;
			vertical-align: middle;
			margin-left: 6px;
		}
	}
}

@media (max-width: 1300px) {
	.curve {
		margin-top: unset;
		padding-top: 24px !important;
	}

}

@media (max-width: 1100px) {
	.curve {
		border-bottom: unset;

		&.slippage-open {
			border-left: unset;
		}
	}
}
</style>
