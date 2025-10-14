import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

/**
 * GET /api/data/engagement
 * Fetch engagement events with optional filtering
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "90")
    const metric = searchParams.get("metric")

    let events = await db.getEngagementEvents(days)

    // Filter by metric if specified
    if (metric) {
      events = events.filter((e) => e.engagement_metric === metric)
    }

    // Aggregate by date and metric
    const aggregated = events.reduce(
      (acc, event) => {
        const key = `${event.date}-${event.engagement_metric}`
        if (!acc[key]) {
          acc[key] = {
            date: event.date,
            metric: event.engagement_metric,
            value: 0,
            count: 0,
            hasMonetization: false,
          }
        }
        acc[key].value += event.metric_value
        acc[key].count += 1
        acc[key].hasMonetization = acc[key].hasMonetization || event.monetization_event
        return acc
      },
      {} as Record<string, any>,
    )

    const result = Object.values(aggregated).map((item: any) => ({
      date: item.date,
      metric: item.metric,
      value: Math.round(item.value / item.count),
      hasMonetization: item.hasMonetization,
    }))

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
    })
  } catch (error) {
    console.error("[v0] Error fetching engagement data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch engagement data" }, { status: 500 })
  }
}
