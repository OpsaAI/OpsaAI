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
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('security') || lowerPrompt.includes('secure')) {
      return this.getRandomResponse(this.analysisTemplates.security);
    }
    
    if (lowerPrompt.includes('performance') || lowerPrompt.includes('optimize') || lowerPrompt.includes('speed')) {
      return this.getRandomResponse(this.analysisTemplates.performance);
    }
    
    if (lowerPrompt.includes('best practice') || lowerPrompt.includes('recommendation')) {
      return this.getRandomResponse(this.analysisTemplates.bestPractices);
    }
    
    if (lowerPrompt.includes('what is') || lowerPrompt.includes('explain') || lowerPrompt.includes('tell me about')) {
      return this.getDetailedExplanation(prompt);
    }
    
    if (lowerPrompt.includes('filename') || lowerPrompt.includes('file name') || lowerPrompt.includes('name')) {
      return this.getFileNameResponse(prompt);
    }
    
    if (lowerPrompt.includes('type') || lowerPrompt.includes('pdf') || lowerPrompt.includes('json') || lowerPrompt.includes('yaml')) {
      return this.getFileTypeResponse(prompt);
    }
    
    if (lowerPrompt.includes('guide') || lowerPrompt.includes('help') || lowerPrompt.includes('how to')) {
      return this.getGuidanceResponse(prompt);
    }

    return this.getRandomResponse(this.responses);
  }

  /**
   * Get detailed explanation based on prompt
   */
  private getDetailedExplanation(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('infra') || lowerPrompt.includes('infrastructure')) {
      return `## Infrastructure Analysis Guide

Your infrastructure configuration contains several key components that work together to provide a robust and scalable system. Here's what I found:

### 🏗️ **Architecture Overview**
- **Configuration Type**: JSON/YAML based infrastructure definition
- **Deployment Model**: Containerized application deployment
- **Resource Management**: Automated scaling and resource allocation

### 🔧 **Key Components**
1. **Application Layer**: Your main application services
2. **Data Layer**: Database and storage configurations
3. **Network Layer**: Service discovery and load balancing
4. **Security Layer**: Authentication and authorization

### 📊 **Current State**
- Configuration is well-structured and follows industry standards
- Resource allocation appears balanced
- Security configurations are in place

### 🚀 **Next Steps**
1. Review the detailed analysis above for specific recommendations
2. Implement monitoring and alerting systems
3. Set up automated testing and deployment pipelines
4. Consider implementing backup and disaster recovery strategies

Would you like me to elaborate on any specific aspect of your infrastructure?`;
    }
    
    return `I can provide detailed analysis of your infrastructure configuration. Based on your uploaded file, I can help you understand:

- **Resource configurations** and their implications
- **Security settings** and potential improvements  
- **Performance optimizations** and scaling strategies
- **Best practices** for your specific setup
- **Implementation guidance** for improvements

What specific aspect would you like me to explain in detail?`;
  }

  /**
   * Get guidance response
   */
  private getGuidanceResponse(prompt: string): string {
    return `## Infrastructure Guidance

I'm here to help you understand and optimize your infrastructure! Here's how I can assist:

### 🔍 **Analysis Capabilities**
- **Security Review**: Identify potential security risks and improvements
- **Performance Optimization**: Suggest ways to improve efficiency and speed
- **Best Practices**: Ensure your configuration follows industry standards
- **Resource Management**: Optimize resource allocation and scaling

### 📋 **What You Can Ask**
- "What security risks do I have?"
- "How can I improve performance?"
- "What are the best practices for this setup?"
- "How do I implement monitoring?"
- "What should I do next?"

### 🎯 **Immediate Actions**
1. **Review the detailed analysis** I provided above
2. **Focus on security** - ensure all sensitive data is properly managed
3. **Implement monitoring** - set up alerts and logging
4. **Plan for scaling** - consider future growth requirements

### 💡 **Pro Tips**
- Regular configuration reviews help maintain security
- Automated testing prevents deployment issues
- Documentation is crucial for team collaboration
- Backup strategies protect against data loss

What specific area would you like guidance on?`;
  }

  /**
   * Get file name response
   */
  private getFileNameResponse(prompt: string): string {
    return `## File Information

Based on your uploaded file, here are the details:

### 📄 **File Details**
- **Filename**: The file you uploaded appears to be a configuration file
- **File Type**: This is a text-based configuration file
- **Purpose**: Infrastructure or application configuration

### 🔍 **What This File Contains**
Your file contains configuration data that defines:
- **Resource specifications** for your infrastructure
- **Configuration parameters** for applications or services
- **Deployment settings** and environment configurations

### 📊 **File Analysis**
- **Format**: Text-based configuration (likely JSON, YAML, or similar)
- **Size**: Contains multiple configuration parameters
- **Structure**: Well-organized configuration data

### 💡 **Next Steps**
1. **Review the detailed analysis** I provided above for specific insights
2. **Check the file type** - look at the file extension to confirm the format
3. **Validate the configuration** - ensure all required parameters are present
4. **Test the configuration** - verify it works in your environment

Would you like me to analyze the specific content of this file in more detail?`;
  }

  /**
   * Get file type response
   */
  private getFileTypeResponse(prompt: string): string {
    return `## File Type Analysis

Let me help you understand what type of file you've uploaded:

### 📋 **File Type Identification**
Your uploaded file appears to be a **text-based configuration file**. Here's what I can tell you:

### 🔍 **Possible File Types**
Based on the content structure, this could be:
- **JSON Configuration**: JavaScript Object Notation format
- **YAML Configuration**: YAML Ain't Markup Language format  
- **Text Configuration**: Plain text configuration file
- **Infrastructure Definition**: Infrastructure as Code file

### 📊 **File Characteristics**
- **Format**: Structured text data
- **Purpose**: Configuration or infrastructure definition
- **Content**: Contains parameters, settings, and specifications
- **Usage**: Typically used for application or infrastructure setup

### 🎯 **How to Identify the Exact Type**
1. **Check the file extension** (e.g., .json, .yaml, .yml, .txt)
2. **Look at the content structure** - JSON uses `{}` and `[]`, YAML uses indentation
3. **Review the file header** - often contains format indicators

### 💡 **What This Means**
- **JSON**: Structured data format, commonly used for APIs and configurations
- **YAML**: Human-readable format, popular for Kubernetes and Docker configurations
- **Text**: Plain text format, used for simple configurations

Would you like me to analyze the specific content to determine the exact format and provide detailed insights?`;
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
    
    // Analyze the actual content
    const contentAnalysis = this.analyzeFileContent(content, fileType);
    
    let analysis = `## Detailed Analysis of ${filename}\n\n`;
    
    analysis += `📄 **File Type**: ${fileType?.toUpperCase() || 'Unknown'}\n`;
    analysis += `📊 **File Size**: ${content.length} characters\n\n`;
    
    analysis += "### 🔍 **Content Analysis**\n";
    analysis += contentAnalysis + '\n\n';
    
    analysis += "### 🔒 **Security Assessment**\n";
    analysis += this.getRandomResponse(this.analysisTemplates.security) + '\n\n';
    
    analysis += "### ⚡ **Performance Review**\n";
    analysis += this.getRandomResponse(this.analysisTemplates.performance) + '\n\n';
    
    analysis += "### ✅ **Best Practices Check**\n";
    analysis += this.getRandomResponse(this.analysisTemplates.bestPractices) + '\n\n';
    
    analysis += "### 💡 **Specific Recommendations**\n";
    analysis += this.getSpecificRecommendations(content, fileType) + '\n\n';
    
    analysis += "### 🔧 **Implementation Steps**\n";
    analysis += "1. **Immediate Actions**:\n";
    analysis += "   - Review security configurations\n";
    analysis += "   - Validate resource limits\n";
    analysis += "   - Check naming conventions\n\n";
    analysis += "2. **Short-term Improvements**:\n";
    analysis += "   - Implement monitoring and alerting\n";
    analysis += "   - Add comprehensive logging\n";
    analysis += "   - Set up automated testing\n\n";
    analysis += "3. **Long-term Strategy**:\n";
    analysis += "   - Implement backup and disaster recovery\n";
    analysis += "   - Consider infrastructure as code\n";
    analysis += "   - Plan for scalability\n\n";
    
    analysis += "### 📚 **Additional Resources**\n";
    analysis += "- [Infrastructure Best Practices](https://docs.example.com)\n";
    analysis += "- [Security Guidelines](https://security.example.com)\n";
    analysis += "- [Performance Optimization](https://perf.example.com)\n\n";
    
    analysis += "---\n";
    analysis += "*This is a comprehensive demo analysis. For real-time AI insights, configure Hugging Face API or run locally with Ollama.*";

    return analysis;
  }

  /**
   * Analyze file content based on type
   */
  private analyzeFileContent(content: string, fileType?: string): string {
    let analysis = "";
    
    if (fileType === 'json') {
      try {
        const jsonData = JSON.parse(content);
        analysis += `✅ **Valid JSON Structure**: The file contains valid JSON with ${Object.keys(jsonData).length} top-level properties.\n\n`;
        
        // Analyze JSON structure
        if (jsonData.apiVersion) {
          analysis += `📋 **API Version**: ${jsonData.apiVersion}\n`;
        }
        if (jsonData.kind) {
          analysis += `🏷️ **Resource Type**: ${jsonData.kind}\n`;
        }
        if (jsonData.metadata?.name) {
          analysis += `📝 **Resource Name**: ${jsonData.metadata.name}\n`;
        }
        if (jsonData.spec) {
          analysis += `⚙️ **Configuration**: Contains specification details\n`;
        }
        
        // Check for common patterns
        if (content.includes('image:')) {
          analysis += `🐳 **Container Images**: Found container image references\n`;
        }
        if (content.includes('ports:')) {
          analysis += `🔌 **Network Ports**: Port configurations detected\n`;
        }
        if (content.includes('resources:')) {
          analysis += `💾 **Resource Limits**: Resource constraints defined\n`;
        }
        
      } catch (error) {
        analysis += `❌ **JSON Validation**: Invalid JSON structure detected\n`;
      }
    } else if (fileType === 'yaml' || fileType === 'yml') {
      analysis += `✅ **YAML Configuration**: Well-structured YAML detected\n\n`;
      
      // Analyze YAML content
      if (content.includes('apiVersion:')) {
        analysis += `📋 **Kubernetes Resource**: Kubernetes YAML configuration\n`;
      }
      if (content.includes('kind:')) {
        analysis += `🏷️ **Resource Kind**: Kubernetes resource type defined\n`;
      }
      if (content.includes('metadata:')) {
        analysis += `📝 **Metadata**: Resource metadata configured\n`;
      }
      if (content.includes('spec:')) {
        analysis += `⚙️ **Specification**: Resource specification defined\n`;
      }
      
      // Count resources
      const resourceCount = (content.match(/kind:/g) || []).length;
      if (resourceCount > 0) {
        analysis += `📊 **Resource Count**: ${resourceCount} resources defined\n`;
      }
    } else {
      analysis += `📄 **Text File**: Plain text configuration file\n`;
      analysis += `📊 **Content Length**: ${content.length} characters\n`;
    }
    
    return analysis;
  }

  /**
   * Get specific recommendations based on content
   */
  private getSpecificRecommendations(content: string, fileType?: string): string {
    let recommendations = "";
    
    if (fileType === 'json' || fileType === 'yaml' || fileType === 'yml') {
      // Security recommendations
      if (content.includes('password') || content.includes('secret')) {
        recommendations += "🔐 **Security**: Consider using secrets management for sensitive data\n";
      }
      
      // Resource recommendations
      if (!content.includes('resources:')) {
        recommendations += "💾 **Resources**: Add resource limits and requests for better resource management\n";
      }
      
      // Health check recommendations
      if (!content.includes('livenessProbe') && !content.includes('readinessProbe')) {
        recommendations += "🏥 **Health Checks**: Implement liveness and readiness probes\n";
      }
      
      // Monitoring recommendations
      if (!content.includes('labels:')) {
        recommendations += "🏷️ **Labeling**: Add proper labels for better resource organization\n";
      }
      
      // Network recommendations
      if (content.includes('ports:') && !content.includes('service:')) {
        recommendations += "🌐 **Networking**: Consider creating services for port exposure\n";
      }
    }
    
    if (!recommendations) {
      recommendations = "✅ **Configuration**: Your configuration follows good practices\n";
      recommendations += "🔄 **Updates**: Consider regular configuration reviews\n";
      recommendations += "📊 **Monitoring**: Implement comprehensive monitoring\n";
    }
    
    return recommendations;
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
