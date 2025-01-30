export const icons = {
  play: 'M9.43993 4.13143C10.1867 4.51529 10.1867 5.48477 9.43992 5.86863L1.66142 9.86696C0.920935 10.2476 -3.72704e-08 9.76612 0 8.99836V1.00164C3.72705e-08 0.233881 0.920939 -0.247589 1.66143 0.133044L9.43993 4.13143Z',
  stop: 'M0.5 0.5H9.5V9.5H0.5V0.5Z',
  call: 'm2.973 1.325.479.57c.663.786.594 1.97-.158 2.723l-.408.408a.396.396 0 0 0-.092.416c.149.406.528.914 1.137 1.522.609.61 1.116.988 1.522 1.138a.396.396 0 0 0 .416-.092l.408-.408c.752-.753 1.937-.822 2.724-.16l.57.48c.649.546.715 1.531.146 2.2-.31.358-.748.584-1.22.63-1.818.244-3.726-.632-5.724-2.63C.776 6.124-.1 4.216.143 2.398a1.844 1.844 0 0 1 .63-1.22c.67-.568 1.654-.503 2.2.147Z'
};

export const baseNetwork = {
  name: 'Base',
  chainId: 8453,
  rpcUrl: 'https://base.drpc.org',
  explorerUrl: 'https://basescan.org/',
  currency: 'ETH',
};

export const chainsToSupport = [baseNetwork];
export const wcProjectId = '31b43709-d56d-4c07-b74c-a7421139da88=e81377cdc3f06c06104ae06b0f71d973270c87bae05fa29c82432808697b58f2';
export const defaultRpcUrl = baseNetwork.rpcUrl;
export const defaultChainId = baseNetwork.chainId;

export const endpoint = 'https://api.vocal.fun/api/v1';
export const wsEndpoint = 'https://api.vocal.fun';
export const wsCallEndpoint = 'https://api.vocal.fun/call';
