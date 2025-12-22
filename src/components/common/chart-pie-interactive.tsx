"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
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

interface PieDataItem {
  name: string;
  value: number;
  fill: string;
}

interface ChartPieInteractiveProps {
  title: string;
  description?: string;
  data: PieDataItem[];
  totalLabel?: string;
  height?: number;
}

export function ChartPieInteractive({
  title,
  description,
  data,
  totalLabel = "Total",
  height = 300,
}: ChartPieInteractiveProps) {
  const totalValue = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0)
  }, [data])

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {}
    data.forEach((item) => {
      config[item.name] = {
        label: item.name,
        color: item.fill,
      }
    })
    return config
  }, [data])

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pb-0">
        {data.length > 0 ? (
          <>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square"
              style={{ maxHeight: `${height}px` }}
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                  // label={({ name, percent }) => 
                  //   `${name}: ${(percent * 100).toFixed(0)}%`
                  // }
                  // labelLine={true}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              ${totalValue.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              {totalLabel}
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            {/* Legend */}
            {/* <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {data.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="truncate text-xs">{item.name}</span>
                </div>
              ))}
            </div> */}
          </>
        ) : (
          <div className="flex items-center justify-center text-muted-foreground" style={{ height: `${height}px` }}>
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
