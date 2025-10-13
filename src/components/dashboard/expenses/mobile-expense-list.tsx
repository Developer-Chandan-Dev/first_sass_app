'use client';


import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash2, Calendar } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { deleteExpense } from '@/lib/redux/expense/expenseSlice';
import { formatCurrency } from '@/hooks/i18n/useBaseTranslations';
import { useLocale } from 'next-intl';
import { useMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ExpenseItem } from '@/lib/redux/expense/expenseSlice';

interface MobileExpenseListProps {
  expenseType: 'free' | 'budget';
  onEdit?: (expense: ExpenseItem) => void;
  className?: string;
}

export function MobileExpenseList({ 
  expenseType, 
  onEdit, 
  className 
}: MobileExpenseListProps) {
  const { isMobile, mounted } = useMobile();
  const { expenses, loading } = useAppSelector(state => state.expenses);
  const dispatch = useAppDispatch();
  const locale = useLocale();

  if (!mounted || !isMobile) {
    return null;
  }

  const filteredExpenses = expenses.filter(expense => 
    expenseType === 'free' ? !expense.budgetId : !!expense.budgetId
  );

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await dispatch(deleteExpense(id));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className={cn('space-y-3', className)}>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-6 bg-muted rounded mb-2" />
              <div className="flex justify-between">
                <div className="h-4 bg-muted rounded w-20" />
                <div className="h-4 bg-muted rounded w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No expenses found</p>
          <p className="text-sm">Add your first expense to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {filteredExpenses.map((expense) => (
        <Card key={expense._id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{expense.reason}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {expense.category}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    {formatCurrency(expense.amount, 'INR', locale)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(expense.date)}
                  </span>
                </div>
                

              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(expense)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => handleDelete(expense._id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}