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
  TableRow,
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
  ArrowDown,
  Eye,
} from 'lucide-react';
import { EditIncomeModal } from './edit-income-modal';
import { PDFExportModal } from './pdf-export-modal';
import { IncomeExpensesModal } from './income-expenses-modal';
import {
  useIncomeTable,
  type PDFExportOptions,
} from '@/hooks/dashboard/useIncomeTable';
import { getIncomeAmountColor, getIncomeTooltip } from '@/lib/financial-styles';
import { sanitizeString } from '@/lib/input-sanitizer';
import { useBaseTranslations, useDashboardTranslations } from '@/hooks/i18n';

export function AdvancedIncomeTable() {
  const { income, table, expenses } = useDashboardTranslations();
  const { common } = useBaseTranslations();
  const {
    incomes,
    loading,
    filters,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    selectedRows,
    searchTerm,
    editingIncome,
    isPDFExportOpen,
    isSelectedExport,
    viewingExpenses,
    setSearchTerm,
    setEditingIncome,
    setIsPDFExportOpen,
    setIsSelectedExport,
    setViewingExpenses,
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
    handlePDFExport,
    setCurrentPage,
    setPageSize,
  } = useIncomeTable();

  const getSortIcon = (column: string) => {
    if (filters.sortBy !== column) return <ArrowUpDown className="h-3 w-3" />;
    return filters.sortOrder === 'asc' ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4">
          <CardTitle className="text-lg sm:text-xl">
            {income.title} ({totalCount})
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={income.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
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
                        {common.export} ({selectedRows.length})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleCSVExport(true)}>
                        <FileText className="mr-2 h-4 w-4" />
                        {expenses.exportSelectedCSV || 'Export Selected CSV'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setIsSelectedExport(true);
                          setIsPDFExportOpen(true);
                        }}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {expenses.exportSelectedPDF || 'Export Selected PDF'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="w-auto"
                  >
                    {common.delete} ({selectedRows.length})
                  </Button>
                </>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    {expenses.exportAll || 'Export All'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleCSVExport(false)}>
                    <FileText className="mr-2 h-4 w-4" />
                    {expenses.exportAllCSV || 'Export All CSV'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setIsSelectedExport(false);
                      setIsPDFExportOpen(true);
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {expenses.exportAllPDF || 'Export All PDF'}
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
                      checked={
                        selectedRows.length === incomes.length &&
                        incomes.length > 0
                      }
                      onCheckedChange={toggleAllRows}
                    />
                  </TableHead>
                  <TableHead className="min-w-[80px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('date')}
                      className="h-auto p-0 font-medium"
                    >
                      {common.date} {getSortIcon('date')}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('source')}
                      className="h-auto p-0 font-medium"
                    >
                      {income.source} {getSortIcon('source')}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell min-w-[100px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('category')}
                      className="h-auto p-0 font-medium"
                    >
                      {common.category} {getSortIcon('category')}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell min-w-[120px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('description')}
                      className="h-auto p-0 font-medium"
                    >
                      {common.description} {getSortIcon('description')}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell min-w-[80px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('isRecurring')}
                      className="h-auto p-0 font-medium"
                    >
                      {income.recurringIncome} {getSortIcon('isRecurring')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right min-w-[80px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('amount')}
                      className="h-auto p-0 font-medium"
                    >
                      {common.amount} {getSortIcon('amount')}
                    </Button>
                  </TableHead>
                  <TableHead className="w-8 sm:w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : incomes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {income.noIncome}
                    </TableCell>
                  </TableRow>
                ) : (
                  incomes.map((incomeItem) => (
                    <TableRow key={incomeItem._id}>
                      <TableCell className="py-2">
                        <Checkbox
                          checked={selectedRows.includes(incomeItem._id)}
                          onCheckedChange={() => toggleRowSelection(incomeItem._id)}
                        />
                      </TableCell>
                      <TableCell className="py-2 text-xs sm:text-sm">
                        {new Date(incomeItem.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="font-medium text-sm truncate max-w-[120px] sm:max-w-none">
                          {sanitizeString(incomeItem.source || '')}
                        </div>
                        <div className="sm:hidden">
                          <Badge variant="secondary" className="text-xs mt-1">
                            {sanitizeString(incomeItem.category || '')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell py-2">
                        <Badge variant="secondary" className="text-xs">
                          {sanitizeString(incomeItem.category || '')}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell py-2">
                        <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {sanitizeString(incomeItem.description || '-')}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell py-2">
                        {incomeItem.isRecurring ? (
                          <Badge variant="outline" className="text-xs">
                            {sanitizeString(incomeItem.frequency || 'Recurring')}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {expenses.oneTime || 'One-time'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium py-2 text-sm">
                        <div className="flex items-center justify-end gap-1">
                          <span
                            className={getIncomeAmountColor(
                              incomeItem.isConnected || false
                            )}
                          >
                            +₹{incomeItem.amount.toLocaleString()}
                          </span>
                          {incomeItem.isConnected && (
                            <div
                              className="w-2 h-2 bg-blue-500 rounded-full"
                              title={sanitizeString(
                                getIncomeTooltip(incomeItem.isConnected) || ''
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
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {incomeItem.isConnected && (
                              <DropdownMenuItem
                                onClick={() => setViewingExpenses(incomeItem)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                {income.viewExpenses || 'View Expenses'}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleEdit(incomeItem)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              {common.edit}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(incomeItem._id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {common.delete}
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
              {table.showing} {(currentPage - 1) * pageSize + 1}{' '}
              {table.to || 'to'} {Math.min(currentPage * pageSize, totalCount)}{' '}
              {table.of} {totalCount} {table.entries}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  {pageSize} {table.perPage || 'per page'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[10, 20, 30, 40, 50, 100].map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() => setPageSize(size)}
                  >
                    {size} {table.perPage || 'per page'}
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
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
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

      {editingIncome && (
        <EditIncomeModal
          incomeId={editingIncome._id}
          onClose={() => setEditingIncome(null)}
        />
      )}

      <PDFExportModal
        isOpen={isPDFExportOpen}
        onClose={() => {
          setIsPDFExportOpen(false);
          setIsSelectedExport(false);
        }}
        incomes={
          isSelectedExport
            ? incomes.filter((income) => selectedRows.includes(income._id))
            : incomes
        }
        onExport={(options: PDFExportOptions) =>
          handlePDFExport({ ...options, selectedOnly: isSelectedExport })
        }
        isSelectedExport={isSelectedExport}
        selectedCount={selectedRows.length}
      />

      {viewingExpenses && (
        <IncomeExpensesModal
          open={!!viewingExpenses}
          onOpenChange={() => setViewingExpenses(null)}
          incomeId={viewingExpenses._id}
          incomeSource={viewingExpenses.source}
          incomeAmount={viewingExpenses.amount}
        />
      )}
    </Card>
  );
}
