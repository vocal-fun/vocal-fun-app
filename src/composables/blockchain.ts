import type { Eip1193Provider } from 'ethers';
import { BrowserProvider } from 'ethers';
import { messageToSign } from '~/consts';

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

  const signMessage = async (): Promise<string> => {
    try {
      const provider = getProvider();
      const signer = await provider.getSigner();
      const signedMessage = await signer.signMessage(messageToSign);
      return signedMessage;
      // TODO: send message to backend
    } catch (error) {
      console.error('Error signing message:', error);
      throw new Error('User rejected the signature or an error occurred.');
    }
  }

  return {
    getSigner,
    getProvider,
    signMessage,
  };
}
