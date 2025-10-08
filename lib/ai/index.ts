/**
 * Unified AI Service Interface
 * Automatically selects the best available AI provider
 */

import { appConfig, isAIAvailable, isHuggingFace, isOllama, isMockMode } from '../config';
import { getHuggingFaceAI } from './huggingface';
import { mockAI } from './mock';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  provider: string;
  isMock: boolean;
}

export class AIService {
  private provider: string;

  constructor() {
    this.provider = appConfig.ai.provider;
  }

  /**
   * Generate text response
   */
  async generateText(prompt: string, maxLength?: number): Promise<AIResponse> {
    try {
      let content: string;

      if (isHuggingFace()) {
        content = await getHuggingFaceAI().generateText(prompt, maxLength);
      } else if (isMockMode()) {
        content = await mockAI.generateText(prompt);
      } else {
        throw new Error('No AI provider available');
      }

      return {
        content,
        provider: this.provider,
        isMock: isMockMode()
      };
    } catch (error) {
      console.error('AI service error:', error);
      
      // Fallback to mock if other providers fail
      if (!isMockMode()) {
        console.log('Falling back to mock AI');
        const content = await mockAI.generateText(prompt);
        return {
          content,
          provider: 'mock-fallback',
          isMock: true
        };
      }
      
      throw error;
    }
  }

  /**
   * Chat with AI
   */
  async chat(messages: ChatMessage[]): Promise<AIResponse> {
    try {
      let content: string;

      if (isHuggingFace()) {
        content = await getHuggingFaceAI().chat(messages);
      } else if (isMockMode()) {
        content = await mockAI.chat(messages);
      } else {
        throw new Error('No AI provider available');
      }

      return {
        content,
        provider: this.provider,
        isMock: isMockMode()
      };
    } catch (error) {
      console.error('AI chat error:', error);
      
      // Fallback to mock
      if (!isMockMode()) {
        const content = await mockAI.chat(messages);
        return {
          content,
          provider: 'mock-fallback',
          isMock: true
        };
      }
      
      throw error;
    }
  }

  /**
   * Analyze infrastructure files
   */
  async analyzeInfrastructure(content: string, filename: string): Promise<AIResponse> {
    try {
      let analysis: string;

      if (isHuggingFace()) {
        analysis = await getHuggingFaceAI().analyzeInfrastructure(content, filename);
      } else if (isMockMode()) {
        analysis = await mockAI.analyzeInfrastructure(content, filename);
      } else {
        throw new Error('No AI provider available');
      }

      return {
        content: analysis,
        provider: this.provider,
        isMock: isMockMode()
      };
    } catch (error) {
      console.error('Infrastructure analysis error:', error);
      
      // Fallback to mock
      if (!isMockMode()) {
        const analysis = await mockAI.analyzeInfrastructure(content, filename);
        return {
          content: analysis,
          provider: 'mock-fallback',
          isMock: true
        };
      }
      
      throw error;
    }
  }

  /**
   * Generate visualization data
   */
  async generateVisualization(content: string, filename: string): Promise<any> {
    try {
      if (isHuggingFace()) {
        return await getHuggingFaceAI().generateVisualization(content, filename);
      } else if (isMockMode()) {
        return await mockAI.generateVisualization(content, filename);
      } else {
        throw new Error('No AI provider available');
      }
    } catch (error) {
      console.error('Visualization generation error:', error);
      
      // Fallback to mock
      if (!isMockMode()) {
        return await mockAI.generateVisualization(content, filename);
      }
      
      throw error;
    }
  }

  /**
   * Get current provider info
   */
  getProviderInfo() {
    return {
      provider: this.provider,
      isAvailable: isAIAvailable(),
      isMock: isMockMode(),
      isHuggingFace: isHuggingFace(),
      isOllama: isOllama()
    };
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export types
export type { ChatMessage, AIResponse };
