"use client";

import { GardenProvider, environment } from '@gardenfi/react-hooks';
import { useEffect, useState } from 'react';
import { ReactNode } from 'react';
import { API } from '../utils/helper';

const api = API();

export function GardenProviderWrapper({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Storage | null>(null);

  useEffect(() => {
    setStore(localStorage);
  }, []);

  if (!store) return null;
  return (
    <GardenProvider
      config={{
        orderBookUrl: api.orderbook,
        quoteUrl: api.quote,
        store: localStorage,
        environment: environment.testnet,
        bitcoinRPCUrl: api.mempool.testnet,
        blockNumberFetcherUrl: api.data.data,
      }}
    >
      {children}
    </GardenProvider>
  );
}
