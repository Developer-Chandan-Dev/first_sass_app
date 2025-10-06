"use client";

import { useEffect } from 'react';
import { useAppTranslations } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatsCards } from '@/components/dashboard/shared/stats-cards';
import { ExpenseChart } from '@/components/dashboard/expenses/expense-chart';
import { RecentTransactions } from '@/components/dashboard/shared/recent-transactions';
import { Clock, TrendingUp, Target, PieChart, Calendar, Bell } from 'lucide-react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { refreshStats } from '@/lib/redux/expense/overviewSlice';

export default function Dashboard() {
    const { dashboard, sidebar } = useAppTranslations();
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
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{dashboard.overview}</h2>
        <p className="text-muted-foreground">{dashboard.description}</p>
      </div>
      
      <StatsCards />
      
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <TrendingUp className="h-5 w-5" />
              {dashboard.spendingTrends}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            <ExpenseChart />
          </CardContent>
        </Card>
        
        <RecentTransactions />
      </div>

      {/* Coming Soon Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {dashboard.comingSoon}
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
                    {dashboard.comingSoon}
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