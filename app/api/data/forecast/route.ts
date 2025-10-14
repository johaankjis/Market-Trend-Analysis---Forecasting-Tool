import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

/**
 * GET /api/data/forecast
 * Fetch forecast results from ML models
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "90")
    const metric = searchParams.get("metric")

    let forecasts = await db.getForecastResults(days)

    // Filter by metric if specified
    if (metric) {
      forecasts = forecasts.filter((f) => f.metric_type === metric)
    }

    // Group by metric type
    const grouped = forecasts.reduce(
      (acc, forecast) => {
        if (!acc[forecast.metric_type]) {
          acc[forecast.metric_type] = []
        }
        acc[forecast.metric_type].push({
          date: forecast.date,
          predicted: forecast.predicted_value,
          lower: forecast.confidence_lower,
          upper: forecast.confidence_upper,
          confidence: forecast.accuracy_score,
        })
        return acc
      },
      {} as Record<string, any[]>,
    )

    return NextResponse.json({
      success: true,
      data: grouped,
      modelVersion: forecasts[0]?.model_version || "v1.2.0",
    })
  } catch (error) {
    console.error("[v0] Error fetching forecast data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch forecast data" }, { status: 500 })
  }
}
