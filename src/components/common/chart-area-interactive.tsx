"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

interface ChartDataItem {
  date: string;
  [key: string]: string | number;
}

interface DataKey {
  key: string;
  label: string;
  color: string;
}

interface ChartAreaInteractiveProps {
  title: string;
  description?: string;
  data: ChartDataItem[];
  dataKeys: DataKey[];
  timeRangeOptions?: {
    value: string;
    label: string;
    days: number;
  }[];
  defaultTimeRange?: string;
  height?: number;
  showYAxis?: boolean;
}

export function ChartAreaInteractive({
  title,
  description,
  data,
  dataKeys,
  timeRangeOptions = [
    { value: "90d", label: "Last 3 months", days: 90 },
    { value: "30d", label: "Last 30 days", days: 30 },
    { value: "7d", label: "Last 7 days", days: 7 },
  ],
  defaultTimeRange = "90d",
  height = 250,
  showYAxis = false,
}: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState(defaultTimeRange)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = React.useMemo(() => {
    if (data.length === 0) return []
    
    const selectedOption = timeRangeOptions.find(opt => opt.value === timeRange)
    if (!selectedOption) return data

    const referenceDate = new Date(data[data.length - 1].date)
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - selectedOption.days)

    return data.filter((item) => {
      const date = new Date(item.date)
      return date >= startDate
    })
  }, [data, timeRange, timeRangeOptions])

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {}
    dataKeys.forEach(({ key, label, color }) => {
      config[key] = { label, color }
    })
    return config
  }, [dataKeys])

  return (
    <Card className="@container/card border-0 shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            {timeRangeOptions.map(opt => (
              <ToggleGroupItem key={opt.value} value={opt.value}>
                {opt.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              aria-label="Select a value"
            >
              <SelectValue placeholder={timeRangeOptions[0].label} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {timeRangeOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className="rounded-lg">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className={`aspect-auto w-full`}
            style={{ height: `${height}px` }}
          >
            <AreaChart data={filteredData}>
              <defs>
                {dataKeys.map(({ key, color }) => (
                  <linearGradient key={key} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              {showYAxis && (
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${value}`}
                />
              )}
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              {dataKeys.map(({ key, color }) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="natural"
                  fill={`url(#fill${key})`}
                  stroke={color}
                  stackId="a"
                />
              ))}
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center text-muted-foreground" style={{ height: `${height}px` }}>
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
