// Forecasting engine utilities using scikit-learn patterns

export interface ForecastConfig {
  metric: string
  historicalData: Array<{ date: string; value: number }>
  forecastDays: number
}

export interface ForecastOutput {
  date: string
  predicted: number
  lower: number
  upper: number
  confidence: number
}

/**
 * Simple linear regression forecasting
 * In production, this would use scikit-learn via Python API
 */
export function generateForecast(config: ForecastConfig): ForecastOutput[] {
  const { historicalData, forecastDays } = config

  // Calculate trend using simple linear regression
  const n = historicalData.length
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0

  historicalData.forEach((point, i) => {
    sumX += i
    sumY += point.value
    sumXY += i * point.value
    sumX2 += i * i
  })

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // Calculate standard deviation for confidence intervals
  const predictions = historicalData.map((_, i) => slope * i + intercept)
  const residuals = historicalData.map((point, i) => point.value - predictions[i])
  const variance = residuals.reduce((sum, r) => sum + r * r, 0) / n
  const stdDev = Math.sqrt(variance)

  // Generate forecasts
  const forecasts: ForecastOutput[] = []
  const lastDate = new Date(historicalData[historicalData.length - 1].date)

  for (let i = 1; i <= forecastDays; i++) {
    const forecastDate = new Date(lastDate)
    forecastDate.setDate(forecastDate.getDate() + i)

    const predicted = slope * (n + i) + intercept
    const confidence = Math.max(0.7, 0.95 - (i / forecastDays) * 0.2) // Decreasing confidence

    forecasts.push({
      date: forecastDate.toISOString().split("T")[0],
      predicted: Math.max(0, predicted),
      lower: Math.max(0, predicted - stdDev * 2),
      upper: predicted + stdDev * 2,
      confidence,
    })
  }

  return forecasts
}

/**
 * Calculate model accuracy metrics
 */
export function calculateAccuracy(actual: number[], predicted: number[]): { mape: number; rmse: number; r2: number } {
  const n = actual.length

  // Mean Absolute Percentage Error
  const mape =
    (actual.reduce((sum, act, i) => {
      return sum + Math.abs((act - predicted[i]) / act)
    }, 0) /
      n) *
    100

  // Root Mean Square Error
  const rmse = Math.sqrt(
    actual.reduce((sum, act, i) => {
      return sum + Math.pow(act - predicted[i], 2)
    }, 0) / n,
  )

  // R-squared
  const mean = actual.reduce((sum, val) => sum + val, 0) / n
  const ssTotal = actual.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0)
  const ssResidual = actual.reduce((sum, act, i) => sum + Math.pow(act - predicted[i], 2), 0)
  const r2 = 1 - ssResidual / ssTotal

  return { mape, rmse, r2 }
}

/**
 * Detect engagement spikes using statistical methods
 */
export function detectSpikes(
  data: Array<{ date: string; value: number }>,
  threshold = 2,
): Array<{ date: string; value: number; zScore: number }> {
  const values = data.map((d) => d.value)
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
  const stdDev = Math.sqrt(variance)

  return data
    .map((point) => ({
      date: point.date,
      value: point.value,
      zScore: (point.value - mean) / stdDev,
    }))
    .filter((point) => Math.abs(point.zScore) > threshold)
}
