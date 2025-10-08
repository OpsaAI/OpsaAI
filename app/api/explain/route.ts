import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  let filename: string | undefined
  let fileType: string | undefined
  
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { filename: reqFilename, content, fileType: reqFileType } = await request.json()
    filename = reqFilename
    fileType = reqFileType

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const prompt = `You are an expert cloud infrastructure analyst with deep expertise in Kubernetes, Docker, Terraform, AWS, GCP, Azure, and security best practices. Analyze the following ${fileType || "configuration"} file and provide a comprehensive analysis.

Filename: ${filename || "Unknown"}
Content:
${content}

Please provide a detailed analysis covering:

## **Overview & Purpose**
- Clear explanation of what this configuration does
- Primary use case and intended functionality
- Technology stack and platform details

## **Architecture Analysis**
- Key components and their specific purposes
- Resource relationships and dependencies
- Data flow and communication patterns
- Scalability and performance considerations

## **Security Assessment**
- Security risks and vulnerabilities (rate severity: Critical/High/Medium/Low)
- Misconfigurations that could lead to security issues
- Access control and permission analysis
- Network security and exposure points
- Secret management and sensitive data handling

## **Best Practices & Recommendations**
- Compliance with industry standards (CIS, NIST, etc.)
- Resource optimization opportunities
- Cost optimization suggestions
- Performance improvements
- Monitoring and observability recommendations

## **Risk Analysis**
- Potential failure points and single points of failure
- Disaster recovery considerations
- Backup and data protection strategies
- High availability and fault tolerance

## **Action Items**
- Immediate actions required (if any)
- Short-term improvements (1-4 weeks)
- Long-term optimizations (1-6 months)
- Monitoring and alerting setup

Format your response with clear markdown headers and bullet points. Include specific code examples and commands where relevant. Rate each issue with appropriate severity levels.`

    // Check if Google AI API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.log("Google AI API key not configured, returning mock explanation")
      
      const mockExplanation = `## File Analysis: ${filename || "Configuration File"}

**Overview:**
This appears to be a ${fileType || "configuration"} file. Without the AI service configured, I can provide a general analysis framework.

**Key Components:**
- Configuration parameters and settings
- Resource definitions and specifications
- Dependencies and relationships

**Security Considerations:**
- Review all exposed ports and services
- Check for hardcoded secrets or credentials
- Validate network policies and access controls
- Ensure proper resource limits are set

**Best Practices:**
- Use environment variables for sensitive data
- Implement proper logging and monitoring
- Follow the principle of least privilege
- Regular security audits and updates

**Next Steps:**
1. Configure Google AI API key for detailed analysis
2. Review the configuration manually
3. Test in a development environment first
4. Document any custom configurations

*Note: This is a mock analysis. For detailed AI-powered analysis, please configure the Google AI API key.*`

      return NextResponse.json({
        explanation: mockExplanation,
        filename,
        timestamp: new Date().toISOString(),
      })
    }

    const { text } = await generateText({
      model: google("gemini-1.5-pro"),
      prompt,
      maxOutputTokens: 2000,
    })

    return NextResponse.json({
      explanation: text,
      filename,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in /api/explain:", error)
    
    // Check if it's a quota exceeded error
    if (error instanceof Error && (error.message.includes("quota") || error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED"))) {
      console.log("Quota exceeded, returning mock explanation")
      
      const mockExplanation = `## File Analysis: ${filename || "Configuration File"}

**⚠️ Google AI API Quota Exceeded**

Your Google AI API free tier quota has been exceeded. Here's a general analysis framework:

**Overview:**
This appears to be a ${fileType || "configuration"} file. Without AI analysis, here's what to look for:

**Key Components to Review:**
- Configuration parameters and settings
- Resource definitions and specifications
- Dependencies and relationships
- Environment variables and secrets

**Security Checklist:**
- ✅ Review all exposed ports and services
- ✅ Check for hardcoded secrets or credentials
- ✅ Validate network policies and access controls
- ✅ Ensure proper resource limits are set
- ✅ Verify RBAC and permission settings

**Best Practices:**
- Use environment variables for sensitive data
- Implement proper logging and monitoring
- Follow the principle of least privilege
- Regular security audits and updates
- Use infrastructure as code (IaC)

**Next Steps:**
1. **Wait for quota reset** (free tier resets daily)
2. **Upgrade to paid plan** at https://ai.google.dev/pricing
3. **Review configuration manually** using this checklist
4. **Test in development environment** first

*Note: This is a mock analysis due to API quota limits. For detailed AI-powered analysis, please wait for quota reset or upgrade your plan.*`

      return NextResponse.json({
        explanation: mockExplanation,
        filename,
        timestamp: new Date().toISOString(),
      })
    }
    
    if (error instanceof Error && (error.message.includes("API key") || error.message.includes("authentication"))) {
      return NextResponse.json({ 
        error: "AI service configuration error. Please check your Google AI API key." 
      }, { status: 500 })
    }
    
    return NextResponse.json({ error: "Failed to analyze the file. Please try again." }, { status: 500 })
  }
}
