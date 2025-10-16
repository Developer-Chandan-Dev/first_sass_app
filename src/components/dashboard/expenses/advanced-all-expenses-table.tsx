'use client';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import {
  fetchExpenses,
  setFilters,
  setCurrentPage,
  setPageSize,
  deleteExpense,
  ExpenseItem,
} from '@/lib/redux/expense/expenseSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MoreVertical,
  Edit,
  Trash2,
  Search,
  Download,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useDashboardTranslations } from '@/hooks/i18n';
import { sanitizeString } from '@/lib/input-sanitizer';
import {
  getExpenseAmountColor,
  getExpenseTooltip,
} from '@/lib/financial-styles';
import { EditExpenseModal } from './edit-expense-modal-redux';
import { ExpensePDFExportModal } from './expense-pdf-export-modal';
import { CategoryFilter } from '../shared/category-filter';

interface AdvancedAllExpensesTableProps {
  className?: string;
}

export function AdvancedAllExpensesTable({
  className,
}: AdvancedAllExpensesTableProps) {
  const dispatch = useAppDispatch();
  const {
    expenses,
    loading,
    filters,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
  } = useAppSelector((state) => state.expenses);
  const { expenses: expensesData, common } = useDashboardTranslations();
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPDFExportOpen, setIsPDFExportOpen] = useState(false);
  const [isSelectedExport, setIsSelectedExport] = useState(false);

  useEffect(() => {
    // Fetch both free and budget expenses
    dispatch(
      fetchExpenses({
        expenseType: 'all',
        filters,
        page: currentPage,
        pageSize,
      })
    );
  }, [dispatch, filters, currentPage, pageSize]);

  const handleSearch = () => {
    dispatch(setFilters({ search: searchTerm }));
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    dispatch(setFilters({ search: '' }));
  };

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleSort = (column: string) => {
    const newOrder =
      filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setFilters({ sortBy: column, sortOrder: newOrder }));
  };

  const handleCSVExport = (selectedOnly: boolean = false) => {
    const dataToExport = selectedOnly
      ? expenses.filter((e) => selectedExpenses.includes(e._id))
      : expenses;
    const csvContent = [
      ['Date', 'Description', 'Category', 'Type', 'Amount'].join(','),
      ...dataToExport.map((expense) =>
        [
          new Date(expense.date).toLocaleDateString(),
          `"${expense.reason}"`,
          expense.category,
          expense.budgetId ? 'Budget' : 'Free',
          expense.amount,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${selectedOnly ? 'selected' : 'all'}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await dispatch(deleteExpense(id));
    }
  };

  const handleEdit = (expense: ExpenseItem) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleBulkDelete = async () => {
    if (selectedExpenses.length === 0) return;
    if (confirm(`Delete ${selectedExpenses.length} selected expenses?`)) {
      for (const id of selectedExpenses) {
        await dispatch(deleteExpense(id));
      }
      setSelectedExpenses([]);
    }
  };

  const toggleExpenseSelection = (id: string) => {
    setSelectedExpenses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedExpenses((prev) =>
      prev.length === expenses.length ? [] : expenses.map((e) => e._id)
    );
  };

  const getSortIcon = (column: string) => {
    if (filters.sortBy !== column) return <ArrowUpDown className="h-3 w-3" />;
    return filters.sortOrder === 'asc' ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  };

  const getExpenseType = (expense: ExpenseItem) => {
    return expense.budgetId ? 'Budget' : 'Free';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4">
          <CardTitle className="text-lg sm:text-xl">
            {sanitizeString(expensesData?.title || 'All Expenses')} (
            {totalCount})
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={sanitizeString(
                    expensesData?.searchExpenses || 'Search expenses'
                  )}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyPress}
                  className="pl-8 w-full text-sm"
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
            <div className="flex gap-2 flex-wrap">
              {selectedExpenses.length > 0 && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-auto">
                        <Download className="h-4 w-4 mr-2" />
                        Export ({selectedExpenses.length})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleCSVExport(true)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Export Selected CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setIsSelectedExport(true);
                          setIsPDFExportOpen(true);
                        }}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Export Selected PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="w-auto"
                  >
                    Delete ({selectedExpenses.length})
                  </Button>
                </>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleCSVExport(false)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export All CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setIsSelectedExport(false);
                      setIsPDFExportOpen(true);
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Export All PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex gap-2">
            <CategoryFilter
              value={filters.category || ''}
              onValueChange={(value) => handleFilterChange('category', value)}
              className="w-40"
            />

            <Select
              value={filters.period || 'all'}
              onValueChange={(value) => handleFilterChange('period', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
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
                      checked={
                        selectedExpenses.length === expenses.length &&
                        expenses.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="min-w-[80px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('date')}
                      className="h-auto p-0 font-medium"
                    >
                      {sanitizeString(common?.date || 'Date')}{' '}
                      {getSortIcon('date')}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('reason')}
                      className="h-auto p-0 font-medium"
                    >
                      {sanitizeString(common?.description || 'Description')}{' '}
                      {getSortIcon('reason')}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell min-w-[100px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('category')}
                      className="h-auto p-0 font-medium"
                    >
                      {sanitizeString(common?.category || 'Category')}{' '}
                      {getSortIcon('category')}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell min-w-[80px]">
                    Type
                  </TableHead>
                  <TableHead className="hidden md:table-cell min-w-[80px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('isRecurring')}
                      className="h-auto p-0 font-medium"
                    >
                      {sanitizeString(expensesData?.recurring || 'Recurring')}{' '}
                      {getSortIcon('isRecurring')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right min-w-[80px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('amount')}
                      className="h-auto p-0 font-medium"
                    >
                      {sanitizeString(common?.amount || 'Amount')}{' '}
                      {getSortIcon('amount')}
                    </Button>
                  </TableHead>
                  <TableHead className="w-8 sm:w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j} className="py-2">
                          <div className="h-4 bg-muted rounded animate-pulse" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : expenses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {sanitizeString(
                        expensesData?.noExpensesFound || 'No expenses found'
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense._id}>
                      <TableCell className="py-2">
                        <Checkbox
                          checked={selectedExpenses.includes(expense._id)}
                          onCheckedChange={() =>
                            toggleExpenseSelection(expense._id)
                          }
                        />
                      </TableCell>
                      <TableCell className="py-2 text-xs sm:text-sm">
                        {new Date(expense.date)?.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="font-medium text-sm truncate max-w-[120px] sm:max-w-none">
                          {sanitizeString(expense.reason || '')}
                        </div>
                        <div className="sm:hidden">
                          <Badge variant="secondary" className="text-xs mt-1">
                            {sanitizeString(expense.category || '')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell py-2">
                        <Badge variant="secondary" className="text-xs">
                          {sanitizeString(expense.category || '')}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell py-2">
                        <Badge
                          variant={expense.budgetId ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          {getExpenseType(expense)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell py-2">
                        {expense.isRecurring ? (
                          <Badge variant="outline" className="text-xs">
                            {sanitizeString(expense.frequency || 'Recurring')}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {sanitizeString(
                              expensesData?.oneTime || 'One-time'
                            )}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium py-2 text-sm">
                        <div className="flex items-center justify-end gap-1">
                          <span
                            className={getExpenseAmountColor(
                              expense.affectsBalance || false
                            )}
                          >
                            -₹{expense.amount?.toLocaleString()}
                          </span>
                          {expense.affectsBalance && (
                            <div
                              className="w-2 h-2 bg-red-500 rounded-full"
                              title={sanitizeString(
                                getExpenseTooltip(expense.affectsBalance) || ''
                              )}
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(expense)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              {sanitizeString(common?.edit || 'Edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(expense._id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {sanitizeString(common?.delete || 'Delete')}
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

        {/* Advanced Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="text-xs sm:text-sm text-muted-foreground">
              {sanitizeString(expensesData?.showing || 'Showing')}{' '}
              {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{' '}
              {sanitizeString(expensesData?.entries || 'entries')}
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
                    onClick={() => dispatch(setPageSize(size))}
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
              onClick={() =>
                dispatch(setCurrentPage(Math.max(currentPage - 1, 1)))
              }
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
              onClick={() =>
                dispatch(setCurrentPage(Math.min(currentPage + 1, totalPages)))
              }
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

      <ExpensePDFExportModal
        isOpen={isPDFExportOpen}
        onClose={() => {
          setIsPDFExportOpen(false);
          setIsSelectedExport(false);
        }}
        expenses={
          isSelectedExport
            ? expenses.filter((expense: ExpenseItem) =>
                selectedExpenses.includes(expense._id)
              )
            : expenses
        }
        isSelectedExport={isSelectedExport}
        selectedCount={selectedExpenses.length}
      />
    </Card>
  );
}
