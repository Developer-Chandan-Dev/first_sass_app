import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  fetchExpenses,
  deleteExpense,
  deleteExpenseOptimistic,
  setCurrentPage,
  setPageSize,
  setExpenseType,
  setFilters,
  type ExpenseItem,
} from '@/lib/redux/expense/expenseSlice';
import {
  updateStatsOptimistic,
  refreshStats,
} from '@/lib/redux/expense/overviewSlice';
import { updateBudgetSpent } from '@/lib/redux/expense/budgetSlice';
import { sanitizeString, sanitizeForLog } from '@/lib/input-sanitizer';

export function useExpenseTable(expenseType: 'free' | 'budget' = 'free') {
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

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPDFExportOpen, setIsPDFExportOpen] = useState(false);
  const [isSelectedExport, setIsSelectedExport] = useState(false);

  // Set expense type when component mounts or type changes
  useEffect(() => {
    dispatch(setExpenseType(expenseType));
  }, [dispatch, expenseType]);

  // Fetch expenses when component mounts or when filters/pagination changes
  useEffect(() => {
    const filtersWithSearch = { ...filters, search: activeSearchTerm };
    dispatch(
      fetchExpenses({
        expenseType,
        filters: filtersWithSearch,
        page: currentPage,
        pageSize,
      })
    );
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

  const handleDelete = async (
    id: string,
    expensesData?: { deleteSuccess?: string }
  ) => {
    const confirmMessage = 'Are you sure you want to delete this expense?';
    if (!confirm(confirmMessage)) {
      return;
    }

    const expense = expenses.find((e) => e._id === id);
    if (!expense) {
      toast.error('Expense not found');
      return;
    }

    try {
      await dispatch(deleteExpense(id)).unwrap();

      dispatch(deleteExpenseOptimistic(id));
      dispatch(
        updateStatsOptimistic({
          type: expenseType,
          amount: expense.amount,
          category: expense.category,
          operation: 'subtract',
        })
      );

      if (expenseType === 'budget' && expense.budgetId) {
        dispatch(
          updateBudgetSpent({
            budgetId: expense.budgetId,
            amount: expense.amount,
            operation: 'subtract',
          })
        );
      }

      toast.success(
        expensesData?.deleteSuccess || 'Expense deleted successfully'
      );
      dispatch(refreshStats(expenseType));
    } catch (error) {
      console.error(
        'Delete expense error:',
        sanitizeForLog(error instanceof Error ? error.message : 'Unknown error')
      );
      toast.error('Failed to delete expense. Please try again.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      toast.error('No expenses selected');
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedRows.length} expenses?`;
    if (
      !confirm(
        confirmMessage.replace('{count}', selectedRows.length.toString())
      )
    ) {
      return;
    }

    try {
      const response = await fetch('/api/expenses/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedRows }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete expenses');
      }

      selectedRows.forEach((id) => {
        dispatch(deleteExpenseOptimistic(id));
      });

      toast.success(`${selectedRows.length} expenses deleted successfully!`);
      setSelectedRows([]);
      dispatch(refreshStats(expenseType));
    } catch (error) {
      console.error(
        'Bulk delete error:',
        sanitizeForLog(error instanceof Error ? error.message : 'Unknown error')
      );
      const errorMessage =
        error instanceof Error && error.message.length < 100
          ? error.message
          : 'Failed to delete expenses. Please try again.';
      toast.error(errorMessage);
    }
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows(
      selectedRows.length === expenses.length
        ? []
        : expenses.map((expense) => expense._id)
    );
  };

  const handleEdit = (expense: ExpenseItem) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleSort = (column: string) => {
    const newSortOrder =
      filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setFilters({ sortBy: column, sortOrder: newSortOrder }));
  };

  const handleCSVExport = (selectedOnly = false) => {
    const dataToExport = selectedOnly
      ? expenses.filter((expense) => selectedRows.includes(expense._id))
      : expenses;

    if (!dataToExport || dataToExport.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      const headers = [
        'Date',
        'Description',
        'Category',
        ...(expenseType === 'budget' ? ['Budget Name'] : []),
        'Amount',
        'Recurring',
        'Frequency',
        'Created Date',
      ];
      const csvData = dataToExport.map((expense) => [
        new Date(expense.date).toLocaleDateString(),
        (expense.reason || '').replace(/["\r\n]/g, ' '),
        (expense.category || '').replace(/["\r\n]/g, ' '),
        ...(expenseType === 'budget'
          ? [(expense.budgetName || '').replace(/["\r\n]/g, ' ')]
          : []),
        expense.amount,
        expense.isRecurring ? 'Yes' : 'No',
        (expense.frequency || '').replace(/["\r\n]/g, ' '),
        new Date(expense.createdAt).toLocaleDateString(),
      ]);

      const csvContent = [headers, ...csvData]
        .map((row) =>
          row
            .map((field) => {
              const sanitized = sanitizeString(String(field || ''));
              return `"${sanitized}"`;
            })
            .join(',')
        )
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `expenses-${selectedOnly ? 'selected-' : ''}${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${dataToExport.length} expenses exported to CSV!`);
    } catch (error) {
      console.error(
        'CSV export error:',
        sanitizeForLog(error instanceof Error ? error.message : 'Unknown error')
      );
      const errorMessage =
        error instanceof Error && error.message.includes('memory')
          ? 'File too large to export. Try exporting fewer records.'
          : 'Failed to export CSV. Please try again.';
      toast.error(errorMessage);
    }
  };

  return {
    // State
    expenses,
    loading,
    filters,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    selectedRows,
    searchTerm,
    activeSearchTerm,
    editingExpense,
    isEditModalOpen,
    isPDFExportOpen,
    isSelectedExport,

    // Setters
    setSearchTerm,
    setEditingExpense,
    setIsEditModalOpen,
    setIsPDFExportOpen,
    setIsSelectedExport,
    setSelectedRows,

    // Handlers
    handleSearch,
    handleSearchKeyPress,
    handleClearSearch,
    handleDelete,
    handleBulkDelete,
    toggleRowSelection,
    toggleAllRows,
    handleEdit,
    handleSort,
    handleCSVExport,

    // Redux actions
    dispatch,
    setCurrentPage: (page: number) => dispatch(setCurrentPage(page)),
    setPageSize: (size: number) => dispatch(setPageSize(size)),
  };
}
