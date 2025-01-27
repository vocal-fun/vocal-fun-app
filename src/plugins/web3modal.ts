import { defineNuxtPlugin } from '#app';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { createAppKit } from '@reown/appkit/vue';
import { base } from '@reown/appkit/networks';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { wcProjectId } from '~/consts';

export default defineNuxtPlugin((nuxtApp) => {
  const metadata = {
    name: 'VOCAL.FUN',
    description: 'Vocal Fun - Talk to realtime AI agents',
    url: 'https://vocal-frontend.vercel.app',
    icons: ['https://vocal-frontend.vercel.app/favicon.ico'],
  };

  const wagmiAdapter = new WagmiAdapter({
    networks: [base],
    projectId: wcProjectId,
  });

  const modal = createAppKit({
    adapters: [wagmiAdapter],
    networks: [base],
    metadata: metadata,
    projectId: wcProjectId,
    features: {
      analytics: false,
      onramp: true,
      swaps: true,
      send: true,
      receive: true,
    },
   });

  const queryClient = new QueryClient();

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

  return {
    provide: {
      modal,
    },
  };
});
