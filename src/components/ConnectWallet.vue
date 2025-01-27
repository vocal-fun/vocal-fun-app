<template>
  <div class="wallet-connect">
    <button
      v-if="!isConnected || !hasSigned"
      v-play-click-sound
      class="wallet-connect__button"
      @click="!isConnected ? modal.open() : promptSignMessage()"
    >
      connect wallet
    </button>
    <button
      v-else
      v-play-click-sound
      class="wallet-connect__button"
      @click="modal.open()"
    >
      {{ formattedAddress }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/vue';
import { useBlockchain } from '~/composables/blockchain';

const { signMessage } = useBlockchain();
const { address, isConnected } = useWeb3ModalAccount();
const modal = useWeb3Modal();
const hasSigned = ref(false);

const formattedAddress = computed(() => {
  if (address.value) {
    return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`;
  }
  return '';
});

onMounted(() => {
  const storedHasSigned = localStorage.getItem('hasSigned')
  const storedAddress = localStorage.getItem('signedAddress')
  if (storedHasSigned === 'true' && storedAddress === address.value) {
    hasSigned.value = true
  }
});

async function promptSignMessage() {
  try {
    await signMessage()
    hasSigned.value = true
    localStorage.setItem('hasSigned', 'true')
    localStorage.setItem('signedAddress', address.value || '')
  } catch (error) {
    console.error('Message signing failed:', error)
    hasSigned.value = false
    localStorage.removeItem('hasSigned')
    localStorage.removeItem('signedAddress')
  }
}
watch(isConnected, async (newVal, oldVal) => {
  if (newVal && !oldVal && !hasSigned.value) {
    await promptSignMessage()
  }
})
</script>

<style scoped lang="scss">
.wallet-connect {
  text-align: center;
  white-space: nowrap;
  > button {
    cursor: pointer;
    text-decoration: none;
    transition: color 0.3s ease-in-out, text-decoration 0.3s ease-in-out;
    &:hover {
      text-decoration: underline;
      color: white;
    }
  }
}
</style>
