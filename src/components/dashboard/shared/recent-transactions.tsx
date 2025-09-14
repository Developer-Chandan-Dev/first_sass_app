import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function RecentTransactions() {
  const transactions = [
    {
      id: 1,
      merchant: 'Starbucks',
      category: 'Food & Dining',
      amount: -4.95,
      date: '2 hours ago',
      icon: '☕'
    },
    {
      id: 2,
      merchant: 'Uber',
      category: 'Transportation',
      amount: -12.50,
      date: '5 hours ago',
      icon: '🚗'
    },
    {
      id: 3,
      merchant: 'Netflix',
      category: 'Entertainment',
      amount: -15.99,
      date: '1 day ago',
      icon: '🎬'
    },
    {
      id: 4,
      merchant: 'Grocery Store',
      category: 'Groceries',
      amount: -89.32,
      date: '2 days ago',
      icon: '🛒'
    },
    {
      id: 5,
      merchant: 'Salary Deposit',
      category: 'Income',
      amount: 3500.00,
      date: '3 days ago',
      icon: '💰'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{transaction.icon}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{transaction.merchant}</p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${
                transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toFixed(2)}
              </p>
              <Badge variant="secondary" className="text-xs">
                {transaction.category}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}