import * as React from "react";
import { motion } from "framer-motion";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";
import { Abi, FAUCET_ADDRESS } from "@/Abi";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { cardVariants } from "../utils/animations";
import { useState } from "react";

export function Faucet({ address }: { address: `0x${string}` }) {
  const [inputError, setInputError] = useState("");
  const { data: txHash, error, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!address) {
      setInputError("Please connect your wallet.");
      return;
    }

    writeContract({
      address: FAUCET_ADDRESS,
      abi: Abi,
      functionName: "requestTokens",
    });
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Request Tokens from Faucet</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {inputError && <p className="text-sm text-red-500">{inputError}</p>}
            <motion.div whileHover="hover" whileTap="tap">
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? "Requesting..." : "Request Tokens"}
              </Button>
            </motion.div>
            {txHash && <div className="text-xs">Transaction Hash: {txHash}</div>}
            {isConfirming && (
              <div className="text-sm">Waiting for confirmation...</div>
            )}
            {isConfirmed && (
              <div className="text-sm text-green-600">Transaction confirmed!</div>
            )}
            {error && (
              <div className="text-sm text-red-600">
                Error: {(error as BaseError).shortMessage || error.message}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
