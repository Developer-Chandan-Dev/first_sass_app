'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { EditExpenseModal } from './edit-expense-modal';
import { toast } from 'sonner';

interface ExpenseItem {
  _id: string;
  amount: number;
  category: string;
  reason: string;
  date: string;
  createdAt: string;
  type: 'free' | 'budget';
}

interface ExpenseFiltersType {
  period: 'all' | 'today' | 'week' | 'month';
  category: string;
  startDate: string;
  endDate: string;
  search: string;
}

interface AdvancedExpensesTableProps {
  filters: ExpenseFiltersType;
  refreshTrigger?: number;
}

export function AdvancedExpensesTable({ filters, refreshTrigger }: AdvancedExpensesTableProps) {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const pageSize = 10;

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: 'free',
        page: currentPage.toString(),
        limit: pageSize.toString(),
        search: searchTerm || filters.search,
        period: filters.period,
        category: filters.category,
        startDate: filters.startDate,
        endDate: filters.endDate
      });

      const response = await fetch(`/api/expenses?${params}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Data: ",data, 76);
        setExpenses(data.expenses);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses, refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    
    try {
      toast.loading('Deleting expense...');
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success('Expense deleted successfully!');
        fetchExpenses();
      } else {
        toast.error('Failed to delete expense');
      }
    } catch (error) {
      toast.error('Failed to delete expense');
      console.error('Failed to delete expense:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedRows.length} expenses?`)) {
      return;
    }
    
    try {
      toast.loading('Deleting expenses...');
      const response = await fetch('/api/expenses/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedRows }),
      });
      if (response.ok) {
        toast.success(`${selectedRows.length} expenses deleted successfully!`);
        setSelectedRows([]);
        fetchExpenses();
      } else {
        toast.error('Failed to delete expenses');
      }
    } catch (error) {
      toast.error('Failed to delete expenses');
      console.error('Failed to bulk delete expenses:', error);
    }
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows(
      selectedRows.length === expenses.length 
        ? [] 
        : expenses.map(expense => expense._id)
    );
  };

  const handleEdit = (expense: ExpenseItem) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Expenses ({totalCount})</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            {selectedRows.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                Delete ({selectedRows.length})
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.length === expenses.length && expenses.length > 0}
                    onCheckedChange={toggleAllRows}
                  />
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No expenses found
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((expense) => (
                  <TableRow key={expense._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(expense._id)}
                        onCheckedChange={() => toggleRowSelection(expense._id)}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(expense.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {expense.reason}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{expense.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(expense)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(expense._id)}
          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      
      <EditExpenseModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        expense={editingExpense}
        onExpenseUpdated={fetchExpenses}
      />
    </Card>
  );
}