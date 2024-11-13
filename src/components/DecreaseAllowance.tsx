import * as React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useWriteContract } from "wagmi";
import { Abi, CONTRACT_ADDRESS } from "@/Abi";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { buttonVariants, cardVariants } from "../utils/animations";
import { parseEther } from "viem";

// Helper function to validate Ethereum address format
const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export function DecreaseAllowance() {
  const [spender, setSpender] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { writeContract, isPending, error: writeError } = useWriteContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spender || !amount) return;

    // Validate the spender address
    if (!isValidAddress(spender)) {
      setError("Invalid address format. Please enter a valid Ethereum address.");
      return;
    }

    setError(null); // Clear any previous error

    const amountInEther = parseEther(amount);

    try {
      // Type casting for the spender address to match '0x${string}' format
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: Abi,
        functionName: "decreaseAllowance",
        args: [spender as `0x${string}`, amountInEther],
      });
    } catch (err) {
      console.error("Error decreasing allowance:", err);
    }
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-[500px] overflow-hidden">
        <CardHeader>
          <CardTitle>Decrease Allowance</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="spender"
              placeholder="Spender Address (0x...)"
              onChange={(e) => setSpender(e.target.value)}
              value={spender}
              className={error ? "border-red-500" : ""}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Input
              name="amount"
              placeholder="Amount"
              type="number"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              required
            />
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? "Processing..." : "Decrease Allowance"}
              </Button>
            </motion.div>
            {writeError && (
              <div className="text-sm text-red-600">
                Error: {writeError.message}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
