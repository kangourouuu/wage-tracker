# Free AI Model Recommendations for CSV/Excel File Processing

## Overview
This document provides recommendations for free-tier AI models that can read CSV/Excel files, extract information, and support chat functionality as an alternative to Google Gemini.

---

## 🏆 Top Recommendations

### 1. **Claude (Anthropic) - RECOMMENDED**
- **Free Tier**: Available via claude.ai
- **API**: Claude API (free tier available through Anthropic Console)
- **Capabilities**:
  - ✅ Excellent at reading and analyzing CSV/Excel files
  - ✅ Advanced data extraction and summarization
  - ✅ Natural conversation abilities
  - ✅ Can handle large files (up to 200MB with Pro)
  - ✅ Very good at structured data analysis
- **Pricing**:
  - Free tier: Limited messages per day on claude.ai
  - API: Pay-as-you-go (very affordable)
- **Best For**: Complex data analysis, professional work tracking
- **How to Use**: Upload CSV directly in chat, ask questions about your data

### 2. **ChatGPT (OpenAI)**
- **Free Tier**: GPT-3.5-turbo via API or ChatGPT free tier
- **API**: OpenAI API
- **Capabilities**:
  - ✅ Good at CSV/Excel file reading (via Code Interpreter in Plus)
  - ✅ Strong conversational AI
  - ✅ Can process and analyze data
  - ✅ Supports plugins and advanced data analysis
  - ⚠️ Free tier has limitations on file uploads
- **Pricing**:
  - Free tier: ChatGPT free (limited features)
  - API: GPT-3.5-turbo ($0.0015/1K tokens)
  - Plus: $20/month (includes GPT-4 + Advanced Data Analysis)
- **Best For**: General purpose, good balance of cost and capability

### 3. **Groq Cloud API** ⭐ BEST FREE OPTION
- **Free Tier**: Very generous free API access
- **Models**: Llama 3, Mixtral, Gemma
- **Capabilities**:
  - ✅ Fast inference (fastest API available)
  - ✅ Free tier: 14,400 requests/day
  - ✅ Can process text from CSV files
  - ⚠️ Requires parsing CSV to text first
  - ✅ Good for chat functionality
- **Pricing**: FREE with generous limits
- **API Endpoint**: https://api.groq.com
- **Best For**: High-volume, fast responses, cost-sensitive applications
- **Implementation**:
```javascript
// Example: Parse CSV then send to Groq
const csvData = parseCSV(file);
const prompt = `Analyze this work data: ${csvData}`;
const response = await groq.chat.completions.create({
  model: "llama3-70b",
  messages: [{ role: "user", content: prompt }]
});
```

### 4. **Mistral AI**
- **Free Tier**: Mistral-7B (open source) or API trial
- **Capabilities**:
  - ✅ Strong open-source model
  - ✅ Can be hosted locally for free
  - ✅ Good at text processing
  - ⚠️ Requires CSV to text conversion
  - ✅ Excellent for chat
- **Pricing**: Free (open source) or API with free trial
- **Best For**: Privacy-focused, self-hosted solutions

### 5. **Hugging Face Inference API**
- **Free Tier**: Multiple free models available
- **Models**: Llama, Mistral, Falcon, and more
- **Capabilities**:
  - ✅ Many models to choose from
  - ✅ Free inference for smaller models
  - ✅ Can process CSV data as text
  - ✅ Good chat capabilities
- **Pricing**: Free tier available, pay-as-you-go for larger models
- **Best For**: Experimentation, multiple model testing

### 6. **Google AI Studio (Gemini)**
- **Free Tier**: Gemini 1.5 Flash (free with limits)
- **Capabilities**:
  - ✅ Native file upload support
  - ✅ Good at structured data
  - ✅ Free tier is generous
  - ✅ Integrated with Google Workspace
- **Note**: This is what you're currently using or considering to replace

---

## 📊 Comparison Table

| Model | Free Tier | CSV/Excel Support | Chat Quality | Speed | Best For |
|-------|-----------|-------------------|--------------|-------|----------|
| **Groq Cloud** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ (text) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | High-volume, fast |
| **Claude** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Data analysis |
| **ChatGPT** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | General purpose |
| **Mistral** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ (text) | ⭐⭐⭐⭐ | ⭐⭐⭐ | Privacy/self-host |
| **HuggingFace** | ⭐⭐⭐⭐ | ⭐⭐⭐ (text) | ⭐⭐⭐ | ⭐⭐⭐ | Experimentation |
| **Gemini** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Google ecosystem |

---

## 💡 Implementation Strategy for Wage Tracker

### Recommended Approach: **Groq Cloud API**

**Why Groq?**
1. **Completely free** with very generous limits (14,400 requests/day)
2. **Extremely fast** inference (fastest API available)
3. **Good model quality** (Llama 3 70B, Mixtral 8x7B)
4. **Easy integration** with existing chat functionality
5. **No credit card required** for free tier

### Implementation Steps:

#### 1. Install Groq SDK
```bash
npm install groq-sdk
```

#### 2. Backend Integration (NestJS)
```typescript
// apps/backend/src/features/assistant/assistant.service.ts
import Groq from 'groq-sdk';

export class AssistantService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY // Free key from https://console.groq.com
    });
  }

  async analyzeWorkEntries(csvData: string, userQuery: string) {
    const prompt = `You are a helpful assistant analyzing work entry data.

Work Entry Data (CSV format):
${csvData}

User Question: ${userQuery}

Please provide a clear and concise answer based on the data.`;

    const completion = await this.groq.chat.completions.create({
      model: "llama3-70b-8192", // or "mixtral-8x7b-32768"
      messages: [
        { role: "system", content: "You are a helpful work tracking assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    return completion.choices[0].message.content;
  }

  async exportToCSV(workEntries: any[]): Promise<string> {
    // Convert work entries to CSV format
    const headers = ['Date', 'Job', 'Hours', 'Break', 'Earnings'];
    const rows = workEntries.map(entry => [
      new Date(entry.startTime).toLocaleDateString(),
      entry.job.name,
      entry.hoursWorked,
      entry.breakDuration,
      entry.earnings
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  async chatWithContext(messages: Array<{role: string, content: string}>) {
    const completion = await this.groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024
    });

    return completion.choices[0].message.content;
  }
}
```

#### 3. Add CSV Export Feature
```typescript
// Add to your work entries controller
@Get('export/csv')
async exportCSV(@GetCurrentUserId() userId: string) {
  const entries = await this.workEntryService.findAll(userId);
  const csvData = await this.assistantService.exportToCSV(entries);

  return {
    data: csvData,
    filename: `work-entries-${new Date().toISOString()}.csv`
  };
}
```

#### 4. Frontend Integration
```typescript
// Update AssistantPanel to use CSV export
const exportAndAnalyze = async () => {
  // Export work entries to CSV
  const response = await api.get('/work-entries/export/csv');
  const csvData = response.data.data;

  // Send to AI for analysis
  const analysis = await api.post('/assistant/analyze', {
    csvData,
    query: userMessage
  });

  setMessages([...messages, { role: 'assistant', content: analysis.data }]);
};
```

---

## 🔧 Alternative: Local Processing (No API Costs)

### Use Ollama (100% Free, Local AI)

**Setup:**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull llama3:8b  # or mistral, codellama, etc.

# Run server
ollama serve
```

**Backend Integration:**
```typescript
import axios from 'axios';

async function chatWithOllama(prompt: string) {
  const response = await axios.post('http://localhost:11434/api/generate', {
    model: 'llama3:8b',
    prompt: prompt,
    stream: false
  });

  return response.data.response;
}
```

**Pros:**
- 100% free
- Unlimited usage
- Complete privacy
- No internet required

**Cons:**
- Requires local hardware
- Slower than cloud APIs
- Needs setup on server

---

## 📝 CSV/Excel File Processing Libraries

To work with files before sending to AI:

### For CSV:
```bash
npm install papaparse
npm install @types/papaparse --save-dev
```

```typescript
import Papa from 'papaparse';

function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error)
    });
  });
}
```

### For Excel:
```bash
npm install xlsx
```

```typescript
import * as XLSX from 'xlsx';

function parseExcel(file: File): Promise<any[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      resolve(jsonData);
    };
    reader.readAsBinaryString(file);
  });
}
```

---

## 🎯 Final Recommendation

**For your Wage Tracker app, I recommend:**

### **Primary Choice: Groq Cloud API**
- ✅ 100% free with generous limits
- ✅ Fast responses (better UX)
- ✅ Easy to implement
- ✅ Good model quality (Llama 3 70B)
- ✅ No credit card required

### **Backup Choice: Claude API**
- ✅ Better at complex data analysis
- ✅ Native file understanding
- ✅ More natural conversations
- ⚠️ Costs money after free trial

### **Budget Choice: Ollama (Local)**
- ✅ 100% free forever
- ✅ Unlimited usage
- ✅ Complete privacy
- ⚠️ Requires server setup

---

## 🚀 Quick Start Guide

1. **Sign up for Groq**: https://console.groq.com
2. **Get your API key** (free)
3. **Install SDK**: `npm install groq-sdk`
4. **Add to `.env`**: `GROQ_API_KEY=your_key_here`
5. **Update AssistantService** with Groq integration
6. **Test the chat functionality**

The implementation is very similar to Gemini but with better free tier limits!

---

## 📚 Additional Resources

- **Groq Documentation**: https://console.groq.com/docs
- **Groq Pricing**: https://wow.groq.com/pricing (Free tier: 14,400 req/day)
- **Ollama**: https://ollama.com
- **Hugging Face**: https://huggingface.co/inference-api
- **Mistral AI**: https://mistral.ai

---

## ⚡ Performance Comparison

| Model | Speed (tokens/sec) | Quality | Cost (Free Tier) |
|-------|-------------------|---------|------------------|
| Groq Llama 3 | ~750 | ⭐⭐⭐⭐ | 14,400 req/day |
| Claude | ~50 | ⭐⭐⭐⭐⭐ | Limited |
| Gemini Flash | ~100 | ⭐⭐⭐⭐ | 1,500 req/day |
| Ollama Local | ~20-50 | ⭐⭐⭐⭐ | Unlimited |

**Groq is significantly faster** than alternatives, making it ideal for real-time chat!
