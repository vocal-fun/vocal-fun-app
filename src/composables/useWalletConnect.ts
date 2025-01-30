import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/vue';

export function useWalletConnect() {
  const authStore = useAuthStore();

  const { address, isConnected } = useWeb3ModalAccount();
  const modal = useWeb3Modal();
  const hasSigned = computed(() => authStore.isLoggedInAddress(address.value));
  const isLoggedIn = computed(() => isConnected.value && hasSigned.value);
  const accountAddress = computed(() => authStore.loggedInAddress);
  const loading = computed(() => authStore.loading);

  async function login() {
    try {
      if (!address.value) return;
      await authStore.login(address.value);
    } catch (error) {
      console.error('Message signing failed:', error);
    }
  }

  watch(isConnected, async (newVal, oldVal) => {
    if (loading.value) return;
    try {
      if (oldVal && !newVal) {
        authStore.logout();
      }

      if (newVal && !oldVal && !hasSigned.value) {
        await login();
      }
    } catch (error) {
      console.error('Error handling connection change:', error);
    }
  });

  function handleConnectClick() {
    if (!isConnected.value) {
      modal.open();
    } else {
      login();
    }
  }

  return {
    isLoggedIn,
    accountAddress,
    openModal: () => modal.open(),
    handleConnectClick,
  };
}
