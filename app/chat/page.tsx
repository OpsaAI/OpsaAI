"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChatMessage } from "@/components/chat-message"
import { FileUpload } from "@/components/file-upload"
import { Layout } from "@/components/layout"
import { AuthWrapper } from "@/components/auth-wrapper"
import { ArrowLeft, Send, MessageSquare, Upload, X, Plus, Brain, Zap, Menu, Settings, Search, Trash2, Edit3, Copy, Download, Star, MoreVertical, ChevronDown, ChevronUp } from "lucide-react"
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const downloadChat = () => {
    const chatData = {
      sessionName,
      messages,
      uploadedFiles: uploadedFiles.map(f => ({ name: f.name, type: f.type })),
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${sessionName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_chat.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filteredSessions = chatSessions.filter(session =>
    session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

  const saveChatHistory = useCallback(async () => {
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
  }, [currentSessionId, messages, sessionName, uploadedFiles])

  useEffect(() => {
    loadChatSessions()
  }, [])

  useEffect(() => {
    if (messages.length > 0 && currentSessionId) {
      saveChatHistory()
    }
  }, [messages, currentSessionId, saveChatHistory])

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && window.innerWidth < 768) {
        const sidebar = document.querySelector('[data-sidebar]')
        const menuButton = document.querySelector('[data-menu-button]')
        if (sidebar && !sidebar.contains(event.target as Node) && !menuButton?.contains(event.target as Node)) {
          setSidebarOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [sidebarOpen])

  const loadChatSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/history/${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
        setUploadedFiles(data.files || [])
        setCurrentSessionId(sessionId)
        setSessionName(data.sessionName || "Chat Session")
        
        // Close sidebar on mobile after selecting a session
        if (window.innerWidth < 768) {
          setSidebarOpen(false)
        }
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
      setIsTyping(false)
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
    setIsTyping(true)

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
      setIsTyping(false)
    }
  }

  return (
    <AuthWrapper>
      <Layout showBackground={false}>
        <div className="h-screen flex bg-gradient-to-br from-background via-background to-muted/20">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="fixed top-4 left-4 z-20 md:hidden bg-background/80 backdrop-blur-sm border shadow-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-menu-button
          >
            <Menu className="w-4 h-4" />
          </Button>

          {/* Enhanced Fixed Sidebar */}
          <div 
            className={`w-80 border-r border-border/40 bg-card/80 backdrop-blur-xl flex flex-col fixed left-0 top-0 h-full z-10 transition-all duration-300 shadow-xl ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}
            data-sidebar
          >
            {/* Enhanced Header */}
            <div className="p-4 border-b border-border/40 flex-shrink-0 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold">Chat History</h3>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" onClick={startNewChat} className="hover:bg-primary/10">
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)} className="hover:bg-primary/10">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-8 text-sm bg-background/50 border-border/50"
                />
              </div>
            </div>

            {/* Enhanced Chat Sessions */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {filteredSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No chats found</p>
                  </div>
                ) : (
                  filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                        currentSessionId === session.id ? "bg-primary/10 border border-primary/20" : "hover:shadow-sm"
                      }`}
                      onClick={() => loadChatSession(session.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate mb-1">{session.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{session.lastMessage}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(session.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-destructive/10">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-primary/10">
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Enhanced File Upload Section */}
            <div className="border-t border-border/40 p-4 bg-gradient-to-r from-transparent to-primary/5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Files
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFileUpload(!showFileUpload)}
                    className="text-xs"
                  >
                    {showFileUpload ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </Button>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md group">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.type || "Unknown type"}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(file.content)}
                            className="h-6 w-6 p-0 hover:bg-primary/10"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.name)}
                            className="h-6 w-6 p-0 hover:bg-destructive/10"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showFileUpload && (
                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Infrastructure File
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <FileUpload onFileUpload={handleFileUpload} isAnalyzing={false} />
                    </CardContent>
                  </Card>
                )}

                <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <p className="font-medium mb-2 flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    Quick Actions
                  </p>
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

          {/* Enhanced Main Chat Area */}
          <div className="flex-1 flex flex-col md:ml-80">
            {/* Enhanced Chat Header */}
            <div className="border-b border-border/40 p-4 bg-background/80 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-sm">{sessionName}</h2>
                  <p className="text-xs text-muted-foreground">
                    {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isTyping && (
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    <span className="ml-2">AI is typing...</span>
                  </div>
                )}
                <Button variant="ghost" size="sm" onClick={downloadChat} className="hover:bg-primary/10">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Enhanced Messages Area */}
            <div className="flex-1 overflow-y-auto" ref={chatContainerRef}>
              <div className="max-w-4xl mx-auto p-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Brain className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">Welcome to Infrastructure Chat</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Upload your infrastructure files and start asking questions. I can help you understand
                      configurations, identify risks, and suggest improvements.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowFileUpload(true)}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload File
                      </Button>
                      <Button variant="outline" size="sm" onClick={startNewChat}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Chat
                      </Button>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => <ChatMessage key={message.id} message={message} />)
                )}
                {isLoading && (
                  <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">OpsaAI</div>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Enhanced Input Area */}
            <div className="border-t border-border/40 p-6 bg-background/95 backdrop-blur-xl">
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about your infrastructure..."
                      className="pr-12 h-12 bg-background/80 border-border/50 focus:border-primary/50 transition-colors"
                      disabled={isLoading}
                    />
                    {input && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setInput("")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="h-12 px-6 bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span>Press Enter to send</span>
                    <span>•</span>
                    <span>Shift + Enter for new line</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>{input.length}/2000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </AuthWrapper>
  )
}
