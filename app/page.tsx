"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Layout } from "@/components/layout"
import { 
  ArrowRight, 
  Upload, 
  MessageSquare, 
  BarChart3, 
  Network, 
  Zap, 
  Shield, 
  Brain,
  Play,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Globe,
  Code,
  Database,
  Cloud,
  Cpu,
  Lock,
  Sparkles,
  Rocket,
  Target,
  Award,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Activity
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <Layout>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 md:pt-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-6xl mx-auto">
            <Badge variant="secondary" className="mb-6 md:mb-8 text-xs md:text-sm px-3 md:px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 border-blue-300 dark:border-blue-700">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-2 text-blue-600" />
              <span className="hidden sm:inline text-blue-700 dark:text-blue-300">Powered by Advanced AI • Trusted by 10,000+ Developers</span>
              <span className="sm:hidden text-blue-700 dark:text-blue-300">AI-Powered • 10K+ Users</span>
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-balance mb-6 md:mb-8 bg-gradient-to-r from-gray-900 via-blue-900 to-blue-800 dark:from-gray-100 dark:via-blue-100 dark:to-blue-200 bg-clip-text text-transparent leading-tight">
              The Future of <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                Machine Intelligence
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground text-balance mb-8 md:mb-12 leading-relaxed max-w-4xl mx-auto px-4">
              Experience the most advanced AI-powered cloud infrastructure platform. 
              Where machines think, learn, and optimize your infrastructure with unprecedented intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-12 md:mb-16 px-4">
              <Link href="/analyze">
                <Button size="lg" className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-4 md:py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Rocket className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Start Building Free
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-4 md:py-6 bg-transparent border-2 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* AI Training Visualization */}
            <div className="relative mb-12 md:mb-16">
              <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/60 dark:from-blue-950/40 dark:to-blue-900/30 rounded-2xl md:rounded-3xl p-4 md:p-8 border border-blue-200/60 dark:border-blue-800/60 backdrop-blur-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-lg md:text-xl font-semibold text-center lg:text-left text-blue-900 dark:text-blue-100">
                      <Brain className="w-5 h-5 inline mr-2" />
                      Machine Intelligence in Action
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-white/80 dark:bg-gray-900/80 rounded-lg shadow-sm border border-blue-200/50 dark:border-blue-800/50">
                        <Cpu className="w-4 h-4 text-blue-500 animate-pulse" />
                        <span className="text-sm md:text-base text-blue-800 dark:text-blue-200">Neural networks processing 1.2M parameters...</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white/80 dark:bg-gray-900/80 rounded-lg shadow-sm border border-blue-200/50 dark:border-blue-800/50">
                        <Database className="w-4 h-4 text-blue-600 animate-pulse" style={{animationDelay: '0.5s'}} />
                        <span className="text-sm md:text-base text-blue-800 dark:text-blue-200">Training on infrastructure patterns...</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white/80 dark:bg-gray-900/80 rounded-lg shadow-sm border border-blue-200/50 dark:border-blue-800/50">
                        <BarChart3 className="w-4 h-4 text-blue-700 animate-pulse" style={{animationDelay: '1s'}} />
                        <span className="text-sm md:text-base text-blue-800 dark:text-blue-200">Optimizing cost prediction models...</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="bg-white/90 dark:bg-gray-900/90 rounded-lg p-4 md:p-6 shadow-lg border border-blue-200/50 dark:border-blue-800/50">
                      <div className="flex items-center space-x-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-sm md:text-base text-blue-800 dark:text-blue-200">Live AI Analysis</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-green-500 animate-pulse" />
                          <span className="text-xs md:text-sm text-blue-700 dark:text-blue-300">Security: 99.7% accuracy</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-blue-600 animate-pulse" style={{animationDelay: '0.3s'}} />
                          <span className="text-xs md:text-sm text-blue-700 dark:text-blue-300">Performance: Real-time optimization</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4 text-blue-700 animate-pulse" style={{animationDelay: '0.6s'}} />
                          <span className="text-xs md:text-sm text-blue-700 dark:text-blue-300">Cost: 23% average savings</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col items-center space-y-4">
              <p className="text-xs md:text-sm text-muted-foreground">Trusted by teams at</p>
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 opacity-60">
                <div className="flex items-center space-x-2">
                  <Cloud className="w-6 h-6 text-blue-500" />
                  <span className="text-lg md:text-2xl font-bold">Microsoft</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-6 h-6 text-blue-500" />
                  <span className="text-lg md:text-2xl font-bold">Google</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="w-6 h-6 text-orange-500" />
                  <span className="text-lg md:text-2xl font-bold">AWS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Network className="w-6 h-6 text-blue-600" />
                  <span className="text-lg md:text-2xl font-bold">Netflix</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="w-6 h-6 text-blue-500" />
                  <span className="text-lg md:text-2xl font-bold">Spotify</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="py-16 md:py-24 lg:py-32 bg-blue-50/30 dark:bg-blue-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              The Ultimate <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">Machine Intelligence</span> Platform
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto px-4">
              Experience the future of cloud infrastructure with AI that thinks, learns, and optimizes. 
              From neural networks to quantum computing, our platform understands the complexity of modern infrastructure.
            </p>
          </div>

          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 md:mb-12 h-auto">
              <TabsTrigger value="analysis" className="text-xs md:text-sm py-2 md:py-3 flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>Neural Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-xs md:text-sm py-2 md:py-3 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>AI Chat</span>
              </TabsTrigger>
              <TabsTrigger value="visualize" className="text-xs md:text-sm py-2 md:py-3 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Visualization</span>
              </TabsTrigger>
              <TabsTrigger value="logs" className="text-xs md:text-sm py-2 md:py-3 flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>Log Analysis</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Neural Network Infrastructure Analysis</h3>
                  <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
                    Our AI neural networks analyze your infrastructure with unprecedented intelligence, 
                    learning from millions of patterns to provide insights that human experts miss.
                  </p>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">AI-powered security vulnerability detection</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">Machine learning cost optimization</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Zap className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">Neural performance bottleneck identification</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Lock className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">AI compliance checking (SOC 2, PCI DSS)</span>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 md:p-8 rounded-2xl">
                  <div className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <Code className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                      <span className="font-medium text-sm md:text-base">deployment.yaml</span>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-3 h-3 text-green-500" />
                        <span className="text-xs md:text-sm">Security: No critical issues found</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs md:text-sm">Performance: Consider resource limits</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-3 h-3 text-blue-500" />
                        <span className="text-xs md:text-sm">Cost: Potential 15% savings identified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Intelligent AI Assistant</h3>
                  <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
                    Chat with our advanced AI that understands your infrastructure context, 
                    provides expert recommendations, and learns from your specific environment.
                  </p>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">Context-aware infrastructure guidance</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Brain className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">Real-time problem solving</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Target className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">Personalized recommendations</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">Best practice enforcement</span>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-4 md:p-8 rounded-2xl">
                  <div className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-lg shadow-lg">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                          <Brain className="w-3 h-3 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs md:text-sm text-blue-800 dark:text-blue-200">I&apos;ve analyzed your Kubernetes configuration and found 3 optimization opportunities...</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium">You</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">How can I improve my pod resource allocation?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="visualize" className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Dynamic Infrastructure Visualization</h3>
                  <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
                    See your infrastructure come to life with interactive diagrams, 
                    real-time monitoring, and AI-powered insights that reveal hidden patterns.
                  </p>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center space-x-3">
                      <Network className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">Interactive network topology</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">Real-time performance metrics</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">Predictive analytics</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">Multi-cloud architecture view</span>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4 md:p-8 rounded-2xl">
                  <div className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <Network className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                      <span className="font-medium text-sm md:text-base">Infrastructure Map</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded text-center">
                        <Database className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                        <span className="text-xs">DB</span>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-center">
                        <Cloud className="w-4 h-4 mx-auto text-green-600 mb-1" />
                        <span className="text-xs">API</span>
                      </div>
                      <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded text-center">
                        <Cpu className="w-4 h-4 mx-auto text-orange-600 mb-1" />
                        <span className="text-xs">Cache</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">AI-Powered Log Intelligence</h3>
                  <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
                    Transform chaotic logs into actionable insights with AI that understands 
                    patterns, predicts issues, and provides root cause analysis.
                  </p>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">Intelligent log parsing and analysis</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Target className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">Anomaly detection and alerting</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Brain className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">Root cause analysis</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">Performance trend analysis</span>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-4 md:p-8 rounded-2xl">
                  <div className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <Activity className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                      <span className="font-medium text-sm md:text-base">Log Analysis</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs md:text-sm text-red-600">Error: Database connection timeout</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs md:text-sm text-yellow-600">Warning: High memory usage</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs md:text-sm text-green-600">Info: Service started successfully</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
              Our AI platform processes millions of infrastructure configurations daily, 
              delivering unprecedented insights and optimizations.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-blue-100 text-sm md:text-base">Active Developers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100 text-sm md:text-base">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50M+</div>
              <div className="text-blue-100 text-sm md:text-base">Configurations Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">23%</div>
              <div className="text-blue-100 text-sm md:text-base">Average Cost Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Ready to Transform Your Infrastructure?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto">
            Join thousands of developers who are already using AI to optimize their cloud infrastructure. 
            Start your free trial today and experience the future of DevOps.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/analyze">
              <Button size="lg" className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Rocket className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-4 md:py-6 bg-transparent border-2 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-700 dark:text-blue-300">
              <Github className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* AI Power Section */}
      <section id="ai-power" className="py-16 md:py-24 bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
              Unleash the <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">Power of AI</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Experience next-generation AI capabilities that transform how you manage, optimize, and scale your cloud infrastructure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Neural Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Advanced neural networks analyze your infrastructure with unprecedented intelligence, learning from millions of patterns.
                </p>
                <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                  <span>Learn more</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Intelligent AI assistant that understands your infrastructure context and provides expert recommendations.
                </p>
                <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <span>Start chatting</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Smart Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Dynamic infrastructure visualization with real-time monitoring and AI-powered insights.
                </p>
                <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">OpsaAI</span>
              </div>
              <p className="text-sm text-gray-400 max-w-xs">
                The future of cloud infrastructure intelligence. 
                Powered by advanced AI and trusted by industry leaders.
              </p>
              <div className="flex space-x-4">
                <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/analyze" className="hover:text-white transition-colors">Infrastructure Analysis</Link></li>
                <li><Link href="/chat" className="hover:text-white transition-colors">AI Chat</Link></li>
                <li><Link href="/visualize" className="hover:text-white transition-colors">Visualization</Link></li>
                <li><Link href="/logs" className="hover:text-white transition-colors">Log Analysis</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#status" className="hover:text-white transition-colors">Status</Link></li>
                <li><Link href="#privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 md:mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 OpsaAI. All rights reserved. Built with ❤️ for the developer community.</p>
          </div>
        </div>
      </footer>
    </Layout>
  )
}
