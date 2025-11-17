#!/usr/bin/env node

/**
 * GROQ API Key Verification Script
 * 
 * This script checks if the GROQ_API_KEY environment variable is set
 * and validates its format without exposing the actual key.
 * 
 * Usage:
 *   node verify-groq-setup.js
 * 
 * Or with a specific .env file:
 *   node verify-groq-setup.js .env
 */

const fs = require('fs');
const path = require('path');

// Load .env file if specified
const envFile = process.argv[2] || '.env';
const envPath = path.join(__dirname, envFile);

console.log('🔍 GROQ API Configuration Verification\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Check if .env file exists
if (fs.existsSync(envPath)) {
  console.log(`✅ Environment file found: ${envFile}`);
  
  // Load .env file
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  
  let groqApiKey = null;
  let groqModel = null;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('GROQ_API_KEY=')) {
      groqApiKey = trimmed.split('=')[1];
    } else if (trimmed.startsWith('GROQ_MODEL=')) {
      groqModel = trimmed.split('=')[1];
    }
  });
  
  // Validate GROQ_API_KEY
  console.log('\n📝 Configuration Check:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (!groqApiKey || groqApiKey === 'your-groq-api-key-here') {
    console.log('❌ GROQ_API_KEY: Not configured');
    console.log('   Status: Missing or using placeholder value');
    console.log('   Action Required: Set a valid Groq API key\n');
    console.log('   Get your API key from: https://console.groq.com/keys');
  } else {
    // Validate format
    if (groqApiKey.startsWith('gsk_')) {
      console.log('✅ GROQ_API_KEY: Configured');
      console.log(`   Format: Valid (gsk_***${groqApiKey.slice(-10)})`);
      console.log(`   Length: ${groqApiKey.length} characters`);
    } else {
      console.log('⚠️  GROQ_API_KEY: Set but format may be incorrect');
      console.log('   Expected format: gsk_...');
      console.log(`   Current format: ${groqApiKey.substring(0, 4)}***`);
    }
  }
  
  // Validate GROQ_MODEL
  if (!groqModel) {
    console.log('\n⚠️  GROQ_MODEL: Not set');
    console.log('   Will use default: llama-3.3-70b-versatile');
  } else {
    console.log(`\n✅ GROQ_MODEL: ${groqModel}`);
    
    // List of known Groq models
    const knownModels = [
      'llama-3.3-70b-versatile',
      'llama3-70b-8192',
      'mixtral-8x7b-32768',
      'gemma2-9b-it',
      'llama-3.1-70b-versatile',
      'llama-3.1-8b-instant',
    ];
    
    if (knownModels.includes(groqModel)) {
      console.log('   Status: Valid model');
    } else {
      console.log('   Status: Unknown model (may still work)');
      console.log(`   Known models: ${knownModels.join(', ')}`);
    }
  }
  
} else {
  console.log(`❌ Environment file not found: ${envFile}`);
  console.log(`   Expected location: ${envPath}\n`);
  console.log('   Action Required:');
  console.log('   1. Copy .env.example to .env');
  console.log('   2. Set GROQ_API_KEY in .env file');
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Check code integration
console.log('📦 Code Integration Status:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const checkFile = (filePath, description) => {
  const fullPath = path.join(__dirname, 'src', filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${description}`);
    return true;
  } else {
    console.log(`❌ ${description} (file not found)`);
    return false;
  }
};

checkFile('config/app.config.ts', 'Configuration file');
checkFile('app/features/assistant/assistant.service.ts', 'Assistant service');
checkFile('app/features/assistant/assistant.module.ts', 'Assistant module');
checkFile('app/features/assistant/assistant.controller.ts', 'Assistant controller');

// Check package.json for groq-sdk
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  if (packageJson.dependencies && packageJson.dependencies['groq-sdk']) {
    console.log(`✅ groq-sdk package (v${packageJson.dependencies['groq-sdk']})`);
  } else {
    console.log('❌ groq-sdk package not found in dependencies');
    console.log('   Run: yarn add groq-sdk');
  }
} else {
  console.log('⚠️  package.json not found');
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Summary
console.log('📊 Summary:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const groqApiKey = process.env.GROQ_API_KEY;
const isConfigured = groqApiKey && groqApiKey !== 'your-groq-api-key-here' && groqApiKey.startsWith('gsk_');

if (isConfigured || (fs.existsSync(envPath) && fs.readFileSync(envPath, 'utf-8').includes('GROQ_API_KEY=gsk_'))) {
  console.log('✅ GROQ integration is configured and ready!');
  console.log('\n📝 Next steps:');
  console.log('   1. Start the backend: yarn start:dev');
  console.log('   2. Check logs for "AI Assistant is ready"');
  console.log('   3. Test the /api/assistant endpoints');
} else {
  console.log('⚠️  GROQ integration needs configuration');
  console.log('\n📝 Next steps:');
  console.log('   1. Get API key from: https://console.groq.com/keys');
  console.log('   2. Create .env file: cp .env.example .env');
  console.log('   3. Set GROQ_API_KEY in .env');
  console.log('   4. Start the backend: yarn start:dev');
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('For detailed setup instructions, see: GROQ_SETUP_GUIDE.md\n');
