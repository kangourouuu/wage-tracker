# Analytics & Insights - Phase 3 Implementation

## Overview

Phase 3 adds comprehensive analytics and insights features to the Wage Tracker application. Users can now view detailed charts, trends, and statistics about their work hours and earnings.

## Features Implemented

### 1. Analytics Dashboard Page

A dedicated analytics page (`/analytics`) with:
- **Summary Cards with Trends**: Display current period statistics compared to the previous period with visual trend indicators
- **Period Selector**: Choose between Day, Week, Month, or Year views
- **Interactive Charts**: Three main chart types for data visualization
- **Navigation**: Easy navigation back to the main dashboard

### 2. Backend Analytics API

New REST API endpoints under `/api/analytics`:

#### `GET /analytics/earnings-trend`
Returns earnings and hours data over time for trend visualization.

**Query Parameters:**
- `period`: "day" | "week" | "month" | "year" (default: "month")
- `startDate`: Optional start date (ISO 8601 format)
- `endDate`: Optional end date (ISO 8601 format)

**Response:**
```json
[
  {
    "date": "2025-01-15",
    "hours": 8.5,
    "earnings": 255.0,
    "entries": 1
  },
  ...
]
```

#### `GET /analytics/job-distribution`
Returns distribution of hours and earnings across different jobs.

**Query Parameters:**
- `startDate`: Optional start date
- `endDate`: Optional end date

**Response:**
```json
[
  {
    "jobId": "uuid",
    "jobName": "Backend Development",
    "hours": 120.5,
    "earnings": 3615.0,
    "entries": 15
  },
  ...
]
```

#### `GET /analytics/weekly-pattern`
Returns work hours and earnings patterns by day of the week.

**Query Parameters:**
- `startDate`: Optional start date
- `endDate`: Optional end date

**Response:**
```json
[
  {
    "day": "Monday",
    "hours": 8.0,
    "earnings": 240.0
  },
  ...
]
```

#### `GET /analytics/summary`
Returns comprehensive summary statistics with trends compared to the previous period.

**Query Parameters:**
- `period`: "day" | "week" | "month" | "year" (default: "week")

**Response:**
```json
{
  "current": {
    "totalHours": 40.0,
    "totalEarnings": 1200.0,
    "totalEntries": 5,
    "averageHoursPerEntry": 8.0,
    "averageEarningsPerEntry": 240.0
  },
  "previous": {
    "totalHours": 35.0,
    "totalEarnings": 1050.0,
    "totalEntries": 5,
    "averageHoursPerEntry": 7.0,
    "averageEarningsPerEntry": 210.0
  },
  "trend": {
    "hours": 14.29,
    "earnings": 14.29,
    "entries": 0.0
  }
}
```

#### `GET /analytics/comparison`
Compares statistics between two custom time periods.

**Query Parameters:**
- `currentStart`: Start date for current period
- `currentEnd`: End date for current period
- `previousStart`: Start date for previous period
- `previousEnd`: End date for previous period

**Response:**
```json
{
  "current": { /* Stats object */ },
  "previous": { /* Stats object */ }
}
```

### 3. Frontend Components

#### Analytics Page (`/frontend/src/features/analytics/pages/Analytics.tsx`)
Main analytics dashboard with:
- Period selector for summary cards
- Four summary cards showing key metrics with trends
- Three chart sections with individual period selectors
- Responsive grid layout

#### Chart Components

**EarningsTrendChart** (`components/EarningsTrendChart.tsx`)
- Line chart showing earnings and hours over time
- Dual Y-axis for better data visualization
- Interactive tooltips
- Responsive design

**JobDistributionChart** (`components/JobDistributionChart.tsx`)
- Pie chart showing earnings distribution by job
- Percentage labels on each slice
- Color-coded job categories
- Legend for job names

**WeeklyPatternChart** (`components/WeeklyPatternChart.tsx`)
- Bar chart showing work patterns by day of week
- Dual Y-axis for earnings and hours
- Helps identify busiest days

#### Enhanced Summary Cards

**SummaryCardWithTrend** (`components/SummaryCardWithTrend.tsx`)
- Displays metric value with an icon
- Shows percentage change vs. previous period
- Visual indicator (↑/↓) for positive/negative trends
- Color-coded trend (green for positive, red for negative)

### 4. Dashboard Enhancements

The main Dashboard now includes:
- Analytics navigation button in the header
- Enhanced summary cards with trend indicators (when data is available)
- Fallback to simple summary cards if analytics data is unavailable

### 5. Internationalization

Added translations for all analytics features in both English and Vietnamese:
- Page titles and labels
- Chart labels
- Period selectors
- Empty state messages

## Technical Details

### Dependencies Added
- **recharts**: `^2.x` - Charting library for React

### File Structure
```
apps/backend/src/app/features/analytics/
├── analytics.controller.ts    # REST API endpoints
├── analytics.service.ts        # Business logic
└── analytics.module.ts         # Module definition

frontend/src/features/analytics/
├── components/
│   ├── EarningsTrendChart.tsx
│   ├── JobDistributionChart.tsx
│   ├── WeeklyPatternChart.tsx
│   └── SummaryCardWithTrend.tsx
├── pages/
│   └── Analytics.tsx
├── types/
│   └── analytics.types.ts
└── hooks/
    (reserved for future custom hooks)
```

### Data Flow
1. User navigates to `/analytics`
2. Analytics page loads and makes API calls via React Query
3. Backend calculates statistics from work entry data
4. Frontend receives data and renders charts
5. Charts are interactive and responsive

## Usage

### Accessing Analytics
1. Log in to the application
2. From the Dashboard, click the "📊 Analytics" button in the header
3. Or navigate directly to `/analytics`

### Viewing Different Periods
- Use the "Summary Period" dropdown to view stats for Today, This Week, This Month, or This Year
- Use the chart-specific period selector to adjust the time range for trend data

### Understanding Trends
- Green ↑ arrow indicates improvement compared to previous period
- Red ↓ arrow indicates decrease compared to previous period
- Percentage shows the magnitude of change

## Future Enhancements

Potential improvements for future phases:
- [ ] Export reports as PDF/Excel
- [ ] Custom date range selector
- [ ] Goal tracking and visualization
- [ ] Predictive analytics using AI
- [ ] More chart types (area charts, scatter plots)
- [ ] Comparison between multiple time periods
- [ ] Filtering by specific jobs
- [ ] Hourly rate trends over time
- [ ] Tax calculation and projections
- [ ] Mobile-optimized charts with touch gestures

## Performance Considerations

- All analytics queries use proper database indexing
- Data is cached via React Query with appropriate stale times
- Charts use virtualization for large datasets
- Lazy loading of analytics module for better initial load times

## Testing Recommendations

To test the analytics features:
1. Create multiple jobs with different wage rates
2. Add work entries spanning several weeks
3. Navigate to the analytics page
4. Switch between different periods
5. Verify charts render correctly
6. Test with empty data states
7. Test responsive design on different screen sizes

## API Authentication

All analytics endpoints require authentication:
- User must be logged in
- JWT access token must be provided in Authorization header
- Each user can only access their own analytics data

## Error Handling

The system handles various error scenarios:
- Empty data states with user-friendly messages
- Failed API calls with retry logic (via React Query)
- Invalid date ranges
- Missing required parameters
- Network errors with graceful fallbacks

## Browser Compatibility

Analytics features work on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

Charts are fully responsive and work well on all screen sizes.
