'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  ChevronDown,
  ChevronRight,
  Target,
  AlertTriangle,
  Settings,
  BarChart3,
  Clock,
  PiggyBank,
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { type Budget } from '@/lib/redux/expense/budgetSlice';
import { BudgetStats } from './budget-stats';
import { useDashboardTranslations } from '@/hooks/i18n';

interface BudgetDashboardProps {
  budgets: Budget[];
  onEditBudget: (budget: Budget) => void;
  onStatusChange: (budgetId: string, status: Budget['status']) => void;
  onCreateBudget: () => void;
}

export function BudgetDashboard({
  budgets,
  onEditBudget,
  onStatusChange,
  onCreateBudget,
}: BudgetDashboardProps) {
  const { expenses } = useDashboardTranslations();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'active-budgets': true,
    'budget-alerts': true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate stats
  const runningBudgets = budgets.filter((b) => b.status === 'running');
  const completedBudgets = budgets.filter((b) => b.status === 'completed');
  const exceededBudgets = budgets.filter((b) => b.percentage >= 100);

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  const SectionHeader = ({
    id,
    title,
    icon: Icon,
    count,
    variant = 'default',
  }: {
    id: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    variant?: 'default' | 'warning' | 'success';
  }) => (
    <CollapsibleTrigger asChild>
      <Button
        variant="ghost"
        className="w-full justify-between p-4 h-auto"
        onClick={() => toggleSection(id)}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5" />
          <span className="font-medium">{title}</span>
          {count !== undefined && (
            <Badge
              variant={
                variant === 'warning'
                  ? 'destructive'
                  : variant === 'success'
                    ? 'default'
                    : 'secondary'
              }
            >
              {count}
            </Badge>
          )}
        </div>
        {openSections[id] ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    </CollapsibleTrigger>
  );

  const BudgetCard = ({ budget }: { budget: Budget }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-medium">{budget.name}</h4>
            {budget.category && (
              <p className="text-sm text-muted-foreground">{budget.category}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Badge
              variant={budget.status === 'completed' ? 'default' : 'secondary'}
            >
              {budget.status}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEditBudget(budget)}
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {formatCurrency(budget.spent)} {expenses.spent || 'spent'}
            </span>
            <span>
              {formatCurrency(budget.amount)} {expenses.budget || 'budget'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${budget.percentage >= 100 ? 'bg-red-500' : budget.percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(budget.percentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {budget.daysLeft || 0} {expenses.daysLeft || 'days left'}
            </span>
            <span>
              {budget.percentage.toFixed(0)}% {expenses.used || 'used'}
            </span>
          </div>
        </div>

        {budget.status === 'running' && (
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusChange(budget._id, 'paused')}
            >
              {expenses.pause || 'Pause'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusChange(budget._id, 'completed')}
            >
              {expenses.complete || 'Complete'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview - Always on Top */}
      <BudgetStats />

      {/* Collapsible Sections */}
      <div className="space-y-4">
        {/* Budget Alerts Section */}
        {exceededBudgets.length > 0 && (
          <Card>
            <Collapsible open={openSections['budget-alerts']}>
              <SectionHeader
                id="budget-alerts"
                title={expenses.budgetAlerts || 'Budget Alerts'}
                icon={AlertTriangle}
                count={exceededBudgets.length}
                variant="warning"
              />
              <CollapsibleContent>
                <CardContent className="pt-0">
                  {exceededBudgets.map((budget) => (
                    <div
                      key={budget._id}
                      className="p-3 bg-red-50 rounded-lg mb-2"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-red-800">
                            {budget.name}
                          </p>
                          <p className="text-sm text-red-600">
                            {expenses.overBy || 'Over by'}{' '}
                            {formatCurrency(budget.spent - budget.amount)}
                          </p>
                        </div>
                        <Button size="sm" onClick={() => onEditBudget(budget)}>
                          {expenses.fixBudget || 'Fix Budget'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        {/* Active Budgets Section */}
        <Card>
          <Collapsible open={openSections['active-budgets']}>
            <SectionHeader
              id="active-budgets"
              title={expenses.activeBudgets || 'Active Budgets'}
              icon={Clock}
              count={runningBudgets.length}
            />
            <CollapsibleContent>
              <CardContent className="pt-0">
                {runningBudgets.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      {expenses.noActiveBudgets || 'No active budgets'}
                    </p>
                    <Button onClick={onCreateBudget}>
                      {expenses.createBudget || 'Create Budget'}
                    </Button>
                  </div>
                ) : (
                  runningBudgets.map((budget) => (
                    <BudgetCard key={budget._id} budget={budget} />
                  ))
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Completed Budgets Section */}
        {completedBudgets.length > 0 && (
          <Card>
            <Collapsible open={openSections['completed-budgets']}>
              <SectionHeader
                id="completed-budgets"
                title={expenses.completedBudgets || 'Completed Budgets'}
                icon={PiggyBank}
                count={completedBudgets.length}
                variant="success"
              />
              <CollapsibleContent>
                <CardContent className="pt-0">
                  {completedBudgets.map((budget) => (
                    <BudgetCard key={budget._id} budget={budget} />
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        {/* Budget Analytics Section */}
        <Card>
          <Collapsible open={openSections['budget-analytics']}>
            <SectionHeader
              id="budget-analytics"
              title={expenses.budgetAnalytics || 'Budget Analytics'}
              icon={BarChart3}
            />
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-900 dark:text-blue-100">
                      {expenses.spendingRate || 'Spending Rate'}
                    </h4>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {totalBudgeted > 0
                        ? ((totalSpent / totalBudgeted) * 100).toFixed(1)
                        : 0}
                      %
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {expenses.ofTotalBudgetUsed || 'of total budget used'}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <h4 className="font-medium mb-2 text-green-900 dark:text-green-100">
                      {expenses.savingsRate || 'Savings Rate'}
                    </h4>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {totalBudgeted > 0
                        ? (
                            ((totalBudgeted - totalSpent) / totalBudgeted) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {expenses.ofBudgetSaved || 'of budget saved'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  );
}
