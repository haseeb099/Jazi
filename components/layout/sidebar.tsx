"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useTenant } from "@/components/providers/tenant-provider"
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
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Agents",
    href: "/agents",
    icon: Bot,
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

  return (
    <div className="flex h-full w-64 flex-col border-r bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="size-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground">
            {tenant?.name || "Jazi"}
          </span>
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
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.name}
                </Link>
                {item.children && isActive && (
                  <div className="ml-7 mt-1 flex flex-col gap-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-sm transition-colors",
                          pathname === child.href
                            ? "text-sidebar-primary font-medium"
                            : "text-sidebar-foreground hover:text-sidebar-primary"
                        )}
                      >
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

        <nav className="flex flex-col gap-1">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Plan Status */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-sidebar-accent p-3">
          <p className="text-xs font-medium text-sidebar-foreground">
            {tenant?.plan === "free" ? "Free Plan" : `${tenant?.plan} Plan`}
          </p>
          <p className="mt-1 text-xs text-sidebar-foreground/70">
            {tenant?.plan_minutes_included || 500} minutes included
          </p>
        </div>
      </div>
    </div>
  )
}
