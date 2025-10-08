/**
 * Hugging Face Inference API Integration
 * Free AI service for deployment environments
 */

import { appConfig } from '../config';

export interface HuggingFaceResponse {
  generated_text?: string;
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class HuggingFaceAI {
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor() {
    if (!appConfig.ai.apiKey) {
      throw new Error('Hugging Face API key not configured');
    }
    
    this.apiKey = appConfig.ai.apiKey;
    this.model = appConfig.ai.model || 'microsoft/DialoGPT-medium';
    this.baseUrl = appConfig.ai.baseUrl || 'https://api-inference.huggingface.co/models';
  }

  /**
   * Generate text using Hugging Face Inference API
   */
  async generateText(prompt: string, maxLength: number = 500): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: maxLength,
            temperature: 0.7,
            do_sample: true,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const data: HuggingFaceResponse[] = await response.json();
      
      if (data.length === 0 || !data[0].generated_text) {
        throw new Error('No response from Hugging Face API');
      }

      return data[0].generated_text.trim();
    } catch (error) {
      console.error('Hugging Face API error:', error);
      throw error;
    }
  }

  /**
   * Chat with the AI model
   */
  async chat(messages: ChatMessage[]): Promise<string> {
    // Convert messages to a single prompt
    const prompt = messages
      .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
      .join('\n') + '\nAssistant:';

    return this.generateText(prompt);
  }

  /**
   * Analyze infrastructure files
   */
  async analyzeInfrastructure(content: string, filename: string): Promise<string> {
    const prompt = `Analyze this ${filename} infrastructure file and provide insights:

${content}

Please provide:
1. Security recommendations
2. Performance optimizations
3. Best practices
4. Potential issues

Analysis:`;

    return this.generateText(prompt, 800);
  }

  /**
   * Generate infrastructure visualization data
   */
  async generateVisualization(content: string, filename: string): Promise<any> {
    const prompt = `Analyze this ${filename} and create a JSON structure for visualization:

${content}

Return a JSON object with nodes and edges for infrastructure visualization. Include:
- nodes: array of resources with id, type, label, data, position
- edges: array of relationships with id, source, target, label, type
- metadata: totalResources, resourceTypes, namespaces

JSON:`;

    try {
      const response = await this.generateText(prompt, 1000);
      
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback to mock data
      return this.getMockVisualizationData();
    } catch (error) {
      console.error('Error generating visualization:', error);
      return this.getMockVisualizationData();
    }
  }

  /**
   * Mock visualization data fallback
   */
  private getMockVisualizationData() {
    return {
      nodes: [
        {
          id: "resource-1",
          type: "deployment",
          label: "Sample Application",
          data: {
            name: "app-deployment",
            kind: "Deployment",
            namespace: "default",
            details: { replicas: 3 }
          },
          position: { x: 200, y: 200 }
        }
      ],
      edges: [],
      metadata: {
        totalResources: 1,
        resourceTypes: ["Deployment"],
        namespaces: ["default"]
      }
    };
  }
}

// Export singleton instance
export const huggingFaceAI = new HuggingFaceAI();
