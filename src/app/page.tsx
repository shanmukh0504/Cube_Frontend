"use client";

import { WalletOptions } from "@/wallet/WalletOptions";
import { useAccount } from "wagmi";
import TokenInteractions from "@/components/TokenInteractions";

function App() {
    const { isConnected, address } = useAccount();
    return (
        <div className=" min-h-screen flex flex-col items-center ">
            {isConnected && address ? (
                <TokenInteractions address={address} />
            ) : (
                <div className="min-h-screen flex flex-col items-center justify-center">
                    <WalletOptions />
                </div>
            )}
        </div>
    );
}

export default App;
