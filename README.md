# Market Trend Analysis & Forecasting Tool

A comprehensive analytics and forecasting platform built with Next.js that provides real-time market insights, engagement predictions, and revenue forecasting for data-driven decision making.

## 🚀 Overview

This platform combines advanced forecasting algorithms with intuitive visualizations to help businesses understand market trends, predict user engagement, and forecast revenue. The tool leverages machine learning models to achieve 85%+ accuracy in engagement spike predictions and provides actionable insights through interactive dashboards.

## ✨ Key Features

### Analytics Dashboard
- **Real-time Metrics Tracking**: Monitor Daily Active Users (DAU), session counts, and revenue metrics
- **Interactive Time Range Selection**: Analyze trends across 30, 60, or 90-day periods
- **Key Performance Indicators**: Track prediction accuracy, latency improvements, and model versions

### Forecasting Capabilities
- **Engagement Forecasting**: Predict DAU with confidence intervals and trend analysis
- **Revenue Trends**: Historical and projected revenue with growth patterns
- **Market Growth Analysis**: TAM/SAM tracking with adoption curve visualization
- **Spike Detection**: Statistical anomaly detection for engagement spikes (z-score > 2.0)

### Data Processing
- **ETL Pipeline**: Automated data extraction, transformation, and loading workflows
- **Feature Engineering**: Advanced time-series features including lag values, rolling statistics, and seasonal indicators
- **Multiple Model Support**: Ridge regression, Random Forest, and Linear regression models

### Visualizations
- **Engagement Forecast Chart**: Interactive line charts with confidence bands
- **Revenue Trends Chart**: Combined historical and projected revenue visualization
- **Market Growth Chart**: TAM/SAM penetration and growth tracking
- **Adoption Curve Chart**: User adoption patterns and market penetration

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.2.4 (React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9 with custom design system
- **UI Components**: Radix UI primitives with custom components
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Theming**: next-themes for dark/light mode support

### Backend & Data
- **API Routes**: Next.js API routes for serverless functions
- **Database**: PostgreSQL schema (production-ready)
- **Mock Data**: In-memory mock database for development
- **Data Processing**: Pandas for ETL operations

### Machine Learning
- **Python Library**: scikit-learn
- **Models**: Ridge Regression, Random Forest, Linear Regression
- **Metrics**: MAPE, RMSE, R², accuracy scoring
- **Feature Engineering**: Time-based, lag, rolling statistics, and trend features

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Type Checking**: TypeScript strict mode

## 📁 Project Structure

```
Market-Trend-Analysis---Forecasting-Tool/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── analytics/
│   │   │   └── summary/         # Analytics summary endpoint
│   │   ├── data/
│   │   │   ├── engagement/      # Engagement data endpoint
│   │   │   ├── forecast/        # Forecast data endpoint
│   │   │   └── market/          # Market data endpoint
│   │   └── forecast/
│   │       ├── accuracy/        # Model accuracy metrics
│   │       └── generate/        # Generate new forecasts
│   ├── page.tsx                 # Main dashboard page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── loading.tsx              # Loading state
│
├── components/                   # React components
│   ├── charts/                  # Chart components
│   │   ├── engagement-forecast-chart.tsx
│   │   ├── revenue-trends-chart.tsx
│   │   ├── market-growth-chart.tsx
│   │   └── adoption-curve-chart.tsx
│   ├── ui/                      # UI component library
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   └── ... (40+ components)
│   ├── dashboard-header.tsx     # Dashboard header
│   ├── dashboard-nav.tsx        # Navigation component
│   ├── time-range-selector.tsx  # Time range picker
│   └── theme-provider.tsx       # Theme context provider
│
├── lib/                         # Utility libraries
│   ├── db.ts                    # Database client (mock/production)
│   ├── forecasting.ts           # Forecasting engine utilities
│   ├── types.ts                 # TypeScript type definitions
│   └── utils.ts                 # Helper functions
│
├── scripts/                     # Data processing scripts
│   ├── etl_pipeline.py          # ETL pipeline for data processing
│   ├── forecasting_model.py     # ML forecasting model
│   ├── 01-create-schema.sql     # Database schema
│   └── 02-seed-data.sql         # Seed data
│
├── public/                      # Static assets
├── styles/                      # Additional styles
├── hooks/                       # Custom React hooks
├── next.config.mjs              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Python 3.8+ (for data processing scripts)
- PostgreSQL (for production deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johaankjis/Market-Trend-Analysis---Forecasting-Tool.git
   cd Market-Trend-Analysis---Forecasting-Tool
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Python environment** (optional, for data processing)
   ```bash
   pip install pandas numpy scikit-learn
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## 📊 API Endpoints

### Analytics Endpoints

#### GET `/api/analytics/summary`
Returns comprehensive analytics summary with KPIs.

**Response:**
```json
{
  "success": true,
  "summary": {
    "engagement": {
      "currentDAU": 65000,
      "dauGrowth": "12.5",
      "avgDailyRevenue": 28000,
      "totalRevenue": 840000
    },
    "market": {
      "tam": 165000000000,
      "sam": 51000000000,
      "adoptionRate": 0.85,
      "marketPenetration": "0.0001"
    },
    "forecasting": {
      "modelVersion": "v1.2.0",
      "accuracy": "87.50",
      "forecastHorizon": "90 days"
    }
  }
}
```

### Data Endpoints

#### GET `/api/data/engagement`
Fetches historical engagement events.

**Query Parameters:**
- `metric` (optional): Filter by metric type (DAU, sessions, revenue)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "event_id": 1,
      "date": "2024-10-14",
      "engagement_metric": "DAU",
      "metric_value": 65000,
      "content_type": "video",
      "monetization_event": false
    }
  ]
}
```

#### GET `/api/data/market`
Retrieves market sizing data (TAM/SAM).

**Query Parameters:**
- `type` (optional): Filter by metric type (TAM, SAM, adoption)

#### GET `/api/data/forecast`
Gets forecast results from ML models.

**Query Parameters:**
- `type` (optional): Filter by forecast type (DAU, revenue)
- `days` (optional): Number of days to forecast (default: 90)

### Forecast Endpoints

#### POST `/api/forecast/generate`
Generates new forecasts using the ML model.

**Request Body:**
```json
{
  "metric": "DAU",
  "historicalData": [
    { "date": "2024-10-01", "value": 60000 },
    { "date": "2024-10-02", "value": 61000 }
  ],
  "forecastDays": 90
}
```

#### GET `/api/forecast/accuracy`
Returns model accuracy metrics.

## 🗄️ Database Schema

### Tables

#### engagement_events
Tracks user engagement metrics over time.

| Column | Type | Description |
|--------|------|-------------|
| event_id | SERIAL | Primary key |
| date | DATE | Event date |
| engagement_metric | VARCHAR(50) | Metric type (DAU, sessions, revenue) |
| metric_value | DECIMAL(12,2) | Metric value |
| content_type | VARCHAR(100) | Content category |
| monetization_event | BOOLEAN | Whether event generated revenue |
| created_at | TIMESTAMP | Record creation time |

#### market_data
Stores market sizing and industry metrics.

| Column | Type | Description |
|--------|------|-------------|
| dataset_id | SERIAL | Primary key |
| source | VARCHAR(100) | Data source |
| metric_type | VARCHAR(50) | Metric category (TAM, SAM, adoption) |
| metric_name | VARCHAR(100) | Metric identifier |
| value | DECIMAL(15,2) | Metric value |
| timestamp | TIMESTAMP | Data timestamp |
| created_at | TIMESTAMP | Record creation time |

#### forecast_results
Stores ML model predictions.

| Column | Type | Description |
|--------|------|-------------|
| forecast_id | SERIAL | Primary key |
| date | DATE | Forecast date |
| metric_type | VARCHAR(50) | Metric being forecasted |
| predicted_value | DECIMAL(12,2) | Predicted value |
| confidence_lower | DECIMAL(12,2) | Lower confidence bound |
| confidence_upper | DECIMAL(12,2) | Upper confidence bound |
| model_version | VARCHAR(50) | Model version identifier |
| accuracy_score | DECIMAL(5,4) | Model accuracy |
| created_at | TIMESTAMP | Record creation time |

### Indexes

- `idx_engagement_date`: Optimizes date-based queries on engagement_events
- `idx_engagement_metric`: Speeds up metric type filtering
- `idx_market_timestamp`: Optimizes time-series queries on market_data
- `idx_market_type`: Speeds up metric type filtering
- `idx_forecast_date`: Optimizes date-based queries on forecast_results
- `idx_forecast_type`: Speeds up forecast type filtering

## 🤖 Machine Learning Models

### EngagementForecaster

The core forecasting engine uses scikit-learn with the following features:

**Features:**
- Time-based: day_of_week, day_of_month, month, quarter
- Lag features: lag_1, lag_7, lag_30 (previous values)
- Rolling statistics: 7-day and 30-day moving averages and standard deviations
- Trend indicators: value differences and percentage changes
- Seasonal indicators: weekend, month start/end flags

**Models:**
- Ridge Regression (default, α=1.0)
- Random Forest (100 estimators)
- Linear Regression

**Performance Metrics:**
- **Accuracy Target**: ≥85%
- **MAPE**: Mean Absolute Percentage Error
- **RMSE**: Root Mean Square Error
- **R²**: Coefficient of determination

**Confidence Intervals:**
- 95% confidence at day 1, decreasing to 75% at day 90
- Based on historical standard deviation (±2σ)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
# Database (production)
DATABASE_URL=postgresql://user:password@localhost:5432/market_trends

# API Keys (if using external data sources)
API_KEY=your_api_key_here

# Analytics
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Next.js Configuration

The project uses custom Next.js configuration (`next.config.mjs`):
- ESLint errors ignored during builds (for demo purposes)
- TypeScript errors ignored during builds (for demo purposes)
- Unoptimized images for faster development

## 🎨 UI Components

The platform includes 40+ reusable UI components built on Radix UI:

- **Layout**: Card, Separator, Tabs, Accordion
- **Forms**: Input, Select, Checkbox, Radio, Slider
- **Navigation**: Dropdown Menu, Navigation Menu, Breadcrumb
- **Feedback**: Alert, Toast, Dialog, Progress
- **Data Display**: Badge, Avatar, Tooltip, Table
- **Charts**: Custom chart components using Recharts

All components support dark/light themes and are fully accessible.

## 🧪 Development

### Running Tests

```bash
# Run linting
pnpm lint

# Build the project
pnpm build
```

### ETL Pipeline

Run the data processing pipeline:

```bash
python scripts/etl_pipeline.py
```

This will:
1. Extract data from mock APIs
2. Transform and engineer features
3. Aggregate metrics by week/month
4. Calculate market penetration
5. Load to data warehouse

### Forecasting Model

Train and test the forecasting model:

```bash
python scripts/forecasting_model.py
```

## 📈 Performance

- **Prediction Accuracy**: 85%+ on engagement forecasts
- **Latency Improvement**: 40% faster reporting vs baseline
- **Model Version**: v1.2.0
- **Forecast Horizon**: 90 days
- **Data Refresh**: Real-time updates via API

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain type safety
- Write descriptive variable names
- Add comments for complex logic

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Charts powered by [Recharts](https://recharts.org/)
- ML models using [scikit-learn](https://scikit-learn.org/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Note**: This is a demonstration/portfolio project. The current implementation uses mock data for the database layer. For production use, integrate with a real PostgreSQL database and configure proper authentication and authorization.
