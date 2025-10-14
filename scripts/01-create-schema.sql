-- Create tables for market trend analysis platform

-- EngagementEvents: Track user engagement metrics over time
CREATE TABLE IF NOT EXISTS engagement_events (
  event_id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  engagement_metric VARCHAR(50) NOT NULL,
  metric_value DECIMAL(12, 2) NOT NULL,
  content_type VARCHAR(100),
  monetization_event BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MarketData: Store market sizing and industry metrics
CREATE TABLE IF NOT EXISTS market_data (
  dataset_id SERIAL PRIMARY KEY,
  source VARCHAR(100) NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  value DECIMAL(15, 2) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ForecastResults: Store ML model predictions
CREATE TABLE IF NOT EXISTS forecast_results (
  forecast_id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  predicted_value DECIMAL(12, 2) NOT NULL,
  confidence_lower DECIMAL(12, 2),
  confidence_upper DECIMAL(12, 2),
  model_version VARCHAR(50) NOT NULL,
  accuracy_score DECIMAL(5, 4),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_engagement_date ON engagement_events(date);
CREATE INDEX IF NOT EXISTS idx_engagement_metric ON engagement_events(engagement_metric);
CREATE INDEX IF NOT EXISTS idx_market_timestamp ON market_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_market_type ON market_data(metric_type);
CREATE INDEX IF NOT EXISTS idx_forecast_date ON forecast_results(date);
CREATE INDEX IF NOT EXISTS idx_forecast_type ON forecast_results(metric_type);
