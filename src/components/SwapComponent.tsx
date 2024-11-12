"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { buttonVariants, cardVariants } from "../utils/animations";
import { useAccount } from 'wagmi';
import { Asset, SupportedAssets } from '@gardenfi/orderbook';
import { useGarden } from "@gardenfi/react-hooks";
import { useEVMWallet } from "../hooks/useEVMWallet";

type SwapAndAddressComponentProps = {
  swapParams: {
    inputToken: Asset;
    outputToken: Asset;
    inputAmount: number;
    outputAmount: number;
    btcAddress: string;
  },
};

type SwapAmountComponentProps = {
  inAmount: string;
  outAmount: string;
  changeAmount: (value: string) => void;
};

const SwapComponent: React.FC = () => {
  const [swapParams, setSwapParams] = useState({
    inputToken: SupportedAssets.testnet.ethereum_sepolia_0x3c6a17b8cd92976d1d91e491c93c98cd81998265,
    outputToken: SupportedAssets.testnet.bitcoin_testnet_primary,
    inputAmount: 0.1,
    outputAmount: 0.098,
    btcAddress: '',
  });

  const { getQuote } = useGarden();

  const handleInputChange = async (value: string) => {
    const amount = Number(value);
    if (isNaN(amount) || amount <= 0) return;

    if (!getQuote) return;

    const quote = await getQuote({
      fromAsset: swapParams.inputToken,
      toAsset: swapParams.outputToken,
      amount: amount * 10 ** swapParams.inputToken.decimals,
    });

    if (quote.error) {
      console.error("Error fetching quote:", quote.error);
      return;
    }

    const [_strategy, quoteAmount] = Object.entries(quote.val.quotes)[0];
    setSwapParams({
      ...swapParams,
      inputAmount: amount,
      outputAmount: Number(quoteAmount) / 10 ** swapParams.outputToken.decimals,
    });
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-[500px] overflow-hidden">
        <CardHeader>
          <CardTitle>Token Swap</CardTitle>
        </CardHeader>
        <CardContent>
          <SwapAmount 
            inAmount={swapParams.inputAmount.toString()} 
            outAmount={swapParams.outputAmount.toString()} 
            changeAmount={handleInputChange} 
          />
          <hr className="my-4" />
          <Swap swapParams={swapParams} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SwapAmount: React.FC<SwapAmountComponentProps> = ({
  inAmount,
  outAmount,
  changeAmount,
}) => (
  <div className="swap-component-middle-section space-y-4">
    <InputField
      id="wbtc"
      label="Send WBTC"
      value={inAmount}
      onChange={(value) => changeAmount(value)}
    />
    <InputField id="btc" label="Receive BTC" value={outAmount} readOnly />
  </div>
);

type InputFieldProps = {
  id: string;
  label: string;
  value: string | null;
  readOnly?: boolean;
  onChange?: (value: string) => void;
};

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  readOnly,
  onChange,
}) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <Input
      id={id}
      placeholder="0"
      value={value ? value : ""}
      type="number"
      readOnly={readOnly}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  </div>
);

const Swap: React.FC<SwapAndAddressComponentProps> = ({
  swapParams,
}) => {
  const { address: EvmAddress } = useAccount();
  const [loading, setLoading] = useState(false);
  const { initializeSecretManager, swapAndInitiate, getQuote } = useGarden();
  const [btcAddress, setBtcAddress] = useState<string>("");
  const { isConnected } = useEVMWallet();

  const handleSwap = async () => {
    const sendAmount =
      swapParams.inputAmount * 10 ** swapParams.inputToken.decimals;

    if (!initializeSecretManager) return;
    const smRes = await initializeSecretManager();

    if (
      !smRes.ok ||
      !swapAndInitiate ||
      !EvmAddress ||
      !swapParams.inputAmount ||
      !swapParams.outputAmount ||
      !smRes.val.getMasterPrivKey() ||
      !getQuote ||
      !btcAddress
    ) return;

    setLoading(true);

    const quote = await getQuote({
      fromAsset: swapParams.inputToken,
      toAsset: swapParams.outputToken,
      amount: sendAmount
    });

    if (quote.error) {
      alert(quote.error);
      setLoading(false);
      return;
    }

    const [_strategy, quoteAmount] = Object.entries(quote.val.quotes)[0];

    const res = await swapAndInitiate({
      fromAsset: swapParams.inputToken,
      toAsset: swapParams.outputToken,
      sendAmount: sendAmount.toString(),
      receiveAmount: quoteAmount.toString(),
      additionalData: {
        btcAddress,
        strategyId: _strategy,
      },
    });

    setLoading(false);

    if (res.error) {
      alert(res.error);
      return;
    }

    console.log(res.ok);
    console.log(res.val);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="receive-address" className="block text-sm font-medium text-gray-700">Receive Address</label>
        <Input
          id="receive-address"
          placeholder="Enter BTC Address"
          value={btcAddress}
          onChange={(e) => setBtcAddress(e.target.value)}
        />
      </div>
      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          className="w-full"
          onClick={handleSwap}
          disabled={!isConnected || loading}
        >
          {loading ? "Processing..." : "Swap"}
        </Button>
      </motion.div>
    </div>
  );
};

export default SwapComponent;
