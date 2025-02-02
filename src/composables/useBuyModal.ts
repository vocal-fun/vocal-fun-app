import { useWeb3Modal } from '@web3modal/ethers/vue';
import type { BuyOptionDto } from '~/types';

export function useBuyModal() {
  const sendLoading = ref(false);
  const buyStore = useBuyStore();
  const authStore = useAuthStore();
  const { transfer } = useBlockchain();
  const modal = useWeb3Modal();
  // const { success, info, warning } = useNotification();

  const amount = ref(1);

  const buyOptions = computed(() => buyStore.buyOptions);
  const selectedOption = ref<BuyOptionDto | null>(null);
  const user = computed(() => authStore.user);

  const formattedAddress = computed(() => {
    if (user.value) {
      return `${user.value.address.slice(0, 6)}...${user.value.address.slice(-4)}`;
    }
    return '';
  });

  const balance = computed(() => user.value?.balance ?? 0);

  const openBuyModal = () => {
    buyStore.openBuyModal();
  };

  const closeBuyModal = () => {
    buyStore.closeBuyModal();
  };

  const openWallet = () => {
    modal.open();
  }

  const increaseAmount = () => {
    amount.value += 1;
  }
  
  const decreaseAmount = () => {
    if (amount.value > 1) {
      amount.value -= 1;
    }
  }

  const selectOption = (option: BuyOptionDto) => {
    if (selectedOption.value?.address === option.address) {
      return;
    }
    selectedOption.value = option;
  }

  const buy = async () => {
    sendLoading.value = true;
    try {
      const user = authStore.user;
      if (!user) {
        console.info('User not logged in to purchase');
        // info('Please connect your wallet to proceed');
        return;
      }
      const option = selectedOption.value;
      if (!option) {
        console.info('No payment option selected to purchase');
        // info('Please select a payment option');
        return;
      }
      const contractAddress = option.address;
      const to = option.recipient;
      await transfer(contractAddress, to, amount.value);
      closeBuyModal();
      console.info(`Purchase successful! ${amount.value} ${option.symbol} has been sent`);
      // success(`Purchase successful! ${amount.value} ${option.symbol} has been sent`);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('user rejected action')) {
        console.info('Purchase cancelled by user');
        // warning('Purchase cancelled');
        return;
      }
      if (errorMessage.includes('transfer amount exceeds balance')) {
        console.info('Insufficient balance');
        // warning('Insufficient balance');
        return;
      }
      console.warn('Error signing transfer ERC20 tx:', error);
      // warning('An error occurred while processing your purchase');
    } finally {
      sendLoading.value = false;
    }
  };

  const copyRecipient = async () => {
    if (!selectedOption.value) {
      return;
    }
    try {
      await navigator.clipboard.writeText(selectedOption.value.recipient);
      // success('Recipient address copied to clipboard.');
    } catch (error) {
      console.warn('Error copying recipient address:', error);
      // warning('An error occurred while copying recipient address.');
    }
  };

  onBeforeMount(async () => {
    await buyStore.getBuyOptions();
    selectOption(buyOptions.value[0]);
  });

  return {
    amount,
    selectedOption,
    balance,
    buyOptions,
    formattedAddress,
    sendLoading,
    openBuyModal,
    closeBuyModal,
    buy,
    increaseAmount,
    decreaseAmount,
    openWallet,
    selectOption,
    copyRecipient,
  };
}
