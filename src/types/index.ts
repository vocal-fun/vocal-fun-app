export type AgentsResponse = {
  agents: AgentDto[];
};

export type AgentDto = {
  /** Agent ID */
  _id: string;
  /** Whether the agent is active */
  active: boolean;
  /** Agent name */
  name: string;
  /** Agent twitter link */
  twitter: string;
  /** Agent rate 1min/$ in USD */
  rate: number;
  /** URL of the agent image */
  imageUrl: string;
  /** Description of the agent */
  description: string;
  /** Whether the agent is featured */
  featured: boolean;
  /** Agent market cap (as string, e.g. "5000") */
  marketCap: string;
  /** Agent symbol */
  symbol: string;
  /** Agent token address */
  tokenAddress: string;
  /** Total supply of the agent token */
  totalSupply: string;
  /** Current price (as string) */
  currentPrice: string;
  /** Creation date */
  createdAt: string;
  /** Update date */
  updatedAt: string;
  /** Created by information */
  createdBy: {
    _id: string;
    address: string;
  };
  __v: number;
};

export type Comment = {
  content: string;
  createdBy: {
    address: string;
  };
  createdAt: string;
};

export type CommentsResponse = {
  comments: Comment[];
};

export type TokenHolder = {
  user: {
    address: string;
  };
  balance: number;
  percentage: number;
};

export type TokenHoldersResponse = {
  holders: {
    holders: TokenHolder[];
    total: number;
  };
};

export type Trade = {
  timestamp: string;
  buyer: {
    address: string;
  };
  seller: {
    address: string;
  };
  amount: number;
  price: number;
  txHash: string;
};

export type AgentTradesResponse = {
  trades: Trade[];
};

export type UserDetailsResponse = {
  user: {
    walletAddress: string;
    createdAt: string;
  };
  agents: Agent[];
};


export type Agent = {
  id: string;
  name: string;
  image: string;
  rate: number;
  createdAt: string;
  createdBy: string;
  route: string;
  tokenName: string;
  mcap: number; 
  price: number;
  contract: string;
  liquidity: number;
  volume24h: number;
  change5m: number;
  change1h: number;
  change24h: number;
  change7d: number;
  comments: CommentsResponse; 
  tokenHolders: TokenHoldersResponse;
  trades: AgentTradesResponse;
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

export enum TypeGridTable  {
  GRID = 'grid',
  TABLE = 'table'
}
