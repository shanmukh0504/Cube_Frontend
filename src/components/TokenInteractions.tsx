import { useState } from "react";
import { ViewAllowance } from "./ViewAllowance";
import { Approve } from "./Approve";
import { Burn } from "./Burn";
import { Mint } from "./Mint";
import AddressBalance from "./AddressBalance";
import { TokenState } from "./TokenState";
import { TokenInfo } from "./TokenInfo";
import { TransferFrom } from "./TransferFrom";
import { Transfer } from "./Transfer";
import { ViewBalance } from "./ViewBalance";
import { TransactionHistory } from "./Transactions";
import SwapComponent from "./SwapComponent";
import TransactionsComponent from "./TransactionComponent";
import { ChevronRightIcon } from "@heroicons/react/solid";
import { IncreaseAllowance } from "./IncreaseAllowance";
import { DecreaseAllowance } from "./DecreaseAllowance";
import { Faucet } from "./Faucet";

interface TokenInteractionsProps {
  address: `0x${string}`;
}

const TokenInteractions = ({ address }: TokenInteractionsProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [activeComponent, setActiveComponent] = useState<React.ReactNode>(<TokenInfo />);

  const handleTabClick = (component: React.ReactNode) => {
    setActiveComponent(component);
  };

  return (
    <div className="flex h-screen text-foreground">
      <div className="sidebar pt-24 p-6 flex flex-col space-y-4 fixed left-0 top-0 h-full bg-inherit">
        {/* Main Menu Item */}
        <div
          onMouseEnter={() => setActiveTab("read")}
          onMouseLeave={() => setActiveTab(null)}
          className="text-gray-300 relative"
        >
          <button className="flex items-center w-[200px] justify-between cursor-pointer p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105">
            Read Contract
            <ChevronRightIcon className="w-5 h-5" />
          </button>
          {/* Sub-options for "Read Contract" */}
          {activeTab === "read" && (
            <div className="absolute w-auto left-full top-0 text-white p-4 rounded-lg shadow-lg space-y-2">
              <button
                className="w-[200px] p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleTabClick(<TokenInfo />)}
              >
                Token Info
              </button>
              <button
                className="w-[200px] p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleTabClick(<ViewBalance address={address} />)}
              >
                View Balance
              </button>
              <button
                className="w-[200px] p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleTabClick(<ViewAllowance />)}
              >
                View Allowance
              </button>
              <button
                className="w-[200px] p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleTabClick(<AddressBalance />)}
              >
                Address Balance
              </button>
            </div>
          )}
        </div>

        {/* Transactions Section */}
        <div
          onMouseEnter={() => setActiveTab("txn")}
          onMouseLeave={() => setActiveTab(null)}
          className="text-gray-300 relative"
        >
          <button className="flex items-center w-[200px] justify-between cursor-pointer p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105">
            Transactions
            <ChevronRightIcon className="w-5 h-5" />
          </button>
          {/* Sub-options for "Transactions" */}
          {activeTab === "txn" && (
            <div className="absolute w-auto left-full top-0 text-white p-4 rounded-lg shadow-lg space-y-2">
              <button
                className="w-[200px] p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleTabClick(<TransactionHistory refreshKey={true} />)}
              >
                Transaction History
              </button>
            </div>
          )}
        </div>

        {/* Write Contract Section */}
        <div
          onMouseEnter={() => setActiveTab("write")}
          onMouseLeave={() => setActiveTab(null)}
          className="text-gray-300 relative"
        >
          <button className="flex items-center w-[200px] justify-between cursor-pointer p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105">
            Write Contract
            <ChevronRightIcon className="w-5 h-5" />
          </button>
          {/* Sub-options for "Write Contract" */}
          {activeTab === "write" && (
            <div className="absolute w-auto left-full top-0 text-white p-4 rounded-lg shadow-lg space-y-2">
              <button
                className="w-[200px] p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleTabClick(<Transfer />)}
              >
                Transfer
              </button>
              <button
                className="w-[200px] p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleTabClick(<TransferFrom />)}
              >
                Transfer From
              </button>
              <button
                className="w-[200px] p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleTabClick(<Approve />)}
              >
                Approve
              </button>
              <button
                className="w-[200px] p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleTabClick(<Mint />)}
              >
                Mint
              </button>
              <button
                className="w-[200px] p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleTabClick(<TokenState />)}
              >
                Token State
              </button>
              <button
                className="w-[200px] p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleTabClick(<Burn />)}
              >
                Burn
              </button>
              <button
        className="w-[200px] p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105"
        onClick={() => handleTabClick(<IncreaseAllowance />)}
      >
        Increase Allowance
      </button>
      <button
        className="w-[200px] p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105"
        onClick={() => handleTabClick(<DecreaseAllowance />)}
      >
        Decrease Allowance
      </button>
            </div>
          )}
        </div>

        {/* Swap Section */}
        <div
          onMouseEnter={() => setActiveTab("swap")}
          onMouseLeave={() => setActiveTab(null)}
          className="text-gray-300 relative"
        >
          <button className="flex items-center w-[200px] justify-between cursor-pointer p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105">
            Swap
            <ChevronRightIcon className="w-5 h-5" />
          </button>
          {/* Sub-options for "Swap" */}
          {activeTab === "swap" && (
            <div className="absolute w-auto left-full top-0 text-white p-4 rounded-lg shadow-lg space-y-2">
              <button
                className="w-[200px] p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleTabClick(<SwapComponent />)}
              >
                Swap Tokens
              </button>
              <button
                className="w-[200px] p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleTabClick(<TransactionsComponent />)}
              >
                View Swap Transactions
              </button>
            </div>
          )}
        </div>
        {/* Faucet Section (New Section) */}
        <div
          onMouseEnter={() => setActiveTab("faucet")}
          onMouseLeave={() => setActiveTab(null)}
          className="text-gray-300 relative"
        >
          <button className="flex items-center w-[200px] justify-between cursor-pointer p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105">
            Faucet
            <ChevronRightIcon className="w-5 h-5" />
          </button>
          {/* Sub-options for "Faucet" */}
          {activeTab === "faucet" && (
            <div className="absolute w-auto left-full top-0 text-white p-4 rounded-lg shadow-lg space-y-2">
              <button
                className="w-[200px] p-2 rounded-lg bg-gradient-button transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleTabClick(<Faucet address={address}/>)} // Faucet Request
              >
                Request Tokens
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 pt-16 p-8 bg-background text-foreground">
        <div className="max-w-3xl mx-auto pt-10">{activeComponent}</div>
      </div>
    </div>
  );
};

export default TokenInteractions;
