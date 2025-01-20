import * as React from "react";
import { useConnect } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Wallet } from "lucide-react";
import { Button } from "@/ui/button";
import { motion } from "framer-motion";
import { cardVariants } from "../utils/animations";

export function WalletOptions() {
    const { connectors, connect } = useConnect();

    return (
        <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl md:min-w-96 mx-auto mt-8"
        >
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-6 w-6" />
                        Wallet Connection
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                    {connectors.map((connector) => (
                        <motion.div
                            key={connector.id}
                            whileTap="tap"
                        >
                            <Button onClick={() => connect({ connector })} className="w-full text-white border border-gray-700 shadow-lg bg-gray-800 hover:bg-gray-700">
                                {connector.name}
                            </Button>
                        </motion.div>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    );
}
