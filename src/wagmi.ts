// import { http, cookieStorage, createConfig, createStorage } from "wagmi";
// import { sepolia } from "wagmi/chains";
// import {
//     coinbaseWallet,
//     metaMask,
//     walletConnect,
// } from "wagmi/connectors";

// export const config = createConfig({
//     chains: [sepolia],
//     connectors: [
//         coinbaseWallet(),
//         walletConnect({
//             projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID as string,
//         }),
//         metaMask(),
//     ],
//     storage: createStorage({
//         storage: cookieStorage,
//     }),
//     ssr: true,
//     transports: {
//         [sepolia.id]: http(),
//     },
// });

// src/wagmi.ts
import { createConfig, http } from 'wagmi';
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from 'wagmi/chains';
import { injected, metaMask, safe } from 'wagmi/connectors';

const SupportedChains = [
  mainnet,
  arbitrum,
  sepolia,
  arbitrumSepolia,
] as const;

export const wagmiConfig = createConfig({
  chains: SupportedChains,
  connectors: [injected(), metaMask(), safe()],
  multiInjectedProviderDiscovery: true,
  cacheTime: 10_000,
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [sepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});
