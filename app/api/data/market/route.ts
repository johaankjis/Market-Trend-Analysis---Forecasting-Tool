import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

/**
 * GET /api/data/market
 * Fetch market data (TAM/SAM/adoption metrics)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const metricType = searchParams.get("type")

    let data = await db.getMarketData()

    // Filter by metric type if specified
    if (metricType) {
      data = data.filter((d) => d.metric_type === metricType)
    }

    // Group by metric type for easier consumption
    const grouped = data.reduce(
      (acc, item) => {
        if (!acc[item.metric_type]) {
          acc[item.metric_type] = []
        }
        acc[item.metric_type].push({
          source: item.source,
          name: item.metric_name,
          value: item.value,
          timestamp: item.timestamp,
        })
        return acc
      },
      {} as Record<string, any[]>,
    )

    return NextResponse.json({
      success: true,
      data: grouped,
      raw: data,
    })
  } catch (error) {
    console.error("[v0] Error fetching market data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch market data" }, { status: 500 })
  }
}
