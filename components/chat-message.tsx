"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Brain, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
  isLoading?: boolean
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

export function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="w-8 h-8 bg-primary">
          <AvatarFallback>
            <Brain className="w-4 h-4 text-primary-foreground" />
          </AvatarFallback>
        </Avatar>
      )}

      <Card className={cn("max-w-[80%]", isUser ? "bg-primary text-primary-foreground" : "bg-card border-border/50")}>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className={cn("prose prose-sm max-w-none", isUser ? "prose-invert" : "dark:prose-invert")}>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              ) : (
                <div className="leading-relaxed">
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    parseMarkdown(message.content)
                  )}
                </div>
              )}
            </div>
            <div className={cn("text-xs opacity-70", isUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {isUser && (
        <Avatar className="w-8 h-8 bg-secondary">
          <AvatarFallback>
            <User className="w-4 h-4 text-secondary-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
