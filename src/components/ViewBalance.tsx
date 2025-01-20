import React, { useState } from "react";
import { motion } from "framer-motion";
import { formatEther } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Abi, CONTRACT_ADDRESS } from "@/Abi";
import { publicClient } from "@/client";
import { cardVariants } from "../utils/animations";

export function ViewBalance({ address }: { address: `0x${string}` }) {
  const [balance, setBalance] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: Abi,
        functionName: "balanceOf",
        args: [address],
      });
      setBalance(data as bigint);
    } catch (err) {
      setError("Error fetching balance.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (address) {
      fetchBalance();
    }
  }, [address]);

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Your Token Balance</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-sm text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center text-sm text-red-600">{error}</div>
          ) : (
            <div className="text-center text-lg font-semibold">
              Balance: {balance ? formatEther(balance) : "0"} CBT
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
