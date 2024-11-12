import * as React from "react";
import { Connector, useConnect } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Wallet } from "lucide-react";
import { Button } from "@/ui/button";
import { motion } from "framer-motion";
import { cardVariants, buttonVariants } from "../utils/animations";

export function WalletOptions() {
    const { connectors, connect } = useConnect();

    return (
        <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl min-w-96 mx-auto mt-8"
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
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Button onClick={() => connect({ connector })} className="w-full bg-gradient-button transform transition-transform duration-300">
                                {connector.name}
                            </Button>
                        </motion.div>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    );
}
