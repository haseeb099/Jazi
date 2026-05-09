import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: number
  description?: string
  gradient?: 'primary' | 'accent' | 'success' | 'warning'
}

const gradientClasses = {
  primary: 'from-primary/20 to-primary/5',
  accent: 'from-accent/20 to-accent/5',
  success: 'from-success/20 to-success/5',
  warning: 'from-warning/20 to-warning/5',
}

const iconBgClasses = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  gradient = 'primary',
}: MetricCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden border-border/50 bg-card/50 card-hover stat-card",
      "bg-gradient-to-br",
      gradientClasses[gradient]
    )}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">{value}</span>
              {typeof trend === "number" && (
                <span
                  className={cn(
                    "flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-full",
                    trend >= 0 
                      ? "bg-success/10 text-success" 
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {trend >= 0 ? (
                    <TrendingUp className="mr-0.5 size-3" />
                  ) : (
                    <TrendingDown className="mr-0.5 size-3" />
                  )}
                  {Math.abs(trend).toFixed(1)}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-xl",
            iconBgClasses[gradient]
          )}>
            <Icon className="size-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
