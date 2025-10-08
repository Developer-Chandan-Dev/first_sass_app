'use client';

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
  ChevronsRight,
  Download,
  FileText,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { EditExpenseModal } from './edit-expense-modal-redux';
import { ExpensePDFExportModal } from './expense-pdf-export-modal';
import { useAppTranslations } from '@/hooks/useTranslation';
import { useExpenseTable } from '@/hooks/dashboard/useExpenseTable';
import { getExpenseAmountColor, getExpenseTooltip } from '@/lib/financial-styles';
import { sanitizeString } from '@/lib/input-sanitizer';

// Table skeleton component
function ExpenseTableSkeleton({ expenseType }: { expenseType: 'free' | 'budget' }) {
  const columnCount = expenseType === 'budget' ? 8 : 7;
  
  return (
    <>
      {[1, 2, 3, 4, 5].map(i => (
        <TableRow key={i}>
          {Array.from({ length: columnCount }).map((_, j) => (
            <TableCell key={j} className={j === 0 ? '' : j >= 3 && j <= 4 && expenseType === 'free' ? 'hidden sm:table-cell' : j === 4 && expenseType === 'budget' ? 'hidden lg:table-cell' : j === 5 ? 'hidden md:table-cell' : ''}>
              <div className="h-4 bg-muted rounded animate-pulse" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

interface AdvancedExpensesTableProps {
  expenseType?: 'free' | 'budget';
}

export function AdvancedExpensesTable({ expenseType = 'free' }: AdvancedExpensesTableProps) {
  const { expenses: expensesData, common, table } = useAppTranslations();
  const {
    expenses,
    loading,
    filters,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    selectedRows,
    searchTerm,
    editingExpense,
    isEditModalOpen,
    isPDFExportOpen,
    isSelectedExport,
    setSearchTerm,
    setIsEditModalOpen,
    setIsPDFExportOpen,
    setIsSelectedExport,
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
    setCurrentPage,
    setPageSize,
  } = useExpenseTable(expenseType);

  const getSortIcon = (column: string) => {
    if (filters.sortBy !== column) return <ArrowUpDown className="h-3 w-3" />;
    return filters.sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4">
          <CardTitle className="text-lg sm:text-xl">{sanitizeString(expensesData?.title || 'Expenses')} ({totalCount})</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={sanitizeString(expensesData?.searchExpenses || 'Search expenses')}
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
              {selectedRows.length > 0 && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-auto">
                        <Download className="h-4 w-4 mr-2" />
                        {sanitizeString(expensesData?.exportAll || 'Export')} ({selectedRows.length})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleCSVExport(true)}>
                        <FileText className="mr-2 h-4 w-4" />
                        {sanitizeString(expensesData?.exportSelectedCSV || 'Export Selected CSV')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setIsSelectedExport(true);
                        setIsPDFExportOpen(true);
                      }}>
                        <FileText className="mr-2 h-4 w-4" />
                        {sanitizeString(expensesData?.exportSelectedPDF || 'Export Selected PDF')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="w-auto">
                    Delete ({selectedRows.length})
                  </Button>
                </>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    {sanitizeString(expensesData?.exportAll || 'Export All')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleCSVExport(false)}>
                    <FileText className="mr-2 h-4 w-4" />
                    {sanitizeString(expensesData?.exportAllCSV || 'Export All CSV')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setIsSelectedExport(false);
                    setIsPDFExportOpen(true);
                  }}>
                    <FileText className="mr-2 h-4 w-4" />
                    {sanitizeString(expensesData?.exportAllPDF || 'Export All PDF')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                  <TableHead className="min-w-[80px]">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('date')} className="h-auto p-0 font-medium">
                      {sanitizeString(common?.date || 'Date')} {getSortIcon('date')}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('reason')} className="h-auto p-0 font-medium">
                      {sanitizeString(common?.description || 'Description')} {getSortIcon('reason')}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell min-w-[100px]">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('category')} className="h-auto p-0 font-medium">
                      {sanitizeString(common?.category || 'Category')} {getSortIcon('category')}
                    </Button>
                  </TableHead>
                  {expenseType === 'budget' && (
                    <TableHead className="hidden lg:table-cell min-w-[100px]">
                      <Button variant="ghost" size="sm" onClick={() => handleSort('budgetName')} className="h-auto p-0 font-medium">
                        {sanitizeString(expensesData?.budget || 'Budget')} {getSortIcon('budgetName')}
                      </Button>
                    </TableHead>
                  )}
                  <TableHead className="hidden md:table-cell min-w-[80px]">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('isRecurring')} className="h-auto p-0 font-medium">
                      {sanitizeString(expensesData?.recurring || 'Recurring')} {getSortIcon('isRecurring')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right min-w-[80px]">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('amount')} className="h-auto p-0 font-medium">
                      {sanitizeString(common?.amount || 'Amount')} {getSortIcon('amount')}
                    </Button>
                  </TableHead>
                  <TableHead className="w-8 sm:w-12"></TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {loading ? (
                <ExpenseTableSkeleton expenseType={expenseType} />
              ) : expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={expenseType === 'budget' ? 8 : 7} className="text-center py-8 text-muted-foreground">
                    {sanitizeString(expensesData?.noExpensesFound || 'No expenses found')}
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
                        {sanitizeString(expense.reason || '')}
                      </div>
                      <div className="sm:hidden">
                        <Badge variant="secondary" className="text-xs mt-1">{sanitizeString(expense.category || '')}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell py-2">
                      <Badge variant="secondary" className="text-xs">{sanitizeString(expense.category || '')}</Badge>
                    </TableCell>
                    {expenseType === 'budget' && (
                      <TableCell className="hidden lg:table-cell py-2">
                        <Badge variant="outline" className="text-xs">
                          {sanitizeString(expense.budgetName || 'Unknown')}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell className="hidden md:table-cell py-2">
                      {expense.isRecurring ? (
                        <Badge variant="outline" className="text-xs">
                          {sanitizeString(expense.frequency || 'Recurring')}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">{sanitizeString(expensesData?.oneTime || 'One-time')}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium py-2 text-sm">
                      <div className="flex items-center justify-end gap-1">
                        <span className={getExpenseAmountColor(expense.affectsBalance || false)}>
                          -₹{expense.amount.toLocaleString()}
                        </span>
                        {expense.affectsBalance && (
                          <div className="w-2 h-2 bg-red-500 rounded-full" title={sanitizeString(getExpenseTooltip(expense.affectsBalance) || '')} />
                        )}
                      </div>
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
                            {sanitizeString(common?.edit || 'Edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(expense._id, expensesData)}
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

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="text-xs sm:text-sm text-muted-foreground">
              {sanitizeString(expensesData?.showing || 'Showing')} {((currentPage - 1) * pageSize) + 1} {sanitizeString(expensesData?.to || 'to')} {Math.min(currentPage * pageSize, totalCount)} {sanitizeString(table?.of || 'of')} {totalCount} {sanitizeString(expensesData?.entries || 'entries')}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  {pageSize} {sanitizeString(expensesData?.perPage || 'per page')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[10, 20, 30, 40, 50, 100].map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() => setPageSize(size)}
                  >
                    {size} {sanitizeString(expensesData?.perPage || 'per page')}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
            >
              <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
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
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
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
        expenses={isSelectedExport ? expenses.filter(expense => selectedRows.includes(expense._id)) : expenses}
        isSelectedExport={isSelectedExport}
        selectedCount={selectedRows.length}
      />
    </Card>
  );
}