import * as React from "react"
import axios from "axios"
import { useAuth } from "@clerk/react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "#components/ui/chart"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const number = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
})

const chartConfig = {
  profit: {
    label: "Profit",
    color: "#34d399",
  },
} satisfies ChartConfig

type MonthlyProfit = {
  month: string
  revenue: number
  cost: number
  profit: number
}

export function ChartLineInteractive({ storeId }: { storeId?: string }) {
  const { getToken } = useAuth()
  const [chartData, setChartData] = React.useState<MonthlyProfit[]>([])

  React.useEffect(() => {
    if (!storeId) return
    const fetchTrend = async () => {
      const token = await getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const [salesTrend, materialsTrend] = await Promise.all([
        axios.get(`http://localhost:5000/trend/sales/${storeId}`, { headers }),
        axios.get(`http://localhost:5000/trend/materials/${storeId}`, { headers }),
      ])

      const revenueByMonth = new Map<string, number>(
        salesTrend.data.map((row: { month: string; revenue: string }) => [
          row.month,
          Number(row.revenue),
        ])
      )
      const costByMonth = new Map<string, number>(
        materialsTrend.data.map((row: { month: string; cost: string }) => [
          row.month,
          Number(row.cost),
        ])
      )

      const months = Array.from(
        new Set([...revenueByMonth.keys(), ...costByMonth.keys()])
      ).sort()

      setChartData(
        months.map((month) => {
          const revenue = revenueByMonth.get(month) ?? 0
          const cost = costByMonth.get(month) ?? 0
          return { month, revenue, cost, profit: revenue - cost }
        })
      )
    }
    fetchTrend()
  }, [storeId, getToken])

  const totalProfit = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.profit, 0),
    [chartData]
  )

  return (
    <div
      className="dark"
      style={
        {
          "--card": "#0b120f",
          "--card-foreground": "#ffffff",
          "--popover": "#0b120f",
          "--popover-foreground": "#ffffff",
          "--muted-foreground": "rgba(255,255,255,0.5)",
        } as React.CSSProperties
      }
    >
      <Card className="rounded-2xl border border-white/10 py-4 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] sm:py-0">
        <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
            <CardTitle className="font-sans text-base font-semibold tracking-normal text-white normal-case">
              Profit Over Time
            </CardTitle>
            <CardDescription>
              Revenue minus cost, tracked month over month
            </CardDescription>
          </div>
          <div className="flex">
            <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
              <span className="text-xs text-muted-foreground">
                Total profit
              </span>
              <span
                className={
                  totalProfit >= 0
                    ? "text-lg leading-none font-bold text-emerald-400 sm:text-3xl"
                    : "text-lg leading-none font-bold text-rose-400 sm:text-3xl"
                }
              >
                {number.format(totalProfit)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-62.5 w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    year: "2-digit",
                  })
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-37.5"
                    nameKey="profit"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    }}
                    formatter={(value) => currency.format(Number(value))}
                  />
                }
              />
              <Line
                dataKey="profit"
                type="monotone"
                stroke="var(--color-profit)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
