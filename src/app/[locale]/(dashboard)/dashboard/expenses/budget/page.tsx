'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BudgetStats } from '@/components/dashboard/expenses/budget-stats';

import { AddBudgetExpenseModal } from '@/components/dashboard/expenses/add-budget-expense-modal';
import { AddBudgetModal } from '@/components/dashboard/expenses/add-budget-modal-redux';
import { AdvancedExpensesTable } from '@/components/dashboard/expenses/advanced-expenses-table-redux';
import { ExpenseCategoryChart } from '@/components/dashboard/expenses/expense-category-chart';
import { ExpenseReportChart } from '@/components/dashboard/expenses/expense-report-chart';
import { RecentActivity } from '@/components/dashboard/expenses/recent-activity';
import { ExpenseFilters } from '@/components/dashboard/expenses/expense-filters-redux';
import { BudgetAlerts } from '@/components/dashboard/expenses/budget-alerts';
import { BudgetTemplates } from '@/components/dashboard/expenses/budget-templates';
import { BudgetAnalytics } from '@/components/dashboard/expenses/budget-analytics';
import { BudgetExceededActions } from '@/components/dashboard/expenses/budget-exceeded-actions';
import { BudgetManagementHub } from '@/components/dashboard/expenses/budget-management-hub';
import { BudgetDashboard } from '@/components/dashboard/expenses/budget-dashboard';
import { Plus } from 'lucide-react';
import { useDashboardTranslations } from '@/hooks/i18n';
import { PageHeader } from '@/components/dashboard/layout/page-header';
import { MobileFAB } from '@/components/dashboard/shared/mobile-fab';
import { fetchBudgets, type Budget } from '@/lib/redux/expense/budgetSlice';
import { useMobile } from '@/hooks/use-mobile';

interface BudgetTemplate {
  name: string;
  category: string;
  suggestedAmount: number;
  description: string;
  icon?: string | React.ComponentType<{ className?: string }>;
}

export default function BudgetExpensesPage() {
  const dispatch = useAppDispatch();
  const { expenses } = useDashboardTranslations();
  const { isMobile } = useMobile();

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<BudgetTemplate | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const { budgets } = useAppSelector((state) => state.budgets);

  const refreshBudgets = useCallback(async () => {
    try {
      await fetch('/api/expenses/budget/auto-complete', { method: 'POST' });
    } catch (error) {
      console.error('Auto-completion check failed:', error);
    }
    dispatch(fetchBudgets());
  }, [dispatch]);

  useEffect(() => {
    refreshBudgets();
    const interval = setInterval(refreshBudgets, 30000);
    return () => clearInterval(interval);
  }, [refreshBudgets]);

  useEffect(() => {
    if (!isBudgetModalOpen && !isExpenseModalOpen) {
      refreshBudgets();
    }
  }, [isBudgetModalOpen, isExpenseModalOpen, refreshBudgets]);

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title={expenses.budgetExpenses}
        description={expenses.manageExpensesWithinBudgetLimits}
        actions={
          !isMobile ? (
            <Button onClick={() => setIsExpenseModalOpen(true)}>
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
          <BudgetDashboard
            budgets={budgets}
            onEditBudget={useCallback((budget: Budget) => {
              setEditingBudget(budget);
              setIsBudgetModalOpen(true);
            }, [])}
            onStatusChange={useCallback((budgetId: string, status: Budget['status']) => {
              fetch(`/api/expenses/budget/${budgetId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
              }).then(() => refreshBudgets());
            }, [refreshBudgets])}
            onCreateBudget={() => setIsBudgetModalOpen(true)}
          />
        </TabsContent>

        <TabsContent value="budgets" className="space-y-6">
          <BudgetManagementHub
            budgets={budgets}
            onCreateBudget={() => setIsBudgetModalOpen(true)}
            onEditBudget={useCallback((budget: Budget) => {
              setEditingBudget(budget);
              setIsBudgetModalOpen(true);
            }, [])}
            onStatusChange={useCallback((budgetId: string, status: Budget['status']) => {
              fetch(`/api/expenses/budget/${budgetId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
              }).then(() => refreshBudgets());
            }, [refreshBudgets])}
            onSelectTemplate={useCallback((template: BudgetTemplate) => {
              setSelectedTemplate(template);
              setIsBudgetModalOpen(true);
            }, [])}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <BudgetAnalytics />
          <ExpenseReportChart expenseType="budget" />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4 md:space-y-6">
          <ExpenseFilters expenseType="budget" budgets={budgets} />
          <AdvancedExpensesTable expenseType="budget" />
        </TabsContent>
      </Tabs>

      <MobileFAB
        onClick={useCallback(() => setIsExpenseModalOpen(true), [])}
        label={expenses.addBudgetExpense}
      />

      <AddBudgetExpenseModal
        open={isExpenseModalOpen}
        onOpenChange={useCallback((open: boolean) => setIsExpenseModalOpen(open), [])}
        onExpenseAdded={useCallback(() => {
          refreshBudgets();
        }, [refreshBudgets])}
      />
      
      <AddBudgetModal
        open={isBudgetModalOpen}
        onOpenChange={useCallback((open: boolean) => {
          setIsBudgetModalOpen(open);
          if (!open) {
            setSelectedTemplate(null);
            setEditingBudget(null);
          }
        }, [])}
        budget={editingBudget}
        selectedTemplate={selectedTemplate}
        onBudgetSaved={useCallback(() => {
          refreshBudgets();
        }, [refreshBudgets])}
      />
    </div>
  );
}