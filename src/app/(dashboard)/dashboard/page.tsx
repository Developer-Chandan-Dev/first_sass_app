import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCards } from '@/components/dashboard/shared/stats-cards';
import { ExpenseChart } from '@/components/dashboard/expenses/expense-chart';
import { RecentTransactions } from '@/components/dashboard/shared/recent-transactions';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your finances today.</p>
      </div>
      
      <StatsCards />
      
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl">Spending Trends</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            <ExpenseChart />
          </CardContent>
        </Card>
        
        <RecentTransactions />
      </div>
    </div>
  );
}