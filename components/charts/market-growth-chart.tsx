"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface MarketData {
  period: string
  tam: number
  sam: number
}

export function MarketGrowthChart() {
  const [data, setData] = useState<MarketData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        const response = await fetch("/api/data/market")
        const result = await response.json()

        if (result.success) {
          // Transform market data for visualization
          const tamData = result.data.TAM || []
          const samData = result.data.SAM || []

          const combined: MarketData[] = []

          // Group by timestamp
          const timestamps = new Set([
            ...tamData.map((d: any) =>
              new Date(d.timestamp).toLocaleDateString("en-US", { year: "numeric", month: "short" }),
            ),
            ...samData.map((d: any) =>
              new Date(d.timestamp).toLocaleDateString("en-US", { year: "numeric", month: "short" }),
            ),
          ])

          timestamps.forEach((period) => {
            const tamItem = tamData.find(
              (d: any) =>
                new Date(d.timestamp).toLocaleDateString("en-US", { year: "numeric", month: "short" }) === period,
            )
            const samItem = samData.find(
              (d: any) =>
                new Date(d.timestamp).toLocaleDateString("en-US", { year: "numeric", month: "short" }) === period,
            )

            combined.push({
              period,
              tam: tamItem ? tamItem.value / 1e9 : 0, // Convert to billions
              sam: samItem ? samItem.value / 1e9 : 0,
            })
          })

          setData(combined.sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime()))
        }
      } catch (error) {
        console.error("[v0] Failed to fetch market data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground">Loading chart...</div>
  }

  const chartConfig = {
    tam: {
      label: "TAM",
      color: "hsl(var(--chart-1))",
    },
    sam: {
      label: "SAM",
      color: "hsl(var(--chart-4))",
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="period"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}B`}
          />
          <ChartTooltip content={<ChartTooltipContent formatter={(value) => `$${value}B`} />} />
          <Bar dataKey="tam" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="TAM" />
          <Bar dataKey="sam" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} name="SAM" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
