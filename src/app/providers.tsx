"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { GardenProviderWrapper } from "../components/GardenProviderWrapper";
import { wagmiConfig } from "@/wagmi";
import { ReactNode, useState } from "react";

export function Providers({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <GardenProviderWrapper>{children}</GardenProviderWrapper>
      </QueryClientProvider>
    </WagmiProvider>
  );
}