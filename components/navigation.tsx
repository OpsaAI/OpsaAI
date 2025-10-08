"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { useScroll } from "@/hooks/use-scroll"
import { useMobile } from "@/hooks/use-mobile"
import { Brain, Menu, X, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Features", href: "#features" },
  { name: "AI Power", href: "#ai-power" },
  { name: "Docs", href: "#docs" },
  { name: "Dashboard", href: "/dashboard" },
]

export function Navigation() {
  const { isScrolled } = useScroll()
  const isMobile = useMobile()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-blue-600/95 dark:bg-blue-900/95 backdrop-blur-md shadow-lg border-b border-blue-500/20 dark:border-blue-700/20"
          : "bg-background/80 dark:bg-background/80 backdrop-blur-sm border-b border-blue-200/20 dark:border-blue-800/20"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className={cn(
              "text-xl font-bold transition-colors duration-300",
              isScrolled
                ? "text-white"
                : "bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent"
            )}>
              OpsaAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 hover:scale-105 transform",
                  isScrolled
                    ? "text-blue-100 hover:text-white"
                    : "text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                )}
              >
                {item.name}
              </Link>
            ))}
            <ThemeToggle />
            <UserNav />
            <Link href="/analyze">
              <Button 
                size="sm" 
                className={cn(
                  "transition-all duration-200 hover:scale-105 transform",
                  isScrolled
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                )}
              >
                Get Started
                <ArrowRight className="ml-1 w-3 h-3" />
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMobileMenuToggle}
              className={cn(
                "p-2",
                isScrolled ? "text-white hover:bg-blue-500/20" : "text-muted-foreground hover:bg-blue-50"
              )}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 dark:bg-background/95 backdrop-blur-md rounded-lg mt-2 shadow-lg border border-blue-200/20 dark:border-blue-800/20">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200",
                    isScrolled
                      ? "text-blue-100 hover:bg-blue-500/20 hover:text-white"
                      : "text-muted-foreground hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-blue-200/20 dark:border-blue-800/20">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-muted-foreground">Account</span>
                  <UserNav />
                </div>
                <Link href="/analyze" onClick={handleLinkClick}>
                  <Button 
                    className={cn(
                      "w-full mt-2 transition-all duration-200",
                      isScrolled
                        ? "bg-white text-blue-600 hover:bg-blue-50"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    )}
                  >
                    Get Started
                    <ArrowRight className="ml-1 w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
