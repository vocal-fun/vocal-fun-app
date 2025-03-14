<template>
	<div class="header-info">
		<div class="back-arrow" @click="goBack">
			<p><- </p>
		</div>
		<div class="header">
			<NuxtImg v-if="$isSmallScreen" class="avatar-img" :src="agent.image" alt="Agent Avatar" />
			<AvatarCircle v-else :img="agent.image" :size="74" />
			<div class="header-text">
				<h3>{{ agent.tokenName }} OFFICIAL COIN</h3>
				<p class="token">
					${{ agent.tokenName }}
					<span v-if="$isSmallScreen">{{ formatContract(agent.contract) }}</span>
				</p>
			</div>
		</div>

		<div class="contract-info">
			<div v-if="!$isSmallScreen" class="info-row">
				<p class="label">CONTRACT</p>
				<p class="value">{{ formatContract(agent.contract) }}</p>
			</div>
			<div class="info-row">
				<p class="label">PRICE / MIN</p>
				<p class="value">{{ agent.rate }} VOCAL</p>
			</div>
		</div>

		<div class="actions">
			<button v-play-click-sound @click="openModal('preview')" class="preview">PREVIEW</button>
			<button v-play-click-sound @click="openModal('call')" class="call">CALL</button>
		</div>

		<Modal :isOpen="isModalOpen" @close="closeModal">
			<ClientOnly>
				<CallModalContent ref="modalContent" :person="agent" :modalType="modalType" @close="closeModal" />
			</ClientOnly>
		</Modal>
	</div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import { NuxtImg } from '#components'
import { formatContract } from '~/utils/formatters'
import type { Agent } from '~/types'
import Modal from '~/components/Modal.vue'
import CallModalContent from '~/components/CallModalContent.vue'
import { useWalletConnect } from '~/composables/useWalletConnect'

const props = defineProps<{ agent: Agent }>()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const router = useRouter()
function goBack() {
	router.push('/') // or router.back() if you want to go back in history
}

const { $isSmallScreen } = useNuxtApp()
const isModalOpen = ref(false)
const modalType = ref<'preview' | 'call' | 'default'>('default')
const modalLoading = ref(false)
const modalContent = ref<InstanceType<typeof CallModalContent> | null>(null)
const { handleConnectClick } = useWalletConnect()

async function openModal(type: 'preview' | 'call' | 'default') {
	if (type === 'call' && !user.value) {
		handleConnectClick()
		return
	}
	modalLoading.value = true
	modalType.value = type
	isModalOpen.value = true
	await modalContent.value?.onOpen(type)
	modalLoading.value = false
}

function closeModal() {
	isModalOpen.value = false
	modalContent.value?.onClose?.()
}
</script>

<style scoped lang="scss">
.header-info {
	background: black;

	.back-arrow {
		width: 100%;
		background: rgba(55, 211, 57, 0.2);
		padding: 6px;
		transition: opacity 0.2s ease-in-out;


		&:hover {
			cursor: pointer;
			opacity: 0.8;
		}

		p {
			margin-left: 10px;
		}
	}

	.header {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 24px 18px 22px;
		border-bottom: 1px solid #37D339;
		background: linear-gradient(180deg, rgba(0, 255, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%);

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
				transition: color 0.3s ease;

				&:hover {
					text-decoration: underline;
					color: #37D339;
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
			transition: background-color 0.3s ease-in-out;

			&:hover {
				background-color: #37D339;
				color: #121212;
			}

			&.preview {
				border-right: 1px solid #00FA00;
			}
		}
	}
}

@media (max-width: 1250px) {
	.header-info .contract-info .info-row:first-child {
		gap: 8px;
	}

	.header-info {
		.header {
			padding: 16px 6px;
		}
	}
}

@media (max-width: 600px) {
	.header-info {
		background: black;

		.header {
			background: unset;
		}
	}

	.header-info .contract-info .info-row:first-child {
		border-bottom: unset;
	}
}
</style>
