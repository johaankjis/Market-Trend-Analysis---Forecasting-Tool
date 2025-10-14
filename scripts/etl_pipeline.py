"""
ETL Pipeline for Market Trend Analysis
Demonstrates data processing patterns using pandas
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def extract_api_data(api_url: str) -> pd.DataFrame:
    """
    Extract data from external APIs
    In production, this would use requests library
    """
    # Mock API data extraction
    dates = pd.date_range(end=datetime.now(), periods=365, freq='D')
    
    data = pd.DataFrame({
        'date': dates,
        'dau': np.random.randint(45000, 65000, size=365),
        'sessions': np.random.randint(140000, 180000, size=365),
        'revenue': np.random.randint(20000, 35000, size=365)
    })
    
    return data

def transform_engagement_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Transform and clean engagement data
    - Handle missing values
    - Calculate rolling averages
    - Detect anomalies
    """
    # Convert date to datetime
    df['date'] = pd.to_datetime(df['date'])
    
    # Fill missing values with forward fill
    df = df.fillna(method='ffill')
    
    # Calculate 7-day rolling averages
    df['dau_7d_avg'] = df['dau'].rolling(window=7).mean()
    df['sessions_7d_avg'] = df['sessions'].rolling(window=7).mean()
    df['revenue_7d_avg'] = df['revenue'].rolling(window=7).mean()
    
    # Calculate growth rates
    df['dau_growth'] = df['dau'].pct_change() * 100
    df['revenue_growth'] = df['revenue'].pct_change() * 100
    
    # Detect anomalies using z-score
    df['dau_zscore'] = (df['dau'] - df['dau'].mean()) / df['dau'].std()
    df['is_anomaly'] = df['dau_zscore'].abs() > 2
    
    return df

def aggregate_metrics(df: pd.DataFrame) -> pd.DataFrame:
    """
    Aggregate metrics by week and month
    """
    # Weekly aggregation
    weekly = df.resample('W', on='date').agg({
        'dau': 'mean',
        'sessions': 'sum',
        'revenue': 'sum'
    }).reset_index()
    
    weekly['period'] = 'week'
    
    # Monthly aggregation
    monthly = df.resample('M', on='date').agg({
        'dau': 'mean',
        'sessions': 'sum',
        'revenue': 'sum'
    }).reset_index()
    
    monthly['period'] = 'month'
    
    return pd.concat([weekly, monthly], ignore_index=True)

def calculate_market_metrics(engagement_df: pd.DataFrame, tam: float, sam: float) -> dict:
    """
    Calculate market sizing and penetration metrics
    """
    current_users = engagement_df['dau'].iloc[-1]
    
    metrics = {
        'tam': tam,
        'sam': sam,
        'current_users': current_users,
        'tam_penetration': (current_users / tam) * 100,
        'sam_penetration': (current_users / sam) * 100,
        'addressable_market': sam - current_users
    }
    
    return metrics

def load_to_warehouse(df: pd.DataFrame, table_name: str):
    """
    Load transformed data to data warehouse
    In production, this would use SQLAlchemy or similar
    """
    print(f"Loading {len(df)} rows to {table_name}")
    print(f"Columns: {df.columns.tolist()}")
    print(f"Date range: {df['date'].min()} to {df['date'].max()}")
    
    # Mock warehouse load
    return True

# Main ETL execution
if __name__ == "__main__":
    print("Starting ETL Pipeline...")
    
    # Extract
    raw_data = extract_api_data("https://api.example.com/metrics")
    print(f"Extracted {len(raw_data)} records")
    
    # Transform
    transformed_data = transform_engagement_data(raw_data)
    print(f"Transformed data with {len(transformed_data.columns)} columns")
    
    # Aggregate
    aggregated_data = aggregate_metrics(transformed_data)
    print(f"Aggregated to {len(aggregated_data)} summary records")
    
    # Calculate market metrics
    market_metrics = calculate_market_metrics(transformed_data, tam=165e9, sam=51e9)
    print(f"Market penetration: {market_metrics['sam_penetration']:.4f}%")
    
    # Load
    load_to_warehouse(transformed_data, "engagement_events")
    load_to_warehouse(aggregated_data, "engagement_summary")
    
    print("ETL Pipeline completed successfully!")
