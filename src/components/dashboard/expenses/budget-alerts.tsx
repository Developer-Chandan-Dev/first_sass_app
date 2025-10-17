'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Bell } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface BudgetAlert {
  budgetId: string;
  budgetName: string;
  type: 'warning' | 'exceeded';
  message: string;
  severity: 'medium' | 'high';
  progress: number;
}

export function BudgetAlerts() {
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/expenses/budget?active=true');
        const budgets = await response.json();
        
        const alertsData = budgets
          .filter((budget: any) => budget.percentage >= 80)
          .map((budget: any) => ({
            budgetId: budget._id,
            budgetName: budget.name,
            type: budget.percentage >= 100 ? 'exceeded' : 'warning',
            message: budget.percentage >= 100 
              ? `Budget "${budget.name}" exceeded by ${formatCurrency(budget.spent - budget.amount)}`
              : `Budget "${budget.name}" is ${budget.percentage.toFixed(0)}% used`,
            severity: budget.percentage >= 100 ? 'high' : 'medium',
            progress: budget.percentage,
          }));
        
        setAlerts(alertsData);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) {
    return <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="h-16 bg-muted rounded"></div>
      </CardContent>
    </Card>;
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bell className="h-4 w-4" />
          Budget Alerts
          <Badge variant="destructive" className="ml-auto text-xs h-5">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {alerts.map((alert) => (
          <div key={alert.budgetId} className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
            {alert.type === 'exceeded' ? (
              <AlertTriangle className="h-3 w-3 text-destructive flex-shrink-0" />
            ) : (
              <TrendingUp className="h-3 w-3 text-orange-500 flex-shrink-0" />
            )}
            <span className="flex-1 text-xs text-muted-foreground truncate">
              {alert.message}
            </span>
            <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'} className="text-xs h-4 px-1">
              {alert.progress.toFixed(0)}%
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}