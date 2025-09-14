'use client';

import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { AddExpenseModal } from '@/components/dashboard/add-expense-modal';
import { ExpensesTable } from '@/components/dashboard/expenses-table';
import { Plus } from 'lucide-react';

export default function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <UserButton />
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Manage your expenses</p>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>
      
      <ExpensesTable />
      
      <AddExpenseModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}