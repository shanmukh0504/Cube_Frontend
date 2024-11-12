import React, { useState } from "react";
import { motion } from "framer-motion";
import { formatEther } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Abi, CONTRACT_ADDRESS } from "@/Abi";
import { publicClient } from "@/client";
import { buttonVariants, cardVariants } from "@/utils/animations";

const AddressBalance = () => {
  const [address, setAddress] = useState("");
  const [inputError, setInputError] = useState("");
  const [data, setData] = useState<bigint | null>(null);

  const fetchTokenBalance = async () => {
    try {
      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: Abi,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      });
      setData(data as bigint);
    } catch (error) {
      setInputError("Error fetching balance. Please verify the address.");
    }
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputError) fetchTokenBalance();
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-[500px] overflow-hidden">
        <CardHeader>
          <CardTitle>Token Balance Checker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Enter Ethereum address (0x...)"
              value={address}
              onChange={handleAddressChange}
              className={inputError ? "border-red-500" : ""}
            />
            {inputError && <p className="text-sm text-red-500">{inputError}</p>}
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                type="submit"
                disabled={Boolean(inputError) || !address}
                className="w-full"
              >
                Check Balance
              </Button>
            </motion.div>
          </form>

          {data && (
            <div className="text-center text-lg font-medium">
              Balance: {formatEther(data)} CBT
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AddressBalance;
