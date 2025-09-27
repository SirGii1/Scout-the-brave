"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { PublicKey } from "@solana/web3.js"
import type { WalletAdapter } from "@/lib/solana"

interface WalletContextType {
  wallet: WalletAdapter | null
  connected: boolean
  connecting: boolean
  publicKey: PublicKey | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | null>(null)

// Mock wallet adapter for demonstration
class MockWalletAdapter implements WalletAdapter {
  publicKey: PublicKey | null = null
  connected = false

  async connect(): Promise<void> {
    // In a real app, this would connect to Phantom, Solflare, etc.
    // For demo purposes, we'll simulate a connection
    this.publicKey = new PublicKey("11111111111111111111111111111112")
    this.connected = true
  }

  async disconnect(): Promise<void> {
    this.publicKey = null
    this.connected = false
  }

  async signTransaction(transaction: any): Promise<any> {
    // Mock signing - in real app this would use the actual wallet
    return transaction
  }

  async signAllTransactions(transactions: any[]): Promise<any[]> {
    return transactions
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet] = useState<WalletAdapter>(new MockWalletAdapter())
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)

  const connect = async () => {
    try {
      setConnecting(true)
      await wallet.connect()
      setConnected(wallet.connected)
      setPublicKey(wallet.publicKey)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = async () => {
    try {
      await wallet.disconnect()
      setConnected(false)
      setPublicKey(null)
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        connecting,
        publicKey,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
