'use client';

import { AdminExpensesTable } from '@/components/admin/expenses/admin-expenses-table';
import { ExpenseFilters } from '@/components/admin/expenses/expense-filters';
import { ExpenseStats } from '@/components/admin/expenses/expense-stats';

export default function ExpensesPage() {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          All Expenses
        </h1>
      </div>

      <ExpenseStats />
      <ExpenseFilters />
      <AdminExpensesTable />
    </div>
  );
}
