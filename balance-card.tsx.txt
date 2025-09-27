"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/hooks/use-wallet"
import { getBalance, getTokenAccounts } from "@/lib/solana"
import { Wallet, TrendingUp, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TokenBalance {
  symbol: string
  balance: number
  usdValue: number
  change24h: number
}

export function BalanceCard() {
  const { connected, publicKey } = useWallet()
  const [solBalance, setSolBalance] = useState<number>(0)
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hideBalances, setHideBalances] = useState(false)

  // Mock token prices and data
  const mockTokens: TokenBalance[] = [
    { symbol: "SOL", balance: solBalance, usdValue: solBalance * 98.5, change24h: 2.4 },
    { symbol: "USDC", balance: 100.0, usdValue: 100.0, change24h: 0.1 },
    { symbol: "RAY", balance: 50.0, usdValue: 50 * 1.85, change24h: -1.2 },
  ]

  const totalUsdValue = mockTokens.reduce((sum, token) => sum + token.usdValue, 0)

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalances()
    }
  }, [connected, publicKey])

  const fetchBalances = async () => {
    if (!publicKey) return

    setIsLoading(true)
    try {
      const balance = await getBalance(publicKey)
      setSolBalance(balance)

      // In a real app, you'd also fetch SPL token balances
      const tokens = await getTokenAccounts(publicKey)
      console.log("Token accounts:", tokens)
    } catch (error) {
      console.error("Error fetching balances:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatBalance = (balance: number) => {
    if (hideBalances) return "••••••"
    return balance.toFixed(4)
  }

  const formatUsdValue = (value: number) => {
    if (hideBalances) return "$••••••"
    return `$${value.toFixed(2)}`
  }

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Portfolio Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Connect your wallet to view balances</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Portfolio Balance
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setHideBalances(!hideBalances)}>
            {hideBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">{formatUsdValue(totalUsdValue)}</div>
          <div className="flex items-center justify-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="text-accent">+2.4% (24h)</span>
          </div>
        </div>

        <div className="space-y-4">
          {mockTokens.map((token) => (
            <div key={token.symbol} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-semibold text-sm">{token.symbol}</span>
                </div>
                <div>
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatBalance(token.balance)} {token.symbol}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatUsdValue(token.usdValue)}</div>
                <div className={`text-sm ${token.change24h >= 0 ? "text-accent" : "text-destructive"}`}>
                  {token.change24h >= 0 ? "+" : ""}
                  {token.change24h.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading balances...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
