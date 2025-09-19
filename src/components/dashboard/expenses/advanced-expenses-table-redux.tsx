'use client';

import { useState, useEffect } from 'react';
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
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { EditExpenseModal } from './edit-expense-modal-redux';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { 
  fetchExpenses, 
  deleteExpense, 
  deleteExpenseOptimistic,
  setCurrentPage,
  setPageSize,
  setExpenseType,
  type ExpenseItem,
} from '@/lib/redux/expense/expenseSlice';
import { updateStatsOptimistic, refreshStats } from '@/lib/redux/expense/overviewSlice';
import { updateBudgetSpent } from '@/lib/redux/expense/budgetSlice';

interface AdvancedExpensesTableProps {
  expenseType?: 'free' | 'budget';
}

export function AdvancedExpensesTable({ expenseType = 'free' }: AdvancedExpensesTableProps) {
  const dispatch = useAppDispatch();
  const { 
    expenses, 
    loading, 
    filters, 
    currentPage, 
    totalPages, 
    totalCount, 
    pageSize 
  } = useAppSelector(state => state.expenses);
  
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Set expense type when component mounts or type changes
  useEffect(() => {
    dispatch(setExpenseType(expenseType));
  }, [dispatch, expenseType]);

  // Fetch expenses when component mounts or when filters/pagination changes
  useEffect(() => {
    const filtersWithSearch = { ...filters, search: activeSearchTerm };
    dispatch(fetchExpenses({ 
      expenseType, 
      filters: filtersWithSearch, 
      page: currentPage, 
      pageSize 
    }));
  }, [dispatch, expenseType, filters, activeSearchTerm, currentPage, pageSize]);

  // Watch for when search term becomes empty and trigger search
  useEffect(() => {
    if (searchTerm === '' && activeSearchTerm !== '') {
      setActiveSearchTerm('');
    }
  }, [searchTerm, activeSearchTerm]);

  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
    dispatch(setCurrentPage(1));
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setActiveSearchTerm('');
    dispatch(setCurrentPage(1));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    
    const expense = expenses.find(e => e._id === id);
    if (!expense) return;
    
    // Optimistic updates - immediate UI changes
    dispatch(deleteExpenseOptimistic(id));
    dispatch(updateStatsOptimistic({ 
      type: expenseType, 
      amount: expense.amount, 
      category: expense.category, 
      operation: 'subtract' 
    }));
    
    if (expenseType === 'budget' && expense.budgetId) {
      dispatch(updateBudgetSpent({ 
        budgetId: expense.budgetId, 
        amount: expense.amount, 
        operation: 'subtract' 
      }));
    }
    
    toast.success('Expense deleted successfully!');
    
    // API call in background
    try {
      await dispatch(deleteExpense(id)).unwrap();
      // Silent stats refresh
      dispatch(refreshStats(expenseType));
    } catch {
      toast.error('Failed to delete expense');
      // Revert optimistic updates by refetching
      dispatch(fetchExpenses({ 
        expenseType, 
        filters: { ...filters, search: activeSearchTerm }, 
        page: currentPage, 
        pageSize 
      }));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedRows.length} expenses?`)) {
      return;
    }
    
    // Optimistic update - remove all selected from UI immediately
    selectedRows.forEach(id => {
      dispatch(deleteExpenseOptimistic(id));
    });
    toast.success(`${selectedRows.length} expenses deleted successfully!`);
    setSelectedRows([]);
    
    // API call in background
    try {
      const response = await fetch('/api/expenses/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedRows }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete expenses');
      }
    } catch {
      toast.error('Failed to delete expenses');
      // Revert optimistic update by refetching
      dispatch(fetchExpenses({ 
        expenseType, 
        filters: { ...filters, search: activeSearchTerm }, 
        page: currentPage, 
        pageSize 
      }));
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4">
          <CardTitle className="text-lg sm:text-xl">Expenses ({totalCount})</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="pl-8 w-full"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSearch}
                className="px-3"
              >
                <Search className="h-4 w-4" />
              </Button>
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="px-3"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {selectedRows.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="w-full sm:w-auto">
                Delete ({selectedRows.length})
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8 sm:w-12">
                    <Checkbox
                      checked={selectedRows.length === expenses.length && expenses.length > 0}
                      onCheckedChange={toggleAllRows}
                    />
                  </TableHead>
                  <TableHead className="min-w-[80px]">Date</TableHead>
                  <TableHead className="min-w-[120px]">Description</TableHead>
                  <TableHead className="hidden sm:table-cell min-w-[100px]">Category</TableHead>
                  <TableHead className="text-right min-w-[80px]">Amount</TableHead>
                  <TableHead className="w-8 sm:w-12"></TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {loading ? (
                // Skeleton rows
                [1, 2, 3, 4, 5].map(i => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell className="hidden sm:table-cell"><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                  </TableRow>
                ))
              ) : expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No expenses found
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((expense) => (
                  <TableRow key={expense._id}>
                    <TableCell className="py-2">
                      <Checkbox
                        checked={selectedRows.includes(expense._id)}
                        onCheckedChange={() => toggleRowSelection(expense._id)}
                      />
                    </TableCell>
                    <TableCell className="py-2 text-xs sm:text-sm">
                      {new Date(expense.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="font-medium text-sm truncate max-w-[120px] sm:max-w-none">
                        {expense.reason}
                      </div>
                      <div className="sm:hidden">
                        <Badge variant="secondary" className="text-xs mt-1">{expense.category}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell py-2">
                      <Badge variant="secondary" className="text-xs">{expense.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium py-2 text-sm">
                      ₹{expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  {pageSize} per page
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[10, 20, 30, 40, 50, 100].map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() => {
                      dispatch(setPageSize(size));
                    }}
                  >
                    {size} per page
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(setCurrentPage(1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
            >
              <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(setCurrentPage(Math.max(currentPage - 1, 1)))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <span className="text-xs sm:text-sm px-2">
              {currentPage}/{totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(setCurrentPage(Math.min(currentPage + 1, totalPages)))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(setCurrentPage(totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
            >
              <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      
      <EditExpenseModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        expense={editingExpense}
      />
    </Card>
  );
}