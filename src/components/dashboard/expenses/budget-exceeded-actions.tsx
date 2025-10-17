'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, Edit, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface ExceededBudget {
  _id: string;
  name: string;
  amount: number;
  spent: number;
  percentage: number;
  category?: string;
}

interface BudgetExceededActionsProps {
  exceededBudgets: ExceededBudget[];
  onIncreaseBudget: (budgetId: string) => void;
  onReduceExpenses: (budgetId: string) => void;
  onCreateNewBudget: () => void;
}

export function BudgetExceededActions({ 
  exceededBudgets, 
  onIncreaseBudget, 
  onReduceExpenses,
  onCreateNewBudget 
}: BudgetExceededActionsProps) {
  if (exceededBudgets.length === 0) {
    return null;
  }

  return (
    <Card className="border-l-4 border-l-red-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm text-red-600">
          <AlertTriangle className="h-4 w-4" />
          Budget Management Required
          <Badge variant="destructive" className="ml-auto text-xs">
            {exceededBudgets.length} Exceeded
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {exceededBudgets.map((budget) => (
          <div key={budget._id} className="p-3 border rounded-lg bg-red-50 dark:bg-red-950/20">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-sm">{budget.name}</h4>
                {budget.category && (
                  <p className="text-xs text-muted-foreground">{budget.category}</p>
                )}
              </div>
              <Badge variant="destructive" className="text-xs">
                {budget.percentage.toFixed(0)}% used
              </Badge>
            </div>
            
            <div className="text-xs text-muted-foreground mb-3">
              <span className="text-red-600 font-medium">
                {formatCurrency(budget.spent)} spent
              </span>
              {' of '}
              <span>{formatCurrency(budget.amount)} budget</span>
              <span className="text-red-600 font-medium">
                {' (+'}{formatCurrency(budget.spent - budget.amount)} over)
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onIncreaseBudget(budget._id)}
                className="text-xs h-7"
              >
                <Edit className="h-3 w-3 mr-1" />
                Increase Budget
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onReduceExpenses(budget._id)}
                className="text-xs h-7"
              >
                <TrendingDown className="h-3 w-3 mr-1" />
                Review Expenses
              </Button>
            </div>
          </div>
        ))}
        
        <div className="pt-2 border-t">
          <Button 
            size="sm" 
            onClick={onCreateNewBudget}
            className="w-full text-xs h-8"
          >
            <Plus className="h-3 w-3 mr-1" />
            Create Additional Budget
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}