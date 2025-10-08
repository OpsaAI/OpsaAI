"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

interface InfrastructureDiagramProps {
  data: DiagramData
  onNodeSelect: (node: DiagramNode) => void
  selectedNode: DiagramNode | null
}

export function InfrastructureDiagram({ data, onNodeSelect, selectedNode }: InfrastructureDiagramProps) {
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({})

  useEffect(() => {
    // Initialize node positions
    const positions: Record<string, { x: number; y: number }> = {}
    data.nodes.forEach((node) => {
      positions[node.id] = node.position
    })
    setNodePositions(positions)
  }, [data.nodes])

  const getNodeColor = (type: string) => {
    switch (type) {
      case "deployment":
        return "bg-blue-500"
      case "service":
        return "bg-green-500"
      case "ingress":
        return "bg-purple-500"
      case "configmap":
        return "bg-orange-500"
      case "secret":
        return "bg-red-500"
      case "pod":
        return "bg-cyan-500"
      case "namespace":
        return "bg-gray-500"
      default:
        return "bg-gray-400"
    }
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "deployment":
        return "⚙️"
      case "service":
        return "🔗"
      case "ingress":
        return "🌐"
      case "configmap":
        return "📋"
      case "secret":
        return "🔐"
      case "pod":
        return "📦"
      case "namespace":
        return "📁"
      default:
        return "❓"
    }
  }

  const handleNodeClick = (node: DiagramNode) => {
    onNodeSelect(node)
  }

  const handleMouseDown = (nodeId: string) => {
    setDraggedNode(nodeId)
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggedNode) return

      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setNodePositions((prev) => ({
        ...prev,
        [draggedNode]: { x: x - 60, y: y - 30 }, // Offset for center of node
      }))
    },
    [draggedNode],
  )

  const handleMouseUp = () => {
    setDraggedNode(null)
  }

  const renderEdge = (edge: DiagramEdge) => {
    const sourceNode = data.nodes.find((n) => n.id === edge.source)
    const targetNode = data.nodes.find((n) => n.id === edge.target)

    if (!sourceNode || !targetNode) return null

    const sourcePos = nodePositions[edge.source] || sourceNode.position
    const targetPos = nodePositions[edge.target] || targetNode.position

    const x1 = sourcePos.x + 60 // Node width/2
    const y1 = sourcePos.y + 30 // Node height/2
    const x2 = targetPos.x + 60
    const y2 = targetPos.y + 30

    return (
      <g key={edge.id}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--border))" strokeWidth="2" markerEnd="url(#arrowhead)" />
        {edge.label && (
          <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 5} textAnchor="middle" className="fill-muted-foreground text-xs">
            {edge.label}
          </text>
        )}
      </g>
    )
  }

  return (
    <div
      className="w-full h-full relative overflow-auto bg-muted/20"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg width="100%" height="100%" className="absolute inset-0" style={{ minWidth: "800px", minHeight: "600px" }}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--border))" />
          </marker>
        </defs>

        {data.edges.map(renderEdge)}
      </svg>

      {data.nodes.map((node) => {
        const position = nodePositions[node.id] || node.position
        const isSelected = selectedNode?.id === node.id

        return (
          <Card
            key={node.id}
            className={cn(
              "absolute w-32 h-20 cursor-pointer transition-all duration-200 hover:shadow-lg",
              isSelected ? "ring-2 ring-primary shadow-lg" : "",
              draggedNode === node.id ? "z-50" : "z-10",
            )}
            style={{
              left: position.x,
              top: position.y,
            }}
            onClick={() => handleNodeClick(node)}
            onMouseDown={() => handleMouseDown(node.id)}
          >
            <div className="p-3 h-full flex flex-col justify-between">
              <div className="flex items-center space-x-2">
                <div className={cn("w-3 h-3 rounded-full", getNodeColor(node.type))} />
                <span className="text-xs font-medium truncate">{getNodeIcon(node.type)}</span>
              </div>
              <div>
                <div className="text-xs font-semibold truncate" title={node.data.name}>
                  {node.data.name}
                </div>
                <Badge variant="outline" className="text-xs h-4 px-1">
                  {node.data.kind}
                </Badge>
              </div>
            </div>
          </Card>
        )
      })}

      {data.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-4xl mb-4">📊</div>
            <p>No resources to visualize</p>
          </div>
        </div>
      )}
    </div>
  )
}
