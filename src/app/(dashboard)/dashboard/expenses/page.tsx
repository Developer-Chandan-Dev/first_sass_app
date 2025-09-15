'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import Link from 'next/link';
import { 
  Wallet, 
  Target, 
 
  PieChart, 
  ArrowRight,
  DollarSign,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function ExpensesOverviewPage() {
  const expenseTypes = [
    {
      title: 'Free Expenses',
      description: 'Track your daily expenses without budget constraints',
      icon: Wallet,
      href: '/dashboard/expenses/free',
      color: 'bg-blue-500',
      features: ['Unlimited tracking', 'Category management', 'Analytics & reports', 'Export data']
    },
    {
      title: 'Budget Expenses',
      description: 'Manage expenses within predefined budget limits',
      icon: Target,
      href: '/dashboard/expenses/budget',
      color: 'bg-green-500',
      features: ['Budget limits', 'Spending alerts', 'Goal tracking', 'Budget analysis']
    }
  ];

  const quickStats = [
    { label: 'Total Expenses', value: '₹45,230', icon: DollarSign, change: '+12%' },
    { label: 'This Month', value: '₹8,450', icon: Calendar, change: '+8%' },
    { label: 'Categories', value: '12', icon: PieChart, change: '+2' },
    { label: 'Avg/Day', value: '₹280', icon: BarChart3, change: '-5%' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Expense Management</h2>
          <p className="text-muted-foreground">Choose how you want to track your expenses</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
                    Get Started
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
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/expenses/free">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { category: 'Food', amount: '₹450', time: '2 hours ago', color: 'bg-orange-500' },
              { category: 'Transport', amount: '₹120', time: '5 hours ago', color: 'bg-blue-500' },
              { category: 'Shopping', amount: '₹2,300', time: '1 day ago', color: 'bg-purple-500' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${activity.color}`}></div>
                  <div>
                    <p className="font-medium">{activity.category}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-{activity.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}