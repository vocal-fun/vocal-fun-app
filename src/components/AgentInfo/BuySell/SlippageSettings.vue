<template>
	<div class="slippage">
		<div v-play-click-sound @click="toggleOptions">
			<NuxtImg class="slippage-img" src="/img/slippage.png" alt="Slippage Settings" format="webp" loading="lazy" />
			<p>{{ selectedSlippage !== null ? selectedSlippage + '%' : 'SLIPPAGE SETTINGS' }}</p>
			<p class="slippage-arrow">></p>
		</div>
		<transition name="fade-slide">
			<div v-if="showOptions" class="slippage-options" @click.stop>
				<ul v-play-click-sound>
					<li v-for="option in slippageOptions" :key="option" @click.stop="selectOption(option)">
						{{ option }}%
					</li>
				</ul>
				<div class="custom-slippage">
					<input type="number" v-model.number="customValue" placeholder="Custom" @input="validateCustom" />
					<button v-play-click-sound @click="setCustom">Set</button>
				</div>
			</div>
		</transition>
	</div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits(['slippage-toggle'])
const showOptions = ref(false)
const slippageOptions = ref([0.1, 0.2, 0.5, 1, 2, 5])
const selectedSlippage = ref<number | null>(null)
const customValue = ref<number | null>(null)

function toggleOptions() {
	showOptions.value = !showOptions.value
	emit('slippage-toggle', showOptions.value)
}

function selectOption(option: number) {
	selectedSlippage.value = option
	showOptions.value = false
	console.log('Selected slippage:', option)
}

function validateCustom() {
	if (customValue.value !== null) {
		if (customValue.value < 0) customValue.value = 0
		if (customValue.value > 50) customValue.value = 50
	}
}

function setCustom() {
	if (customValue.value !== null) {
		selectedSlippage.value = customValue.value
		showOptions.value = false
		console.log('Selected custom slippage:', customValue.value)
	}
}
</script>

<style scoped lang="scss">
.slippage {

	.fade-slide-enter-active,
	.fade-slide-leave-active {
		transition: all 0.3s ease;
	}

	.fade-slide-enter-from,
	.fade-slide-leave-to {
		opacity: 0;
		transform: translateY(-10px);
	}

	.fade-slide-enter-to,
	.fade-slide-leave-from {
		opacity: 1;
		transform: translateY(0);
	}

	position: relative;
	border-bottom: 1px solid var(--color-tertiary);

	div {
		background: var(--color-tertiary-faded);
		border: 1px solid var(--color-tertiary);
		padding: 18px;
		display: flex;
		flex-direction: row;
		align-items: center;
		color: white;
		cursor: pointer;

		transition: background-color 0.3s ease-in-out;

		&:hover {
			background-color: #ada9a926;
		}

		.slippage-img {
			margin-right: 16px;
			width: 24px;
			height: 24px;
		}

		.slippage-arrow {
			opacity: 0.5;
			display: inline-block;
			transform: rotate(90deg);
			margin-left: auto;
		}
	}

	.slippage-options {
		padding: 10px;
		margin-top: 12px;
		display: flex;
		flex-direction: column;

		&:hover {
			background-color: var(--color-tertiary-faded);
			cursor: default;
		}

		ul {
			list-style: none;
			padding: 0;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			width: 100%;

			li {
				padding: 4px;
				border: 1px solid var(--color-tertiary);
				cursor: pointer;

				transition: background-color 0.3s ease-in-out;

				&:hover {
					background-color: rgba(89, 89, 109, 0.2);
				}
			}
		}

		.custom-slippage {
			background-color: transparent;
			border: unset;
			display: flex;
			flex-direction: column;
			gap: 8px;

			input {
				background-color: transparent;
				border: 1px solid var(--color-tertiary);
				padding: 4px;
				color: white;

				&::-webkit-inner-spin-button {
					-webkit-appearance: none;
				}

				&:focus-visible {
					outline: unset;
				}
			}

			button {
				transition: color 0.3s ease-in-out;

				&:hover {
					color: rgb(185, 184, 184)
				}
			}
		}
	}
}

@media (max-width: 1300px) {
	.slippage {
		.slippage-options {
			ul {
				flex-wrap: wrap;
				gap: 6px;
			}
		}
	}
}

@media (max-width: 1100px) {
	.slippage {
		.slippage-options {
			ul {
				li {
					padding: 12px;
				}
			}
		}
	}
}

@media (max-width: 480px) {
	.slippage {
		.slippage-options {
			ul {
				flex-wrap: wrap;

				li {
					padding: 4px;
				}
			}

			.custom-slippage {
				input {
					width: 100%;
				}
			}
		}
	}

}
</style>
