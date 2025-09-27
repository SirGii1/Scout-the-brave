"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { connection } from "@/lib/solana"
import { Activity, Wifi, WifiOff } from "lucide-react"

export function NetworkStatus() {
  const [isConnected, setIsConnected] = useState(true)
  const [blockHeight, setBlockHeight] = useState<number | null>(null)
  const [tps, setTps] = useState<number | null>(null)

  useEffect(() => {
    checkNetworkStatus()
    const interval = setInterval(checkNetworkStatus, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const checkNetworkStatus = async () => {
    try {
      const slot = await connection.getSlot()
      setBlockHeight(slot)
      setIsConnected(true)

      // Mock TPS data - in a real app, you'd fetch this from the RPC
      setTps(Math.floor(Math.random() * 3000) + 1000)
    } catch (error) {
      setIsConnected(false)
      console.error("Network status check failed:", error)
    }
  }

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConnected ? <Wifi className="h-4 w-4 text-accent" /> : <WifiOff className="h-4 w-4 text-destructive" />}
            <span className="text-sm font-medium">Solana Devnet</span>
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>

          {isConnected && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {blockHeight && (
                <div className="flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  <span>Block: {blockHeight.toLocaleString()}</span>
                </div>
              )}
              {tps && (
                <div>
                  <span>TPS: {tps.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
