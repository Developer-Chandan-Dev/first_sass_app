'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddExpenseModal } from '@/components/dashboard/expenses/add-expense-modal-redux';
import { AdvancedExpensesTable } from '@/components/dashboard/expenses/advanced-expenses-table-redux';
import { ExpenseStats } from '@/components/dashboard/expenses/expense-stats';
import { ExpenseCategoryChart } from '@/components/dashboard/expenses/expense-category-chart';
import { ExpenseReportChart } from '@/components/dashboard/expenses/expense-report-chart';

import { RecentActivity } from '@/components/dashboard/expenses/recent-activity';
import { ExpenseFilters } from '@/components/dashboard/expenses/expense-filters-redux';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useDashboardTranslations } from '@/hooks/i18n';



export default function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { expenses } = useDashboardTranslations();



  return (
    <div className="space-y-4 md:space-y-6">
      <Button variant="ghost" size="sm" asChild className="w-fit">
        <Link href="/dashboard/expenses">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {expenses.backToExpenses}
        </Link>
      </Button>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{expenses.freeExpenses}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{expenses.trackAndManageDailyExpenses}</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="sm:inline">{expenses.addExpense}</span>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-2">{expenses.overview}</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 py-2">{expenses.analytics}</TabsTrigger>
          <TabsTrigger value="expenses" className="text-xs sm:text-sm px-2 py-2">{expenses?.title?.split(" ")[0]}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 md:space-y-6">
          <ExpenseStats />
          
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2 w-full max-w-full">
            <Card className="min-w-0 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{expenses.expensesByCategory}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 overflow-hidden">
                <ExpenseCategoryChart />
              </CardContent>
            </Card>
            
            <Card className="min-w-0 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{expenses.recentActivity}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 overflow-hidden">
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ExpenseReportChart />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4 md:space-y-6">
          <ExpenseFilters expenseType="free" />
          <AdvancedExpensesTable expenseType="free" />
        </TabsContent>
      </Tabs>
      
      <AddExpenseModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        expenseType="free"
      />
    </div>
  );
}