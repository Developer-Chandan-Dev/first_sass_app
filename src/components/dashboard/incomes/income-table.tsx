'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { setCurrentPage, setPageSize, deleteIncomeOptimistic, deleteIncome, fetchIncomes } from '@/lib/redux/income/incomeSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, ChevronLeft, ChevronRight, MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown, Download, Copy, Search, X } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { EditIncomeModal } from './edit-income-modal';
import { toast } from 'sonner';

type SortField = 'source' | 'category' | 'amount' | 'date';
type SortOrder = 'asc' | 'desc';

export function IncomeTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { incomes, loading, currentPage, totalPages, totalCount, pageSize, filters } = useSelector(
    (state: RootState) => state.incomes
  );
  
  const [editingIncome, setEditingIncome] = useState<string | null>(null);
  const [selectedIncomes, setSelectedIncomes] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');

  // Fetch incomes when filters or pagination changes
  useEffect(() => {
    const filtersWithSearch = { ...filters, search: activeSearchTerm };
    dispatch(fetchIncomes({ 
      filters: filtersWithSearch, 
      page: currentPage, 
      pageSize 
    }));
  }, [dispatch, filters, activeSearchTerm, currentPage, pageSize]);

  // Watch for when search term becomes empty and trigger search
  useEffect(() => {
    if (searchTerm === '' && activeSearchTerm !== '') {
      setActiveSearchTerm('');
    }
  }, [searchTerm, activeSearchTerm]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this income?')) {
      dispatch(deleteIncomeOptimistic(id));
      dispatch(deleteIncome(id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIncomes.size === 0) return;
    if (confirm(`Delete ${selectedIncomes.size} selected incomes?`)) {
      selectedIncomes.forEach(id => {
        dispatch(deleteIncomeOptimistic(id));
        dispatch(deleteIncome(id));
      });
      setSelectedIncomes(new Set());
      toast.success(`${selectedIncomes.size} incomes deleted`);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIncomes(new Set(incomes.map(income => income._id)));
    } else {
      setSelectedIncomes(new Set());
    }
  };

  const handleSelectIncome = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIncomes);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIncomes(newSelected);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleExportCSV = () => {
    const csvData = sortedIncomes.map(income => ({
      Source: income.source,
      Category: income.category,
      Amount: income.amount,
      Date: formatDate(income.date),
      Description: income.description || '',
      Recurring: income.isRecurring ? 'Yes' : 'No',
      Frequency: income.frequency || 'N/A'
    }));
    
    const csv = [Object.keys(csvData[0]).join(','), ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incomes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Incomes exported to CSV');
  };

  const handleExportPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('Income Report', 20, 20);
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      doc.text(`Total Incomes: ${sortedIncomes.length}`, 20, 40);
      doc.text(`Total Amount: ₹${sortedIncomes.reduce((sum, income) => sum + income.amount, 0).toLocaleString()}`, 20, 50);
      
      // Table headers
      let yPos = 70;
      doc.setFontSize(10);
      doc.text('Source', 20, yPos);
      doc.text('Category', 70, yPos);
      doc.text('Amount', 120, yPos);
      doc.text('Date', 160, yPos);
      
      // Table data
      sortedIncomes.forEach((income) => {
        yPos += 10;
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.text(income.source.substring(0, 20), 20, yPos);
        doc.text(income.category, 70, yPos);
        doc.text(`₹${income.amount.toLocaleString()}`, 120, yPos);
        doc.text(formatDate(income.date), 160, yPos);
      });
      
      doc.save(`incomes-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Incomes exported to PDF');
    } catch {
      toast.error('Failed to export PDF');
    }
  };

  const handleCopySelected = () => {
    const selectedData = incomes.filter(income => selectedIncomes.has(income._id));
    const text = selectedData.map(income => `${income.source}: ₹${income.amount}`).join('\n');
    navigator.clipboard.writeText(text);
    toast.success(`${selectedData.length} incomes copied to clipboard`);
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Salary': 'bg-green-100 text-green-800',
      'Freelance': 'bg-blue-100 text-blue-800',
      'Business': 'bg-purple-100 text-purple-800',
      'Investment': 'bg-yellow-100 text-yellow-800',
      'Rental': 'bg-orange-100 text-orange-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  const sortedIncomes = useMemo(() => {
    return [...incomes].sort((a, b) => {
      let aVal: string | number | Date = a[sortField];
      let bVal: string | number | Date = b[sortField];
      
      if (sortField === 'amount') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else if (sortField === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [incomes, sortField, sortOrder]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3" />;
    return sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4">
          <CardTitle className="text-lg sm:text-xl">Incomes ({totalCount})</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search incomes..."
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
            {selectedIncomes.size > 0 && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCopySelected} className="text-xs">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy ({selectedIncomes.size})
                </Button>
                <Button size="sm" variant="destructive" onClick={handleBulkDelete} className="text-xs">
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete ({selectedIncomes.size})
                </Button>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleExportCSV} className="text-xs">
                    Export CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPDF} className="text-xs">
                    Export PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Select value={pageSize.toString()} onValueChange={(value) => dispatch(setPageSize(Number(value)))}>
              <SelectTrigger className="h-8 w-24 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-8 px-2">
                  <Checkbox
                    checked={selectedIncomes.size === incomes.length && incomes.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="h-3 w-3"
                  />
                </TableHead>
                <TableHead className="min-w-[120px] px-2">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('source')} className="h-6 px-1 text-xs font-medium">
                    Source {getSortIcon('source')}
                  </Button>
                </TableHead>
                <TableHead className="hidden xs:table-cell min-w-[80px] px-2">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('category')} className="h-6 px-1 text-xs font-medium">
                    Category {getSortIcon('category')}
                  </Button>
                </TableHead>
                <TableHead className="text-right min-w-[80px] px-2">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('amount')} className="h-6 px-1 text-xs font-medium">
                    Amount {getSortIcon('amount')}
                  </Button>
                </TableHead>
                <TableHead className="hidden sm:table-cell min-w-[80px] px-2">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('date')} className="h-6 px-1 text-xs font-medium">
                    Date {getSortIcon('date')}
                  </Button>
                </TableHead>
                <TableHead className="w-8 px-1"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Skeleton rows
                [1, 2, 3, 4, 5].map(i => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell className="hidden xs:table-cell"><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell className="hidden sm:table-cell"><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                  </TableRow>
                ))
              ) : sortedIncomes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                    No incomes found
                  </TableCell>
                </TableRow>
              ) : (
                sortedIncomes.map((income) => (
                  <TableRow key={income._id} className={selectedIncomes.has(income._id) ? 'bg-muted/30' : ''}>
                    <TableCell className="px-2">
                      <Checkbox
                        checked={selectedIncomes.has(income._id)}
                        onCheckedChange={(checked) => handleSelectIncome(income._id, checked as boolean)}
                        className="h-3 w-3"
                      />
                    </TableCell>
                    <TableCell className="px-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs sm:text-sm font-medium">{income.source}</p>
                        {income.description && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {income.description}
                          </p>
                        )}
                        <div className="xs:hidden mt-1 flex flex-wrap gap-1">
                          <Badge className={`text-xs h-4 px-1 ${getCategoryColor(income.category)}`}>
                            {income.category}
                          </Badge>
                          {income.isRecurring && (
                            <Badge variant="outline" className="text-xs h-4 px-1">
                              {income.frequency}
                            </Badge>
                          )}
                        </div>
                        <div className="sm:hidden mt-1 text-xs text-muted-foreground">
                          {formatDate(income.date)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden xs:table-cell px-2">
                      <div className="flex flex-wrap gap-1">
                        <Badge className={`text-xs h-4 px-1 ${getCategoryColor(income.category)}`}>
                          {income.category}
                        </Badge>
                        {income.isRecurring && (
                          <Badge variant="outline" className="text-xs h-4 px-1">
                            {income.frequency}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600 px-2">
                      <span className="text-xs sm:text-sm">+₹{income.amount.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground px-2">
                      <span className="text-xs">{formatDate(income.date)}</span>
                    </TableCell>
                    <TableCell className="px-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem onClick={() => setEditingIncome(income._id)} className="text-xs">
                            <Edit className="h-3 w-3 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(income._id)} 
                            className="text-xs text-red-600"
                          >
                            <Trash2 className="h-3 w-3 mr-2" />
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
      {totalPages > 1 && (
        <div className="flex flex-col xs:flex-row items-center justify-between gap-2 px-2">
          <div className="text-xs text-muted-foreground order-2 xs:order-1">
            {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount}
          </div>
          <div className="flex items-center gap-1 order-1 xs:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(setCurrentPage(currentPage - 1))}
              disabled={currentPage === 1}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <span className="text-xs px-2 py-1 bg-muted rounded min-w-[60px] text-center">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(setCurrentPage(currentPage + 1))}
              disabled={currentPage === totalPages}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {editingIncome && (
        <EditIncomeModal
          incomeId={editingIncome}
          onClose={() => setEditingIncome(null)}
        />
      )}
      </CardContent>
    </Card>
  );
}