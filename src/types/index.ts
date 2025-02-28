export type AgentDto = {
  /** Agent ID */
  _id: string;
  /** Agent name */
  name: string;
  /** Agent image src */
  image: string;
  /** Agent rate 1min/$ in USD */
  rate: number;
  createdAt: string;
  /** Agent twitter link */
  twitter: string;
  __v: number;
};

export type Agent = {
  id: string;
  name: string;
  image: string;
  rate: number;
  createdAt: string;
  route: string;
  tokenName: string;
  mcap: string;
};

export type PreviewDto = {
  /** Base64 encoded audio data */
  audio: string;
  format: 'wav';
  sampleRate: number;
};

export type Preview = PreviewDto & { agentId: string };

export type UserDto = {
  _id: string;
  __v: number;
  address: string;
  /** User balance in minutes */
  balance: number;
  createdAt: string;
};

export type NonceDto = {
  /** Nonce value */
  nonce: string;
  /** Nonce related message */
  message: string;
};

export type BuyOptionDto = {
  /** Token contract */
  address: string;
  /** Token name */
  name: string;
  network: 'base';
  /** Recipient that should receive a transfer to topup the account balance in minutes */
  recipient: string;
  /** Token symbol */
  symbol: string;
};

export type OpenModalState = 'default' | 'preview' | 'call';
