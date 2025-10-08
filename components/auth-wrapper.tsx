"use client"

import { useAuth } from "@/hooks/use-auth"
import { Brain } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface AuthWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthWrapper({ children, fallback }: AuthWrapperProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-8 h-8 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-8 h-8 mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
