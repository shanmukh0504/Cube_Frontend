// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Roboto, Poppins } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import { cookieToInitialState } from "wagmi";
import { Providers } from "./providers";
import WalletNavbar from "@/wallet/WalletNavbar";
import { wagmiConfig } from "@/wagmi";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "Cube Token",
  description: "Cube Token",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const initialState = cookieToInitialState(wagmiConfig, (await headers()).get("cookie"));

  return (
    <html lang="en">
      <body className={`${roboto.className} w-screen overflow-hidden flex flex-col`}>
        <Providers initialState={initialState}>
          <WalletNavbar />
          <main
            className={`${poppins.className} flex-1 flex flex-col`}
            style={{
              height: "calc(100vh - 4rem)",
              paddingTop: "4rem",
              paddingBottom: "1rem",
              overflowY: "auto",
            }}
          >
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
