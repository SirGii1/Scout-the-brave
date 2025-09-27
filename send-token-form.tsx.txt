"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet } from "@/hooks/use-wallet"
import { sendSOL } from "@/lib/solana"
import { Send, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TokenOption {
  symbol: string
  name: string
  balance: number
  mint?: string
}

export function SendTokenForm() {
  const { wallet, connected, publicKey } = useWallet()
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState<string>("SOL")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Mock token balances - in a real app, fetch from blockchain
  const tokens: TokenOption[] = [
    { symbol: "SOL", name: "Solana", balance: 2.5 },
    { symbol: "USDC", name: "USD Coin", balance: 100.0, mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
    { symbol: "RAY", name: "Raydium", balance: 50.0, mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R" },
  ]

  const selectedTokenData = tokens.find((t) => t.symbol === selectedToken)

  const handleSend = async () => {
    if (!connected || !wallet || !publicKey) {
      setError("Please connect your wallet first")
      return
    }

    if (!recipient || !amount) {
      setError("Please fill in all fields")
      return
    }

    if (Number.parseFloat(amount) <= 0) {
      setError("Amount must be greater than 0")
      return
    }

    if (selectedTokenData && Number.parseFloat(amount) > selectedTokenData.balance) {
      setError("Insufficient balance")
      return
    }

    try {
      setIsLoading(true)
      setError("")
      setSuccess("")

      if (selectedToken === "SOL") {
        const signature = await sendSOL(wallet, recipient, Number.parseFloat(amount))
        setSuccess(`Transaction sent! Signature: ${signature.slice(0, 8)}...`)
      } else {
        // For SPL tokens, you would use a different function
        setSuccess(`${selectedToken} transfer initiated (demo mode)`)
      }

      // Reset form
      setRecipient("")
      setAmount("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Tokens
          </CardTitle>
          <CardDescription>Connect your wallet to send tokens on Solana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Please connect your wallet to continue</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send Tokens
        </CardTitle>
        <CardDescription>Send SOL or SPL tokens to any Solana address</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-accent bg-accent/10">
            <CheckCircle className="h-4 w-4 text-accent" />
            <AlertDescription className="text-accent-foreground">{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="token">Token</Label>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger>
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              {tokens.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  <div className="flex items-center justify-between w-full">
                    <span>
                      {token.symbol} - {token.name}
                    </span>
                    <span className="text-muted-foreground ml-2">{token.balance.toFixed(2)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTokenData && (
            <p className="text-sm text-muted-foreground">
              Available: {selectedTokenData.balance.toFixed(4)} {selectedTokenData.symbol}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="Enter Solana wallet address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.000001"
              min="0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {selectedToken}
            </div>
          </div>
          {selectedTokenData && amount && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Network fee: ~0.000005 SOL</span>
              <span>
                Remaining: {(selectedTokenData.balance - Number.parseFloat(amount || "0")).toFixed(4)} {selectedToken}
              </span>
            </div>
          )}
        </div>

        <Button onClick={handleSend} disabled={isLoading || !recipient || !amount} className="w-full" size="lg">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send {selectedToken}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
