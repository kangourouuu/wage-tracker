
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiApiUrl: process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
}));
