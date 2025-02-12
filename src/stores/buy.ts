import type { BuyOptionDto } from '~/types';

export const useBuyStore = defineStore('buy', () => {
  const loading = ref(false);
  const isBuyModalOpen = ref(false);
  const buyOptions = ref<BuyOptionDto[]>([]);

  async function getBuyOptions(): Promise<void> {
    try {
      loading.value = true;
      const res = await $fetch<{ paymentMethods: BuyOptionDto[] }>('/api/v1/vocal/buy-credits', {
        headers: { 'Cache-Control': 'max-age=86400' }, // Cache for 1 day
      });
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
