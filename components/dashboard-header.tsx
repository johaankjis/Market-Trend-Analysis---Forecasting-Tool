import type React from "react"
import { Activity, TrendingUp, Target, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string
  change?: string
  icon: React.ReactNode
  trend?: "up" | "down" | "neutral"
}

function MetricCard({ title, value, change, icon, trend = "neutral" }: MetricCardProps) {
  const trendColor = trend === "up" ? "text-chart-2" : trend === "down" ? "text-destructive" : "text-muted-foreground"

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
          {change && <p className={`mt-1 text-sm font-medium ${trendColor}`}>{change}</p>}
        </div>
        <div className="rounded-lg bg-primary/10 p-3 text-primary">{icon}</div>
      </div>
    </Card>
  )
}

interface DashboardHeaderProps {
  summary?: {
    engagement: {
      currentDAU: number
      dauGrowth: string
      avgDailyRevenue: number
      totalRevenue: number
    }
    market: {
      tam: number
      sam: number
      adoptionRate: number
      marketPenetration: string
    }
    forecasting: {
      modelVersion: string
      accuracy: string
      forecastHorizon: string
    }
  }
}

export function DashboardHeader({ summary }: DashboardHeaderProps) {
  if (!summary) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-32 animate-pulse bg-card" />
        ))}
      </div>
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
    return num.toLocaleString()
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Daily Active Users"
        value={summary.engagement.currentDAU.toLocaleString()}
        change={`+${summary.engagement.dauGrowth}% vs last week`}
        icon={<Activity className="h-5 w-5" />}
        trend="up"
      />
      <MetricCard
        title="Avg Daily Revenue"
        value={formatNumber(summary.engagement.avgDailyRevenue)}
        change={`${formatNumber(summary.engagement.totalRevenue)} total (30d)`}
        icon={<TrendingUp className="h-5 w-5" />}
        trend="up"
      />
      <MetricCard
        title="Market Penetration"
        value={`${summary.market.marketPenetration}%`}
        change={`SAM: ${formatNumber(summary.market.sam)}`}
        icon={<Target className="h-5 w-5" />}
        trend="neutral"
      />
      <MetricCard
        title="Forecast Accuracy"
        value={`${summary.forecasting.accuracy}%`}
        change={`Model ${summary.forecasting.modelVersion}`}
        icon={<Zap className="h-5 w-5" />}
        trend="up"
      />
    </div>
  )
}
