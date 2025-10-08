"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  Clock, 
  Users, 
  FileText, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Zap,
  Brain
} from "lucide-react"
import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

interface DashboardStats {
  totalAnalyses: number
  totalFiles: number
  totalSessions: number
  costSavings: number
  securityIssues: number
  performanceScore: number
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    status: "success" | "warning" | "error"
  }>
  topInsights: Array<{
    id: string
    title: string
    description: string
    priority: "high" | "medium" | "low"
    category: string
  }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // In a real implementation, this would fetch from your API
      // For now, we'll use mock data
      const mockStats: DashboardStats = {
        totalAnalyses: 47,
        totalFiles: 23,
        totalSessions: 8,
        costSavings: 2340,
        securityIssues: 12,
        performanceScore: 87,
        recentActivity: [
          {
            id: "1",
            type: "analysis",
            description: "Kubernetes deployment analyzed",
            timestamp: "2 minutes ago",
            status: "success"
          },
          {
            id: "2",
            type: "security",
            description: "Security vulnerability detected",
            timestamp: "15 minutes ago",
            status: "warning"
          },
          {
            id: "3",
            type: "optimization",
            description: "Cost optimization completed",
            timestamp: "1 hour ago",
            status: "success"
          },
          {
            id: "4",
            type: "visualization",
            description: "Infrastructure diagram generated",
            timestamp: "2 hours ago",
            status: "success"
          }
        ],
        topInsights: [
          {
            id: "1",
            title: "High CPU Usage Detected",
            description: "Your nginx deployment is using 95% CPU. Consider scaling or optimizing resource requests.",
            priority: "high",
            category: "performance"
          },
          {
            id: "2",
            title: "Security Vulnerability Found",
            description: "Outdated base image detected in production containers. Update to latest version.",
            priority: "high",
            category: "security"
          },
          {
            id: "3",
            title: "Cost Optimization Opportunity",
            description: "Switch to reserved instances could save $340/month on your EC2 costs.",
            priority: "medium",
            category: "cost"
          },
          {
            id: "4",
            title: "Missing Health Checks",
            description: "Add liveness and readiness probes to improve reliability.",
            priority: "medium",
            category: "reliability"
          }
        ]
      }

      setStats(mockStats)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Activity className="w-4 h-4 text-blue-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-8 h-8 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">OpsaAI Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/chat" className="text-muted-foreground hover:text-foreground transition-colors">
                Chat
              </Link>
              <Link href="/analyze" className="text-muted-foreground hover:text-foreground transition-colors">
                Analyze
              </Link>
              <Link href="/visualize" className="text-muted-foreground hover:text-foreground transition-colors">
                Visualize
              </Link>
              <Link href="/logs" className="text-muted-foreground hover:text-foreground transition-colors">
                Logs
              </Link>
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Infrastructure Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your cloud infrastructure health, performance, and optimization opportunities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAnalyses || 0}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Files Processed</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalFiles || 0}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.costSavings?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">Potential monthly savings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.performanceScore || 0}%</div>
              <Progress value={stats?.performanceScore || 0} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/analyze">
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Analyze New File
                    </Button>
                  </Link>
                  <Link href="/chat">
                    <Button className="w-full justify-start" variant="outline">
                      <Brain className="w-4 h-4 mr-2" />
                      Start AI Chat
                    </Button>
                  </Link>
                  <Link href="/visualize">
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Generate Diagram
                    </Button>
                  </Link>
                  <Link href="/logs">
                    <Button className="w-full justify-start" variant="outline">
                      <Activity className="w-4 h-4 mr-2" />
                      Analyze Logs
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Security Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Security Issues</span>
                      <Badge variant="destructive">{stats?.securityIssues || 0}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Critical</span>
                        <span className="text-red-600 font-medium">2</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>High</span>
                        <span className="text-orange-600 font-medium">4</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Medium</span>
                        <span className="text-yellow-600 font-medium">6</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Security Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI-Generated Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.topInsights.map((insight) => (
                      <div key={insight.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{insight.title}</h4>
                          <Badge className={getPriorityColor(insight.priority)}>
                            {insight.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {insight.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {insight.category}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      {getStatusIcon(activity.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Start Collaborating</h3>
                  <p className="text-muted-foreground mb-4">
                    Create collaboration sessions to work with your team on infrastructure analysis
                  </p>
                  <Button>Create Collaboration Session</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
