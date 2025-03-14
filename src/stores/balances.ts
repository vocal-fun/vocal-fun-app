import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useBlockchain } from '~/composables/blockchain'

export const useBalanceStore = defineStore('balance', () => {
  const userBalance = ref('0.0')
  const { getFormattedNativeBalance } = useBlockchain()
  async function fetchBalance(address: string) {
    try {
      userBalance.value = await getFormattedNativeBalance(address)
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }

  return { userBalance, fetchBalance }
})
