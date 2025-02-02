import { BrowserProvider, ethers, Contract, type Eip1193Provider, type ContractTransactionResponse } from 'ethers';

interface IERC20 {
  balanceOf(owner: string): Promise<bigint>;
  transfer(to: string, amount: bigint): Promise<ContractTransactionResponse>;
  decimals(): Promise<bigint>;
  approve(spender: string, amount: bigint): Promise<ContractTransactionResponse>;
  allowance(owner: string, spender: string): Promise<bigint>;
}

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

export function useBlockchain() {
  const getProvider = () => {
    const ethereum = (window as any).ethereum as Eip1193Provider | undefined;
    if (!ethereum) {
      throw new Error('No Ethereum provider detected. Please install MetaMask.');
    }
    return new BrowserProvider(ethereum);
  }

  const getSigner = async () => {
    const provider = getProvider();
    const signer = await provider.getSigner();
    return signer;
  }

  const signMessage = async (message: string): Promise<string> => {
    try {
      const provider = getProvider();
      const signer = await provider.getSigner();
      const signedMessage = await signer.signMessage(message);
      return signedMessage;
    } catch (error) {
      console.error('Error signing message:', error);
      throw new Error('User rejected the signature or an error occurred.');
    }
  }

  const transfer = async (from: string, contractAddress: string, to: string, amount: number) => {
    try {
      const provider = getProvider();
      const signer = await provider.getSigner();

      const contract = new Contract(contractAddress, ERC20_ABI, signer) as Contract & IERC20;
      const decimals = Number(await contract.decimals());
      // No need for allowance if recipient is the regular address
      // const allowance = await contract.allowance(from, contractAddress);
      const value = ethers.parseUnits(`${amount}`, decimals);
      // if (allowance < value) {
      //   const tx = await contract.approve(contractAddress, ethers.MaxUint256);
      //   await tx.wait();
      // }
      const tx = await contract.transfer(to, value);
      await tx.wait();
    } catch (error) {
      console.warn('Error signing transfer ERC20 tx:', error);
      throw new Error('An error occurred while transferring ERC20 tokens.');
    }
  }

  return {
    getSigner,
    getProvider,
    signMessage,
    transfer,
  };
}
