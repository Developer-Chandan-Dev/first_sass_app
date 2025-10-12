'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Wallet, 
  Target, 
  ArrowRight
} from 'lucide-react';
import { ExpenseOverviewStats } from '@/components/dashboard/expenses/expense-overview-stats';
import { RecentActivityOverview } from '@/components/dashboard/expenses/recent-activity-overview';
import { useDashboardTranslations } from '@/hooks/i18n';
import { LucideIcon } from 'lucide-react';

interface ExpenseType {
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  href: string;
  color: string;
}

export default function ExpensesOverviewPage() {
  const { expenses } = useDashboardTranslations();

  // Safe access with fallbacks
  const expenseTypes: ExpenseType[] = [
    {
      title: expenses?.expenseType?.[0]?.title || 'Free Expenses',
      description: expenses?.expenseType?.[0]?.description || 'Track your daily expenses without budget constraints',
      features: expenses?.expenseType?.[0]?.features || [
        'Unlimited tracking',
        'Category management',
        'Analytics & reports',
        'Export data'
      ],
      icon: Wallet,
      href: '/dashboard/expenses/free',
      color: 'bg-blue-500'
    },
    {
      title: expenses?.expenseType?.[1]?.title || 'Budget Expenses',
      description: expenses?.expenseType?.[1]?.description || 'Manage expenses within predefined budget limits',
      features: expenses?.expenseType?.[1]?.features || [
        'Budget limits',
        'Spending alerts',
        'Goal tracking',
        'Budget analysis'
      ],
      icon: Target,
      href: '/dashboard/expenses/budget',
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{expenses?.title || 'Expense Management'}</h2>
          <p className="text-muted-foreground">{expenses?.subTitle || 'Choose how you want to track your expenses'}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <ExpenseOverviewStats />

      {/* Expense Types */}
      <div className="grid gap-6 md:grid-cols-2">
        {expenseTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card key={type.title} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${type.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {type.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {type.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  asChild 
                  className="w-full" 
                  variant="default"
                >
                  <Link href={type.href}>
                    {expenses?.getStarted || 'Get Started'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{expenses?.recentExpenses || 'Recent Activity'}</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/expenses/free">
                {expenses?.viewAll || 'View All'} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <RecentActivityOverview />
        </CardContent>
      </Card>
    </div>
  );
}