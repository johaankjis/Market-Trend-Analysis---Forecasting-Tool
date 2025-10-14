"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface RevenueData {
  date: string
  revenue: number
  forecast?: number
}

export function RevenueTrendsChart({ days = 90 }: { days?: number }) {
  const [data, setData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch historical revenue data
        const engagementRes = await fetch(`/api/data/engagement?days=${days}&metric=revenue`)
        const engagementData = await engagementRes.json()

        // Fetch revenue forecast
        const forecastRes = await fetch(`/api/data/forecast?days=${days}&metric=revenue`)
        const forecastData = await forecastRes.json()

        const combined: RevenueData[] = []

        // Add historical data
        if (engagementData.success) {
          engagementData.data.forEach((item: any) => {
            combined.push({
              date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              revenue: item.value,
            })
          })
        }

        // Add forecast data
        if (forecastData.success && forecastData.data.revenue) {
          forecastData.data.revenue.forEach((item: any) => {
            combined.push({
              date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              forecast: item.predicted,
            })
          })
        }

        setData(combined)
      } catch (error) {
        console.error("[v0] Failed to fetch revenue data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [days])

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground">Loading chart...</div>
  }

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-2))",
    },
    forecast: {
      label: "Forecast",
      color: "hsl(var(--chart-5))",
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={false}
            name="Revenue"
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="hsl(var(--chart-5))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Forecast"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
