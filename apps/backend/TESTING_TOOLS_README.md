# GROQ Integration Testing Tools

This directory contains several tools to verify and test the GROQ API integration.

## 🛠️ Available Tools

### 1. **verify-groq-setup.js** - Complete Setup Verification
Comprehensive script that checks all aspects of the GROQ integration.

```bash
node verify-groq-setup.js
```

**What it checks:**
- ✅ .env file exists
- ✅ GROQ_API_KEY format is valid
- ✅ GROQ_MODEL is set
- ✅ All required source files exist
- ✅ groq-sdk package is installed

**Output:**
- Clear status of each component
- Actionable next steps
- Summary of integration status

---

### 2. **test-groq-config.js** - Configuration Testing
Tests that environment variables are loaded correctly.

```bash
node test-groq-config.js
```

**What it tests:**
- .env file parsing
- GROQ_API_KEY loading
- GROQ_MODEL configuration
- Groq SDK client instantiation

**Use case:** Quick check that your .env file is set up correctly.

---

### 3. **test-groq-api.js** - Live API Testing
Tests the actual GROQ API with your API key.

```bash
node test-groq-api.js
```

**What it does:**
- Makes a real API call to Groq
- Tests the llama-3.3-70b-versatile model
- Shows token usage
- Validates API key is working

**⚠️ Note:** 
- Requires network access to Groq API
- Uses 1 API call from your daily quota
- API key must be set in the script or .env

---

## 🚀 Quick Start

### Step 1: Verify Integration Exists
```bash
node verify-groq-setup.js
```

### Step 2: Create .env File
```bash
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

### Step 3: Test Configuration
```bash
node test-groq-config.js
```

### Step 4: (Optional) Test Live API
```bash
# Edit test-groq-api.js to add your API key or set it in .env
node test-groq-api.js
```

---

## 📋 Expected Workflow

### For New Setup:
1. Run `verify-groq-setup.js` → Shows what's missing
2. Create `.env` file with your API key
3. Run `test-groq-config.js` → Confirms config is loaded
4. Start backend → Check logs for "AI Assistant is ready"

### For Troubleshooting:
1. Run `verify-groq-setup.js` → Identify the issue
2. Fix the issue (missing file, wrong format, etc.)
3. Run `test-groq-config.js` → Confirm fix worked
4. Optionally run `test-groq-api.js` → Verify API connectivity

---

## 🎯 Tool Selection Guide

| When to use | Which tool |
|-------------|------------|
| First time setup | `verify-groq-setup.js` |
| After changing .env | `test-groq-config.js` |
| API key not working | `test-groq-api.js` |
| Something broken | `verify-groq-setup.js` |
| Before deploying | All three |

---

## 🔐 Security Notes

- **Never commit your .env file** (already in .gitignore)
- API keys in test scripts are for local testing only
- Don't share your API keys in logs or screenshots
- Rotate keys regularly at https://console.groq.com/keys

---

## 📚 Output Examples

### ✅ Successful Setup
```
🔍 GROQ API Configuration Verification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Environment file found: .env
✅ GROQ_API_KEY: Configured
✅ GROQ_MODEL: llama-3.3-70b-versatile
✅ Configuration is complete and valid!
```

### ❌ Missing Configuration
```
🔍 GROQ API Configuration Verification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Environment file not found: .env
Action Required:
1. Copy .env.example to .env
2. Set GROQ_API_KEY in .env file
```

---

## 🆘 Troubleshooting

### Error: "GROQ_API_KEY not configured"
**Solution:** Create .env file and add your API key
```bash
cp .env.example .env
# Edit .env: GROQ_API_KEY=gsk_your_key_here
```

### Error: "Invalid API key format"
**Solution:** API keys must start with `gsk_`
- Check for typos
- Ensure no extra spaces
- Get new key from https://console.groq.com/keys

### Error: "groq-sdk not found"
**Solution:** Install dependencies
```bash
yarn install
```

### Error: "Connection error" (test-groq-api.js)
**Solutions:**
- Check your internet connection
- Verify firewall allows access to groq.com
- Check if Groq API is operational
- Ensure API key is not expired

---

## 📖 Additional Resources

- **GROQ_SETUP_GUIDE.md** - Comprehensive setup guide
- **GROQ_INTEGRATION_STATUS.md** - Quick reference
- **.env.example** - Environment template
- **src/config/app.config.ts** - Configuration implementation
- **src/app/features/assistant/assistant.service.ts** - Service using Groq

---

## 🎉 Success Indicators

When everything is working correctly, you should see:

1. ✅ All verification scripts pass
2. ✅ Backend logs show "AI Assistant is ready"
3. ✅ API endpoints respond (when authenticated)
4. ✅ No errors in console about GROQ_API_KEY

Happy coding! 🚀
