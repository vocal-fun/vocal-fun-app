import io, { Socket } from 'socket.io-client';
import { useWeb3ModalAccount } from '@web3modal/ethers/vue';
import { defineStore } from 'pinia';
import type { NonceDto, UserDto } from '~/types';

export const useAuthStore = defineStore('auth', () => {
  const { $toast } = useNuxtApp();
  const loading = ref(false);
  const loggedInAddress = ref('');
  const nonceData = ref<NonceDto | null>(null);
  const token = ref('');
  const user = ref<UserDto | null>(null);
  const ws = ref<Socket | null>(null);

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

  /** Temporary solution to avoid WalletConnect usage */
  async function fakeAuthorize(): Promise<void> {
    const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Nzk4ODkzM2FkNGEwM2UxZDEyZmExODciLCJhZGRyZXNzIjoiMHgxNmIxMDI1Y2QxYTgzMTQxYmY5M2U0N2RiYzMxNmYzNGYyN2YyZTc2IiwiaWF0IjoxNzQwMjEwNjc3LCJleHAiOjE3NDIyODQyNzd9.x1OQ-ko4us7RSA6xztJ8ykF8cyPiTJM8zJoivP2D7EM";
    const tokenCookie = useCookie('token');
    tokenCookie.value = fakeToken;

    const tokenData = JSON.parse(atob(fakeToken.split('.')[1]));
    const expires = tokenData.exp * 1000;

    if (Date.now() >= expires) {
      clearCookie();

      return;
    }

    token.value = fakeToken;
    loggedInAddress.value = tokenData.address;

    loading.value = true;

    try {
      await getUser();
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
    if (walletAddress.value && walletAddress.value.toLowerCase() !== tokenData.address.toLowerCase()) {
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

  function subscribeOnUserBalance(): void {
    if (!token.value) return;
    unsubscribeFromUserBalance();
    try {
      ws.value = io('https://api.vocal.fun', {
        auth: {
          token: token.value,
        },
      });
      ws.value.on('connect', () => {
        console.log('[USER API] Connected to server');
      });
      ws.value.on('disconnect', () => {
        console.log('[USER API] Disconnected from server');
      });
      ws.value.on('balance_update', (args: { balance: number }) => {
        if (!user.value) {
          console.warn('[USER API] [WARN] User data is not available but balance updated');
          return;
        }
        const balanceBefore = user.value.balance;
        console.log('[USER API] Balance updated: ', args.balance);
        user.value = {
          ...user.value,
          balance: args.balance,
        };
        if (balanceBefore < args.balance) {
          $toast.success(`$${args.balance - balanceBefore} has been received`);
        } else if (balanceBefore > args.balance) {
          $toast.info(`$${balanceBefore - args.balance} has been spent`);
        }
      });
    } catch (error) {
      console.warn('[USER API] Error connecting to server:', error);
    }
  }

  function unsubscribeFromUserBalance(): void {
    if (!ws.value) return;
    ws.value.disconnect();
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
      // Subscribe on user balance
      subscribeOnUserBalance();
    } catch (error) {
      user.value = null;
      unsubscribeFromUserBalance();
      throw error; // Rethrow error to handle it in app.vue (for token expiration)
    } finally {
      loading.value = false;
    }
  }

  const destroy = () => {
    unsubscribeFromUserBalance();
  };

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
    destroy,
    fakeAuthorize,
  };
});
