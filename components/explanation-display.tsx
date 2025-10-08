"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain, CheckCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExplanationDisplayProps {
  explanation: string
  isAnalyzing: boolean
}

// Simple markdown parser for basic formatting
function parseMarkdown(text: string): JSX.Element {
  const lines = text.split('\n')
  const elements: JSX.Element[] = []
  let key = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Handle headers (## Header)
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-lg font-semibold mt-4 mb-2">
          {line.replace('## ', '')}
        </h2>
      )
    }
    // Handle bold text (**text**)
    else if (line.includes('**')) {
      const parts = line.split(/(\*\*.*?\*\*)/g)
      const formattedParts = parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index}>{part.slice(2, -2)}</strong>
        }
        return part
      })
      elements.push(
        <p key={key++} className="mb-2">
          {formattedParts}
        </p>
      )
    }
    // Handle bullet points (- item)
    else if (line.startsWith('- ')) {
      elements.push(
        <li key={key++} className="ml-4 mb-1">
          {line.replace('- ', '')}
        </li>
      )
    }
    // Handle regular paragraphs
    else if (line.trim()) {
      elements.push(
        <p key={key++} className="mb-2">
          {line}
        </p>
      )
    }
    // Handle empty lines
    else {
      elements.push(<br key={key++} />)
    }
  }

  return <div>{elements}</div>
}

export function ExplanationDisplay({ explanation, isAnalyzing }: ExplanationDisplayProps) {
  if (isAnalyzing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-primary">
          <Brain className="w-5 h-5 animate-pulse" />
          <span className="font-medium">AI is analyzing your file...</span>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    )
  }

  if (!explanation) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">Upload a file to get AI-powered analysis and explanations</p>
      </div>
    )
  }

  // Parse explanation for different types of insights
  const sections = explanation.split("\n\n").filter((section) => section.trim())

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-primary">
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">Analysis Complete</span>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => {
          const isWarning =
            section.toLowerCase().includes("warning") ||
            section.toLowerCase().includes("risk") ||
            section.toLowerCase().includes("security")
          const isInfo = section.toLowerCase().includes("note") || section.toLowerCase().includes("tip")

          return (
            <Card
              key={index}
              className={cn(
                "border-l-4",
                isWarning
                  ? "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20"
                  : isInfo
                    ? "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                    : "border-l-green-500 bg-green-50/50 dark:bg-green-950/20",
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {isWarning ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    ) : isInfo ? (
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="leading-relaxed">
                        {parseMarkdown(section)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
