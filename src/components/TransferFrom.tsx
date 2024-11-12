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

export function TransferFrom() {
    const { data: hash, error, isPending, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const from = formData.get("from") as `0x${string}`;
        const to = formData.get("to") as `0x${string}`;
        const amount = formData.get("amount") as string;
        const amountInEtherStr = (parseFloat(amount) / 1e18).toFixed(18);

        writeContract({
            address: CONTRACT_ADDRESS,
            abi: Abi,
            functionName: "transferFrom",
            args: [from, to, parseEther(amountInEtherStr)],
        });
    }

    return (
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Card className="w-[500px] overflow-hidden">
                <CardHeader>
                    <CardTitle>Transfer From</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <Input name="from" placeholder="From Address (0x...)" required />
                        <Input name="to" placeholder="To Address (0x...)" required />
                        <Input name="amount" placeholder="Amount" type="number" step="0.000001" required />
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                            <Button disabled={isPending} type="submit" className="w-full">
                                {isPending ? "Confirming..." : "Transfer From"}
                            </Button>
                        </motion.div>
                        {hash && <div className="text-xs">Transaction Hash: {hash}</div>}
                        {isConfirming && <div className="text-sm">Waiting for confirmation...</div>}
                        {isConfirmed && (
                            <div className="text-sm text-green-600">Transaction confirmed.</div>
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