"use client";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { cardVariants } from "@/utils/animations";

interface Transaction {
  blockNum: string;
  hash: string;
  from: string;
  to: string;
  value: string;
}

export function TransactionHistory({ refreshKey }: { refreshKey: boolean }) {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const apiKey = "ixwsFB8ciVVTC7FpCWknSVxU3lMKWDyw";

  const fetchTransactions = async () => {
    setLoading(true);
    const data = JSON.stringify({
      jsonrpc: "2.0",
      id: 0,
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          fromAddress: address,
          category: ["erc20"],
          withMetadata: true,
        },
      ],
    });

    const baseURL = `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    };

    try {
      const response = await fetch(baseURL, requestOptions);
      const result = await response.json();
      if (result.result) {
        setTransactions(result.result.transfers);
      } else {
        console.error("No transactions found");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [address, refreshKey]);

  return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="h-full w-full max-w-3xl overflow-hidden ml-20 pl-4 pb-4"
      >
        <Card className="w-full h-full overflow-hidden">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent className="h-full overflow-y-auto no-scrollbar">
            {loading ? (
              <p>Loading transactions...</p>
            ) : transactions.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar">
                {transactions
                  .slice()
                  .reverse()
                  .map((tx, index) => (
                    <motion.div
                      key={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Card className="overflow-hidden shadow-sm">
                        <CardHeader>
                          <CardTitle>Transaction Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>
                            <strong>Block Number:</strong> {tx.blockNum}
                          </p>
                          <p>
                            <strong>Transaction Hash:</strong> {tx.hash}
                          </p>
                          <p>
                            <strong>From:</strong> {tx.from}
                          </p>
                          <p>
                            <strong>To:</strong> {tx.to}
                          </p>
                          <p>
                            <strong>Value:</strong> {parseFloat(tx.value) / 10 ** 18} ETH
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <p>No transactions found for this address.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
  );
}
