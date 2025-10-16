'use client';

import { Card, CardContent } from '@/components/ui/card';

export function BalanceLegend() {
  return (
    <Card className="bg-muted/30">
      <CardContent className="pt-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-blue-600 font-medium">Connected Income</span>
            <span className="text-muted-foreground">- Affects balance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-green-600 font-medium">
              Unconnected Income
            </span>
            <span className="text-muted-foreground">- Tracking only</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-red-600 font-medium">
              Balance-Affecting Expense
            </span>
            <span className="text-muted-foreground">
              - Reduces from connected income
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">Regular Expense</span>
            <span className="text-muted-foreground">- Tracking only</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
