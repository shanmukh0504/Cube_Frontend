import { useReadContract, type BaseError } from "wagmi";
import { Abi, CONTRACT_ADDRESS } from "@/Abi";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { formatEther } from "viem";
import { ReadContractErrorType } from "wagmi/actions";
import { motion } from "framer-motion";
import { cardVariants } from "../utils/animations";

export function ViewBalance({ address }: { address: `0x${string}` }) {
    const { data, error, isPending } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: Abi,
        functionName: "balanceOf",
        args: [address],
    });

    return (
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Card className="w-[500px] overflow-hidden">
                <CardHeader>
                    <CardTitle>Your Token Balance</CardTitle>
                </CardHeader>
                <CardContent>
                    {isPending ? (
                        <div className="text-center text-sm text-gray-500">Loading...</div>
                    ) : error ? (
                        <div className="text-center text-sm text-red-600">
                            Error: {(error as ReadContractErrorType).shortMessage || error.message}
                        </div>
                    ) : (
                        <div className="text-center text-lg font-semibold">
                            Balance: {data ? formatEther(data) : "0"} CBT
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
