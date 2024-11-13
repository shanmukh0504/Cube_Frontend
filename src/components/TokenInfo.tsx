import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatEther } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Abi, CONTRACT_ADDRESS } from "@/Abi";
import { publicClient } from "@/client";
import { cardVariants } from "../utils/animations";

export function TokenInfo() {
    const [name, setName] = useState<string | null>(null);
    const [symbol, setSymbol] = useState<string | null>(null);
    const [totalSupply, setTotalSupply] = useState<bigint | null>(null);
    const [decimals, setDecimals] = useState<number | null>(null);
    const [owner, setOwner] = useState<string | null>(null);
    const [paused, setPaused] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTokenInfo = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const [
                nameData,
                symbolData,
                totalSupplyData,
                decimalsData,
                ownerData,
                pausedData,
            ] = await Promise.all([
                publicClient.readContract({
                    address: CONTRACT_ADDRESS,
                    abi: Abi,
                    functionName: "name",
                    args: [],
                }),
                publicClient.readContract({
                    address: CONTRACT_ADDRESS,
                    abi: Abi,
                    functionName: "symbol",
                    args: [],
                }),
                publicClient.readContract({
                    address: CONTRACT_ADDRESS,
                    abi: Abi,
                    functionName: "totalSupply",
                    args: [],
                }),
                publicClient.readContract({
                    address: CONTRACT_ADDRESS,
                    abi: Abi,
                    functionName: "decimals",
                    args: [],
                }),
                publicClient.readContract({
                    address: CONTRACT_ADDRESS,
                    abi: Abi,
                    functionName: "owner",
                    args: [],
                }),
                publicClient.readContract({
                    address: CONTRACT_ADDRESS,
                    abi: Abi,
                    functionName: "paused",
                    args: [],
                }),
            ]);

            setName(nameData as string);
            setSymbol(symbolData as string);
            setTotalSupply(totalSupplyData as bigint);
            setDecimals(decimalsData as number);
            setOwner(ownerData as string);
            setPaused(pausedData as boolean);
        } catch (err) {
            setError("Error loading token information.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTokenInfo();
    }, []);

    return (
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Card className="overflow-hidden col-span-2 md:col-span-3">
                <CardHeader>
                    <CardTitle>Token Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {isLoading ? (
                        <div className="text-center text-sm">Loading...</div>
                    ) : error ? (
                        <div className="text-center text-sm text-red-600">{error}</div>
                    ) : (
                        <>
                            <div>Name: {name}</div>
                            <div>Symbol: {symbol}</div>
                            <div>Total Supply: {totalSupply ? formatEther(totalSupply) : "0"}</div>
                            <div>Decimals: {decimals}</div>
                            <div>Owner: {owner}</div>
                            <div>Status: {paused ? "Paused" : "Active"}</div>
                        </>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
