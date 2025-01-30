import { useWeb3ModalAccount } from '@web3modal/ethers/vue';
import { defineStore } from 'pinia';
import { useBlockchain } from '~/composables/blockchain';
import type { NonceDto, UserDto } from '~/types';

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false);
  const loggedInAddress = ref('');
  const nonceData = ref<NonceDto | null>(null);
  const token = ref('');
  const user = ref<UserDto | null>(null);

  function isLoggedInAddress(address: string | undefined) {
    return token.value && loggedInAddress.value.toLowerCase() === address?.toLowerCase();
  }

  async function login(address: string): Promise<void> {
    const { signMessage } = useBlockchain();

    await requestNonce(address);
    console.info('Nonce requested. Signing message...');
    if (!nonceData.value) return;
    const signature = await signMessage(nonceData.value.message);
    console.info('Message signed. Verifying signature...');
    await verifySignature(address, signature, nonceData.value.nonce);
    console.info('Signature verified. Getting user data...');
    await getUser();
    console.info('User data fetched.');
  }

  async function requestNonce(address: string) {
    loading.value = true;

    try {
      const res = await $fetch<NonceDto>('/api/v1/auth/nonce', {
        method: 'POST',
        body: {
          address,
        },
      });
      nonceData.value = res;
    } finally {
      loading.value = false;
    }
  }

  async function authorize(): Promise<void> {
    const tokenCookie = useCookie('token');

    if (!tokenCookie.value) return;

    const tokenData = JSON.parse(atob(tokenCookie.value.split('.')[1]));
    const expires = tokenData.exp * 1000;

    if (Date.now() >= expires) {
      clearCookie();

      return;
    }

    token.value = tokenCookie.value;
    loggedInAddress.value = tokenData.address;

    loading.value = true;
    const { address: walletAddress } = useWeb3ModalAccount();
    // Check current address and address from token
    if (walletAddress.value?.toLowerCase() !== tokenData.address.toLowerCase()) {
      logout();
      return;
    }
    try {
      await getUser();
    } finally {
      loading.value = false;
    }
  }

  function clearCookie(): void {
    const tokenCookie = useCookie('token');
    tokenCookie.value = null;
  }

  function logout(): void {
    clearCookie();

    token.value = '';
    loggedInAddress.value = '';
    user.value = null;
    nonceData.value = null;
    loading.value = false;
  }

  async function verifySignature(address: string, signature: string, nonce: string): Promise<void> {
    loading.value = true;

    try {
      const res = await $fetch<{ token: string }>('/api/v1/auth/verify', {
        method: 'POST',
        body: {
          address,
          signature,
          nonce,
        },
      });
      const tokenCookie = useCookie('token');
      tokenCookie.value = res.token;
      const tokenData = JSON.parse(atob(res.token.split('.')[1]));
      loggedInAddress.value = tokenData.address;
      token.value = res.token;
    } finally {
      loading.value = false;
    }
  }

  async function getUser(): Promise<void> {
    try {
      loading.value = true;
      const res = await $fetch<{ user: UserDto }>('/api/v1/user', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token.value,
        },
      });
      user.value = res.user;
    } catch (error) {
      user.value = null;
      throw error; // Rethrow error to handle it in app.vue (for token expiration)
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    token,
    loggedInAddress,
    user,
    nonceData,
    requestNonce,
    verifySignature,
    getUser,
    authorize,
    clearCookie,
    logout,
    login,
    isLoggedInAddress,
  };
});
