import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

/**
 * GET /api/analytics/summary
 * Generate summary analytics and KPIs
 */
export async function GET() {
  try {
    const [engagementEvents, marketData, forecasts] = await Promise.all([
      db.getEngagementEvents(30),
      db.getMarketData(),
      db.getForecastResults(30),
    ])

    // Calculate DAU metrics
    const dauEvents = engagementEvents.filter((e) => e.engagement_metric === "DAU")
    const currentDAU = dauEvents[dauEvents.length - 1]?.metric_value || 0
    const previousDAU = dauEvents[dauEvents.length - 8]?.metric_value || 0
    const dauGrowth = previousDAU > 0 ? ((currentDAU - previousDAU) / previousDAU) * 100 : 0

    // Calculate revenue metrics
    const revenueEvents = engagementEvents.filter((e) => e.engagement_metric === "revenue")
    const totalRevenue = revenueEvents.reduce((sum, e) => sum + e.metric_value, 0)
    const avgDailyRevenue = totalRevenue / 30

    // Get latest market data
    const latestTAM = marketData.find((d) => d.metric_type === "TAM")?.value || 0
    const latestSAM = marketData.find((d) => d.metric_type === "SAM")?.value || 0
    const latestAdoption = marketData.find((d) => d.metric_type === "adoption")?.value || 0

    // Forecast accuracy
    const dauForecasts = forecasts.filter((f) => f.metric_type === "DAU")
    const avgAccuracy = dauForecasts[0]?.accuracy_score || 0

    return NextResponse.json({
      success: true,
      summary: {
        engagement: {
          currentDAU: Math.round(currentDAU),
          dauGrowth: dauGrowth.toFixed(2),
          avgDailyRevenue: Math.round(avgDailyRevenue),
          totalRevenue: Math.round(totalRevenue),
        },
        market: {
          tam: latestTAM,
          sam: latestSAM,
          adoptionRate: latestAdoption,
          marketPenetration: ((currentDAU / latestSAM) * 100).toFixed(4),
        },
        forecasting: {
          modelVersion: "v1.2.0",
          accuracy: (avgAccuracy * 100).toFixed(2),
          forecastHorizon: "90 days",
        },
      },
    })
  } catch (error) {
    console.error("[v0] Error generating summary:", error)
    return NextResponse.json({ success: false, error: "Failed to generate summary" }, { status: 500 })
  }
}
