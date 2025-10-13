"use client";

import { useEffect } from 'react';
import { useDashboardTranslations } from '@/hooks/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatsCards } from '@/components/dashboard/shared/stats-cards';
import { ExpenseChart } from '@/components/dashboard/expenses/expense-chart';
import { RecentTransactions } from '@/components/dashboard/shared/recent-transactions';
import ErrorBoundary from '@/components/dashboard/shared/error-boundary';
import { safeGet } from '@/lib/safe-access';
import { Clock, TrendingUp, Target, PieChart, Calendar, Bell } from 'lucide-react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { refreshStats } from '@/lib/redux/expense/overviewSlice';
import { PageHeader } from '@/components/dashboard/layout/page-header';

export default function Dashboard() {
    const { dashboard, sidebar } = useDashboardTranslations();
    const dispatch = useAppDispatch();

    useEffect(() => {
      dispatch(refreshStats('free'));
      dispatch(refreshStats('budget'));
    }, [dispatch]);

  const comingSoonFeatures = [
    { 
      title: sidebar.budgets, 
      icon: Target, 
      description: dashboard.setBudgetTargets 
    },
    { 
      title: sidebar.analytics, 
      icon: PieChart, 
      description: dashboard.advancedSpendingAnalysis 
    },
    { 
      title: sidebar.notifications, 
      icon: Bell, 
      description: dashboard.neverMissPayment 
    },
    { 
      title: dashboard.financialCalendar, 
      icon: Calendar, 
      description: dashboard.planExpensesAhead 
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={safeGet(dashboard, 'overview', 'Dashboard Overview')}
        description={safeGet(dashboard, 'description', 'Track your financial progress and manage expenses efficiently.')}
        showBreadcrumbs={false}
      />
      
      <ErrorBoundary>
        <StatsCards />
      </ErrorBoundary>
      

      
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <ErrorBoundary>
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <TrendingUp className="h-5 w-5" />
                {dashboard?.spendingTrends || 'Spending Trends'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6">
              <ExpenseChart />
            </CardContent>
          </Card>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <RecentTransactions />
        </ErrorBoundary>
      </div>

      {/* Coming Soon Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {dashboard?.comingSoon || 'Coming Soon'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {comingSoonFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex flex-col items-center text-center p-4 border rounded-lg bg-muted/30">
                  <Icon className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-medium mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {dashboard?.comingSoon || 'Coming Soon'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}