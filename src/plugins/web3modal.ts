import { defineNuxtPlugin } from '#app';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/vue';
import { chainsToSupport, wcProjectId, defaultRpcUrl, defaultChainId } from '~/consts';

export default defineNuxtPlugin(() => {
  const metadata = {
    name: 'VOCAL.FUN',
    description: 'Vocal Fun - Talk to realtime AI agents',
    url: 'https://vocal-frontend.vercel.app',
    icons: ['https://vocal-frontend.vercel.app/favicon.ico'],
  };

  const ethersConfig = defaultConfig({
    metadata,
    enableEIP6963: true,
    enableInjected: false,
    enableCoinbase: true,
    rpcUrl: defaultRpcUrl,
    defaultChainId,
  });

  const modal = createWeb3Modal({
    ethersConfig,
    chains: chainsToSupport,
    projectId: wcProjectId,
    enableAnalytics: false,
    enableOnramp: true,
    enableSwaps: true,
  });

  return {
    provide: {
      modal,
    },
  };
});
