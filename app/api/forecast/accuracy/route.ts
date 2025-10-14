import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { calculateAccuracy } from "@/lib/forecasting"

export const dynamic = "force-dynamic"

/**
 * GET /api/forecast/accuracy
 * Calculate and return model accuracy metrics
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const metric = searchParams.get("metric") || "DAU"

    // Fetch historical data for validation
    const historicalEvents = await db.getEngagementEvents(90)
    const actualData = historicalEvents
      .filter((e) => e.engagement_metric === metric)
      .map((e) => e.metric_value)
      .slice(-30) // Last 30 days

    // Fetch forecasts for the same period
    const forecasts = await db.getForecastResults(30)
    const predictedData = forecasts.filter((f) => f.metric_type === metric).map((f) => f.predicted_value)

    if (actualData.length === 0 || predictedData.length === 0) {
      return NextResponse.json({ success: false, error: "Insufficient data for accuracy calculation" }, { status: 400 })
    }

    // Calculate accuracy metrics
    const minLength = Math.min(actualData.length, predictedData.length)
    const accuracy = calculateAccuracy(actualData.slice(0, minLength), predictedData.slice(0, minLength))

    // Determine accuracy grade
    let grade = "A"
    if (accuracy.mape > 15) grade = "B"
    if (accuracy.mape > 25) grade = "C"
    if (accuracy.mape > 35) grade = "D"

    return NextResponse.json({
      success: true,
      metric,
      accuracy: {
        mape: accuracy.mape.toFixed(2),
        rmse: accuracy.rmse.toFixed(2),
        r2: accuracy.r2.toFixed(4),
        grade,
        percentage: ((1 - accuracy.mape / 100) * 100).toFixed(2),
      },
      metadata: {
        sampleSize: minLength,
        modelVersion: "v1.2.0",
        evaluationPeriod: "30 days",
      },
    })
  } catch (error) {
    console.error("[v0] Error calculating accuracy:", error)
    return NextResponse.json({ success: false, error: "Failed to calculate accuracy" }, { status: 500 })
  }
}
