// Type definitions for the forecasting platform

export interface TimeSeriesData {
  date: string
  value: number
}

export interface ForecastPoint {
  date: string
  predicted: number
  lower: number
  upper: number
  confidence: number
}

export interface ModelMetrics {
  mape: number
  rmse: number
  r2: number
  accuracy?: number
}

export interface EngagementMetrics {
  currentDAU: number
  dauGrowth: string
  avgDailyRevenue: number
  totalRevenue: number
}

export interface MarketMetrics {
  tam: number
  sam: number
  adoptionRate: number
  marketPenetration: string
}

export interface ForecastingMetrics {
  modelVersion: string
  accuracy: string
  forecastHorizon: string
}

export interface AnalyticsSummary {
  engagement: EngagementMetrics
  market: MarketMetrics
  forecasting: ForecastingMetrics
}
