import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExpenseSummary } from '@/components/dashboard/expense-summary';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <UserButton />
      </div>
      
      <ExpenseSummary />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/dashboard/expenses">
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/expenses">View All Expenses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}