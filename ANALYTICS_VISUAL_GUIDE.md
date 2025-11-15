# Analytics Dashboard - Visual Overview

## Page Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Dashboard    Analytics & Insights          [Summary Period: ▼]  │
└─────────────────────────────────────────────────────────────────────┘

┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ ⏱️ Total Hours │ │ 💰 Total Earn. │ │ 📝 Total Entr. │ │ 📊 Avg. Earn.  │
│     40.00      │ │   $1,200.00    │ │       5        │ │    $240.00     │
│  ↑ 14.29%      │ │  ↑ 14.29%      │ │  ↔ 0.00%       │ │                │
│ vs last period │ │ vs last period │ │ vs last period │ │  per entry     │
└────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Earnings Trend                                    [Period: Month ▼]│
│                                                                       │
│  $                                                                    │
│  │                                                    ╱──────╲        │
│  │                                     ╱────╲        ╱        ╲       │
│  │                      ╱────╲        ╱      ╲      ╱          ╲     │
│  │            ╱────╲   ╱      ╲      ╱        ╲    ╱            ╲    │
│  │  ────╲    ╱      ╲ ╱        ╲────           ╲──               ╲── │
│  │       ╲──                                                         │
│  └─────────────────────────────────────────────────────────────────  │
│     Jan 1   Jan 5   Jan 10  Jan 15  Jan 20  Jan 25  Jan 30          │
│                                                                       │
│  Legend: ─── Earnings ($)  ─── Hours                                 │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┐ ┌──────────────────────────────────┐
│  Earnings by Job                 │ │  Weekly Pattern                  │
│                                  │ │                                  │
│         ┌───────────────┐        │ │   $                              │
│         │               │        │ │   │  ▂▂                          │
│         │               │        │ │   │  ██  ▃▃  ▂▂  ▄▄  ▆▆  ▃▃  ▁▁ │
│         │  Backend Dev  │        │ │   │  ██  ██  ██  ██  ██  ██  ██ │
│         │      60%      │        │ │   │  ██  ██  ██  ██  ██  ██  ██ │
│         │               │        │ │   │  ██  ██  ██  ██  ██  ██  ██ │
│         │               │        │ │   └─────────────────────────────  │
│  ┌──────┴───────────────┴──────┐ │ │     Mon Tue Wed Thu Fri Sat Sun │
│  │   Design    Frontend        │ │ │                                  │
│  │    25%        15%           │ │ │  ■ Earnings  ■ Hours             │
│  └─────────────────────────────┘ │ │                                  │
└──────────────────────────────────┘ └──────────────────────────────────┘
```

## Component Breakdown

### 1. Header Section
```
┌─────────────────────────────────────────────────────────────────┐
│  [← Dashboard]  [Analytics & Insights]     [Summary Period: ▼] │
└─────────────────────────────────────────────────────────────────┘
```
- **Back Button**: Navigate to Dashboard
- **Page Title**: "Analytics & Insights"
- **Period Selector**: Dropdown to choose Day/Week/Month/Year

### 2. Summary Cards (4 cards in responsive grid)
```
┌────────────────────┐
│ 💰 Icon            │
│ Card Title         │
│ Large Value        │
│ ↑ 14.29%          │
│ vs last period     │
└────────────────────┘
```
Each card shows:
- Icon (⏱️ 💰 📝 📊)
- Metric title
- Current value
- Trend arrow (↑ ↓ ↔)
- Percentage change
- Comparison label

**Trend Colors:**
- Green with ↑ for positive trends (earnings/hours increased)
- Red with ↓ for negative trends (earnings/hours decreased)
- Gray with ↔ for no change

### 3. Earnings Trend Chart
```
┌──────────────────────────────────────────────────────────────┐
│  Earnings Trend                          [Period: Month ▼]  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Line chart with dual Y-axis                          │ │
│  │  Left axis: Earnings ($)                              │ │
│  │  Right axis: Hours                                    │ │
│  │  X-axis: Dates                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│  Legend: ─── Earnings ($)  ─── Hours                       │
└──────────────────────────────────────────────────────────────┘
```
Features:
- Two lines (Earnings in purple, Hours in green)
- Dual Y-axis for better scale
- Interactive tooltips on hover
- Period selector for different time ranges
- Responsive to container width

### 4. Job Distribution Chart
```
┌─────────────────────────────────────┐
│  Earnings by Job                    │
│  ┌───────────────────────────────┐  │
│  │     Pie chart showing         │  │
│  │     earnings breakdown        │  │
│  │     by job with percentages   │  │
│  └───────────────────────────────┘  │
│  ■ Backend Dev  ■ Frontend  ■ Design│
└─────────────────────────────────────┘
```
Features:
- Pie slices for each job
- Percentage labels on slices
- Color-coded (6 distinct colors)
- Legend with job names
- Shows earnings distribution

### 5. Weekly Pattern Chart
```
┌─────────────────────────────────────┐
│  Weekly Pattern                     │
│  ┌───────────────────────────────┐  │
│  │  Bar chart showing            │  │
│  │  hours and earnings           │  │
│  │  by day of week               │  │
│  └───────────────────────────────┘  │
│  ■ Earnings  ■ Hours                │
└─────────────────────────────────────┘
```
Features:
- Two bars per day (Earnings and Hours)
- Dual Y-axis
- 7 days (Sun-Sat)
- Helps identify busiest days
- Purple for earnings, green for hours

## Responsive Behavior

### Desktop (> 1024px)
```
[Back] Analytics & Insights                    [Selector]
┌────┐ ┌────┐ ┌────┐ ┌────┐  (4 cards in row)
┌──────────────────────────┐  (full width)
┌───────────┐ ┌────────────┐  (2 charts side by side)
```

### Tablet (768px - 1024px)
```
[Back] Analytics
        [Selector]
┌────┐ ┌────┐  (2 cards per row)
┌────┐ ┌────┐
┌──────────────┐  (full width)
┌──────────────┐  (stacked)
┌──────────────┐  (stacked)
```

### Mobile (< 768px)
```
[Back]
Analytics
[Selector]
┌──────┐  (1 card per row)
┌──────┐
┌──────┐
┌──────┐
┌────────┐  (full width, smaller)
┌────────┐  (stacked)
┌────────┐  (stacked)
```

## Loading State
When data is loading, skeleton screens appear:
```
┌─────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░  (animated skeleton)  │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────────────┘
```

## Empty State
When no data exists:
```
┌─────────────────────────────────────┐
│                                     │
│              📊                     │
│   No data available for this period │
│                                     │
└─────────────────────────────────────┘
```

## User Interactions

### Hovering on Charts
- **Line Chart**: Shows tooltip with exact values for that date
- **Pie Chart**: Highlights slice and shows percentage
- **Bar Chart**: Shows tooltip with exact hours and earnings

### Period Selection
1. Click period dropdown
2. Select: Today, This Week, This Month, This Year
3. Charts automatically update with new data
4. Loading skeleton shown during fetch

### Navigation
1. Click "← Dashboard" to return to main dashboard
2. Click "📊 Analytics" from dashboard to view analytics

## Color Scheme

### Primary Colors
- **Purple** (`#8b5cf6`): Primary brand color, earnings lines
- **Green** (`#10b981`): Success, hours lines, positive trends
- **Red** (`#ef4444`): Negative trends
- **Blue** (`#3b82f6`): Accent color

### Chart Colors
- **Earnings**: Purple gradient
- **Hours**: Green solid
- **Job 1**: Purple
- **Job 2**: Green
- **Job 3**: Amber
- **Job 4**: Red
- **Job 5**: Blue
- **Job 6**: Pink

### UI Colors
- **Background**: `#f9fafb` (light gray)
- **Cards**: `#ffffff` (white)
- **Text Primary**: `#1f2937` (dark gray)
- **Text Secondary**: `#6b7280` (medium gray)
- **Borders**: `#d1d5db` (light gray)

## Accessibility Features

1. **Semantic HTML**: Proper heading hierarchy
2. **Keyboard Navigation**: All interactive elements focusable
3. **ARIA Labels**: Charts have descriptive labels
4. **Color Contrast**: WCAG AA compliant
5. **Alt Text**: Icons have descriptive text
6. **Focus Indicators**: Visible focus rings

## Performance Optimizations

1. **React Query Caching**: Data cached for 5 minutes
2. **Lazy Loading**: Charts load only when needed
3. **Virtualization**: Ready for large datasets
4. **Debounced Filtering**: Prevents excessive API calls
5. **Memoization**: Charts re-render only when data changes

## Browser Support

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile Safari (iOS 14+)
✅ Chrome Mobile (Android 90+)

## Chart Interactions Summary

| Chart Type | Hover | Click | Legend Click |
|------------|-------|-------|--------------|
| Line Chart | Tooltip | - | Toggle line |
| Pie Chart | Highlight | - | Toggle slice |
| Bar Chart | Tooltip | - | Toggle bar |

## Data Refresh

- **Automatic**: Data refetches when period changes
- **Manual**: Pull to refresh on mobile (future)
- **Cache**: 5-minute stale time via React Query
- **Background**: Stale-while-revalidate strategy

## Future Enhancements Preview

Potential additions shown in documentation:
1. Export charts as images/PDF
2. Custom date range picker
3. More chart types (area, scatter)
4. Drill-down to individual entries
5. Annotations on charts
6. Comparison between jobs
7. Goal tracking overlays
8. Forecasting with trend lines
