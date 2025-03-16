import { useState, useCallback } from 'react';
import { showConnect } from '@stacks/connect';
import { useConnect } from '@stacks/connect-react';
import { APP_CONFIG } from '@/lib/constants';
// import { NETWORK } from '@/config/stacks';

export interface WalletState {
  walletConnected: boolean;
  walletAddress: string | null;
}

export const useWallet = () => {
  const { authOptions } = useConnect();
  const [walletState, setWalletState] = useState<WalletState>({
    walletConnected: !!authOptions?.userSession?.isUserSignedIn(),
    walletAddress: authOptions?.userSession?.loadUserData()?.profile?.stxAddress?.testnet || null,
  });

  const connectWallet = useCallback(async () => {
    showConnect({
      appDetails: {
        name: APP_CONFIG.NAME,
        icon: window.location.origin + APP_CONFIG.ICON,
      },
      onFinish: () => {
        setWalletState({
          walletConnected: true,
          walletAddress: walletState.walletAddress,
        });
      },
      onCancel: () => {
        console.log('User canceled wallet connection');
      },
      userSession: authOptions?.userSession,
      //   network: NETWORK,
    });
  }, [authOptions?.userSession]);

  const disconnectWallet = useCallback(() => {
    authOptions?.userSession?.signUserOut();
    setWalletState({
      walletConnected: false,
      walletAddress: null,
    });
  }, [authOptions?.userSession]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
  };
};