import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { generateForecast } from "@/lib/forecasting"

export const dynamic = "force-dynamic"

/**
 * POST /api/forecast/generate
 * Generate new forecasts using the forecasting engine
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { metric = "DAU", days = 90 } = body

    // Fetch historical data
    const historicalEvents = await db.getEngagementEvents(365)
    const metricData = historicalEvents
      .filter((e) => e.engagement_metric === metric)
      .map((e) => ({
        date: e.date,
        value: e.metric_value,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    if (metricData.length === 0) {
      return NextResponse.json({ success: false, error: "No historical data found" }, { status: 400 })
    }

    // Generate forecast
    const forecasts = generateForecast({
      metric,
      historicalData: metricData,
      forecastDays: days,
    })

    // Calculate model performance
    const recentData = metricData.slice(-30)
    const avgValue = recentData.reduce((sum, d) => sum + d.value, 0) / recentData.length
    const variance = recentData.reduce((sum, d) => sum + Math.pow(d.value - avgValue, 2), 0) / recentData.length
    const stdDev = Math.sqrt(variance)
    const coefficientOfVariation = (stdDev / avgValue) * 100

    return NextResponse.json({
      success: true,
      metric,
      forecasts,
      metadata: {
        historicalDays: metricData.length,
        forecastDays: days,
        modelVersion: "v1.2.0",
        avgHistoricalValue: Math.round(avgValue),
        volatility: coefficientOfVariation.toFixed(2),
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[v0] Error generating forecast:", error)
    return NextResponse.json({ success: false, error: "Failed to generate forecast" }, { status: 500 })
  }
}
