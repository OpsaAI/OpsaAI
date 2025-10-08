"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChatMessage } from "@/components/chat-message"
import { FileUpload } from "@/components/file-upload"
import { Layout } from "@/components/layout"
import { AuthWrapper } from "@/components/auth-wrapper"
import { ArrowLeft, Send, MessageSquare, Upload, X, Plus, Brain, Zap } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface UploadedFile {
  name: string
  content: string
  type: string
  fileId?: string
}

interface ChatSession {
  id: string
  name: string
  lastMessage: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [sessionName, setSessionName] = useState("New Chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadChatSessions()
  }, [])

  useEffect(() => {
    if (messages.length > 0 && currentSessionId) {
      saveChatHistory()
    }
  }, [messages, currentSessionId])

  const loadChatSessions = async () => {
    try {
      const response = await fetch("/api/chat/sessions")
      if (response.ok) {
        const data = await response.json()
        setChatSessions(data.sessions || [])
      }
    } catch (error) {
      console.error("Failed to load chat sessions:", error)
    }
  }

  const saveChatHistory = async () => {
    if (!currentSessionId || messages.length === 0) return

    try {
      await fetch("/api/chat/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: currentSessionId,
          sessionName,
          messages: messages.slice(-2), // Save only the last 2 messages to avoid duplicates
          files: uploadedFiles,
        }),
      })
    } catch (error) {
      console.error("Failed to save chat history:", error)
    }
  }

  const loadChatSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/history/${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
        setUploadedFiles(data.files || [])
        setCurrentSessionId(sessionId)
        setSessionName(data.sessionName || "Chat Session")
      }
    } catch (error) {
      console.error("Failed to load chat session:", error)
    }
  }

  const startNewChat = () => {
    setMessages([])
    setUploadedFiles([])
    setCurrentSessionId(null)
    setSessionName("New Chat")
  }

  const handleFileUpload = async (file: File, content: string) => {
    try {
      setIsLoading(true)
      
      // Upload file to backend
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload file')
      }
      
      const uploadData = await response.json()
      
      const newFile: UploadedFile = {
        name: file.name,
        content: content,
        type: file.type,
        fileId: uploadData.fileId,
      }
      
      setUploadedFiles((prev) => [...prev, newFile])
      setShowFileUpload(false)

      // Add a system message about the uploaded file
      const systemMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `✅ File "${file.name}" uploaded successfully! I can now help you analyze it. Ask me anything about this file. For example:\n\n• What resources are defined in this file?\n• Are there any security risks?\n• What would happen if I delete this deployment?\n• How can I optimize this configuration?`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, systemMessage])
      
    } catch (error) {
      console.error('File upload error:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "❌ Failed to upload file. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const removeFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Create new session if this is the first message
    if (!currentSessionId) {
      const newSessionId = `session-${Date.now()}`
      setCurrentSessionId(newSessionId)
      setSessionName(input.slice(0, 50) + (input.length > 50 ? "..." : ""))
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Check if we have uploaded files to chat about
      if (uploadedFiles.length === 0) {
        const noFileMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Please upload a file first so I can help you analyze it. Click the 'Upload File' button to get started.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, noFileMessage])
        return
      }

      // Use the first uploaded file for now (can be extended for multiple files)
      const fileToAnalyze = uploadedFiles[0]
      if (!fileToAnalyze.fileId) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "The uploaded file is not ready for analysis. Please try uploading it again.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
        return
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId: fileToAnalyze.fileId,
          question: input,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthWrapper>
      <Layout showBackground={false}>

      <div className="flex-1 flex">
        <div className="w-80 border-r border-border/40 bg-card/50 flex flex-col">
          {/* Chat Sessions */}
          <div className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Chat History</h3>
              <Button variant="ghost" size="sm" onClick={startNewChat}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {chatSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => loadChatSession(session.id)}
                  className={`w-full text-left p-2 rounded-md text-sm hover:bg-muted/50 transition-colors ${
                    currentSessionId === session.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="font-medium truncate">{session.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{session.lastMessage}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Uploaded Files */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-3">Uploaded Files</h3>
                {uploadedFiles.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No files uploaded yet. Upload infrastructure files to start asking questions about them.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.type || "Unknown type"}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.name)}
                          className="ml-2 h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Button
                  onClick={() => setShowFileUpload(!showFileUpload)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Upload className="w-3 h-3 mr-2" />
                  Upload File
                </Button>
              </div>

              {showFileUpload && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Upload Infrastructure File</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <FileUpload onFileUpload={handleFileUpload} isAnalyzing={false} />
                  </CardContent>
                </Card>
              )}

              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-2">Example questions:</p>
                <ul className="space-y-1">
                  <li>• What resources are affected if I delete this deployment?</li>
                  <li>• Explain the risk of this IAM policy</li>
                  <li>• How can I optimize this configuration?</li>
                  <li>• Are there any security vulnerabilities?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Welcome to Infrastructure Chat</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Upload your infrastructure files and start asking questions. I can help you understand
                    configurations, identify risks, and suggest improvements.
                  </p>
                </div>
              ) : (
                messages.map((message) => <ChatMessage key={message.id} message={message} />)
              )}
              {isLoading && (
                <ChatMessage
                  message={{
                    id: "loading",
                    role: "assistant",
                    content: "Thinking...",
                    timestamp: new Date(),
                  }}
                  isLoading={true}
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="border-t border-border/40 p-6">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your infrastructure..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      </Layout>
    </AuthWrapper>
  )
}
