/**
 * Simple test script to verify GROQ API key integration
 * Run with: node test-groq-api.js
 */

const Groq = require('groq-sdk').default;

// API key from the issue
const GROQ_API_KEY = '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';

async function testGroqAPI() {
  console.log('🔧 Testing GROQ API Integration...\n');
  
  if (!GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY is not set');
    process.exit(1);
  }
  
  console.log('✅ API Key is set');
  console.log('   Format: gsk_***' + GROQ_API_KEY.slice(-10));
  
  try {
    const groq = new Groq({
      apiKey: GROQ_API_KEY,
    });
    
    console.log('\n📡 Sending test request to Groq API...');
    
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Respond briefly.'
        },
        {
          role: 'user',
          content: 'Say "Hello, GROQ integration is working!" in one sentence.'
        }
      ],
      temperature: 0.7,
      max_tokens: 100,
    });
    
    const response = completion.choices?.[0]?.message?.content;
    
    console.log('\n✅ GROQ API Response:');
    console.log('   ' + response);
    console.log('\n📊 Usage:');
    console.log('   Prompt tokens:', completion.usage.prompt_tokens);
    console.log('   Completion tokens:', completion.usage.completion_tokens);
    console.log('   Total tokens:', completion.usage.total_tokens);
    
    console.log('\n✅ SUCCESS: GROQ API integration is working correctly!');
    console.log('\n📝 Next steps:');
    console.log('   1. Add GROQ_API_KEY to your .env file');
    console.log('   2. Set GROQ_MODEL=llama-3.3-70b-versatile (default)');
    console.log('   3. Start the backend server');
    console.log('   4. Test the /api/assistant endpoints');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ GROQ API Error:');
    console.error('   Status:', error.status || 'N/A');
    console.error('   Message:', error.message);
    
    if (error.status === 401) {
      console.error('\n⚠️  API key is invalid or expired');
      console.error('   Please get a new key from: https://console.groq.com/keys');
    } else if (error.status === 429) {
      console.error('\n⚠️  Rate limit exceeded');
      console.error('   Please wait and try again later');
    }
    
    process.exit(1);
  }
}

testGroqAPI();
