import { useWeb3Modal } from '@web3modal/ethers/vue';
import type { BuyOptionDto } from '~/types';

export function useBuyModal() {
  const sendLoading = ref(false);
  const buyStore = useBuyStore();
  const authStore = useAuthStore();
  const { transfer } = useBlockchain();
  const modal = useWeb3Modal();
  const { $toast } = useNuxtApp();

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

  const _buy = async () => {
    let message = '';
    sendLoading.value = true;
    const option = selectedOption.value;
    try {
      const user = authStore.user;
      if (!user) {
        message = 'User not logged in to purchase';
        console.info(message);
        throw message;
      }
      if (!option) {
        message = 'No payment option selected to purchase';
        console.info(message);
        throw message;
      }
      const contractAddress = option.address;
      const to = option.recipient;
      await transfer(contractAddress, to, amount.value);
      closeBuyModal();
      message = `Purchase successful! ${amount.value} ${option.symbol} has been sent`;
      console.info(message);
      return message;
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('user rejected action')) {
        message = 'Purchase cancelled by user';
        console.info(message);
        throw message;
      }
      if (errorMessage.includes('transfer amount exceeds balance')) {
        message = `Insufficient ${option?.symbol} balance`;
        console.info(message);
        throw message;
      }
      if (errorMessage.includes('account has not been authorized by the user')) {
        message = 'User not logged in to purchase';
        console.info(message);
        throw message;
      }
      console.warn('Error signing transfer ERC20 tx:', error);
      throw 'An error occurred while processing your purchase';
    } finally {
      sendLoading.value = false;
    }
  };

  const buy = async () => {
    $toast.promise(_buy(), {
      loading: 'Processing purchase...',
      success: (data: string) => data,
      error: (data: string) => data,
    });
  };

  const copyRecipient = async () => {
    if (!selectedOption.value) {
      return;
    }
    try {
      await navigator.clipboard.writeText(selectedOption.value.recipient);
      $toast.success('Recipient address copied to clipboard.');
    } catch (error) {
      $toast.warning('An error occurred while copying recipient address.');
      console.warn('Error copying recipient address:', error);
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
