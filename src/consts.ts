export const icons = {
  play: 'M9.43993 4.13143C10.1867 4.51529 10.1867 5.48477 9.43992 5.86863L1.66142 9.86696C0.920935 10.2476 -3.72704e-08 9.76612 0 8.99836V1.00164C3.72705e-08 0.233881 0.920939 -0.247589 1.66143 0.133044L9.43993 4.13143Z',
  stop: 'M0.5 0.5H9.5V9.5H0.5V0.5Z',
  call: 'm2.973 1.325.479.57c.663.786.594 1.97-.158 2.723l-.408.408a.396.396 0 0 0-.092.416c.149.406.528.914 1.137 1.522.609.61 1.116.988 1.522 1.138a.396.396 0 0 0 .416-.092l.408-.408c.752-.753 1.937-.822 2.724-.16l.57.48c.649.546.715 1.531.146 2.2-.31.358-.748.584-1.22.63-1.818.244-3.726-.632-5.724-2.63C.776 6.124-.1 4.216.143 2.398a1.844 1.844 0 0 1 .63-1.22c.67-.568 1.654-.503 2.2.147Z',
  download: 'M4.375,9.742c0.282,0.363,0.825,0.363,1.097,0l3.556-4.435c0.355-0.459,0.032-1.108-0.518-1.108H7.207c-0.369,0-0.643-0.33-0.643-0.709V0.694C6.564,0.337,6.238,0,5.806,0H4.049c-0.389,0-0.725,0.308-0.725,0.694v2.754c0,0.369-0.284,0.709-0.654,0.709H1.162c-0.56,0-0.884,0.63-0.537,1.081l3.75,4.504z',
};

export const baseNetwork = {
  name: 'Base',
  chainId: 8453,
  rpcUrl: 'https://base.drpc.org',
  explorerUrl: 'https://basescan.org/',
  currency: 'ETH',
};

export const chainsToSupport = [baseNetwork];
export const wcProjectId = 'fb93d3bd1d8f1197ffa577a77489afe6';
export const defaultRpcUrl = baseNetwork.rpcUrl;
export const defaultChainId = baseNetwork.chainId;

export const endpoint = 'https://api.vocal.fun/api/v1';
export const wsEndpoint = 'https://api.vocal.fun';
export const wsCallEndpoint = 'https://api.vocal.fun/call';

/** Sound params based on server settings */
export const Sound = {
  SampleRate: 24000,
  SampleSize: 32,
  Channels: 1,
};

/** Agent Images base URL */
export const BASE_IMAGE_URL = 'https://vocal-fun.s3.ap-south-1.amazonaws.com/agents/';
