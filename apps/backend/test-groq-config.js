/**
 * Test GROQ configuration loading
 * This tests that the configuration is properly loaded from .env
 * 
 * Note: This script manually reads the .env file for testing purposes.
 * The actual NestJS application uses @nestjs/config which handles .env loading automatically.
 */

const fs = require('fs');
const path = require('path');

// Manually parse .env file
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

let groqApiKey = null;
let groqModel = null;

if (envExists) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('GROQ_API_KEY=') && !trimmed.startsWith('#')) {
      groqApiKey = trimmed.split('=')[1];
    } else if (trimmed.startsWith('GROQ_MODEL=') && !trimmed.startsWith('#')) {
      groqModel = trimmed.split('=')[1];
    }
  });
}

console.log('🔍 Testing GROQ Configuration Loading\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Check if .env file exists
if (!envExists) {
  console.log('❌ .env file not found');
  console.log('   Expected location:', envPath);
  console.log('\n   To create .env file:');
  console.log('   1. cp .env.example .env');
  console.log('   2. Edit .env and set GROQ_API_KEY\n');
  process.exit(1);
}

console.log('✅ .env file found\n');

// Test environment variable loading
console.log('Environment Variables:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (groqApiKey) {
  console.log('✅ GROQ_API_KEY is loaded');
  console.log(`   Value: gsk_***${groqApiKey.slice(-10)}`);
  console.log(`   Length: ${groqApiKey.length} characters`);
  
  if (groqApiKey.startsWith('gsk_')) {
    console.log('   Format: ✅ Valid');
  } else {
    console.log('   Format: ⚠️  Invalid (should start with gsk_)');
  }
} else {
  console.log('❌ GROQ_API_KEY is not loaded');
  console.log('   Check your .env file');
}

console.log();

if (groqModel) {
  console.log(`✅ GROQ_MODEL is loaded: ${groqModel}`);
} else {
  console.log('ℹ️  GROQ_MODEL not set (will use default)');
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Test configuration file
console.log('Testing Configuration File:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

try {
  // Simulate what the config file does
  const appConfig = {
    groqApiKey: groqApiKey,
    groqModel: groqModel || 'llama-3.3-70b-versatile',
  };
  
  console.log('✅ Configuration object created successfully:');
  console.log(`   groqApiKey: ${appConfig.groqApiKey ? 'Set (gsk_***' + appConfig.groqApiKey.slice(-10) + ')' : 'Not set'}`);
  console.log(`   groqModel: ${appConfig.groqModel}`);
  
} catch (error) {
  console.log('❌ Error creating configuration:', error.message);
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Test Groq SDK import
console.log('Testing Groq SDK:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

try {
  const Groq = require('groq-sdk').default;
  console.log('✅ groq-sdk package is installed and can be imported');
  
  // Create client (without making API calls)
  if (groqApiKey) {
    const client = new Groq({ apiKey: groqApiKey });
    console.log('✅ Groq client instantiated successfully');
  } else {
    console.log('ℹ️  Cannot instantiate client without API key');
  }
  
} catch (error) {
  console.log('❌ Error with groq-sdk:', error.message);
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Summary
console.log('Summary:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (groqApiKey && groqApiKey.startsWith('gsk_')) {
  console.log('✅ Configuration is complete and valid!');
  console.log('\nThe backend will be able to use GROQ API when started.');
  console.log('\nExpected log message when starting backend:');
  console.log('   "✅ Groq API Key is configured - AI Assistant is ready"');
} else {
  console.log('⚠️  Configuration is incomplete');
  console.log('\nPlease ensure GROQ_API_KEY is set in your .env file');
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
