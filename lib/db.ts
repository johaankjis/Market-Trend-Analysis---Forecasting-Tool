// Mock database client for demonstration
// In production, this would connect to Postgres/Snowflake

export interface EngagementEvent {
  event_id: number
  date: string
  engagement_metric: string
  metric_value: number
  content_type: string | null
  monetization_event: boolean
}

export interface MarketData {
  dataset_id: number
  source: string
  metric_type: string
  metric_name: string
  value: number
  timestamp: string
}

export interface ForecastResult {
  forecast_id: number
  date: string
  metric_type: string
  predicted_value: number
  confidence_lower: number | null
  confidence_upper: number | null
  model_version: string
  accuracy_score: number | null
}

// Mock data generator for demonstration
export const db = {
  async getEngagementEvents(days = 90): Promise<EngagementEvent[]> {
    const events: EngagementEvent[] = []
    const today = new Date()

    for (let i = days; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      // DAU
      events.push({
        event_id: events.length + 1,
        date: dateStr,
        engagement_metric: "DAU",
        metric_value: 50000 + Math.random() * 10000 + Math.sin(i * 0.017) * 5000,
        content_type: "app_usage",
        monetization_event: false,
      })

      // Sessions
      events.push({
        event_id: events.length + 1,
        date: dateStr,
        engagement_metric: "sessions",
        metric_value: 150000 + i * 50 + Math.random() * 20000,
        content_type: "app_usage",
        monetization_event: false,
      })

      // Revenue
      events.push({
        event_id: events.length + 1,
        date: dateStr,
        engagement_metric: "revenue",
        metric_value: 25000 + i * 100 + Math.random() * 5000,
        content_type: "subscription",
        monetization_event: Math.random() > 0.7,
      })
    }

    return events
  },

  async getMarketData(): Promise<MarketData[]> {
    const now = new Date()
    const sixMonthsAgo = new Date(now)
    sixMonthsAgo.setMonth(now.getMonth() - 6)
    const oneYearAgo = new Date(now)
    oneYearAgo.setFullYear(now.getFullYear() - 1)

    return [
      {
        dataset_id: 1,
        source: "Gartner",
        metric_type: "TAM",
        metric_name: "Total Addressable Market",
        value: 125000000000,
        timestamp: oneYearAgo.toISOString(),
      },
      {
        dataset_id: 2,
        source: "Gartner",
        metric_type: "TAM",
        metric_name: "Total Addressable Market",
        value: 145000000000,
        timestamp: sixMonthsAgo.toISOString(),
      },
      {
        dataset_id: 3,
        source: "Gartner",
        metric_type: "TAM",
        metric_name: "Total Addressable Market",
        value: 165000000000,
        timestamp: now.toISOString(),
      },
      {
        dataset_id: 4,
        source: "Forrester",
        metric_type: "SAM",
        metric_name: "Serviceable Addressable Market",
        value: 35000000000,
        timestamp: oneYearAgo.toISOString(),
      },
      {
        dataset_id: 5,
        source: "Forrester",
        metric_type: "SAM",
        metric_name: "Serviceable Addressable Market",
        value: 42000000000,
        timestamp: sixMonthsAgo.toISOString(),
      },
      {
        dataset_id: 6,
        source: "Forrester",
        metric_type: "SAM",
        metric_name: "Serviceable Addressable Market",
        value: 51000000000,
        timestamp: now.toISOString(),
      },
      {
        dataset_id: 7,
        source: "IDC",
        metric_type: "adoption",
        metric_name: "Market Penetration Rate",
        value: 12.5,
        timestamp: oneYearAgo.toISOString(),
      },
      {
        dataset_id: 8,
        source: "IDC",
        metric_type: "adoption",
        metric_name: "Market Penetration Rate",
        value: 18.3,
        timestamp: sixMonthsAgo.toISOString(),
      },
      {
        dataset_id: 9,
        source: "IDC",
        metric_type: "adoption",
        metric_name: "Market Penetration Rate",
        value: 24.7,
        timestamp: now.toISOString(),
      },
    ]
  },

  async getForecastResults(days = 90): Promise<ForecastResult[]> {
    const forecasts: ForecastResult[] = []
    const today = new Date()

    for (let i = 1; i <= days; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]

      // DAU forecast
      const dauBase = 65000 + i * 150
      forecasts.push({
        forecast_id: forecasts.length + 1,
        date: dateStr,
        metric_type: "DAU",
        predicted_value: dauBase + Math.random() * 2000,
        confidence_lower: dauBase - 3000,
        confidence_upper: dauBase + 5000,
        model_version: "v1.2.0",
        accuracy_score: 0.875,
      })

      // Revenue forecast
      const revenueBase = 60000 + i * 200
      forecasts.push({
        forecast_id: forecasts.length + 1,
        date: dateStr,
        metric_type: "revenue",
        predicted_value: revenueBase + Math.random() * 3000,
        confidence_lower: 55000 + i * 180,
        confidence_upper: 65000 + i * 220,
        model_version: "v1.2.0",
        accuracy_score: 0.852,
      })
    }

    return forecasts
  },
}
