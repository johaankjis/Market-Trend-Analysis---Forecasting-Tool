"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ForecastData {
  date: string
  historical?: number
  predicted?: number
  lower?: number
  upper?: number
}

export function EngagementForecastChart({ days = 90 }: { days?: number }) {
  const [data, setData] = useState<ForecastData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch historical engagement data
        const engagementRes = await fetch(`/api/data/engagement?days=${days}&metric=DAU`)
        const engagementData = await engagementRes.json()

        // Fetch forecast data
        const forecastRes = await fetch(`/api/data/forecast?days=${days}&metric=DAU`)
        const forecastData = await forecastRes.json()

        // Combine historical and forecast data
        const combined: ForecastData[] = []

        // Add historical data
        if (engagementData.success) {
          engagementData.data.forEach((item: any) => {
            combined.push({
              date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              historical: item.value,
            })
          })
        }

        // Add forecast data
        if (forecastData.success && forecastData.data.DAU) {
          forecastData.data.DAU.forEach((item: any) => {
            combined.push({
              date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              predicted: item.predicted,
              lower: item.lower,
              upper: item.upper,
            })
          })
        }

        setData(combined)
      } catch (error) {
        console.error("[v0] Failed to fetch forecast data:", error)
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
    historical: {
      label: "Historical DAU",
      color: "hsl(var(--chart-1))",
    },
    predicted: {
      label: "Predicted DAU",
      color: "hsl(var(--chart-3))",
    },
    upper: {
      label: "Upper Bound",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="historicalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Area
            type="monotone"
            dataKey="historical"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            fill="url(#historicalGradient)"
            name="Historical"
          />
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="hsl(var(--chart-3))"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="url(#predictedGradient)"
            name="Forecast"
          />
          <Area
            type="monotone"
            dataKey="upper"
            stroke="hsl(var(--chart-2))"
            strokeWidth={1}
            strokeDasharray="2 2"
            fill="none"
            name="Confidence"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
