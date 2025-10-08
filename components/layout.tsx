"use client"

import { Navigation } from "@/components/navigation"
import { AITechArt } from "@/components/ai-tech-art"
import { AIDataStream } from "@/components/ai-tech-art"
import dynamic from "next/dynamic"

const DynamicAITechArt = dynamic(() => import("@/components/ai-tech-art").then(mod => ({ default: mod.AITechArt })), {
  ssr: false,
  loading: () => null
})

const DynamicAIDataStream = dynamic(() => import("@/components/ai-tech-art").then(mod => ({ default: mod.AIDataStream })), {
  ssr: false,
  loading: () => null
})

interface LayoutProps {
  children: React.ReactNode
  showBackground?: boolean
}

export function Layout({ children, showBackground = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background relative" suppressHydrationWarning>
      {/* AI Technology Art Background */}
      {showBackground && (
        <>
          <DynamicAITechArt />
          <DynamicAIDataStream />
        </>
      )}
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative z-10 pt-16">
        {children}
      </main>
    </div>
  )
}
