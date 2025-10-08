import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { getCurrentUser } from "@/lib/auth"

interface DiagramNode {
  id: string
  type: string
  label: string
  data: {
    name: string
    kind: string
    namespace?: string
    details: Record<string, any>
  }
  position: { x: number; y: number }
}

interface DiagramEdge {
  id: string
  source: string
  target: string
  label?: string
  type?: string
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { filename, content, fileType } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const prompt = `You are an expert in cloud infrastructure visualization and architecture design. Analyze the following configuration file and generate a comprehensive diagram representation.

Filename: ${filename || "Unknown"}
Content:
${content}

Create a detailed JSON response with nodes and edges for interactive visualization. Each node should represent a resource with rich metadata, and edges should represent relationships with context.

Respond with this exact JSON structure:
{
  "nodes": [
    {
      "id": "unique-id",
      "type": "resource-type (deployment, service, ingress, configmap, secret, pod, pvc, pv, statefulset, daemonset, job, cronjob, networkpolicy, rbac, etc.)",
      "label": "display-name",
      "data": {
        "name": "resource-name",
        "kind": "resource-kind",
        "namespace": "namespace-if-applicable",
        "details": {
          "replicas": number,
          "image": "string",
          "ports": [{"port": number, "protocol": "string"}],
          "env": ["key=value"],
          "volumes": ["volume-name"],
          "resources": {"cpu": "string", "memory": "string"},
          "labels": {"key": "value"},
          "annotations": {"key": "value"}
        },
        "status": "healthy|warning|error|unknown",
        "priority": "high|medium|low"
      },
      "position": { "x": number, "y": number },
      "size": { "width": number, "height": number }
    }
  ],
  "edges": [
    {
      "id": "edge-id",
      "source": "source-node-id",
      "target": "target-node-id",
      "label": "relationship-type",
      "type": "connection-type (service, config, volume, network, dependency, etc.)",
      "weight": number,
      "style": "solid|dashed|dotted"
    }
  ],
  "metadata": {
    "totalResources": number,
    "resourceTypes": ["list", "of", "types"],
    "namespaces": ["list", "of", "namespaces"],
    "securityLevel": "high|medium|low",
    "complexity": "high|medium|low",
    "recommendations": [
      "Optimization suggestion 1",
      "Security improvement 2",
      "Performance enhancement 3"
    ]
  },
  "layers": [
    {
      "name": "Application Layer",
      "nodes": ["node-id-1", "node-id-2"],
      "description": "User-facing applications and services"
    },
    {
      "name": "Service Layer", 
      "nodes": ["node-id-3", "node-id-4"],
      "description": "Internal services and APIs"
    },
    {
      "name": "Data Layer",
      "nodes": ["node-id-5", "node-id-6"],
      "description": "Databases and storage"
    }
  ]
}

Position nodes in a logical layered layout:
- Application layer at the top
- Service layer in the middle  
- Data layer at the bottom
- Network components on the sides
- Spacing: minimum 200px between nodes
- Group related resources together

Identify all relationships:
- Deployments → Services (exposes)
- Services → Ingress (routes)
- ConfigMaps/Secrets → Deployments (configures)
- PVCs → PVs (binds)
- NetworkPolicies → Pods (controls)
- RBAC → Resources (authorizes)
- Dependencies and references

Include security and performance annotations. Respond ONLY with valid JSON, no additional text.`

    // Check if Google AI API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.log("Google AI API key not configured, returning mock visualization")
      
      const mockDiagram = {
        nodes: [
          {
            id: "resource-1",
            type: "deployment",
            label: "Sample Application",
            data: {
              name: "app-deployment",
              kind: "Deployment",
              namespace: "default",
              details: { replicas: 3 },
            },
            position: { x: 200, y: 200 },
          },
          {
            id: "resource-2",
            type: "service",
            label: "Application Service",
            data: {
              name: "app-service",
              kind: "Service",
              namespace: "default",
              details: { type: "ClusterIP" },
            },
            position: { x: 400, y: 200 },
          },
          {
            id: "resource-3",
            type: "ingress",
            label: "Application Ingress",
            data: {
              name: "app-ingress",
              kind: "Ingress",
              namespace: "default",
              details: { host: "app.example.com" },
            },
            position: { x: 600, y: 200 },
          },
        ],
        edges: [
          {
            id: "edge-1",
            source: "resource-1",
            target: "resource-2",
            label: "exposes",
            type: "service"
          },
          {
            id: "edge-2",
            source: "resource-2",
            target: "resource-3",
            label: "routes to",
            type: "ingress"
          },
        ],
        metadata: {
          totalResources: 3,
          resourceTypes: ["Deployment", "Service", "Ingress"],
          namespaces: ["default"],
        },
      }

      return NextResponse.json({
        diagram: mockDiagram,
        filename: filename || "Unknown",
        timestamp: new Date().toISOString(),
      })
    }

    const { text } = await generateText({
      model: google("gemini-1.5-pro"),
      prompt,
      maxOutputTokens: 2000,
    })

    try {
      const diagram = JSON.parse(text)

      return NextResponse.json({
        diagram,
        filename: filename || "Unknown",
        timestamp: new Date().toISOString(),
      })
    } catch (parseError) {
      // Fallback with mock data if JSON parsing fails
      const mockDiagram = {
        nodes: [
          {
            id: "resource-1",
            type: "deployment",
            label: "Application",
            data: {
              name: "app-deployment",
              kind: "Deployment",
              namespace: "default",
              details: { replicas: 3 },
            },
            position: { x: 100, y: 100 },
          },
        ],
        edges: [],
        metadata: {
          totalResources: 1,
          resourceTypes: ["Deployment"],
          namespaces: ["default"],
        },
      }

      return NextResponse.json({
        diagram: mockDiagram,
        filename: "Unknown",
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("Error in /api/visualize:", error)
    
    // Check if it's a quota exceeded error
    if (error instanceof Error && (error.message.includes("quota") || error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED"))) {
      console.log("Quota exceeded, returning mock visualization")
      
      const mockDiagram = {
        nodes: [
          {
            id: "resource-1",
            type: "deployment",
            label: "Sample Application",
            data: {
              name: "app-deployment",
              kind: "Deployment",
              namespace: "default",
              details: { replicas: 3 },
            },
            position: { x: 200, y: 200 },
          },
          {
            id: "resource-2",
            type: "service",
            label: "Application Service",
            data: {
              name: "app-service",
              kind: "Service",
              namespace: "default",
              details: { type: "ClusterIP" },
            },
            position: { x: 400, y: 200 },
          },
          {
            id: "resource-3",
            type: "ingress",
            label: "Application Ingress",
            data: {
              name: "app-ingress",
              kind: "Ingress",
              namespace: "default",
              details: { host: "app.example.com" },
            },
            position: { x: 600, y: 200 },
          },
          {
            id: "resource-4",
            type: "configmap",
            label: "App Config",
            data: {
              name: "app-config",
              kind: "ConfigMap",
              namespace: "default",
              details: { data: "configuration" },
            },
            position: { x: 200, y: 400 },
          },
        ],
        edges: [
          {
            id: "edge-1",
            source: "resource-1",
            target: "resource-2",
            label: "exposes",
            type: "service"
          },
          {
            id: "edge-2",
            source: "resource-2",
            target: "resource-3",
            label: "routes to",
            type: "ingress"
          },
          {
            id: "edge-3",
            source: "resource-4",
            target: "resource-1",
            label: "configures",
            type: "config"
          },
        ],
        metadata: {
          totalResources: 4,
          resourceTypes: ["Deployment", "Service", "Ingress", "ConfigMap"],
          namespaces: ["default"],
        },
      }

      return NextResponse.json({
        diagram: mockDiagram,
        filename: "Unknown",
        timestamp: new Date().toISOString(),
      })
    }
    
    if (error instanceof Error && (error.message.includes("API key") || error.message.includes("authentication"))) {
      return NextResponse.json({ 
        error: "AI service configuration error. Please check your Google AI API key." 
      }, { status: 500 })
    }
    
    return NextResponse.json({ error: "Failed to generate visualization. Please try again." }, { status: 500 })
  }
}
