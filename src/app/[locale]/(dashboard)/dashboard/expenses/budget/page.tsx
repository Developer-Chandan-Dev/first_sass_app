'use client';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BudgetStats } from '@/components/dashboard/expenses/budget-stats';
import { BudgetManager } from '@/components/dashboard/expenses/budget-manager-redux';
import { AddBudgetExpenseModal } from '@/components/dashboard/expenses/add-budget-expense-modal';
import { AdvancedExpensesTable } from '@/components/dashboard/expenses/advanced-expenses-table-redux';
import { ExpenseCategoryChart } from '@/components/dashboard/expenses/expense-category-chart';
import { ExpenseReportChart } from '@/components/dashboard/expenses/expense-report-chart';

import { RecentActivity } from '@/components/dashboard/expenses/recent-activity';
import { ExpenseFilters } from '@/components/dashboard/expenses/expense-filters-redux';
import { Plus } from 'lucide-react';
import { useDashboardTranslations } from '@/hooks/i18n';
import { PageHeader } from '@/components/dashboard/layout/page-header';
import { MobileFAB } from '@/components/dashboard/shared/mobile-fab';
import { fetchBudgets } from '@/lib/redux/expense/budgetSlice';
import { useMobile } from '@/hooks/use-mobile';

export default function BudgetExpensesPage() {
  const dispatch = useAppDispatch();
  const { expenses } = useDashboardTranslations();
  const { isMobile } = useMobile();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { budgets } = useAppSelector((state) => state.budgets);

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);
  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title={expenses.budgetExpenses}
        description={expenses.manageExpensesWithinBudgetLimits}
        actions={
          !isMobile ? (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {expenses.addBudgetExpense}
            </Button>
          ) : null
        }
      />

      <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          <TabsTrigger
            value="overview"
            className="text-xs sm:text-sm px-2 py-2"
          >
            {expenses.overview}
          </TabsTrigger>
          <TabsTrigger value="budgets" className="text-xs sm:text-sm px-2 py-2">
            {expenses.budgets}
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="text-xs sm:text-sm px-2 py-2"
          >
            {expenses.analytics}
          </TabsTrigger>
          <TabsTrigger
            value="expenses"
            className="text-xs sm:text-sm px-2 py-2"
          >
            {expenses?.title?.split(' ')[0]}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 md:space-y-6">
          <BudgetStats />

          <div className="grid gap-4 md:gap-6 lg:grid-cols-2 w-full max-w-full">
            <Card className="min-w-0 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {expenses.expensesByCategory}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 overflow-hidden">
                <ExpenseCategoryChart expenseType="budget" />
              </CardContent>
            </Card>

            <Card className="min-w-0 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {expenses.recentActivity}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 overflow-hidden">
                <RecentActivity expenseType="budget" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-6">
          <BudgetManager />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ExpenseReportChart expenseType="budget" />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4 md:space-y-6">
          <ExpenseFilters expenseType="budget" budgets={budgets} />
          <AdvancedExpensesTable expenseType="budget" />
        </TabsContent>
      </Tabs>

      <MobileFAB
        onClick={() => setIsModalOpen(true)}
        label={expenses.addBudgetExpense}
      />

      <AddBudgetExpenseModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onExpenseAdded={() => {}} // Redux handles updates automatically
      />
    </div>
  );
}
