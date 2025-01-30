import type { BuyOptionDto } from '~/types';

export const useBuyStore = defineStore('buy', () => {
  const loading = ref(false);
  const isBuyModalOpen = ref(false);
  const buyOptions = ref<BuyOptionDto[]>([]);

  async function getBuyOptions(): Promise<void> {
    try {
      loading.value = true;
      const res = await $fetch<{ paymentMethods: BuyOptionDto[] }>('/api/v1/vocal/buy-credits');
      buyOptions.value = res.paymentMethods;
    } catch (error) {
      console.warn(`Error fetching buy options:`, error);
    } finally {
      loading.value = false;
    }
  }

  async function openBuyModal() {
    if (!buyOptions.value.length) {
      await getBuyOptions();
    }
    isBuyModalOpen.value = true;
  }

  function closeBuyModal() {
    isBuyModalOpen.value = false;
  }

  return {
    loading,
    isBuyModalOpen,
    buyOptions,
    getBuyOptions,
    openBuyModal,
    closeBuyModal,
  };
});
