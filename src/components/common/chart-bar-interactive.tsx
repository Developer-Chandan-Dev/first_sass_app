"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
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

interface BarDataItem {
  name: string;
  value: number;
}

interface ChartBarInteractiveProps {
  title: string;
  description?: string;
  data: BarDataItem[];
  dataKey?: string;
  nameKey?: string;
  color?: string;
  height?: number;
  showYAxis?: boolean;
}

export function ChartBarInteractive({
  title,
  description,
  data,
  dataKey = "value",
  nameKey = "name",
  color = "#3b82f6",
  height = 300,
  showYAxis = true,
}: ChartBarInteractiveProps) {
  const chartConfig = {
    [dataKey]: {
      label: "Amount",
      color: color,
    },
  } satisfies ChartConfig

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="w-full" style={{ height: `${height}px` }}>
            <BarChart 
              accessibilityLayer 
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey={nameKey}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 11 }}
                interval={0}
              />
              {showYAxis && (
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => `$${value}`}
                />
              )}
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar 
                dataKey={dataKey} 
                fill={color} 
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
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
