# GROQ API Integration Setup Guide

## Overview

The Wage Tracker backend is already fully integrated with **Groq AI** for advanced AI assistant features. This guide explains how to configure and use the GROQ API.

## ✅ What's Already Implemented

The backend already has:

1. **Package Installed**: `groq-sdk` (v0.35.0) in `package.json`
2. **Configuration Setup**: Environment variables in `config/app.config.ts`
3. **Service Implementation**: `AssistantService` using Groq API
4. **Controller Endpoints**: `/api/assistant/*` endpoints
5. **Error Handling**: Graceful fallback when API key is not configured

## 🔑 Setting Up Your API Key

### Step 1: Get Your GROQ API Key

1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up or log in to your account
3. Click "Create API Key"
4. Copy your API key (format: `gsk_...`)

**Benefits of Groq:**
- ⚡ 10x faster inference than other AI providers
- 💰 Generous free tier (14,400 requests/day)
- 🚀 Simple and reliable API
- 🔥 Excellent model quality (Llama 3.3 70B)
- 💳 No credit card required for free tier

### Step 2: Configure Environment Variables

1. Navigate to the backend directory:
   ```bash
   cd apps/backend
   ```

2. Create a `.env` file (if it doesn't exist):
   ```bash
   cp .env.example .env
   ```

3. Open `.env` and update the GROQ configuration:
   ```env
   # Groq AI Configuration
   GROQ_API_KEY=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
   GROQ_MODEL=llama-3.3-70b-versatile
   ```

   Replace `gsk_...` with your actual API key.

### Step 3: Available Models

You can choose different models based on your needs:

| Model | Speed | Quality | Use Case |
|-------|-------|---------|----------|
| `llama-3.3-70b-versatile` | Fast | Excellent | **Recommended** - Best balance |
| `llama3-70b-8192` | Very Fast | Good | Quick responses |
| `mixtral-8x7b-32768` | Fast | Very Good | Large context windows |
| `gemma2-9b-it` | Fastest | Good | Simple queries |

## 🚀 Testing the Integration

### Option 1: Using the Test Script

Run the included test script to verify your API key:

```bash
cd apps/backend
node test-groq-api.js
```

Expected output:
```
🔧 Testing GROQ API Integration...
✅ API Key is set
📡 Sending test request to Groq API...
✅ GROQ API Response: Hello, GROQ integration is working!
📊 Usage: X tokens
✅ SUCCESS: GROQ API integration is working correctly!
```

### Option 2: Testing via the Backend Server

1. **Start the backend server:**
   ```bash
   yarn start:dev
   ```

2. **Check the startup logs:**
   ```
   🔧 Assistant Service Initialization:
     - GROQ_API_KEY present: Yes
     - GROQ_MODEL: llama-3.3-70b-versatile
   ✅ Groq API Key is configured - AI Assistant is ready
   ```

3. **Test the API endpoint** (requires authentication):
   ```bash
   curl -X POST http://localhost:3000/api/assistant/chat \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     -d '{"message": "Hello, test GROQ integration"}'
   ```

## 📋 Available Features

The GROQ integration powers these AI assistant features:

### 1. **Chat with AI Assistant**
- Endpoint: `POST /api/assistant/chat`
- Ask questions about your work data
- Get personalized insights

### 2. **Analyze Work Entries**
- Endpoint: `POST /api/assistant/analyze`
- Analyze work patterns and productivity
- Get actionable recommendations

### 3. **File Import with AI**
- Endpoint: `POST /api/assistant/upload`
- Upload CSV/Excel files
- AI automatically structures and matches data to your jobs

### 4. **Export to CSV**
- Endpoint: `GET /api/assistant/export/csv`
- Export work entries with AI-generated insights

## 🔧 Configuration Details

### Environment Variables

```env
# Required
GROQ_API_KEY=your-api-key-here

# Optional (with defaults)
GROQ_MODEL=llama-3.3-70b-versatile  # Default model
```

### Configuration File Location

The configuration is loaded in:
- `apps/backend/src/config/app.config.ts`

```typescript
groqApiKey: process.env.GROQ_API_KEY,
groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
```

### Service Implementation

The AI service is implemented in:
- `apps/backend/src/app/features/assistant/assistant.service.ts`

Key methods:
- `generateContent()` - Chat with AI
- `processUploadedFile()` - Import files with AI
- `analyzeWorkDataWithAI()` - Analyze work data

## ⚠️ Error Handling

### If API Key is Not Set

```
⚠️ Groq API Key is not configured. AI assistant features will be disabled.
Please set GROQ_API_KEY environment variable to enable AI features.
```

The backend will start normally but AI features will return an error:
```json
{
  "statusCode": 500,
  "message": "AI Assistant is not configured. Please contact the administrator to set up the GROQ_API_KEY."
}
```

### Common Issues

1. **Invalid API Key (401)**
   - Error: "Groq API Key is invalid or lacks permissions"
   - Solution: Check your API key at https://console.groq.com/keys

2. **Rate Limit (429)**
   - Error: "Groq API rate limit exceeded"
   - Solution: Wait a few minutes or upgrade your Groq plan

3. **Network Issues**
   - Error: "Connection error"
   - Solution: Check your internet connection and firewall settings

## 🔐 Security Best Practices

1. **Never commit your .env file**
   - The `.gitignore` already excludes `.env` files
   - Always use `.env.example` as a template

2. **Rotate API keys regularly**
   - Generate new keys periodically
   - Revoke old keys at https://console.groq.com/keys

3. **Use different keys for different environments**
   - Development: Use a test API key
   - Production: Use a dedicated production key

## 📊 Monitoring Usage

To monitor your GROQ API usage:

1. Visit [Groq Console](https://console.groq.com)
2. Navigate to "Usage" section
3. View your request count and token usage

Free tier limits:
- **14,400 requests per day**
- Resets daily at midnight UTC

## 🆘 Troubleshooting

### Check if GROQ is configured:

```bash
# Check environment variable
cd apps/backend
cat .env | grep GROQ_API_KEY

# Check if service detects the key
yarn start:dev | grep GROQ
```

### Verify the API key manually:

```bash
# Install groq-sdk globally (optional)
npm install -g groq-sdk

# Run test script
node test-groq-api.js
```

### Debug mode:

The service logs detailed information. Look for:
- `🔧 Assistant Service Initialization`
- `🔑 Using Groq model:`
- `✅ Received response from Groq API`
- `❌ Groq API Error Details:`

## 📚 Additional Resources

- [Groq Documentation](https://console.groq.com/docs)
- [Groq API Reference](https://console.groq.com/docs/api-reference)
- [Available Models](https://console.groq.com/docs/models)
- [Rate Limits](https://console.groq.com/docs/rate-limits)

## ✅ Verification Checklist

After setup, verify:

- [ ] `.env` file created with GROQ_API_KEY
- [ ] GROQ_MODEL is set (or using default)
- [ ] Backend starts without warnings about GROQ
- [ ] Test script passes successfully
- [ ] AI assistant endpoints return responses (when authenticated)
- [ ] File upload with AI processing works

## 🎉 You're All Set!

Your GROQ AI integration is now complete and ready to use. The AI assistant features will enhance your wage tracking experience with:

- 🤖 Intelligent chat assistance
- 📊 Automated data analysis
- 📁 Smart file import
- 💡 Personalized insights
- 📈 Work pattern recognition

Enjoy using your AI-powered wage tracker!
