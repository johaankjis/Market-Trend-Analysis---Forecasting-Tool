"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { TimeRangeSelector } from "@/components/time-range-selector"
import { EngagementForecastChart } from "@/components/charts/engagement-forecast-chart"
import { RevenueTrendsChart } from "@/components/charts/revenue-trends-chart"
import { MarketGrowthChart } from "@/components/charts/market-growth-chart"
import { AdoptionCurveChart } from "@/components/charts/adoption-curve-chart"
import { Card } from "@/components/ui/card"
import type { AnalyticsSummary } from "@/lib/types"

export default function DashboardPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("90")

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true)
        const response = await fetch("/api/analytics/summary")
        const data = await response.json()
        if (data.success) {
          setSummary(data.summary)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch summary:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav />

      <main className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Market Trend Analysis</h1>
            <p className="mt-1 text-sm text-muted-foreground">Real-time forecasting and market intelligence platform</p>
          </div>
          <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} />
        </div>

        {/* KPI Cards */}
        <div className="mb-8">
          <DashboardHeader summary={summary || undefined} />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Engagement Forecast */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">Engagement Forecast</h3>
              <p className="text-sm text-muted-foreground">Predicted DAU for next {timeRange} days</p>
            </div>
            <EngagementForecastChart days={Number.parseInt(timeRange)} />
          </Card>

          {/* Revenue Trends */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">Revenue Trends</h3>
              <p className="text-sm text-muted-foreground">Historical and projected revenue</p>
            </div>
            <RevenueTrendsChart days={Number.parseInt(timeRange)} />
          </Card>

          {/* TAM/SAM Growth */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">TAM/SAM Growth Curves</h3>
              <p className="text-sm text-muted-foreground">Market sizing and opportunity analysis</p>
            </div>
            <MarketGrowthChart />
          </Card>

          {/* Adoption Curve */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">Feature Adoption Curve</h3>
              <p className="text-sm text-muted-foreground">S-curve modeling and penetration rate</p>
            </div>
            <AdoptionCurveChart />
          </Card>
        </div>

        {/* Model Performance */}
        <Card className="mt-6 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Model Performance Metrics</h3>
            <p className="text-sm text-muted-foreground">Forecasting accuracy and validation results</p>
          </div>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-accent/50" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-accent/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Prediction Accuracy</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{summary?.forecasting.accuracy}%</p>
                <p className="mt-1 text-xs text-muted-foreground">Target: ≥85%</p>
              </div>
              <div className="rounded-lg border border-border bg-accent/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Latency Improvement</p>
                <p className="mt-2 text-2xl font-bold text-chart-2">40%</p>
                <p className="mt-1 text-xs text-muted-foreground">Faster reporting vs baseline</p>
              </div>
              <div className="rounded-lg border border-border bg-accent/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Model Version</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{summary?.forecasting.modelVersion}</p>
                <p className="mt-1 text-xs text-muted-foreground">Last updated: Today</p>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
