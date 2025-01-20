import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from "@heroicons/react/solid";
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
import { IncreaseAllowance } from "./IncreaseAllowance";
import { DecreaseAllowance } from "./DecreaseAllowance";
import { Faucet } from "./Faucet";

interface TokenInteractionsProps {
  address: `0x${string}`;
  onActiveTabChange: (component: React.ReactNode) => void;
}

const TokenInteractions = ({
  address,
  onActiveTabChange,
}: TokenInteractionsProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const sections = [
    {
      label: "Read Contract",
      subOptions: [
        { label: "Token Info", component: <TokenInfo /> },
        { label: "View Balance", component: <ViewBalance address={address} /> },
        { label: "View Allowance", component: <ViewAllowance /> },
        { label: "Address Balance", component: <AddressBalance /> },
      ],
    },
    {
      label: "Transactions",
      subOptions: [
        {
          label: "Transaction History",
          component: <TransactionHistory refreshKey={true} />,
        },
      ],
    },
    {
      label: "Write Contract",
      subOptions: [
        { label: "Transfer", component: <Transfer /> },
        { label: "Transfer From", component: <TransferFrom /> },
        { label: "Approve", component: <Approve /> },
        { label: "Mint", component: <Mint /> },
        { label: "Token State", component: <TokenState /> },
        { label: "Burn", component: <Burn /> },
        { label: "Increase Allowance", component: <IncreaseAllowance /> },
        { label: "Decrease Allowance", component: <DecreaseAllowance /> },
      ],
    },
    {
      label: "Swap",
      subOptions: [
        { label: "Swap Tokens", component: <SwapComponent /> },
        {
          label: "Swap Transactions",
          component: <TransactionsComponent />,
        },
      ],
    },
    {
      label: "Faucet",
      subOptions: [
        { label: "Request Tokens", component: <Faucet address={address} /> },
      ],
    },
  ];

  const handleToggleTab = (label: string) => {
    setActiveTab((prevTab) => (prevTab === label ? null : label));
  };

  return (
    <div className="sidebar p-8 flex flex-col space-y-4 bg-inherit w-full md:w-auto">
      {sections.map((section) => (
        <div key={section.label} className="text-gray-300">
          <button
            onClick={() => handleToggleTab(section.label)}
            className="flex items-center justify-between w-full md:w-[200px] p-2 px-6 rounded-lg text-white border border-gray-700 shadow-lg bg-gray-800 hover:bg-gray-700"
          >
            {section.label}
            {activeTab === section.label ? (
              <ChevronDownIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>
          {activeTab === section.label && (
            <div className="mt-2 flex flex-col space-y-2">
              {section.subOptions.map((option, idx) => (
                <button
                  key={idx}
                  className="flex justify-between items-center w-full p-2 rounded-lg border-gray-700 shadow-lg bg-gray-800 hover:bg-gray-700"
                  onClick={() => onActiveTabChange(option.component)}
                >
                  <span>{option.label}</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TokenInteractions;
