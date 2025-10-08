"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, CheckCircle, Info, XCircle, Lightbulb, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogEntry {
  level: "error" | "warning" | "info"
  message: string
  timestamp?: string
  source?: string
}

interface AnalysisResult {
  summary: string
  rootCause: string
  suggestions: string[]
  logEntries: LogEntry[]
  severity: "critical" | "high" | "medium" | "low"
}

interface LogAnalysisResultProps {
  result: AnalysisResult | null
  isAnalyzing: boolean
}

export function LogAnalysisResult({ result, isAnalyzing }: LogAnalysisResultProps) {
  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-primary">
          <Search className="w-5 h-5 animate-pulse" />
          <span className="font-medium">AI is analyzing your logs...</span>
        </div>
        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-28 mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">Paste your logs or upload a log file to get AI-powered analysis</p>
      </div>
    )
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "high":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case "medium":
        return <Info className="w-5 h-5 text-yellow-600" />
      case "low":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
      case "high":
        return "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800"
      case "medium":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800"
      case "low":
        return "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
      default:
        return "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800"
    }
  }

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />
      default:
        return <Info className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Severity Badge */}
      <div className="flex items-center space-x-2">
        {getSeverityIcon(result.severity)}
        <Badge variant="outline" className={cn("capitalize", getSeverityColor(result.severity))}>
          {result.severity} Severity
        </Badge>
      </div>

      {/* Summary */}
      <Card className={getSeverityColor(result.severity)}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{result.summary}</p>
        </CardContent>
      </Card>

      {/* Root Cause */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Root Cause Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{result.rootCause}</p>
        </CardContent>
      </Card>

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              Recommended Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Parsed Log Entries */}
      {result.logEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Parsed Log Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {result.logEntries.map((entry, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">{getLogLevelIcon(entry.level)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {entry.level}
                      </Badge>
                      {entry.timestamp && <span className="text-xs text-muted-foreground">{entry.timestamp}</span>}
                      {entry.source && <span className="text-xs text-muted-foreground">[{entry.source}]</span>}
                    </div>
                    <p className="text-sm font-mono leading-relaxed break-words">{entry.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
