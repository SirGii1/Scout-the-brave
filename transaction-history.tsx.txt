"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/hooks/use-wallet"
import {
  getTransactionHistory,
  formatTransactionType,
  getTransactionTypeColor,
  type Transaction,
} from "@/lib/transactions"
import { History, ExternalLink, RefreshCw, ArrowUpRight, ArrowDownLeft, RotateCcw, Zap } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function TransactionHistory() {
  const { connected, publicKey } = useWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<"all" | "send" | "receive" | "swap">("all")

  useEffect(() => {
    if (connected && publicKey) {
      fetchTransactions()
    }
  }, [connected, publicKey])

  const fetchTransactions = async () => {
    if (!publicKey) return

    setIsLoading(true)
    try {
      const txHistory = await getTransactionHistory(publicKey)
      setTransactions(txHistory)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTransactions = transactions.filter((tx) => filter === "all" || tx.type === filter)

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-4 w-4" />
      case "receive":
        return <ArrowDownLeft className="h-4 w-4" />
      case "swap":
        return <RotateCcw className="h-4 w-4" />
      case "stake":
        return <Zap className="h-4 w-4" />
      default:
        return <History className="h-4 w-4" />
    }
  }

  const formatAddress = (address: string) => {
    if (!address) return "Unknown"
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <CardDescription>View your recent Solana transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Connect your wallet to view transaction history</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription>Your recent Solana blockchain activity</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchTransactions} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "send", "receive", "swap"] as const).map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterType)}
            >
              {filterType === "all" ? "All" : formatTransactionType(filterType)}
            </Button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.signature}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center ${getTransactionTypeColor(tx.type)}`}
                  >
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatTransactionType(tx.type)}</span>
                      <Badge
                        variant={
                          tx.status === "success" ? "default" : tx.status === "failed" ? "destructive" : "secondary"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                    </div>
                    {(tx.from || tx.to) && (
                      <div className="text-xs text-muted-foreground">
                        {tx.type === "send"
                          ? `To: ${formatAddress(tx.to || "")}`
                          : tx.type === "receive"
                            ? `From: ${formatAddress(tx.from || "")}`
                            : "Internal transaction"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-medium ${tx.type === "send" ? "text-destructive" : tx.type === "receive" ? "text-accent" : ""}`}
                  >
                    {tx.type === "send" ? "-" : tx.type === "receive" ? "+" : ""}
                    {tx.amount.toFixed(4)} {tx.token}
                  </div>
                  <div className="text-xs text-muted-foreground">Fee: {tx.fee.toFixed(6)} SOL</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 mt-1"
                    onClick={() =>
                      window.open(`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`, "_blank")
                    }
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredTransactions.length > 0 && (
          <div className="text-center pt-4">
            <Button variant="outline" size="sm">
              Load More Transactions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
