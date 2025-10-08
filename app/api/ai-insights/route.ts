import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { getCurrentUser } from "@/lib/auth"

interface AIInsightsRequest {
  files: Array<{
    name: string
    content: string
    type: string
  }>
  analysisType: "cost-optimization" | "security-scan" | "performance-analysis" | "compliance-check" | "comprehensive"
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { files, analysisType }: AIInsightsRequest = await request.json()

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Files are required" }, { status: 400 })
    }

    // Build file context
    let fileContext = ""
    files.forEach((file, index) => {
      fileContext += `\n--- File ${index + 1}: ${file.name} ---\n${file.content}\n`
    })

    const getAnalysisPrompt = (type: string) => {
      const basePrompt = `You are an expert cloud infrastructure consultant with deep expertise in cost optimization, security, performance, and compliance. Analyze the following infrastructure files and provide comprehensive insights.

Files to analyze:
${fileContext}

`

      switch (type) {
        case "cost-optimization":
          return basePrompt + `Provide a detailed cost optimization analysis including:

## **Current Cost Analysis**
- Estimated monthly/yearly costs for each resource
- Cost breakdown by service and region
- Underutilized resources and waste identification
- Reserved instance opportunities

## **Optimization Recommendations**
- Right-sizing recommendations with specific instance types
- Reserved instance and savings plans opportunities
- Spot instance usage for non-critical workloads
- Storage optimization (S3 lifecycle, EBS optimization)
- Network cost optimization
- Database optimization opportunities

## **Cost Savings Potential**
- Immediate savings (0-30 days)
- Short-term savings (1-6 months)
- Long-term savings (6+ months)
- Total potential savings percentage

## **Implementation Plan**
- Step-by-step optimization roadmap
- Risk assessment for each change
- Rollback strategies
- Monitoring and validation steps

Include specific AWS/GCP/Azure pricing and commands where relevant.`

        case "security-scan":
          return basePrompt + `Provide a comprehensive security analysis including:

## **Security Vulnerabilities**
- Critical, High, Medium, Low severity issues
- CVE references and CVSS scores where applicable
- Misconfigurations and security gaps
- Network security issues
- Access control problems

## **Compliance Assessment**
- CIS Benchmark compliance
- NIST Framework alignment
- SOC 2, PCI DSS, HIPAA considerations
- Industry-specific compliance requirements

## **Security Recommendations**
- Immediate security fixes
- Network segmentation improvements
- Identity and access management enhancements
- Encryption and key management
- Monitoring and logging improvements

## **Risk Assessment**
- Business impact of each vulnerability
- Exploitability and likelihood
- Remediation priority matrix
- Compensating controls

Include specific security tools, commands, and remediation steps.`

        case "performance-analysis":
          return basePrompt + `Provide a detailed performance analysis including:

## **Performance Bottlenecks**
- CPU, memory, network, and storage bottlenecks
- Database performance issues
- Application performance problems
- Network latency and throughput issues

## **Resource Utilization**
- Current resource usage patterns
- Peak and off-peak utilization
- Resource contention issues
- Scaling opportunities

## **Performance Optimization**
- Horizontal and vertical scaling recommendations
- Caching strategies
- CDN and edge optimization
- Database optimization
- Application performance tuning

## **Monitoring and Alerting**
- Key performance indicators to monitor
- Alerting thresholds and rules
- Performance testing recommendations
- Capacity planning guidance

Include specific metrics, tools, and optimization techniques.`

        case "compliance-check":
          return basePrompt + `Provide a comprehensive compliance analysis including:

## **Regulatory Compliance**
- SOC 2 Type II requirements
- PCI DSS compliance for payment processing
- HIPAA compliance for healthcare data
- GDPR compliance for EU data
- Industry-specific regulations

## **Security Standards**
- CIS Controls implementation
- NIST Cybersecurity Framework
- ISO 27001 requirements
- OWASP Top 10 compliance

## **Audit Readiness**
- Documentation requirements
- Evidence collection points
- Control testing procedures
- Remediation tracking

## **Compliance Gaps**
- Missing controls and policies
- Documentation gaps
- Process improvements needed
- Training requirements

Include specific compliance frameworks, controls, and implementation guidance.`

        case "comprehensive":
          return basePrompt + `Provide a comprehensive infrastructure analysis covering all aspects:

## **Executive Summary**
- Overall infrastructure health score
- Key findings and recommendations
- Business impact assessment
- Priority action items

## **Cost Optimization**
- Current cost analysis and optimization opportunities
- Potential savings and ROI calculations
- Implementation roadmap

## **Security Analysis**
- Vulnerability assessment and risk analysis
- Compliance status and gaps
- Security improvement recommendations

## **Performance Analysis**
- Performance bottlenecks and optimization opportunities
- Resource utilization analysis
- Scaling recommendations

## **Operational Excellence**
- Monitoring and observability improvements
- Automation opportunities
- Disaster recovery and backup strategies
- Change management recommendations

## **Strategic Recommendations**
- Technology stack evolution
- Architecture improvements
- Team training and skill development
- Tool and process enhancements

Provide a holistic view with specific, actionable recommendations across all areas.`

        default:
          return basePrompt + "Provide a general infrastructure analysis with recommendations."
      }
    }

    const prompt = getAnalysisPrompt(analysisType)

    // Check if Google AI API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.log("Google AI API key not configured, returning mock insights")
      
      const mockInsights = {
        analysisType,
        summary: "AI insights analysis completed with mock results. Configure Google AI API key for detailed analysis.",
        recommendations: [
          "Configure Google AI API key for detailed insights",
          "Review infrastructure manually for optimization opportunities",
          "Implement basic monitoring and alerting",
          "Consider cost optimization strategies",
          "Review security best practices"
        ],
        timestamp: new Date().toISOString(),
      }

      return NextResponse.json({
        insights: mockInsights,
        timestamp: new Date().toISOString(),
      })
    }

    const { text } = await generateText({
      model: google("gemini-1.5-pro"),
      prompt,
      maxOutputTokens: 3000,
      temperature: 0.3,
    })

    return NextResponse.json({
      insights: {
        analysisType,
        content: text,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in /api/ai-insights:", error)
    
    // Check if it's a quota exceeded error
    if (error instanceof Error && (error.message.includes("quota") || error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED"))) {
      console.log("Quota exceeded, returning mock insights")
      
      const mockInsights = {
        analysisType: "comprehensive",
        summary: "AI insights analysis completed with mock results due to Google AI API quota exceeded.",
        recommendations: [
          "Wait for quota reset (free tier resets daily)",
          "Upgrade to paid plan at https://ai.google.dev/pricing",
          "Review infrastructure manually for optimization opportunities",
          "Implement basic monitoring and alerting",
          "Consider cost optimization strategies"
        ],
        timestamp: new Date().toISOString(),
      }

      return NextResponse.json({
        insights: mockInsights,
        timestamp: new Date().toISOString(),
      })
    }
    
    if (error instanceof Error && (error.message.includes("API key") || error.message.includes("authentication"))) {
      return NextResponse.json({ 
        error: "AI service configuration error. Please check your Google AI API key." 
      }, { status: 500 })
    }
    
    return NextResponse.json({ error: "Failed to generate insights. Please try again." }, { status: 500 })
  }
}
