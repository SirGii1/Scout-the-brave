"use client"

import { WalletButton } from "@/components/wallet-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/hooks/use-wallet"
import { ArrowRight, Shield, Zap, TrendingUp, Github, Twitter } from "lucide-react"

export default function HomePage() {
  const { connected } = useWallet()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SW</span>
            </div>
            <span className="font-semibold text-lg">SolanaWallet</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#security" className="text-muted-foreground hover:text-foreground transition-colors">
              Security
            </a>
            <a href="#support" className="text-muted-foreground hover:text-foreground transition-colors">
              Support
            </a>
          </nav>
          <WalletButton />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground px-3 py-1 rounded-full text-sm mb-6">
            <div className="h-2 w-2 bg-accent rounded-full animate-pulse"></div>
            Powered by Solana Network
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Solana Wallet for <span className="text-primary">Modern DeFi</span>
          </h1>

          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
            Connect your wallet, send tokens instantly, and manage all your Solana transactions in one secure,
            user-friendly platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {connected ? (
              <Button size="lg" className="gap-2" asChild>
                <a href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            ) : (
              <WalletButton />
            )}
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need for Solana</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for speed, security, and simplicity. Manage your digital assets with confidence on the Solana
              blockchain.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Send tokens in seconds with Solana's high-speed blockchain. Low fees, instant confirmations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Secure by Design</CardTitle>
                <CardDescription>
                  Your private keys never leave your device. Built with industry-leading security practices and audited
                  smart contracts.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-chart-1/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-chart-1" />
                </div>
                <CardTitle>Real-time Tracking</CardTitle>
                <CardDescription>
                  Monitor your portfolio, track transaction history, and get real-time updates on all your Solana
                  assets.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-2xl mx-auto border-primary/20 bg-primary/5">
            <CardContent className="pt-8">
              <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-muted-foreground mb-6">
                Connect your Solana wallet and start managing your digital assets today.
              </p>
              {!connected && <WalletButton />}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">SW</span>
                </div>
                <span className="font-semibold text-lg">SolanaWallet</span>
              </div>
              <p className="text-muted-foreground mb-4">
                The most user-friendly way to manage your Solana assets. Built with modern web technologies and security
                best practices.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 SolanaWallet. Built for the Solana ecosystem.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
