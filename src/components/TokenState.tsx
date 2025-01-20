import * as React from "react";
import { motion } from "framer-motion";
import {
    useWriteContract,
    useWaitForTransactionReceipt,
    type BaseError,
} from "wagmi";
import { Abi, CONTRACT_ADDRESS } from "@/Abi";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { cardVariants } from "../utils/animations";

export function TokenState() {
    const { data: hash, error, isPending, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    function handlePause() {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: Abi,
            functionName: "pause",
        });
    }

    function handleUnpause() {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: Abi,
            functionName: "unpause",
        });
    }

    return (
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle>Token Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-center gap-4">
                        <motion.div whileHover="hover" whileTap="tap">
                            <Button
                                onClick={handlePause}
                                disabled={isPending}
                                variant="destructive"
                                className="flex-1"
                            >
                                {isPending ? "Pausing..." : "Pause Token"}
                            </Button>
                        </motion.div>
                        <motion.div whileHover="hover" whileTap="tap">
                            <Button
                                onClick={handleUnpause}
                                disabled={isPending}
                                className="flex-1"
                            >
                                {isPending ? "Unpausing..." : "Unpause Token"}
                            </Button>
                        </motion.div>
                    </div>
                    {hash && <div className="text-xs">Transaction Hash: {hash}</div>}
                    {isConfirming && <div className="text-sm">Waiting for confirmation...</div>}
                    {isConfirmed && <div className="text-sm text-green-600">Transaction confirmed.</div>}
                    {error && (
                        <div className="text-sm text-red-600">
                            Error: {(error as BaseError).shortMessage || error.message}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
