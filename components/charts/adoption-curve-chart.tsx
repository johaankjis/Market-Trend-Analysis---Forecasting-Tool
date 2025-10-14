"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AdoptionData {
  period: string
  adoptionRate: number
  projected?: number
}

export function AdoptionCurveChart() {
  const [data, setData] = useState<AdoptionData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        const response = await fetch("/api/data/market?type=adoption")
        const result = await response.json()

        if (result.success && result.data.adoption) {
          const adoptionData = result.data.adoption

          // Transform data and add S-curve projection
          const historical: AdoptionData[] = adoptionData.map((item: any) => ({
            period: new Date(item.timestamp).toLocaleDateString("en-US", { year: "numeric", month: "short" }),
            adoptionRate: item.value,
          }))

          // Generate S-curve projection
          const lastRate = historical[historical.length - 1]?.adoptionRate || 24.7
          const projected: AdoptionData[] = []

          for (let i = 1; i <= 12; i++) {
            const futureDate = new Date()
            futureDate.setMonth(futureDate.getMonth() + i)

            // S-curve formula: y = L / (1 + e^(-k(x-x0)))
            const L = 100 // Maximum adoption (100%)
            const k = 0.15 // Growth rate
            const x0 = 24 // Inflection point
            const x = lastRate + i * 3

            const projected_rate = L / (1 + Math.exp(-k * (x - x0)))

            projected.push({
              period: futureDate.toLocaleDateString("en-US", { year: "numeric", month: "short" }),
              projected: Math.min(projected_rate, 95), // Cap at 95%
            })
          }

          setData([...historical, ...projected])
        }
      } catch (error) {
        console.error("[v0] Failed to fetch adoption data:", error)
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
    adoptionRate: {
      label: "Adoption Rate",
      color: "hsl(var(--chart-3))",
    },
    projected: {
      label: "Projected",
      color: "hsl(var(--chart-5))",
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="adoptionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="period"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
          <Area
            type="monotone"
            dataKey="adoptionRate"
            stroke="hsl(var(--chart-3))"
            strokeWidth={2}
            fill="url(#adoptionGradient)"
            name="Historical"
          />
          <Area
            type="monotone"
            dataKey="projected"
            stroke="hsl(var(--chart-5))"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="url(#projectedGradient)"
            name="S-Curve Projection"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
