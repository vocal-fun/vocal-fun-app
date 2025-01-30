<template>
  <div class="wallet-connect">
    <button
      v-if="!isLoggedIn"
      v-play-click-sound
      class="wallet-connect__button"
      @click="handleConnectClick()"
    >
      connect wallet
    </button>
    <button
      v-else
      v-play-click-sound
      class="wallet-connect__button"
      @click="openModal()"
    >
      {{ formattedAddress }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useWalletConnect } from '~/composables/useWalletConnect';

const { isLoggedIn, accountAddress, openModal, handleConnectClick } = useWalletConnect();

const formattedAddress = computed(() => {
  if (accountAddress.value) {
    return `${accountAddress.value.slice(0, 6)}...${accountAddress.value.slice(-4)}`;
  }
  return '';
});
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
