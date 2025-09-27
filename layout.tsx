import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { WalletProvider } from "@/hooks/use-wallet"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "SolanaWallet - Send Tokens & Manage Transactions",
  description: "Connect your Solana wallet to send tokens and manage transactions with ease",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <WalletProvider>{children}</WalletProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
