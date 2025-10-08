/**
 * Mock AI Service
 * Provides realistic responses for demo/deployment without AI services
 */

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class MockAI {
  private responses = [
    "I can help you analyze your infrastructure files. Please upload a file to get started.",
    "Based on your configuration, I recommend checking security best practices.",
    "Your infrastructure looks well-structured. Consider adding monitoring and logging.",
    "I notice some optimization opportunities in your setup. Would you like me to elaborate?",
    "This configuration follows good practices. Here are some additional recommendations...",
    "I can see potential improvements for scalability and performance.",
    "Your setup is solid! Consider implementing backup and disaster recovery strategies."
  ];

  private analysisTemplates = {
    security: [
      "🔒 Security Analysis: Your configuration looks secure, but consider adding network policies and RBAC.",
      "🛡️ Security Check: Good practices detected. Recommend enabling audit logging.",
      "🔐 Security Review: Configuration is secure. Consider implementing secrets management."
    ],
    performance: [
      "⚡ Performance: Your setup is optimized. Consider adding horizontal pod autoscaling.",
      "🚀 Performance: Good resource allocation. Monitor CPU and memory usage.",
      "📈 Performance: Configuration is efficient. Consider implementing caching strategies."
    ],
    bestPractices: [
      "✅ Best Practices: Following industry standards. Consider adding health checks.",
      "📋 Best Practices: Good structure. Recommend implementing proper labeling.",
      "🎯 Best Practices: Well-organized configuration. Consider adding resource limits."
    ]
  };

  /**
   * Generate a mock response
   */
  async generateText(prompt: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Analyze prompt to provide relevant response
    if (prompt.toLowerCase().includes('security')) {
      return this.getRandomResponse(this.analysisTemplates.security);
    }
    
    if (prompt.toLowerCase().includes('performance')) {
      return this.getRandomResponse(this.analysisTemplates.performance);
    }
    
    if (prompt.toLowerCase().includes('best practice')) {
      return this.getRandomResponse(this.analysisTemplates.bestPractices);
    }

    return this.getRandomResponse(this.responses);
  }

  /**
   * Chat with mock AI
   */
  async chat(messages: ChatMessage[]): Promise<string> {
    const lastMessage = messages[messages.length - 1];
    return this.generateText(lastMessage.content);
  }

  /**
   * Analyze infrastructure files
   */
  async analyzeInfrastructure(content: string, filename: string): Promise<string> {
    const fileType = filename.split('.').pop()?.toLowerCase();
    
    let analysis = `## Analysis of ${filename}\n\n`;
    
    analysis += this.getRandomResponse(this.analysisTemplates.security) + '\n\n';
    analysis += this.getRandomResponse(this.analysisTemplates.performance) + '\n\n';
    analysis += this.getRandomResponse(this.analysisTemplates.bestPractices) + '\n\n';
    
    if (fileType === 'yaml' || fileType === 'yml') {
      analysis += "📄 **YAML Configuration**: Well-structured YAML detected. Consider using YAML linters for validation.\n\n";
    }
    
    if (fileType === 'json') {
      analysis += "📄 **JSON Configuration**: Valid JSON structure. Consider adding schema validation.\n\n";
    }
    
    analysis += "💡 **Recommendations**:\n";
    analysis += "- Implement proper monitoring and alerting\n";
    analysis += "- Add comprehensive logging\n";
    analysis += "- Consider implementing backup strategies\n";
    analysis += "- Review and update regularly\n\n";
    
    analysis += "🔧 **Next Steps**:\n";
    analysis += "1. Review the recommendations above\n";
    analysis += "2. Implement monitoring solutions\n";
    analysis += "3. Set up automated testing\n";
    analysis += "4. Document your infrastructure\n\n";
    
    analysis += "*This is a demo analysis. For real AI-powered insights, run the application locally with Ollama or configure Hugging Face API.*";

    return analysis;
  }

  /**
   * Generate mock visualization data
   */
  async generateVisualization(content: string, filename: string): Promise<any> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const fileType = filename.split('.').pop()?.toLowerCase();
    
    if (fileType === 'yaml' || fileType === 'yml') {
      return this.getKubernetesMockData();
    }
    
    if (fileType === 'json') {
      return this.getJSONMockData();
    }
    
    return this.getGenericMockData();
  }

  /**
   * Get random response from array
   */
  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Mock Kubernetes visualization data
   */
  private getKubernetesMockData() {
    return {
      nodes: [
        {
          id: "deployment-1",
          type: "deployment",
          label: "Web Application",
          data: {
            name: "web-app",
            kind: "Deployment",
            namespace: "default",
            details: { replicas: 3, image: "nginx:latest" }
          },
          position: { x: 200, y: 100 }
        },
        {
          id: "service-1",
          type: "service",
          label: "Web Service",
          data: {
            name: "web-service",
            kind: "Service",
            namespace: "default",
            details: { type: "ClusterIP", port: 80 }
          },
          position: { x: 400, y: 100 }
        },
        {
          id: "ingress-1",
          type: "ingress",
          label: "Web Ingress",
          data: {
            name: "web-ingress",
            kind: "Ingress",
            namespace: "default",
            details: { host: "example.com" }
          },
          position: { x: 600, y: 100 }
        }
      ],
      edges: [
        {
          id: "edge-1",
          source: "deployment-1",
          target: "service-1",
          label: "exposes",
          type: "service"
        },
        {
          id: "edge-2",
          source: "service-1",
          target: "ingress-1",
          label: "routes to",
          type: "ingress"
        }
      ],
      metadata: {
        totalResources: 3,
        resourceTypes: ["Deployment", "Service", "Ingress"],
        namespaces: ["default"]
      }
    };
  }

  /**
   * Mock JSON configuration data
   */
  private getJSONMockData() {
    return {
      nodes: [
        {
          id: "config-1",
          type: "configuration",
          label: "App Configuration",
          data: {
            name: "app-config",
            kind: "ConfigMap",
            namespace: "default",
            details: { type: "JSON", size: "2KB" }
          },
          position: { x: 300, y: 200 }
        }
      ],
      edges: [],
      metadata: {
        totalResources: 1,
        resourceTypes: ["ConfigMap"],
        namespaces: ["default"]
      }
    };
  }

  /**
   * Generic mock data
   */
  private getGenericMockData() {
    return {
      nodes: [
        {
          id: "resource-1",
          type: "generic",
          label: "Infrastructure Component",
          data: {
            name: "main-component",
            kind: "Resource",
            namespace: "default",
            details: { type: "Generic" }
          },
          position: { x: 300, y: 200 }
        }
      ],
      edges: [],
      metadata: {
        totalResources: 1,
        resourceTypes: ["Resource"],
        namespaces: ["default"]
      }
    };
  }
}

// Export singleton instance
export const mockAI = new MockAI();
