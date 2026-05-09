"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useTenant } from "@/components/providers/tenant-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LayoutDashboard,
  Bot,
  Users,
  Phone,
  BarChart3,
  CheckCircle,
  Settings,
  Zap,
  CreditCard,
  ChevronRight,
  Sparkles,
  Crown,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "AI Agents",
    href: "/agents",
    icon: Bot,
    badge: "3",
  },
  {
    name: "CRM",
    href: "/crm/leads",
    icon: Users,
    children: [
      { name: "Leads", href: "/crm/leads" },
      { name: "Pipeline", href: "/crm/pipeline" },
      { name: "Tasks", href: "/crm/tasks" },
    ],
  },
  {
    name: "Calls",
    href: "/calls",
    icon: Phone,
    badge: "12",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Approvals",
    href: "/approvals",
    icon: CheckCircle,
    badge: "5",
    badgeVariant: "warning",
  },
]

const secondaryNavigation = [
  {
    name: "Integrations",
    href: "/integrations",
    icon: Zap,
  },
  {
    name: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { tenant } = useTenant()

  const minutesUsed = 847
  const minutesTotal = tenant?.plan_minutes_included || 2000
  const usagePercentage = (minutesUsed / minutesTotal) * 100

  return (
    <div className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Zap className="size-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-success border-2 border-sidebar" />
          </div>
          <div>
            <span className="font-bold text-sidebar-foreground">
              {tenant?.name || "Jazi"}
            </span>
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-0">
                {tenant?.plan === "free" ? "Free" : tenant?.plan || "Pro"}
              </Badge>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-accent/5 text-sidebar-accent-foreground border border-primary/20"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className={cn(
                      "size-4 transition-colors",
                      isActive ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-primary"
                    )} />
                    {item.name}
                  </span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "h-5 min-w-5 px-1.5 text-[10px] font-semibold",
                        item.badgeVariant === "warning" 
                          ? "bg-warning/10 text-warning border-warning/20"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
                {item.children && isActive && (
                  <div className="ml-5 mt-1 flex flex-col gap-0.5 border-l border-sidebar-border pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors",
                          pathname === child.href
                            ? "text-primary font-medium"
                            : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
                        )}
                      >
                        <ChevronRight className={cn(
                          "size-3",
                          pathname === child.href ? "text-primary" : "text-sidebar-foreground/40"
                        )} />
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="my-4 h-px bg-sidebar-border" />

        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
          Settings
        </p>
        <nav className="flex flex-col gap-1">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-accent/5 text-sidebar-accent-foreground border border-primary/20"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn(
                  "size-4 transition-colors",
                  isActive ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-primary"
                )} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Usage Stats & Upgrade */}
      <div className="border-t border-sidebar-border p-4 space-y-4">
        {/* Usage Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-sidebar-foreground/60">Minutes used</span>
            <span className="font-medium text-sidebar-foreground">
              {minutesUsed.toLocaleString()} / {minutesTotal.toLocaleString()}
            </span>
          </div>
          <Progress 
            value={usagePercentage} 
            className="h-1.5 bg-sidebar-accent"
          />
        </div>

        {/* Upgrade CTA */}
        {tenant?.plan !== "enterprise" && (
          <Button 
            className="w-full gradient-primary text-white border-0 gap-2"
            size="sm"
          >
            <Crown className="size-4" />
            Upgrade Plan
          </Button>
        )}
      </div>
    </div>
  )
}
