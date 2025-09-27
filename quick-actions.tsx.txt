"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, QrCode, ArrowUpDown, Plus } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      icon: <Send className="h-5 w-5" />,
      label: "Send",
      description: "Send tokens",
      onClick: () => {
        // Scroll to send form
        document.getElementById("send-form")?.scrollIntoView({ behavior: "smooth" })
      },
    },
    {
      icon: <QrCode className="h-5 w-5" />,
      label: "Receive",
      description: "Show QR code",
      onClick: () => console.log("Show receive QR"),
    },
    {
      icon: <ArrowUpDown className="h-5 w-5" />,
      label: "Swap",
      description: "Exchange tokens",
      onClick: () => console.log("Open swap"),
    },
    {
      icon: <Plus className="h-5 w-5" />,
      label: "Buy",
      description: "Purchase crypto",
      onClick: () => console.log("Open buy"),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/50 bg-transparent"
              onClick={action.onClick}
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {action.icon}
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{action.label}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
