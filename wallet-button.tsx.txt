"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { Wallet, LogOut } from "lucide-react"

export function WalletButton() {
  const { connected, connecting, publicKey, connect, disconnect } = useWallet()

  if (connected && publicKey) {
    return (
      <Button variant="outline" onClick={disconnect} className="gap-2 bg-transparent">
        <Wallet className="h-4 w-4" />
        {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
        <LogOut className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button onClick={connect} disabled={connecting} className="gap-2 bg-primary hover:bg-primary/90">
      <Wallet className="h-4 w-4" />
      {connecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
