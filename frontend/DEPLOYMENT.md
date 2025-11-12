# Frontend Deployment Guide

## Environment Variables

Before deploying to Vercel, yoto configure the following environment variable:

### Required Environment Variable

- `VITE_API_URL`: The URL of your backend API

## Vercel Deployment Steps

1. Goour Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://wage-tracker-backend.onrender.com/api`
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**
5. Redeploy your application:
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Select **Redeploy**

## Local Development

For local development, create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

## Verifying the Configuration

After deployment, check the browser console. If you see a 404 error for `/api/assistant/chat`, the environment variable is not set correctly.

The API should be accessible at: `https://wage-tracker-backend.onrender.com/api`

