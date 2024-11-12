import { useReadContracts } from "wagmi";
import { motion } from "framer-motion";
import { Abi, CONTRACT_ADDRESS } from "@/Abi";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { formatEther } from "viem";
import { cardVariants } from "../utils/animations";

export function TokenInfo() {
    const { data, error, isPending } = useReadContracts({
        contracts: [
            { address: CONTRACT_ADDRESS, abi: Abi, functionName: "name" },
            { address: CONTRACT_ADDRESS, abi: Abi, functionName: "symbol" },
            { address: CONTRACT_ADDRESS, abi: Abi, functionName: "totalSupply" },
            { address: CONTRACT_ADDRESS, abi: Abi, functionName: "decimals" },
            { address: CONTRACT_ADDRESS, abi: Abi, functionName: "owner" },
            { address: CONTRACT_ADDRESS, abi: Abi, functionName: "paused" },
        ],
    });

    if (isPending) return <div className="col-span-2 md:col-span-3">Loading...</div>;
    if (error) return <div className="col-span-2 md:col-span-3">Error loading token info</div>;

    const [name, symbol, totalSupply, decimals, owner, paused] = data || [];

    return (
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Card className="overflow-hidden col-span-2 md:col-span-3">
                <CardHeader>
                    <CardTitle>Token Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div>Name: {name.result}</div>
                    <div>Symbol: {symbol.result}</div>
                    <div>Total Supply: {totalSupply.result ? formatEther(totalSupply.result) : "0"}</div>
                    <div>Decimals: {decimals.result}</div>
                    <div>Owner: {owner.result}</div>
                    <div>Status: {paused.result ? "Paused" : "Active"}</div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
