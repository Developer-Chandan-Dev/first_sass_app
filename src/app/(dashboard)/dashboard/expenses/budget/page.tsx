'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BudgetStats } from '@/components/dashboard/expenses/budget-stats';
import { BudgetManager } from '@/components/dashboard/expenses/budget-manager';
import { AddBudgetExpenseModal } from '@/components/dashboard/expenses/add-budget-expense-modal';
import { AdvancedExpensesTable } from '@/components/dashboard/expenses/advanced-expenses-table';
import { ExpenseCategoryChart } from '@/components/dashboard/expenses/expense-category-chart';
import { ExpenseReportChart } from '@/components/dashboard/expenses/expense-report-chart';
import { ExpenseFilters } from '@/components/dashboard/expenses/expense-filters';
import { RecentActivity } from '@/components/dashboard/expenses/recent-activity';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ExpenseFiltersType {
  period: 'all' | 'today' | 'week' | 'month';
  category: string;
  startDate: string;
  endDate: string;
  search: string;
}

export default function BudgetExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filters, setFilters] = useState<ExpenseFiltersType>({
    period: 'all',
    category: '',
    startDate: '',
    endDate: '',
    search: ''
  });

  useEffect(() => {
    setCategories(['Food', 'Travel', 'Shopping', 'Bills', 'Others']);
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <Button variant="ghost" size="sm" asChild className="w-fit">
        <Link href="/dashboard/expenses">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Expenses
        </Link>
      </Button>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Budget Expenses</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage expenses within predefined budget limits</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          <span className="sm:inline">Add Budget Expense</span>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-2">Overview</TabsTrigger>
          <TabsTrigger value="budgets" className="text-xs sm:text-sm px-2 py-2">Budgets</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 py-2">Analytics</TabsTrigger>
          <TabsTrigger value="expenses" className="text-xs sm:text-sm px-2 py-2">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 md:space-y-6">
          <BudgetStats key={refreshTrigger} />
          
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2 w-full max-w-full">
            <Card className="min-w-0 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 overflow-hidden">
                <ExpenseCategoryChart expenseType="budget" />
              </CardContent>
            </Card>
            
            <Card className="min-w-0 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 overflow-hidden">
                <RecentActivity expenseType="budget" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-6">
          <BudgetManager refreshTrigger={refreshTrigger} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ExpenseReportChart expenseType="budget" />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4 md:space-y-6">
          <ExpenseFilters 
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
            onRefresh={() => setRefreshTrigger(prev => prev + 1)}
            expenseType="budget"
          />
          <AdvancedExpensesTable filters={filters} refreshTrigger={refreshTrigger} expenseType="budget" />
        </TabsContent>
      </Tabs>
      
      <AddBudgetExpenseModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onExpenseAdded={() => setRefreshTrigger(prev => prev + 1)}
      />
    </div>
  );
}