"use client"

import { useWallet } from "@/hooks/use-wallet"
import { WalletButton } from "@/components/wallet-button"
import { SendTokenForm } from "@/components/send-token-form"
import { BalanceCard } from "@/components/balance-card"
import { TransactionHistory } from "@/components/transaction-history"
import { QuickActions } from "@/components/quick-actions"
import { NetworkStatus } from "@/components/network-status"
import { PortfolioChart } from "@/components/portfolio-chart"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, Bell } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { connected } = useWallet()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SW</span>
              </div>
              <span className="font-semibold text-lg">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Network Status Bar */}
      <div className="container mx-auto px-4 py-2">
        <NetworkStatus />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {connected ? (
          <div className="space-y-8">
            {/* Top Row - Balance and Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BalanceCard />
              </div>
              <div>
                <QuickActions />
              </div>
            </div>

            {/* Middle Row - Portfolio Chart */}
            <div className="grid lg:grid-cols-1 gap-6">
              <PortfolioChart />
            </div>

            {/* Bottom Row - Send Form and Transaction History */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <TransactionHistory />
              </div>
              <div className="space-y-8" id="send-form">
                <SendTokenForm />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">SW</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
              <p className="text-muted-foreground mb-8">
                Please connect your Solana wallet to access your dashboard and start managing your digital assets.
              </p>
              <WalletButton />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
