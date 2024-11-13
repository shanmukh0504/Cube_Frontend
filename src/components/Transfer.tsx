import * as React from "react";
import { motion } from "framer-motion";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";
import { parseEther } from "viem";
import { Abi, CONTRACT_ADDRESS } from "@/Abi";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { buttonVariants, cardVariants } from "../utils/animations";
import { useState } from "react";

export function Transfer() {
  const [address, setAddress] = useState("");
  const [inputError, setInputError] = useState("");
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);

    if (value && (!value.startsWith("0x") || value.length !== 42)) {
      setInputError(
        "Invalid address format. Please enter a valid Ethereum address."
      );
    } else {
      setInputError("");
    }
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const to = formData.get("to") as `0x${string}`;
    const amount = formData.get("amount") as string;
    const amountInEtherStr = (parseFloat(amount)).toFixed(18);

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: Abi,
      functionName: "transfer",
      args: [to, parseEther(amountInEtherStr)],
    });
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-[500px] overflow-hidden">
        <CardHeader>
          <CardTitle>Transfer Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <Input
              name="to"
              placeholder="Recipient Address (0x...)"
              onChange={handleAddressChange}
              className={inputError ? "border-red-500" : ""}
              required
            />
            {inputError && <p className="text-sm text-red-500">{inputError}</p>}
            <Input
              name="amount"
              placeholder="Amount"
              type="number"
              step="0.000001"
              required
            />
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? "Confirming..." : "Transfer"}
              </Button>
            </motion.div>
            {hash && <div className="text-xs">Transaction Hash: {hash}</div>}
            {isConfirming && (
              <div className="text-sm">Waiting for confirmation...</div>
            )}
            {isConfirmed && (
              <div className="text-sm text-green-600">
                Transaction confirmed.
              </div>
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
