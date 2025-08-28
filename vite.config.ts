import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Debug logging for environment variables
    console.log('Vite config - Environment variables:', {
        mode,
        hasViteGeminiApiKey: !!env.VITE_GEMINI_API_KEY,
        hasGeminiApiKey: !!env.GEMINI_API_KEY,
        viteKeyLength: env.VITE_GEMINI_API_KEY?.length || 0,
        geminiKeyLength: env.GEMINI_API_KEY?.length || 0,
        nodeEnv: process.env.NODE_ENV
    });
    
    const apiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY;
    
    return {
      base: process.env.NODE_ENV === 'production' ? '/AI-Virtual-Try-on/' : '/',
      define: {
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
