"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Link2, Users, TrendingUp, TrendingDown } from "lucide-react"

interface Metrics {
  totalRevenue: number
  totalSales: number
  activeLinks: number
  uniqueCustomers: number
  revenueChange: number
  salesChange: number
}

// Insert commas manually using array slicing — no regex, deterministic on any locale
function formatNumber(num: number): string {
  const s = String(Math.round(num))
  const chunks: string[] = []
  for (let i = s.length; i > 0; i -= 3) {
    chunks.unshift(s.slice(Math.max(0, i - 3), i))
  }
  return chunks.join(",")
}

function formatCurrency(num: number): string {
  // toFixed can produce locale-specific separators on some Node versions
  // so we build the decimal manually
  const rounded = Math.round(num * 100)
  const cents = String(rounded % 100).padStart(2, "0")
  const dollars = formatNumber(Math.floor(rounded / 100))
  return `${dollars}.${cents}`
}

function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalRevenue: 45231.89,
    totalSales: 2350,
    activeLinks: 0,
    uniqueCustomers: 573,
    revenueChange: 20.1,
    salesChange: 180.1,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/metrics")
        if (res.ok) setMetrics(await res.json())
      } catch {
        // Keep existing metrics on error
      }
    }
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 3000)
    return () => clearInterval(interval)
  }, [])

  return { metrics, mounted }
}

function StatsCardsInner() {
  const { metrics, mounted } = useMetrics()

  const stats = [
    {
      id: "revenue",
      label: "Total Revenue",
      value: mounted ? `$${formatCurrency(metrics.totalRevenue)}` : "$--",
      change: metrics.revenueChange,
      changeLabel: "from last month",
      icon: DollarSign,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    {
      id: "sales",
      label: "Total Sales",
      value: mounted ? formatNumber(metrics.totalSales) : "--",
      change: metrics.salesChange,
      changeLabel: "from last month",
      icon: ShoppingCart,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      id: "links",
      label: "Active Links",
      value: mounted ? String(metrics.activeLinks) : "--",
      change: 12,
      changeLabel: "new this week",
      icon: Link2,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      id: "customers",
      label: "Unique Customers",
      value: mounted ? formatNumber(metrics.uniqueCustomers) : "--",
      change: 4.3,
      changeLabel: "from last month",
      icon: Users,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        const isPositive = stat.change >= 0
        const TrendIcon = isPositive ? TrendingUp : TrendingDown

        return (
          <Card key={stat.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p
                    className="text-2xl font-bold tracking-tight text-foreground"
                    suppressHydrationWarning
                  >
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-lg p-2.5 ${stat.iconBg}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-sm">
                <TrendIcon
                  className={`h-4 w-4 ${
                    isPositive ? "text-emerald-600" : "text-red-600"
                  }`}
                />
                <span
                  className={`font-medium ${
                    isPositive ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {stat.change}%
                </span>
                <span className="text-muted-foreground">{stat.changeLabel}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Disable SSR entirely so number formatting never runs on the server
export const StatsCards = dynamic(() => Promise.resolve(StatsCardsInner), { ssr: false })
