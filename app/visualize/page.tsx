"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"
import { InfrastructureDiagram } from "@/components/infrastructure-diagram"
import { Layout } from "@/components/layout"
import { AuthWrapper } from "@/components/auth-wrapper"
import { ArrowLeft, Network, Download, Zap, Eye, Brain } from "lucide-react"
import Link from "next/link"

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

interface DiagramData {
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  metadata: {
    totalResources: number
    resourceTypes: string[]
    namespaces: string[]
  }
}

export default function VisualizePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [diagramData, setDiagramData] = useState<DiagramData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null)

  const handleFileUpload = async (file: File, content: string) => {
    setUploadedFile(file)
    setIsGenerating(true)

    try {
      const response = await fetch("/api/visualize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          content: content,
          fileType: file.type,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate visualization")
      }

      const data = await response.json()
      setDiagramData(data.diagram)
    } catch (error) {
      console.error("Error generating visualization:", error)
      // Mock data for demo purposes
      generateMockDiagram(file.name, content)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMockDiagram = (filename: string, content: string) => {
    // Generate mock diagram based on file content
    const mockNodes: DiagramNode[] = [
      {
        id: "deployment-1",
        type: "deployment",
        label: "nginx-deployment",
        data: {
          name: "nginx-deployment",
          kind: "Deployment",
          namespace: "default",
          details: { replicas: 3, image: "nginx:1.21" },
        },
        position: { x: 100, y: 100 },
      },
      {
        id: "service-1",
        type: "service",
        label: "nginx-service",
        data: {
          name: "nginx-service",
          kind: "Service",
          namespace: "default",
          details: { type: "ClusterIP", port: 80 },
        },
        position: { x: 300, y: 100 },
      },
      {
        id: "ingress-1",
        type: "ingress",
        label: "nginx-ingress",
        data: {
          name: "nginx-ingress",
          kind: "Ingress",
          namespace: "default",
          details: { host: "example.com" },
        },
        position: { x: 500, y: 100 },
      },
    ]

    const mockEdges: DiagramEdge[] = [
      {
        id: "e1-2",
        source: "deployment-1",
        target: "service-1",
        label: "exposes",
      },
      {
        id: "e2-3",
        source: "service-1",
        target: "ingress-1",
        label: "routes",
      },
    ]

    setDiagramData({
      nodes: mockNodes,
      edges: mockEdges,
      metadata: {
        totalResources: 3,
        resourceTypes: ["Deployment", "Service", "Ingress"],
        namespaces: ["default"],
      },
    })
  }

  const handleNodeSelect = useCallback((node: DiagramNode) => {
    setSelectedNode(node)
  }, [])

  const handleExport = async (format: "png" | "svg") => {
    // This would implement actual export functionality
    console.log(`Exporting diagram as ${format}`)
    // For now, just show an alert
    alert(`Export as ${format.toUpperCase()} functionality would be implemented here`)
  }

  const handleReset = () => {
    setUploadedFile(null)
    setDiagramData(null)
    setSelectedNode(null)
    setIsGenerating(false)
  }

  return (
    <AuthWrapper>
      <Layout showBackground={false}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Infrastructure Visualization</h1>
          <p className="text-muted-foreground text-lg">
            Upload your infrastructure files to generate interactive diagrams and visual documentation.
          </p>
        </div>

        {!diagramData ? (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  Upload Infrastructure File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload onFileUpload={handleFileUpload} isAnalyzing={isGenerating} />
                {uploadedFile && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        Upload New File
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Diagram Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {diagramData.metadata.totalResources} resources visualized
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{diagramData.metadata.resourceTypes.join(", ")}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleExport("png")}>
                  <Download className="w-4 h-4 mr-2" />
                  Export PNG
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport("svg")}>
                  <Download className="w-4 h-4 mr-2" />
                  Export SVG
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  New Diagram
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Main Diagram */}
              <div className="lg:col-span-3">
                <Card className="h-[600px]">
                  <CardContent className="p-0 h-full">
                    <InfrastructureDiagram
                      data={diagramData}
                      onNodeSelect={handleNodeSelect}
                      selectedNode={selectedNode}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Resource Details Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Resource Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold text-primary">{diagramData.metadata.totalResources}</div>
                      <div className="text-sm text-muted-foreground">Total Resources</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{diagramData.metadata.resourceTypes.length}</div>
                      <div className="text-sm text-muted-foreground">Resource Types</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{diagramData.metadata.namespaces.length}</div>
                      <div className="text-sm text-muted-foreground">Namespaces</div>
                    </div>
                  </CardContent>
                </Card>

                {selectedNode && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Resource Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Name</div>
                        <div className="font-mono text-sm">{selectedNode.data.name}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Kind</div>
                        <div className="font-mono text-sm">{selectedNode.data.kind}</div>
                      </div>
                      {selectedNode.data.namespace && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Namespace</div>
                          <div className="font-mono text-sm">{selectedNode.data.namespace}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Configuration</div>
                        <div className="bg-muted p-3 rounded-lg">
                          <pre className="text-xs overflow-auto">
                            {JSON.stringify(selectedNode.data.details, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Legend</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded" />
                      <span className="text-sm">Deployment</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded" />
                      <span className="text-sm">Service</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-500 rounded" />
                      <span className="text-sm">Ingress</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-orange-500 rounded" />
                      <span className="text-sm">ConfigMap</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded" />
                      <span className="text-sm">Secret</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
      </Layout>
    </AuthWrapper>
  )
}
