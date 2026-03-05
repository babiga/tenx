"use client"

import { useEffect, useMemo, useState } from "react"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type DashboardAnalytics = {
  totalRevenue: number
  newCustomers: number
  activeAccounts: number
  growthRate: number
  deltas: {
    totalRevenue: number
    newCustomers: number
    activeAccounts: number
    growthRate: number
  }
}

const initialAnalytics: DashboardAnalytics = {
  totalRevenue: 0,
  newCustomers: 0,
  activeAccounts: 0,
  growthRate: 0,
  deltas: {
    totalRevenue: 0,
    newCustomers: 0,
    activeAccounts: 0,
    growthRate: 0,
  },
}

function formatDelta(value: number) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(1)}%`
}

function DeltaBadge({ value }: { value: number }) {
  const isPositive = value >= 0
  const Icon = isPositive ? TrendingUpIcon : TrendingDownIcon

  return (
    <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
      <Icon className="size-3" />
      {formatDelta(value)}
    </Badge>
  )
}

export function SectionCards() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics>(initialAnalytics)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await fetch("/api/dashboard/analytics", { cache: "no-store" })
        if (!response.ok) return

        const payload = await response.json()
        if (!payload?.success || !payload?.data) return
        setAnalytics(payload.data as DashboardAnalytics)
      } catch {
        // Preserve zero-state if analytics fetch fails.
      }
    }

    loadAnalytics()
  }, [])

  const formattedRevenue = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(analytics.totalRevenue),
    [analytics.totalRevenue],
  )

  const formattedCustomers = useMemo(
    () => new Intl.NumberFormat("en-US").format(analytics.newCustomers),
    [analytics.newCustomers],
  )

  const formattedAccounts = useMemo(
    () => new Intl.NumberFormat("en-US").format(analytics.activeAccounts),
    [analytics.activeAccounts],
  )

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formattedRevenue}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <DeltaBadge value={analytics.deltas.totalRevenue} />
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Month-over-month revenue
          </div>
          <div className="text-muted-foreground">
            Completed bookings only
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formattedCustomers}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <DeltaBadge value={analytics.deltas.newCustomers} />
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Current month signups
          </div>
          <div className="text-muted-foreground">
            Compared to previous month
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formattedAccounts}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <DeltaBadge value={analytics.deltas.activeAccounts} />
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Customer + active dashboard users
          </div>
          <div className="text-muted-foreground">Monthly account creation trend</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatDelta(analytics.growthRate)}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <DeltaBadge value={analytics.deltas.growthRate} />
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Booking growth rate
          </div>
          <div className="text-muted-foreground">Current month vs previous month</div>
        </CardFooter>
      </Card>
    </div>
  )
}
