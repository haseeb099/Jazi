"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { format, parseISO } from "date-fns"
import { Activity } from "lucide-react"

interface CallVolumeChartProps {
  data: Array<{
    date: string
    calls: number
    positive: number
    neutral: number
    negative: number
  }>
}

export function CallVolumeChart({ data }: CallVolumeChartProps) {
  const [mounted, setMounted] = useState(false)
  const totalCalls = data.reduce((acc, d) => acc + d.calls, 0)
  const avgCalls = data.length > 0 ? Math.round(totalCalls / data.length) : 0
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5 text-primary" />
              Call Volume
            </CardTitle>
            <CardDescription>Daily call activity with sentiment breakdown</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{totalCalls}</p>
            <p className="text-xs text-muted-foreground">Total calls ({avgCalls}/day avg)</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full" style={{ height: 288, minHeight: 288 }}>
          {!mounted ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-muted-foreground">Loading chart...</div>
            </div>
          ) : (
          <ResponsiveContainer width="99%" height={280}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(70% 0.25 280)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="oklch(70% 0.25 280)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(70% 0.2 145)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="oklch(70% 0.2 145)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(25% 0.02 260)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  try {
                    return format(parseISO(value), "MMM d")
                  } catch {
                    return value
                  }
                }}
                stroke="oklch(50% 0.02 260)"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                stroke="oklch(50% 0.02 260)"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || typeof label !== 'string') return null
                  let formattedDate = label
                  try {
                    formattedDate = format(parseISO(label), "MMM d, yyyy")
                  } catch {
                    // Use label as-is
                  }
                  return (
                    <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-sm p-4 shadow-xl">
                      <p className="text-sm font-semibold mb-2">
                        {formattedDate}
                      </p>
                      <div className="space-y-1">
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between gap-4 text-sm">
                            <span className="flex items-center gap-2">
                              <span 
                                className="size-2.5 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-muted-foreground capitalize">
                                {entry.name}
                              </span>
                            </span>
                            <span className="font-medium">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground capitalize">{value}</span>
                )}
              />
              <Area
                type="monotone"
                dataKey="calls"
                name="Total Calls"
                stroke="oklch(70% 0.25 280)"
                strokeWidth={2}
                fill="url(#colorCalls)"
              />
              <Area
                type="monotone"
                dataKey="positive"
                name="Positive"
                stroke="oklch(70% 0.2 145)"
                strokeWidth={2}
                fill="url(#colorPositive)"
              />
            </AreaChart>
          </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
