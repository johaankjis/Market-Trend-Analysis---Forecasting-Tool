-- Seed realistic mock data for the platform

-- Generate engagement events for the past 365 days
DO $$
DECLARE
  i INTEGER;
  base_date DATE := CURRENT_DATE - INTERVAL '365 days';
  dau_base DECIMAL := 50000;
  sessions_base DECIMAL := 150000;
  revenue_base DECIMAL := 25000;
BEGIN
  FOR i IN 0..364 LOOP
    -- Daily Active Users (DAU) with seasonal variation
    INSERT INTO engagement_events (date, engagement_metric, metric_value, content_type, monetization_event)
    VALUES (
      base_date + i,
      'DAU',
      dau_base + (RANDOM() * 10000) + (SIN(i * 0.017) * 5000),
      'app_usage',
      FALSE
    );
    
    -- Sessions with growth trend
    INSERT INTO engagement_events (date, engagement_metric, metric_value, content_type, monetization_event)
    VALUES (
      base_date + i,
      'sessions',
      sessions_base + (i * 50) + (RANDOM() * 20000),
      'app_usage',
      FALSE
    );
    
    -- Revenue with monetization events
    INSERT INTO engagement_events (date, engagement_metric, metric_value, content_type, monetization_event)
    VALUES (
      base_date + i,
      'revenue',
      revenue_base + (i * 100) + (RANDOM() * 5000),
      'subscription',
      (RANDOM() > 0.7)
    );
  END LOOP;
END $$;

-- Insert market data (TAM/SAM metrics)
INSERT INTO market_data (source, metric_type, metric_name, value, timestamp) VALUES
  ('Gartner', 'TAM', 'Total Addressable Market', 125000000000, NOW() - INTERVAL '1 year'),
  ('Gartner', 'TAM', 'Total Addressable Market', 145000000000, NOW() - INTERVAL '6 months'),
  ('Gartner', 'TAM', 'Total Addressable Market', 165000000000, NOW()),
  ('Forrester', 'SAM', 'Serviceable Addressable Market', 35000000000, NOW() - INTERVAL '1 year'),
  ('Forrester', 'SAM', 'Serviceable Addressable Market', 42000000000, NOW() - INTERVAL '6 months'),
  ('Forrester', 'SAM', 'Serviceable Addressable Market', 51000000000, NOW()),
  ('IDC', 'adoption', 'Market Penetration Rate', 12.5, NOW() - INTERVAL '1 year'),
  ('IDC', 'adoption', 'Market Penetration Rate', 18.3, NOW() - INTERVAL '6 months'),
  ('IDC', 'adoption', 'Market Penetration Rate', 24.7, NOW()),
  ('Internal', 'growth_rate', 'YoY Growth Rate', 45.2, NOW() - INTERVAL '1 year'),
  ('Internal', 'growth_rate', 'YoY Growth Rate', 52.8, NOW() - INTERVAL '6 months'),
  ('Internal', 'growth_rate', 'YoY Growth Rate', 61.3, NOW());

-- Generate forecast results for next 90 days
DO $$
DECLARE
  i INTEGER;
  forecast_date DATE := CURRENT_DATE;
  base_value DECIMAL := 65000;
BEGIN
  FOR i IN 1..90 LOOP
    -- DAU forecast
    INSERT INTO forecast_results (date, metric_type, predicted_value, confidence_lower, confidence_upper, model_version, accuracy_score)
    VALUES (
      forecast_date + i,
      'DAU',
      base_value + (i * 150) + (RANDOM() * 2000),
      base_value + (i * 150) - 3000,
      base_value + (i * 150) + 5000,
      'v1.2.0',
      0.8750
    );
    
    -- Revenue forecast
    INSERT INTO forecast_results (date, metric_type, predicted_value, confidence_lower, confidence_upper, model_version, accuracy_score)
    VALUES (
      forecast_date + i,
      'revenue',
      60000 + (i * 200) + (RANDOM() * 3000),
      55000 + (i * 180),
      65000 + (i * 220),
      'v1.2.0',
      0.8520
    );
  END LOOP;
END $$;
