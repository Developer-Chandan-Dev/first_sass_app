'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddExpenseModal } from '@/components/dashboard/expenses/add-expense-modal';
import { AdvancedExpensesTable } from '@/components/dashboard/expenses/advanced-expenses-table';
import { ExpenseStats } from '@/components/dashboard/expenses/expense-stats';
import { ExpenseCategoryChart } from '@/components/dashboard/expenses/expense-category-chart';
import { ExpenseReportChart } from '@/components/dashboard/expenses/expense-report-chart';
import { ExpenseFilters } from '@/components/dashboard/expenses/expense-filters';
import { RecentActivity } from '@/components/dashboard/expenses/recent-activity';
import { Plus } from 'lucide-react';

interface ExpenseFiltersType {
  period: 'all' | 'today' | 'week' | 'month';
  category: string;
  startDate: string;
  endDate: string;
  search: string;
}

export default function ExpensesPage() {
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
    // Set default categories
    setCategories(['Food', 'Travel', 'Shopping', 'Bills', 'Others']);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Free Expenses</h2>
          <p className="text-muted-foreground">Track and manage your daily expenses</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ExpenseStats />
          
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseCategoryChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ExpenseReportChart />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <ExpenseFilters 
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
          />
          <AdvancedExpensesTable filters={filters} refreshTrigger={refreshTrigger} />
        </TabsContent>
      </Tabs>
      
      <AddExpenseModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        expenseType="free"
        onExpenseAdded={() => setRefreshTrigger(prev => prev + 1)}
      />
    </div>
  );
}