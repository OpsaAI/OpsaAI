"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Upload, FileText, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileUpload: (file: File, content: string) => void
  isAnalyzing: boolean
}

export function FileUpload({ onFileUpload, isAnalyzing }: FileUploadProps) {
  const [error, setError] = useState<string>("")

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError("")
      const file = acceptedFiles[0]

      if (!file) return

      // Validate file type
      const validTypes = [
        "application/json", 
        "text/yaml", 
        "application/x-yaml", 
        "text/x-yaml", 
        "text/plain",
        "text/x-python",
        "application/xml",
        "text/xml",
        "application/x-toml",
        "text/toml"
      ]
      const validExtensions = [
        ".json", ".yaml", ".yml", ".tf", ".hcl", 
        ".py", ".xml", ".toml", ".ini", ".conf",
        ".env", ".properties", ".cfg", ".config",
        ".dockerfile", ".Dockerfile", ".sh", ".bash",
        ".ps1", ".bat", ".cmd", ".yaml", ".yml"
      ]

      const hasValidType = validTypes.includes(file.type)
      const hasValidExtension = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))

      if (!hasValidType && !hasValidExtension) {
        setError("Please upload a valid file type: JSON, YAML, Terraform, Python, XML, TOML, Dockerfile, or Shell scripts")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }

      try {
        const content = await file.text()
        onFileUpload(file, content)
      } catch (err) {
        setError("Failed to read file content")
      }
    },
    [onFileUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
      "text/yaml": [".yaml", ".yml"],
      "application/x-yaml": [".yaml", ".yml"],
      "text/x-yaml": [".yaml", ".yml"],
      "text/plain": [".tf", ".hcl", ".env", ".properties", ".cfg", ".config", ".dockerfile", ".Dockerfile", ".sh", ".bash", ".ps1", ".bat", ".cmd"],
      "text/x-python": [".py"],
      "application/xml": [".xml"],
      "text/xml": [".xml"],
      "application/x-toml": [".toml"],
      "text/toml": [".toml"],
    },
    multiple: false,
    disabled: isAnalyzing,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
          isAnalyzing && "opacity-50 cursor-not-allowed",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          {isDragActive ? (
            <p className="text-lg font-medium">Drop your file here...</p>
          ) : (
            <>
              <div>
                <p className="text-lg font-medium mb-2">
                  {isAnalyzing ? "Analyzing..." : "Drop your file here, or click to browse"}
                </p>
                <p className="text-sm text-muted-foreground">Supports JSON, YAML, Terraform, Python, XML, TOML, Dockerfile, and Shell scripts (max 5MB)</p>
              </div>
              {!isAnalyzing && (
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-destructive text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        <p className="font-medium mb-1">Supported file types:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Kubernetes YAML manifests (.yaml, .yml)</li>
          <li>Docker Compose files (.yaml, .yml)</li>
          <li>Terraform configuration files (.tf, .hcl)</li>
          <li>JSON configuration files (.json)</li>
          <li>Python scripts (.py)</li>
          <li>XML configuration files (.xml)</li>
          <li>TOML configuration files (.toml)</li>
          <li>Dockerfile (.dockerfile, .Dockerfile)</li>
          <li>Shell scripts (.sh, .bash, .ps1, .bat, .cmd)</li>
          <li>Environment files (.env, .properties, .cfg)</li>
          <li>Cloud formation templates</li>
        </ul>
      </div>
    </div>
  )
}
