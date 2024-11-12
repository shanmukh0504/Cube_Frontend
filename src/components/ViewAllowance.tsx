import React, { useState } from "react";
import { motion } from "framer-motion";
import { formatEther } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Abi, CONTRACT_ADDRESS } from "@/Abi";
import { publicClient } from "@/client";
import { buttonVariants, cardVariants } from "../utils/animations";

export function ViewAllowance() {
  const [owner, setOwner] = useState("");
  const [spender, setSpender] = useState("");
  const [inputError, setInputError] = useState("");
  const [allowance, setAllowance] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllowance = async () => {
    setIsLoading(true);
    setInputError("");

    try {
      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: Abi,
        functionName: "allowance",
        args: [owner as `0x${string}`, spender as `0x${string}`],
      });
      setAllowance(data as bigint);
    } catch (error) {
      setInputError("Error checking allowance. Verify the addresses.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateAddress = (address: string) =>
    address.startsWith("0x") && address.length === 42;

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    setter(value);
    if (!validateAddress(value)) {
      setInputError("Invalid address format.");
    } else {
      setInputError("");
    }
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress(owner) && validateAddress(spender)) {
      await fetchAllowance();
    }
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-[500px] overflow-hidden">
        <CardHeader>
          <CardTitle>Check Allowance</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheck} className="space-y-4">
            <Input
              placeholder="Owner Address (0x...)"
              value={owner}
              onChange={(e) => handleInputChange(setOwner, e.target.value)}
              className={inputError ? "border-red-500" : ""}
              required
            />
            <Input
              placeholder="Spender Address (0x...)"
              value={spender}
              onChange={(e) => handleInputChange(setSpender, e.target.value)}
              className={inputError ? "border-red-500" : ""}
              required
            />
            {inputError && (
              <p className="text-sm text-red-500">{inputError}</p>
            )}

            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                type="submit"
                className="w-full"
                disabled={Boolean(inputError) || !owner || !spender || isLoading}
              >
                {isLoading ? "Checking..." : "Check Allowance"}
              </Button>
            </motion.div>

            {allowance !== null && (
              <div className="text-center text-lg font-medium">
                Allowance: {formatEther(allowance * BigInt(10 ** 18))} CBT
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
