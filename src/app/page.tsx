"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import TokenInteractions from "@/components/TokenInteractions";
import { WalletOptions } from "@/wallet/WalletOptions";
import { TokenInfo } from "@/components/TokenInfo";

function Page() {
  const { isConnected, address } = useAccount();
  const [activeComponent, setActiveComponent] = useState<React.ReactNode>(<TokenInfo />);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center">
      {isConnected && address ? (
        <div className="flex flex-col md:flex-row min-h-screen w-full">
          <TokenInteractions address={address} onActiveTabChange={setActiveComponent} />
          <div className="flex-1 p-4 md:p-8 overflow-auto">
            <div className="max-w-3xl min-h-8 mx-auto">{activeComponent}</div>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl md:text-4xl font-semibold mb-6">Connect Your Wallet</h1>
          <p className="text-gray-400 text-sm md:text-base mb-4">
            To get started, connect your wallet to access token interactions and features.
          </p>
          <WalletOptions />
        </>
      )}
    </div>
  );
}

export default Page;
