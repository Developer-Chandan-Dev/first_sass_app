'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const data = [
  { month: 'Jan', revenue: 4000, subscriptions: 120 },
  { month: 'Feb', revenue: 3000, subscriptions: 150 },
  { month: 'Mar', revenue: 5000, subscriptions: 180 },
  { month: 'Apr', revenue: 4500, subscriptions: 200 },
  { month: 'May', revenue: 6000, subscriptions: 250 },
  { month: 'Jun', revenue: 5500, subscriptions: 300 },
];

export function RevenueAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">
          Revenue & Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="subscriptions"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
