/**
 * Application Configuration
 * Handles different deployment environments and AI service options
 */

export interface AIConfig {
  provider: 'ollama' | 'huggingface' | 'mock';
  baseUrl?: string;
  apiKey?: string;
  model?: string;
}

export interface AppConfig {
  isProduction: boolean;
  isVercel: boolean;
  isLocal: boolean;
  ai: AIConfig;
  features: {
    fileUpload: boolean;
    aiChat: boolean;
    visualization: boolean;
    authentication: boolean;
  };
}

// Detect environment
const isVercel = process.env.VERCEL === '1';
const isProduction = process.env.NODE_ENV === 'production';
const isLocal = !isVercel && !isProduction;

// Determine AI provider based on environment
function getAIProvider(): AIConfig {
  // Check for Hugging Face API key first
  if (process.env.HUGGINGFACE_API_KEY) {
    return {
      provider: 'huggingface',
      apiKey: process.env.HUGGINGFACE_API_KEY,
      model: process.env.HUGGINGFACE_MODEL || 'microsoft/DialoGPT-medium',
      baseUrl: 'https://api-inference.huggingface.co/models'
    };
  }

  // Check for Ollama in local environment
  if (isLocal && process.env.OLLAMA_BASE_URL) {
    return {
      provider: 'ollama',
      baseUrl: process.env.OLLAMA_BASE_URL,
      model: process.env.OLLAMA_MODEL || 'llama3'
    };
  }

  // Fallback to mock mode
  return {
    provider: 'mock'
  };
}

// Get application configuration
export function getAppConfig(): AppConfig {
  const ai = getAIProvider();
  
  return {
    isProduction,
    isVercel,
    isLocal,
    ai,
    features: {
      fileUpload: true,
      aiChat: ai.provider !== 'mock',
      visualization: true,
      authentication: !isVercel // Disable auth in Vercel for demo
    }
  };
}

// Export singleton config
export const appConfig = getAppConfig();

// Helper functions
export const isAIAvailable = () => appConfig.ai.provider !== 'mock';
export const isHuggingFace = () => appConfig.ai.provider === 'huggingface';
export const isOllama = () => appConfig.ai.provider === 'ollama';
export const isMockMode = () => appConfig.ai.provider === 'mock';
