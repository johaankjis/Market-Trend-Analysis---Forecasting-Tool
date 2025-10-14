"use client"

import type React from "react"
import { BarChart3, TrendingUp, Target, Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavItem {
  title: string
  icon: React.ReactNode
  href: string
  active?: boolean
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "#overview",
    active: true,
  },
  {
    title: "Forecasting",
    icon: <TrendingUp className="h-5 w-5" />,
    href: "#forecasting",
  },
  {
    title: "Market Analysis",
    icon: <Target className="h-5 w-5" />,
    href: "#market",
  },
  {
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    href: "#settings",
  },
]

function NavContent() {
  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => (
        <a
          key={item.title}
          href={item.href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            item.active
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          {item.icon}
          {item.title}
        </a>
      ))}
    </nav>
  )
}

export function DashboardNav() {
  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden bg-transparent">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-sidebar">
            <div className="mt-8">
              <NavContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <aside className="hidden lg:block w-64 border-r border-border bg-sidebar p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Market Analytics</h2>
          <p className="text-sm text-muted-foreground">Forecasting Platform</p>
        </div>
        <NavContent />
      </aside>
    </>
  )
}
