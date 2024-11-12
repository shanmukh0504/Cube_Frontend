// //App.tsx
// import SwapComponent from "./components/SwapComponent";
// import TransactionsComponent from "./components/TransactionComponent";
// import "./styles/App.css";

// function App() {
//   return (
//     <div id="container">
//       <SwapComponent/>
//       <TransactionsComponent/>
//     </div>
//   );
// }

// export default App;

// //main.tsx
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
// import './styles/index.css'
// import { WagmiProvider } from 'wagmi';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { BitcoinNetwork, GardenProvider } from '@gardenfi/react-hooks';
// import { wagmiConfig } from './config/wagmi.ts';
// import { API } from './helpers/utils.ts';

// const queryClient = new QueryClient();
// const api = API();

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <WagmiProvider config={wagmiConfig}>
//       <QueryClientProvider client={queryClient}>
//         <GardenProvider
//           config={{
//             orderBookUrl: api.orderbook,
//             quoteUrl: api.quote,
//             store: localStorage,
//             network: BitcoinNetwork.Testnet,
//             bitcoinRPCUrl: api.mempool.testnet,
//             blockNumberFetcherUrl: api.data.data,
//           }}
//         >
//           <App />
//         </GardenProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   </React.StrictMode>,
// )

// //components/SwapComponent.tsx
// import { useState } from "react";
// import { useAccount } from 'wagmi';
// import {
//   Asset,
//   SupportedAssets
// } from '@gardenfi/orderbook';
// import '../styles/App.css';
// import { useGarden } from "@gardenfi/react-hooks";
// import { useEVMWallet } from "../hooks/useEVMWallet";
// import { WalletConnect } from "./WalletConnect";

// type SwapAndAddressComponentProps = {
//   swapParams: {
//     inputToken: Asset;
//     outputToken: Asset;
//     inputAmount: number;
//     outputAmount: number;
//     btcAddress: string;
//   },
// };

// type SwapAmountComponentProps = {
//   inAmount: string;
//   outAmount: string;
//   changeAmount: (value: string) => void;
// };

// const SwapComponent: React.FC = () => {
//   const [swapParams, setSwapParams] = useState({
//     inputToken: SupportedAssets.testnet.ethereum_sepolia_0x3c6a17b8cd92976d1d91e491c93c98cd81998265,
//     outputToken: SupportedAssets.testnet.bitcoin_testnet_primary,
//     inputAmount: 0.1,
//     outputAmount: 0.098,
//     btcAddress: '',
// });

//   const handleInputChange = (value: string) => {
//     const amount = Number(value);
//     //you should ideally get the quote from getQuote method, but for now we are just using a simple formula as the quote is static
//     const outputAmount = amount * 0.997;
//     setSwapParams({
//       ...swapParams,
//       inputAmount: amount,
//       outputAmount: outputAmount,
//     });
//   };

//   return (
//     <div className="swap-component">
//       <WalletConnect />
//       <hr></hr>
//       <SwapAmount inAmount={swapParams.inputAmount.toString()} outAmount={swapParams.outputAmount.toString()} changeAmount={handleInputChange} />
//       <hr></hr>
//       <Swap swapParams={swapParams} />
//     </div>
//   );
// };

// const SwapAmount: React.FC<SwapAmountComponentProps> = ({
//   inAmount,
//   outAmount,
//   changeAmount,
// }) => {

//   return (
//     <div className="swap-component-middle-section">
//       <InputField
//         id="wbtc"
//         label="Send WBTC"
//         value={inAmount}
//         onChange={(value) => changeAmount(value)}
//       />
//       <InputField id="btc" label="Receive BTC" value={outAmount} readOnly />
//     </div>
//   );
// };

// type InputFieldProps = {
//   id: string;
//   label: string;
//   value: string | null;
//   readOnly?: boolean;
//   onChange?: (value: string) => void;
// };

// const InputField: React.FC<InputFieldProps> = ({
//   id,
//   label,
//   value,
//   readOnly,
//   onChange,
// }) => (
//   <div>
//     <label htmlFor={id}>{label}</label>
//     <div className="input-component">
//       <input
//         id={id}
//         placeholder="0"
//         value={value ? value : ""}
//         type="number"
//         readOnly={readOnly}
//         onChange={(e) => onChange && onChange(e.target.value)}
//       />
//       <button>{id.toUpperCase()}</button>
//     </div>
//   </div>
// );

// const Swap: React.FC<SwapAndAddressComponentProps> = ({
//   swapParams,
// }) => {
//   const { address: EvmAddress } = useAccount();
//   const [loading, setLoading] = useState(false);
//   const { initializeSecretManager, swapAndInitiate , getQuote } = useGarden();
//   const [btcAddress, setBtcAddress] = useState<string>();
//   const { isConnected } = useEVMWallet();

//   const handleSwap = async () => {
//     const sendAmount =
//       swapParams.inputAmount * 10 ** swapParams.inputToken.decimals;

//     if (!initializeSecretManager) return;
//     const smRes = await initializeSecretManager();

//     if (
//       !smRes.ok ||
//       !swapAndInitiate ||
//       !EvmAddress ||
//       !swapParams.inputAmount ||
//       !swapParams.outputAmount ||
//       !smRes.val.getMasterPrivKey() ||
//       !getQuote ||
//       !btcAddress
//     )
//       return;

//     setLoading(true);

//     const quote = await getQuote({
//       fromAsset: swapParams.inputToken,
//       toAsset: swapParams.outputToken,
//       amount: sendAmount
//     });

//     if (quote.error) {
//       alert(quote.error);
//       return;
//     }

//     const [_strategy, quoteAmount] = Object.entries(quote.val.quotes)[0];

//     const res = await swapAndInitiate({
//       fromAsset: swapParams.inputToken,
//       toAsset: swapParams.outputToken,
//       sendAmount: sendAmount.toString(),
//       receiveAmount: quoteAmount.toString(),
//       additionalData: {
//         btcAddress,
//         strategyId: _strategy,
//       },
//     });

//     setLoading(false);

//     if (res.error) {
//       alert(res.error);
//       return
//     }

//     console.log(res.ok);
//     console.log(res.val);
//   };

//   return (
//     <div className="swap-component-bottom-section">
//       <div>
//         <label htmlFor="receive-address">Receive address</label>
//         <div className="input-component">
//           <input
//             id="receive-address"
//             placeholder="Enter BTC Address"
//             value={btcAddress ? btcAddress : ""}
//             onChange={(e) => setBtcAddress(e.target.value)}
//           />
//         </div>
//       </div>
//       <button
//         className={button-${!isConnected || loading ? "black" : "white"}}
//         onClick={handleSwap}
//         disabled={!isConnected || loading}
//       >
//         {loading ? "Processing..."  : "Swap"}
//       </button>
//     </div>
//   );
// };

// export default SwapComponent;

// //components/TransactionComponent.tsx
// import { useCallback, useEffect, useState } from "react";
// import { formatUnits } from "ethers";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import axios from "axios";
// import { faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
// import { Chain, MatchedOrder } from "@gardenfi/orderbook";
// import { OrderStatus } from "@gardenfi/core";
// import { useGarden } from "@gardenfi/react-hooks";
// import { API, parseStatus } from "../helpers/utils";

// function TransactionsComponent() {
//   const { garden, orderBook } = useGarden();
//   const [orders, setOrders] = useState<MatchedOrder[]>([]);
//   const [blockNumbers, setBlockNumbers] = useState<Record<Chain, number> | null>(null);

//   const fetchOrders = useCallback(async () => {
//     if (!orderBook) return;
//     const res = await orderBook.fetchOrders(true, false, {
//       per_page: 4,
//     });
//     setOrders(res.val.data);
//   }, [orderBook]);

//   useEffect(() => {
//     fetchOrders(); // Initial fetch

//     const intervalId = setInterval(fetchOrders, 10000); // Poll every 10 seconds

//     return () => clearInterval(intervalId); // Cleanup on unmount
//   }, [fetchOrders]);

//   useEffect(() => {
//     if (!orderBook) return;
//     const fetchBlockNumbers = async () => {
//       const res = await axios.get<{
//         [key in Chain]: number;
//       }>(API().data.blockNumbers("testnet"));

//       setBlockNumbers(res.data);
//     };

//     fetchBlockNumbers();
//   }, [garden, orderBook]);

//   return (
//     <div className="transaction-component">
//       {orders.map((order) => (
//         <OrderComponent order={order} status={parseStatus(order, blockNumbers)} key={order.created_at} />
//       ))}
//     </div>
//   );
// }

// type Order = {
//   order: MatchedOrder;
//   status?: OrderStatus;
// };

// const OrderComponent: React.FC<Order> = ({ order, status }) => {
//   const [modelIsVisible, setModelIsVisible] = useState(false);
//   const [isInitiating, setIsInitiating] = useState(false);

//   const { evmInitiate } = useGarden();

//   const handleInitiate = async () => {
//     if (!evmInitiate) return;
//     setIsInitiating(true);
//     const res = await evmInitiate(order);
//     if (res.ok) {
//       console.log("Initiated");
//       status = OrderStatus.InitiateDetected;
//     } else {
//       alert("Failed to initiate");
//     }
//     setIsInitiating(false);
//   };
  
//   const {
//     source_swap,
//     destination_swap,
//   } = order;
  
//   const wbtcAmount = formatUnits(source_swap.amount, 8);
//   const btcAmount = formatUnits(destination_swap.amount, 8);
  
//   const userFriendlyStatus = status && getUserFriendlyStatus(status);
  
//   const toggleModelVisible = () => setModelIsVisible((pre) => !pre);

//   const txFromBtcToWBTC =
//     order.source_swap.asset.toLowerCase() === "btc";

//   const fromLabel = txFromBtcToWBTC ? "BTC" : "WBTC";
//   const toLabel = txFromBtcToWBTC ? "WBTC" : "BTC";

//   return (
//     <div className="order">
//       <div className="order-id">
//         <div>
//           Order Id <span>{source_swap.swap_id.slice(0,4)}...</span>
//         </div>
//         <span className="enlarge">
//           <FontAwesomeIcon
//             icon={faUpRightAndDownLeftFromCenter}
//             style={{ color: "#ffffff" }}
//             onClick={toggleModelVisible}
//           />
//         </span>
//       </div>
//       <div className="amount-and-status">
//         <div className="amount-label">{fromLabel}</div>
//         <div className="amount-label">{toLabel}</div>
//         <div className="status-label">Status</div>
//         <div className="amount">{wbtcAmount}</div>
//         <div className="amount">{btcAmount}</div>
//         {  userFriendlyStatus === StatusLabel.Initiate ? (
//           <button
//             className={button-${isInitiating ? "black" : "white"}}
//             disabled={isInitiating}
//             onClick={handleInitiate}
//           >
//             {isInitiating ? "Initiating..." : "Initiate"}
//           </button>
//         ) : (
//           <div className="status">
//             <span>{userFriendlyStatus}</span>
//           </div>
//         )}
//       </div>
//       {modelIsVisible && (
//         <OrderPopUp
//           order={order}
//           toggleModelVisible={toggleModelVisible}
//           fromLabel={fromLabel}
//           toLabel={toLabel}
//         />
//       )}
//     </div>
//   );
// };

// enum StatusLabel {
//   Completed = "Completed",
//   Pending = "In progress...",
//   Expired = "Expired",
//   Initiate = "Awaiting initiate",
// }

// const getUserFriendlyStatus = (status: OrderStatus) => {
//   switch (status) {
//     case OrderStatus.Redeemed:
//     case OrderStatus.Refunded:
//     case OrderStatus.CounterPartyRedeemed:
//     case OrderStatus.CounterPartyRedeemDetected:
//       return StatusLabel.Completed;
//     case OrderStatus.Matched:
//       return StatusLabel.Initiate;
//     case OrderStatus.DeadLineExceeded:
//       return StatusLabel.Expired;
//     default:
//       return StatusLabel.Pending;
//   }
// };

// function getFormattedDate(CreatedAt: string): string {
//   const date = new Date(CreatedAt);

//   const formattedDate = new Intl.DateTimeFormat("en-GB", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   }).format(date);

//   const formattedTime = date
//     .toLocaleTimeString("en-GB", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     })
//     .replace(":", " : ");

//   return ${formattedDate} | ${formattedTime};
// }

// type PopUp = {
//   order: MatchedOrder;
//   toggleModelVisible: () => void;
//   fromLabel: string;
//   toLabel: string;
// };

// const OrderPopUp: React.FC<PopUp> = ({
//   order,
//   toggleModelVisible,
//   fromLabel,
//   toLabel,
// }) => {
//   const {
//     destination_swap: { redeemer: to, amount: toAmount, redeem_tx_hash, },
//     created_at,
//     source_swap: {
//       initiator: from,
//       amount: fromAmount,
//       initiate_tx_hash,
//       refund_tx_hash,
//       swap_id,
//     },
//   } = order;

//   const formattedDate = getFormattedDate(created_at);

//   return (
//     <div className="pop-up-container" onClick={toggleModelVisible}>
//       <div className="pop-up" onClick={(e) => e.stopPropagation()}>
//         <span>
//           <span className="pop-up-label">Created At</span>
//           <span className="pop-up-value">{formattedDate}</span>
//         </span>
//         <span>
//           <span className="pop-up-label">Order Id</span>
//           <span className="pop-up-value">{swap_id}</span>
//         </span>
//         <span>
//           <span className="pop-up-label">From</span>
//           <span className="pop-up-value">{from}</span>
//         </span>
//         <span>
//           <span className="pop-up-label">To</span>
//           <span className="pop-up-value">{to}</span>
//         </span>
//         <span>
//           <span className="pop-up-label">{fromLabel}</span>
//           <span className="pop-up-value">{Number(fromAmount) / 1e8}</span>
//         </span>
//         <span>
//           <span className="pop-up-label">{toLabel}</span>
//           <span className="pop-up-value">{Number(toAmount) / 1e8}</span>
//         </span>
//         {initiate_tx_hash && (
//           <span>
//             <span className="pop-up-label">Initiate txHash</span>
//             <span className="pop-up-value">{initiate_tx_hash}</span>
//           </span>
//         )}
//         {redeem_tx_hash && (
//           <span>
//             <span className="pop-up-label">Redeem txHash</span>
//             <span className="pop-up-value">{redeem_tx_hash}</span>
//           </span>
//         )}
//         {refund_tx_hash && (
//           <span>
//             <span className="pop-up-label">Refund txHash</span>
//             <span className="pop-up-value">{refund_tx_hash}</span>
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TransactionsComponent;

// //components/WalletConnect.tsx
// import { Connector } from "wagmi";
// import { useEVMWallet } from "../hooks/useEVMWallet";
// import { WalletClient } from "viem";
// import { getWalletClient } from "wagmi/actions";
// import { wagmiConfig } from "../config/wagmi";

// type MetaMaskButtonProps = {
//     isConnected: boolean;
//     onClick: () => void;
// };

// const MetaMaskButton: React.FC<MetaMaskButtonProps> = ({
//     isConnected,
//     onClick,
// }) => {
//     const buttonClass = connect-metamask button-${isConnected ? "black" : "white"
//         };
//     const buttonText = isConnected ? "Connected" : "Connect Metamask";

//     return (
//         <button className={buttonClass} onClick={onClick}>
//             {buttonText}
//         </button>
//     );
// };

// export const WalletConnect: React.FC = () => {
//     const { connectors, isConnected } = useEVMWallet();

//     const handleConnect = async (connectors: readonly Connector[]) => {
//         try {
//             // Filter connectors to support only MetaMask or injected wallets
//             const supportedConnectors = connectors.filter(connector =>
//                 connector.name === 'MetaMask' || connector.isInjected
//             );

//             for (const connector of supportedConnectors) {
//                 await connector.connect();
//                 const walletClient: WalletClient = await getWalletClient(wagmiConfig, {
//                     connector: connector,
//                 });
//                 if (!walletClient?.account) continue;
//             }
//         } catch (error) {
//             console.warn("error :", error);
//         } finally {
//             console.log("finally");
//         }
//     };

//     return (
//         <div className="swap-component-top-section">
//             <span className="swap-title">Swap</span>
//             <MetaMaskButton
//                 isConnected={isConnected}
//                 onClick={() => handleConnect(connectors)}
//             />
//         </div>
//     );
// };

// //config/wagmi.ts
// import { createConfig, http } from 'wagmi';
// import { arbitrum, arbitrumSepolia, mainnet, sepolia } from 'wagmi/chains';
// import { injected, metaMask, safe } from 'wagmi/connectors';

// const SupportedChains = [
//     mainnet,
//     arbitrum,
//     sepolia,
//     arbitrumSepolia,
// ] as const;

// export const wagmiConfig = createConfig({
//     chains: SupportedChains,
//     connectors: [injected(), metaMask(), safe()],
//     multiInjectedProviderDiscovery: true,
//     cacheTime: 10_000,
//     transports: {
//         [mainnet.id]: http(),
//         [arbitrum.id]: http(),
//         [sepolia.id]: http(),
//         [arbitrumSepolia.id]: http(),
//     },
// });

// //helper/utils.ts
// import { ParseOrderStatus } from "@gardenfi/core";
// import { Chain, MatchedOrder } from "@gardenfi/orderbook";

// const GARDEN_TESTNET_CONFIG = {
//     DATA_URL: "https://prod-mainnet-virtual-balance-pr-5.onrender.com",
//     ORDERBOOK_URL: "https://evm-swapper-relay.onrender.com",
//     QUOTE_URL: "https://quote-knrp.onrender.com",
// } as const;

// const GARDEN_MAINNET_CONFIG = {
//     DATA_URL: "https://dummy.fi",
//     ORDERBOOK_URL: "https://dummy.fi",
//     QUOTE_URL: "https://dummy.fi",
// } as const;

// const isTestnet = true;

// const GARDEN_CONFIG = isTestnet ? GARDEN_TESTNET_CONFIG : GARDEN_MAINNET_CONFIG;

// export const API = () => {
//     Object.entries(GARDEN_CONFIG).forEach(([key, value]) => {
//         if (!value) throw new Error(Missing ${key} in env);
//     });

//     return {
//         home: "https://garden.finance",
//         data: {
//             data: GARDEN_CONFIG.DATA_URL,
//             assets: GARDEN_CONFIG.DATA_URL + "/assets",
//             blockNumbers: (network: "mainnet" | "testnet") =>
//                 GARDEN_CONFIG.DATA_URL + "/blocknumber/" + network,
//         },
//         orderbook: GARDEN_CONFIG.ORDERBOOK_URL,
//         quote: GARDEN_CONFIG.QUOTE_URL,
//         mempool: {
//             testnet: "https://mempool.space/testnet4/api",
//             mainnet: "https://mempool.space/api",
//         },
//     };
// };

// export const parseStatus = (order: MatchedOrder, blockNumbers: Record<Chain, number> | null) => {

//     if (!blockNumbers) return;
//     const { source_swap, destination_swap } = order;
//     const sourceBlockNumber = blockNumbers[source_swap.chain];
//     const destinationBlockNumber = blockNumbers[destination_swap.chain];
//     if (!sourceBlockNumber || !destinationBlockNumber) return;

//     return ParseOrderStatus(order, sourceBlockNumber, destinationBlockNumber);
// };

// //hooks/useEVMWallet.tsx
// import { useAccount, useConnect, useDisconnect, useWalletClient } from "wagmi";

// export const useEVMWallet = () => {
//     const { data: walletClient } = useWalletClient();
//     const { address, isConnected } = useAccount();
//     const { disconnect } = useDisconnect();
//     const { status, connectors, isPending, connectAsync } = useConnect();

//     return {
//         walletClient,
//         address,
//         connectors,
//         isPending,
//         isConnected,
//         status,
//         disconnect,
//         connectAsync,
//     };
// };

// PLEASE ANALYZE THE ABOVE CODE 

























// "use client";

// import { config } from "@/wagmi";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { type ReactNode, useState } from "react";
// import { type State, WagmiProvider } from "wagmi";

// export function Providers(props: {
//     children: ReactNode;
//     initialState?: State;
// }) {
//     const [queryClient] = useState(() => new QueryClient());

//     return (
//         <WagmiProvider config={config} initialState={props.initialState}>
//             <QueryClientProvider client={queryClient}>
//                 {props.children}
//             </QueryClientProvider>
//         </WagmiProvider>
//     );
// }
// src/app/providers.tsx
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

















// Now, I'll give you another project's code

// //src/app/layout.tsx
// import "./globals.css";
// import type { Metadata } from "next";
// import { Roboto, Poppins } from "next/font/google";
// import { headers } from "next/headers";
// import { type ReactNode } from "react";
// import { cookieToInitialState } from "wagmi";

// import { Providers } from "./providers";
// import WalletNavbar from "@/wallet/WalletNavbar";
// import { config } from "@/wagmi";

// const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });
// const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

// export const metadata: Metadata = {
//     title: "Cube Token",
//     description: "Cube Token",
// };

// export default async function RootLayout(props: { children: ReactNode }) {
//     const initialState = cookieToInitialState(config, (await headers()).get("cookie"));
    
//     return (
//         <html lang="en">
//             <body className={${roboto.className} w-screen overflow-x-hidden}>
//                 <Providers initialState={initialState}>
//                     <WalletNavbar />
//                     <main className={poppins.className}>
//                         {props.children}
//                     </main>
//                 </Providers>
//             </body>
//         </html>
//     );
// }

// //src/app/page.tsx
// "use client";

// import { WalletOptions } from "@/wallet/WalletOptions";
// import { useAccount } from "wagmi";
// import TokenInteractions from "@/components/TokenInteractions";

// function App() {
//     const { isConnected, address } = useAccount();
//     return (
//         <div className=" min-h-screen flex flex-col items-center ">
//             {isConnected && address ? (
//                 <TokenInteractions address={address} />
//             ) : (
//                 <div className="min-h-screen flex flex-col items-center justify-center">
//                     <WalletOptions />
//                 </div>
//             )}
//         </div>
//     );
// }

// export default App;

// //src/app/providers.tsx
// "use client";

// import { config } from "@/wagmi";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { type ReactNode, useState } from "react";
// import { type State, WagmiProvider } from "wagmi";

// export function Providers(props: {
//     children: ReactNode;
//     initialState?: State;
// }) {
//     const [queryClient] = useState(() => new QueryClient());

//     return (
//         <WagmiProvider config={config} initialState={props.initialState}>
//             <QueryClientProvider client={queryClient}>
//                 {props.children}
//             </QueryClientProvider>
//         </WagmiProvider>
//     );
// }

// //components/AddressBalance.tsx
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { formatEther } from "viem";
// import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
// import { Input } from "@/ui/input";
// import { Button } from "@/ui/button";
// import { Abi, CONTRACT_ADDRESS } from "@/Abi";
// import { publicClient } from "@/client";
// import { buttonVariants, cardVariants } from "@/utils/animations";

// const AddressBalance = () => {
//   const [address, setAddress] = useState("");
//   const [inputError, setInputError] = useState("");
//   const [data, setData] = useState<bigint | null>(null);

//   const fetchTokenBalance = async () => {
//     try {
//       const data = await publicClient.readContract({
//         address: CONTRACT_ADDRESS,
//         abi: Abi,
//         functionName: "balanceOf",
//         args: [address as 0x${string}],
//       });
//       setData(data as bigint);
//     } catch (error) {
//       setInputError("Error fetching balance. Please verify the address.");
//     }
//   };

//   const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setAddress(value);

//     if (value && (!value.startsWith("0x") || value.length !== 42)) {
//       setInputError("Invalid Ethereum address. Must be 42 characters (0x...)");
//     } else {
//       setInputError("");
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!inputError) fetchTokenBalance();
//   };

//   return (
//     <motion.div variants={cardVariants} initial="hidden" animate="visible">
//       <Card className="w-full">
//         <CardHeader>
//           <CardTitle>Token Balance Checker</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Input
//               placeholder="Enter Ethereum address (0x...)"
//               value={address}
//               onChange={handleAddressChange}
//               className={inputError ? "border-red-500" : ""}
//             />
//             {inputError && (
//               <p className="text-sm text-red-500">{inputError}</p>
//             )}
//             <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
//               <Button type="submit" disabled={Boolean(inputError) || !address} className="w-full">
//                 Check Balance
//               </Button>
//             </motion.div>
//           </form>

//           {data && (
//             <div className="text-center text-lg font-medium">
//               Balance: {formatEther(data)} CBT
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

// export default AddressBalance;

// //components/Approve.tsx
// import React from "react";
// import { motion } from "framer-motion";
// import { useWriteContract, useWaitForTransactionReceipt, type BaseError } from "wagmi";
// import { parseEther } from "viem";
// import { Abi, CONTRACT_ADDRESS } from "@/Abi";
// import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
// import { Input } from "@/ui/input";
// import { Button } from "@/ui/button";
// import { buttonVariants, cardVariants } from "../utils/animations";

// export function Approve() {
//   const { data: hash, error, isPending, writeContract } = useWriteContract();
//   const { isLoading: isConfirming, isSuccess: isConfirmed } =
//     useWaitForTransactionReceipt({ hash });

//   const submit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.target as HTMLFormElement);
//     const spender = formData.get("spender") as 0x${string};
//     const amount = formData.get("amount") as string;
//     const amountInEther = parseFloat(amount) / Math.pow(10, 18);

//     writeContract({
//       address: CONTRACT_ADDRESS,
//       abi: Abi,
//       functionName: "approve",
//       args: [spender, parseEther(amountInEther.toFixed(18))],
//     });
//   };

//   return (
//     <motion.div variants={cardVariants} initial="hidden" animate="visible">
//       <Card className="overflow-hidden">
//         <CardHeader>
//           <CardTitle>Approve Spender</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={submit} className="space-y-4">
//             <Input name="spender" placeholder="Spender Address (0x...)" required />
//             <Input name="amount" placeholder="Amount" type="number" step="0.000001" required />

//             <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
//               <Button disabled={isPending} type="submit" className="w-full">
//                 {isPending ? "Confirming..." : "Approve"}
//               </Button>
//             </motion.div>

//             {hash && <div className="text-xs">Transaction Hash: {hash}</div>}
//             {isConfirming && <div className="text-sm">Waiting for confirmation...</div>}
//             {isConfirmed && <div className="text-sm text-green-600">Transaction confirmed.</div>}
//             {error && (
//               <div className="text-sm text-red-600">
//                 Error: {(error as BaseError).shortMessage || error.message}
//               </div>
//             )}
//           </form>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }

// //components/Burn.tsx
// import * as React from "react";
// import { motion } from "framer-motion";
// import {
//   useWriteContract,
//   useWaitForTransactionReceipt,
//   type BaseError,
// } from "wagmi";
// import { parseEther } from "viem";
// import { Abi, CONTRACT_ADDRESS } from "@/Abi";
// import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
// import { Input } from "@/ui/input";
// import { Button } from "@/ui/button";
// import { buttonVariants, cardVariants } from "../utils/animations";

// export function Burn() {
//   const { data: hash, error, isPending, writeContract } = useWriteContract();
//   const { isLoading: isConfirming, isSuccess: isConfirmed } =
//     useWaitForTransactionReceipt({ hash });

//   async function submit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     const formData = new FormData(e.target as HTMLFormElement);
//     const amount = formData.get("amount") as string;
//     const amountInEtherStr = (parseFloat(amount) / 1e18).toFixed(18);

//     writeContract({
//       address: CONTRACT_ADDRESS,
//       abi: Abi,
//       functionName: "burn",
//       args: [parseEther(amountInEtherStr)],
//     });
//   }

//   return (
//     <motion.div variants={cardVariants} initial="hidden" animate="visible">
//       <Card className="overflow-hidden">
//         <CardHeader>
//           <CardTitle>Burn Tokens</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={submit} className="space-y-4">
//             <Input
//               name="amount"
//               placeholder="Amount"
//               type="number"
//               step="0.000001"
//               required
//             />
//             <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
//               <Button disabled={isPending} type="submit" variant="destructive" className="w-full">
//                 {isPending ? "Confirming..." : "Burn"}
//               </Button>
//             </motion.div>
//             {hash && <div className="text-xs">Transaction Hash: {hash}</div>}
//             {isConfirming && <div className="text-sm">Waiting for confirmation...</div>}
//             {isConfirmed && (
//               <div className="text-sm text-green-600">Transaction confirmed.</div>
//             )}
//             {error && (
//               <div className="text-sm text-red-600">
//                 Error: {(error as BaseError).shortMessage || error.message}
//               </div>
//             )}
//           </form>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }

// //components/Mint.tsx
// import * as React from "react";
// import { motion } from "framer-motion";
// import {
//   useWriteContract,
//   useWaitForTransactionReceipt,
//   type BaseError,
// } from "wagmi";
// import { parseEther } from "viem";
// import { Abi, CONTRACT_ADDRESS } from "@/Abi";
// import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
// import { Input } from "@/ui/input";
// import { Button } from "@/ui/button";
// import { buttonVariants, cardVariants } from "../utils/animations";

// export function Mint() {
//   const { data: hash, error, isPending, writeContract } = useWriteContract();
//   const { isLoading: isConfirming, isSuccess: isConfirmed } =
//     useWaitForTransactionReceipt({ hash });

//   async function submit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     const formData = new FormData(e.target as HTMLFormElement);
//     const amount = formData.get("amount") as string;
//     const amountInEtherStr = (parseFloat(amount) / 1e18).toFixed(18);

//     writeContract({
//       address: CONTRACT_ADDRESS,
//       abi: Abi,
//       functionName: "mint",
//       args: [parseEther(amountInEtherStr)],
//     });
//   }

//   return (
//     <motion.div variants={cardVariants} initial="hidden" animate="visible">
//       <Card className="overflow-hidden">
//         <CardHeader>
//           <CardTitle>Mint Tokens</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={submit} className="space-y-4">
//             <Input
//               name="amount"
//               placeholder="Amount to Mint"
//               type="number"
//               step="0.000001"
//               required
//             />
//             <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
//               <Button disabled={isPending} type="submit" className="w-full">
//                 {isPending ? "Confirming..." : "Mint"}
//               </Button>
//             </motion.div>
//             {hash && <div className="text-xs">Transaction Hash: {hash}</div>}
//             {isConfirming && <div className="text-sm">Waiting for confirmation...</div>}
//             {isConfirmed && (
//               <div className="text-sm text-green-600">Transaction confirmed.</div>
//             )}
//             {error && (
//               <div className="text-sm text-red-600">
//                 Error: {(error as BaseError).shortMessage || error.message}
//               </div>
//             )}
//           </form>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }

// ......

// //components/TokenInteractions.tsx
// import { useState } from "react";
// import { ViewAllowance } from "./ViewAllowance";
// import { Approve } from "./Approve";
// import { Burn } from "./Burn";
// import { Mint } from "./Mint";
// import AddressBalance from "./AddressBalance";
// import { TokenState } from "./TokenState";
// import { TokenInfo } from "./TokenInfo";
// import { TransferFrom } from "./TransferFrom";
// import { Transfer } from "./Transfer";
// import { ViewBalance } from "./ViewBalance";
// import { TransactionHistory } from "./Transactions";

// interface TokenInteractionsProps {
//   address: 0x${string};
// }

// const TokenInteractions = ({ address }: TokenInteractionsProps) => {
//   const [activeTab, setActiveTab] = useState<string | null>(null);
//   const [activeComponent, setActiveComponent] = useState<React.ReactNode>(<TokenInfo />);

//   const handleTabClick = (component: React.ReactNode) => {
//     setActiveComponent(component);
//   };

//   return (
//     <div className="flex h-screen bg-background text-foreground">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-900 text-white p-4 flex flex-col space-y-4 fixed left-0 top-0 h-full">
//         <h1 className="text-2xl font-bold mb-6 text-white">Cube Token</h1>

//         {/* Sidebar Navigation Items */}
//         <div
//           onMouseEnter={() => setActiveTab("read")}
//           onMouseLeave={() => setActiveTab(null)}
//           className="text-gray-300"
//         >
//           <p className="cursor-pointer hover:bg-gray-700 p-2 rounded">
//             Read Contract
//           </p>
//           {activeTab === "read" && (
//             <div className="pl-4 mt-2 space-y-2">
//               <p className="cursor-pointer hover:underline" onClick={() => handleTabClick(<TokenInfo />)}>
//                 Token Info
//               </p>
//               <p className="cursor-pointer hover:underline" onClick={() => handleTabClick(<ViewBalance address={address} />)}>
//                 View Balance
//               </p>
//               <p className="cursor-pointer hover:underline" onClick={() => handleTabClick(<ViewAllowance />)}>
//                 View Allowance
//               </p>
//               <p className="cursor-pointer hover:underline" onClick={() => handleTabClick(<AddressBalance />)}>
//                 Address Balance
//               </p>
//             </div>
//           )}
//         </div>

//         <div
//           onMouseEnter={() => setActiveTab("txn")}
//           onMouseLeave={() => setActiveTab(null)}
//           className="text-gray-300"
//         >
//           <p className="cursor-pointer hover:bg-gray-700 p-2 rounded">
//             Transactions
//           </p>
//           {activeTab === "txn" && (
//             <div className="pl-4 mt-2 space-y-2">
//               <p className="cursor-pointer hover:underline" onClick={() => handleTabClick(<TransactionHistory refreshKey={true} />)}>
//                 Transaction History
//               </p>
//             </div>
//           )}
//         </div>

//         <div
//           onMouseEnter={() => setActiveTab("write")}
//           onMouseLeave={() => setActiveTab(null)}
//           className="text-gray-300"
//         >
//           <p className="cursor-pointer hover:bg-gray-700 p-2 rounded">
//             Write Contract
//           </p>
//           {activeTab === "write" && (
//             <div className="pl-4 mt-2 space-y-2">
//               <p className="cursor-pointer hover:underline" onClick={() => handleTabClick(<Transfer />)}>
//                 Transfer
//               </p>
//               <p className="cursor-pointer hover:underline" onClick={() => handleTabClick(<TransferFrom />)}>
//                 Transfer From
//               </p>
//               <p className="cursor-pointer hover:underline" onClick={() => handleTabClick(<Approve />)}>
//                 Approve
//               </p>
//               <p className="cursor-pointer hover:underline" onClick={() => handleTabClick(<Mint />)}>
//                 Mint
//               </p>
//               <p className="cursor-pointer hover:underline" onClick={() => handleTabClick(<TokenState />)}>
//                 Token State
//               </p>
//               <p className="cursor-pointer hover:underline" onClick={() => handleTabClick(<Burn />)}>
//                 Burn
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 pt-16 p-8 bg-background text-foreground">
//         <div className="max-w-4xl mx-auto p-10">{activeComponent}</div>
//       </div>
//     </div>
//   );
// };

// export default TokenInteractions;

// //wallet/WalletNavbar.tsx
// "use client";

// import { useState, useEffect } from "react";
// import {
//     useAccount,
//     useDisconnect,
//     useConnect,
//     useBalance,
//     useEnsName,
//     useEnsAvatar,
// } from "wagmi";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/ui/dropdown-menu";
// import { Button } from "@/ui/button";
// import { Wallet, ChevronDown, LogOut } from "lucide-react";
// import { type ReactNode } from "react";

// const WalletNavbar = () => {
//     const { address, isConnected, connector: activeConnector } = useAccount();
//     const { disconnect } = useDisconnect();
//     const { connect, connectors } = useConnect();
//     const [isClient, setIsClient] = useState(false);

//     const { data: ensName } = useEnsName({ address });
//     const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

//     const { data: balance } = useBalance({
//         address,
//     });

//     useEffect(() => {
//         setIsClient(true);
//     }, []);

//     if (!isClient) return null;

//     const formatAddress = (addr: string) => ${addr.substring(0, 6)}...${addr.substring(addr.length - 4)};
//     const displayName = ensName || (address ? formatAddress(address) : "");

//     const renderWalletSwitcherItems = (): ReactNode[] =>
//         connectors
//             .filter((connector) => connector.id !== activeConnector?.id)
//             .map((connector) => (
//                 <DropdownMenuItem
//                     key={connector.id}
//                     onClick={() => {
//                         disconnect();
//                         connect({ connector });
//                     }}
//                     className="cursor-pointer"
//                 >
//                     <Wallet className="w-4 h-4 mr-2" />
//                     {connector.name}
//                 </DropdownMenuItem>
//             ));

//     return (
//         <nav className="w-screen bg-gray-900 border-b border-gray-700 flex fixed top-0 z-50">
//             <div className="px-8 py-3 w-full">
//                 <div className="flex justify-between items-center">
//                     <div className="text-xl font-bold text-white">Cube Token</div>
//                     <div className="flex items-center gap-4 mx-4">
//                         {isConnected ? (
//                             <div className="flex items-center gap-2">
//                                 <DropdownMenu>
//                                     <DropdownMenuTrigger asChild>
//                                         <Button
//                                             variant="outline"
//                                             className="flex items-center gap-2 bg-gray-800 text-white border-gray-600"
//                                         >
//                                             {ensAvatar ? (
//                                                 <img
//                                                     src={ensAvatar}
//                                                     alt="ENS Avatar"
//                                                     className="w-5 h-5 rounded-full"
//                                                 />
//                                             ) : (
//                                                 <Wallet className="w-5 h-5" />
//                                             )}
//                                             {displayName}
//                                             <ChevronDown className="w-4 h-4" />
//                                         </Button>
//                                     </DropdownMenuTrigger>
//                                     <DropdownMenuContent
//                                         align="end"
//                                         className="w-56 bg-gray-800 text-white border border-gray-700"
//                                     >
//                                         <DropdownMenuLabel>
//                                             Connected with {activeConnector?.name}
//                                         </DropdownMenuLabel>
//                                         <DropdownMenuSeparator />
//                                         <DropdownMenuLabel>
//                                             {balance && (
//                                                 <span className="text-sm font-medium">
//                                                     {parseFloat(balance.formatted).toFixed(4)}{" "}
//                                                     {balance.symbol}
//                                                 </span>
//                                             )}
//                                         </DropdownMenuLabel>
//                                         <DropdownMenuSeparator />

//                                         {renderWalletSwitcherItems().length > 0 && (
//                                             <>
//                                                 <DropdownMenuLabel>Switch Wallet</DropdownMenuLabel>
//                                                 {renderWalletSwitcherItems()}
//                                                 <DropdownMenuSeparator />
//                                             </>
//                                         )}

//                                         <DropdownMenuItem
//                                             onClick={() => disconnect()}
//                                             className="text-red-600 cursor-pointer"
//                                         >
//                                             <LogOut className="w-4 h-4 mr-2" />
//                                             Disconnect
//                                         </DropdownMenuItem>
//                                     </DropdownMenuContent>
//                                 </DropdownMenu>
//                             </div>
//                         ) : (
//                             <Button variant="outline" className="flex items-center gap-2 bg-gray-800 text-white border-gray-600">
//                                 <Wallet className="w-4 h-4" />
//                                 Not Connected
//                             </Button>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default WalletNavbar;

// //wallet/WalletOptions.tsx
// import * as React from "react";
// import { Connector, useConnect } from "wagmi";
// import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
// import { Wallet } from "lucide-react";
// import { Button } from "@/ui/button";
// import { motion } from "framer-motion";
// import { cardVariants, buttonVariants } from "../utils/animations";

// export function WalletOptions() {
//     const { connectors, connect } = useConnect();

//     return (
//         <motion.div 
//             variants={cardVariants}
//             initial="hidden"
//             animate="visible"
//             className="max-w-3xl min-w-96 mx-auto mt-8"
//         >
//             <Card>
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <Wallet className="h-6 w-6" />
//                         Wallet Connection
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex flex-col space-y-4">
//                     {connectors.map((connector) => (
//                         <motion.div
//                             key={connector.id}
//                             variants={buttonVariants}
//                             whileHover="hover"
//                             whileTap="tap"
//                         >
//                             <Button onClick={() => connect({ connector })} className="w-full">
//                                 {connector.name}
//                             </Button>
//                         </motion.div>
//                     ))}
//                 </CardContent>
//             </Card>
//         </motion.div>
//     );
// }

// //Abi.ts
// export const Abi = [
//     {
//         name: "name",
//         type: "function",
//         stateMutability: "view",
//         inputs: [],
//         outputs: [{ type: "string" }],
//     },
//     {
//         name: "symbol",
//         type: "function",
//         stateMutability: "view",
//         inputs: [],
//         outputs: [{ type: "string" }],
//     },
//     {
//         name: "decimals",
//         type: "function",
//         stateMutability: "view",
//         inputs: [],
//         outputs: [{ type: "uint8" }],
//     },
//     {
//         name: "totalSupply",
//         type: "function",
//         stateMutability: "view",
//         inputs: [],
//         outputs: [{ type: "uint256" }],
//     },
//     {
//         name: "balanceOf",
//         type: "function",
//         stateMutability: "view",
//         inputs: [{ name: "account", type: "address" }],
//         outputs: [{ type: "uint256" }],
//     },
//     {
//         name: "allowance",
//         type: "function",
//         stateMutability: "view",
//         inputs: [
//             { name: "owner", type: "address" },
//             { name: "spender", type: "address" },
//         ],
//         outputs: [{ type: "uint256" }],
//     },
//     {
//         name: "owner",
//         type: "function",
//         stateMutability: "view",
//         inputs: [],
//         outputs: [{ type: "address" }],
//     },
//     {
//         name: "paused",
//         type: "function",
//         stateMutability: "view",
//         inputs: [],
//         outputs: [{ type: "bool" }],
//     },
//     {
//         name: "transfer",
//         type: "function",
//         stateMutability: "nonpayable",
//         inputs: [
//             { name: "to", type: "address" },
//             { name: "amount", type: "uint256" },
//         ],
//         outputs: [{ type: "bool" }],
//     },
//     {
//         name: "approve",
//         type: "function",
//         stateMutability: "nonpayable",
//         inputs: [
//             { name: "spender", type: "address" },
//             { name: "amount", type: "uint256" },
//         ],
//         outputs: [{ type: "bool" }],
//     },
//     {
//         name: "transferFrom",
//         type: "function",
//         stateMutability: "nonpayable",
//         inputs: [
//             { name: "from", type: "address" },
//             { name: "to", type: "address" },
//             { name: "amount", type: "uint256" },
//         ],
//         outputs: [{ type: "bool" }],
//     },
//     {
//         name: "mint",
//         type: "function",
//         stateMutability: "nonpayable",
//         inputs: [
//             { name: "amount", type: "uint256" },
//         ],
//         outputs: [{ type: "bool" }],
//     },
//     {
//         name: "burn",
//         type: "function",
//         stateMutability: "nonpayable",
//         inputs: [{ name: "amount", type: "uint256" }],
//         outputs: [{ type: "bool" }],
//     },
//     {
//         name: "pause",
//         type: "function",
//         stateMutability: "nonpayable",
//         inputs: [],
//         outputs: [],
//     },
//     {
//         name: "unpause",
//         type: "function",
//         stateMutability: "nonpayable",
//         inputs: [],
//         outputs: [],
//     },
// ] as const;

// export const CONTRACT_ADDRESS = process.env
//     .NEXT_PUBLIC_CONTRACT_ADDRESS as 0x${string};

// //wagmi.ts
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