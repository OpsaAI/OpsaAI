"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"
import { ExplanationDisplay } from "@/components/explanation-display"
import { Layout } from "@/components/layout"
import { AuthWrapper } from "@/components/auth-wrapper"
import { ArrowLeft, Upload, FileText, Code, Brain, Zap } from "lucide-react"
import Link from "next/link"

export default function AnalyzePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState<string>("")
  const [explanation, setExplanation] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileUpload = async (file: File, content: string) => {
    setUploadedFile(file)
    setFileContent(content)
    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/explain", {
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
        throw new Error("Failed to analyze file")
      }

      const data = await response.json()
      setExplanation(data.explanation)
    } catch (error) {
      console.error("Error analyzing file:", error)
      setExplanation("Sorry, there was an error analyzing your file. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setUploadedFile(null)
    setFileContent("")
    setExplanation("")
    setIsAnalyzing(false)
  }

  return (
    <AuthWrapper>
      <Layout showBackground={false}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                Cloud Infrastructure File Analyzer
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Upload your YAML, JSON, or Terraform files to get AI-powered explanations and insights.
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">AI-Powered Analysis</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Advanced neural networks</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">Real-time Processing</p>
                <p className="text-xs text-green-600 dark:text-green-400">Instant insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Multi-format Support</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">YAML, JSON, Terraform</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload onFileUpload={handleFileUpload} isAnalyzing={isAnalyzing} />
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

            {fileContent && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    File Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm">
                    <code>{fileContent}</code>
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Explanation Section */}
          <div>
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ExplanationDisplay explanation={explanation} isAnalyzing={isAnalyzing} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </Layout>
    </AuthWrapper>
  )
}
