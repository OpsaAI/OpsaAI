"use client"

import { useEffect, useRef, useState } from "react"

export function AITechArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // AI Data Training Visualization
    const dataPoints: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: string
    }> = []

    const neuralNodes: Array<{
      x: number
      y: number
      connections: number[]
      pulse: number
    }> = []

    // Remove data points - they're too distracting

    // Initialize neural network nodes - very subtle
    for (let i = 0; i < 8; i++) {
      neuralNodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        connections: [],
        pulse: Math.random() * Math.PI * 2
      })
    }

    // Create connections between nearby nodes
    neuralNodes.forEach((node, i) => {
      neuralNodes.forEach((otherNode, j) => {
        if (i !== j) {
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          )
          if (distance < 150) {
            node.connections.push(j)
          }
        }
      })
    })

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background grid
      ctx.strokeStyle = "rgba(59, 130, 246, 0.1)"
      ctx.lineWidth = 1
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Data points removed - too distracting for text readability

      // Update and draw neural network - very subtle
      neuralNodes.forEach((node, i) => {
        node.pulse += 0.01

        // Draw connections - very subtle
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 + Math.sin(node.pulse) * 0.05})`
        ctx.lineWidth = 0.5
        ctx.globalAlpha = 0.2
        node.connections.forEach((connectionIndex) => {
          const connectedNode = neuralNodes[connectionIndex]
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(connectedNode.x, connectedNode.y)
          ctx.stroke()
        })

        // Draw node - very subtle
        const pulseSize = 1 + Math.sin(node.pulse) * 0.5
        ctx.fillStyle = `rgba(59, 130, 246, ${0.2 + Math.sin(node.pulse) * 0.1})`
        ctx.globalAlpha = 0.3
        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2)
        ctx.fill()
      })

      // Remove horizontal scan lines - they look too intrusive

      // Matrix characters removed - too distracting for text readability

      ctx.globalAlpha = 1
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [isClient])

  if (!isClient) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  )
}

export function AIDataStream() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Data streams removed - too distracting */}

      {/* Neural nodes - very subtle */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="neural-node absolute"
          style={{
            left: `${20 + (i % 3) * 30}%`,
            top: `${30 + Math.floor(i / 3) * 30}%`,
            animationDelay: `${i * 0.5}s`
          }}
        />
      ))}

      {/* Data points removed - too distracting */}

      {/* Matrix characters removed - too distracting */}

      {/* AI scan line removed - too intrusive */}
    </div>
  )
}
