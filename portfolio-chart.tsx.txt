"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

// Mock portfolio data
const portfolioData = [
  { date: "2025-01-20", value: 245.5 },
  { date: "2025-01-21", value: 251.2 },
  { date: "2025-01-22", value: 248.8 },
  { date: "2025-01-23", value: 267.4 },
  { date: "2025-01-24", value: 275.6 },
  { date: "2025-01-25", value: 289.3 },
  { date: "2025-01-26", value: 295.8 },
  { date: "2025-01-27", value: 312.45 },
]

export function PortfolioChart() {
  const currentValue = portfolioData[portfolioData.length - 1].value
  const previousValue = portfolioData[portfolioData.length - 2].value
  const change = ((currentValue - previousValue) / previousValue) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Portfolio Performance
        </CardTitle>
        <CardDescription>7-day portfolio value trend</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-2xl font-bold">${currentValue.toFixed(2)}</div>
          <div className={`text-sm flex items-center gap-1 ${change >= 0 ? "text-accent" : "text-destructive"}`}>
            <span>
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)}%
            </span>
            <span className="text-muted-foreground">vs yesterday</span>
          </div>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={portfolioData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <YAxis className="text-xs" tickFormatter={(value) => `$${value}`} />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Portfolio Value"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--accent))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
