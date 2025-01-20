"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useDisconnect,
  useConnect,
  useBalance,
  useEnsName,
  useEnsAvatar,
} from "wagmi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Button } from "@/ui/button";
import { Wallet, ChevronDown, LogOut } from "lucide-react";
import { type ReactNode } from "react";

const WalletNavbar = () => {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const [isClient, setIsClient] = useState(false);

  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const { data: balance } = useBalance({
    address,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const formatAddress = (addr: string) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  const displayName = ensName || (address ? formatAddress(address) : "");

  const renderWalletSwitcherItems = (): ReactNode[] =>
    connectors
      .filter((connector) => connector.id !== activeConnector?.id)
      .map((connector) => (
        <DropdownMenuItem
          key={connector.id}
          onClick={() => {
            disconnect();
            connect({ connector });
          }}
          className="cursor-pointer w-full p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-200"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {connector.name}
        </DropdownMenuItem>
      ));

  return (
    <nav className="navbar w-screen border-b border-gray-700 flex fixed top-0 z-50 bg-gray-800">
      <div className="px-8 py-3 w-full">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-white">Cube Token</div>
          <div className="flex items-center gap-4 mx-4">
            {isConnected ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 text-white bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition-all duration-200"
                    >
                      {ensAvatar ? (
                        <img
                          src={ensAvatar}
                          alt="ENS Avatar"
                          className="w-5 h-5 rounded-full"
                        />
                      ) : (
                        <Wallet className="w-5 h-5" />
                      )}
                      {displayName}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 mt-2 p-4 rounded-lg text-white border border-gray-700 shadow-lg space-y-2 bg-gray-800"
                  >
                    <DropdownMenuLabel className="text-sm font-bold">
                      Connected with {activeConnector?.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-sm font-medium">
                      {balance && (
                        <span>
                          {parseFloat(balance.formatted).toFixed(4)}{" "}
                          {balance.symbol}
                        </span>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {renderWalletSwitcherItems().length > 0 && (
                      <>
                        <DropdownMenuLabel className="text-sm font-bold">
                          Switch Wallet
                        </DropdownMenuLabel>
                        {renderWalletSwitcherItems()}
                        <DropdownMenuSeparator />
                      </>
                    )}

                    <DropdownMenuItem
                      onClick={() => disconnect()}
                      className="cursor-pointer w-full p-2 rounded-lg bg-gray-700 text-red-600 hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                variant="outline"
                className="flex items-center gap-2 text-white bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition-all duration-200"
              >
                <Wallet className="w-4 h-4" />
                Not Connected
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default WalletNavbar;
