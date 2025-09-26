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
  ChevronsRight,
  Download,
  FileText,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { EditIncomeModal } from './edit-income-modal';
import { PDFExportModal } from './pdf-export-modal';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { 
  fetchIncomes, 
  deleteIncome, 
  deleteIncomeOptimistic,
  setCurrentPage,
  setPageSize,
  setFilters,
} from '@/lib/redux/income/incomeSlice';
import { getIncomeAmountColor, getIncomeTooltip } from '@/lib/financial-styles';

interface IncomeItem {
  _id: string;
  source: string;
  category: string;
  amount: number;
  date: string;
  description?: string;
  isRecurring: boolean;
  frequency?: string;
  createdAt: string;
  isConnected?: boolean;
}

export function AdvancedIncomeTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    incomes, 
    loading, 
    filters, 
    currentPage, 
    totalPages, 
    totalCount, 
    pageSize 
  } = useSelector((state: RootState) => state.incomes);
  
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [editingIncome, setEditingIncome] = useState<IncomeItem | null>(null);
  const [isPDFExportOpen, setIsPDFExportOpen] = useState(false);
  const [isSelectedExport, setIsSelectedExport] = useState(false);

  // Fetch incomes when component mounts or when filters/pagination changes
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
    if (!confirm('Are you sure you want to delete this income?')) {
      return;
    }
    
    // Optimistic update
    dispatch(deleteIncomeOptimistic(id));
    toast.success('Income deleted successfully!');
    
    // API call in background
    try {
      await dispatch(deleteIncome(id)).unwrap();
    } catch {
      toast.error('Failed to delete income');
      // Revert by refetching
      dispatch(fetchIncomes({ 
        filters: { ...filters, search: activeSearchTerm }, 
        page: currentPage, 
        pageSize 
      }));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedRows.length} incomes?`)) {
      return;
    }
    
    // Optimistic updates
    selectedRows.forEach(id => {
      dispatch(deleteIncomeOptimistic(id));
    });
    toast.success(`${selectedRows.length} incomes deleted successfully!`);
    setSelectedRows([]);
    
    // API call in background
    try {
      const response = await fetch('/api/incomes/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedRows }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete incomes');
      }
    } catch {
      toast.error('Failed to delete incomes');
      // Revert by refetching
      dispatch(fetchIncomes({ 
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
      selectedRows.length === incomes.length 
        ? [] 
        : incomes.map(income => income._id)
    );
  };

  const handleEdit = (income: IncomeItem) => {
    setEditingIncome(income);
  };

  const handleSort = (column: string) => {
    const newSortOrder = filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setFilters({ sortBy: column, sortOrder: newSortOrder }));
  };

  const getSortIcon = (column: string) => {
    if (filters.sortBy !== column) return <ArrowUpDown className="h-3 w-3" />;
    return filters.sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const handleCSVExport = (selectedOnly = false) => {
    const dataToExport = selectedOnly 
      ? incomes.filter(income => selectedRows.includes(income._id))
      : incomes;
    
    if (dataToExport.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    const headers = ['Date', 'Source', 'Category', 'Amount', 'Description', 'Recurring', 'Frequency', 'Created Date'];
    const csvData = dataToExport.map(income => [
      new Date(income.date).toLocaleDateString(),
      income.source,
      income.category,
      income.amount,
      income.description || '',
      income.isRecurring ? 'Yes' : 'No',
      income.frequency || '',
      new Date(income.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `incomes-${selectedOnly ? 'selected-' : ''}${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${dataToExport.length} incomes exported to CSV!`);
  };

  interface PDFExportOptions {
    orientation: 'portrait' | 'landscape';
    fontSize: 'small' | 'medium' | 'large';
    title: string;
    subtitle?: string;
    includeDescription: boolean;
    includeRecurring: boolean;
    includeCreatedDate: boolean;
    dateFormat: 'short' | 'long';
    selectedOnly?: boolean;
  }

  const handlePDFExport = async (options: PDFExportOptions) => {
    try {
      const jsPDF = (await import('jspdf')).default;
      const doc = new jsPDF({
        orientation: options.orientation,
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      
      // Font sizes
      const fontSizes = {
        small: { title: 16, subtitle: 10, header: 8, body: 7 },
        medium: { title: 18, subtitle: 11, header: 9, body: 8 },
        large: { title: 20, subtitle: 12, header: 10, body: 9 }
      };
      const sizes = fontSizes[options.fontSize as keyof typeof fontSizes] || fontSizes.medium;
      
      let yPos = margin;
      
      // Title
      doc.setFontSize(sizes.title);
      doc.setFont('helvetica', 'bold');
      doc.text(options.title, margin, yPos);
      yPos += 10;
      
      // Subtitle
      if (options.subtitle) {
        doc.setFontSize(sizes.subtitle);
        doc.setFont('helvetica', 'normal');
        const subtitleLines = doc.splitTextToSize(options.subtitle, pageWidth - 2 * margin);
        doc.text(subtitleLines, margin, yPos);
        yPos += subtitleLines.length * 5 + 5;
      }
      
      // Summary
      const dataToExport = isSelectedExport 
        ? incomes.filter(income => selectedRows.includes(income._id))
        : incomes;
      
      doc.setFontSize(sizes.subtitle);
      doc.text(`Total Entries: ${dataToExport.length}`, margin, yPos);
      doc.text(`Total Amount: ₹${dataToExport.reduce((sum, income) => sum + income.amount, 0).toLocaleString()}`, margin + 60, yPos);
      yPos += 15;
      
      // Table setup
      const colWidths = options.orientation === 'landscape' 
        ? [40, 25, 25, 30, ...(options.includeDescription ? [35] : []), ...(options.includeRecurring ? [25] : []), ...(options.includeCreatedDate ? [25] : [])]
        : [35, 20, 20, 25, ...(options.includeDescription ? [30] : []), ...(options.includeRecurring ? [20] : []), ...(options.includeCreatedDate ? [20] : [])];
      
      let xPos = margin;
      
      // Table headers
      doc.setFontSize(sizes.header);
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F');
      
      const headers = ['Source', 'Category', 'Amount', 'Date'];
      if (options.includeDescription) headers.push('Description');
      if (options.includeRecurring) headers.push('Recurring');
      if (options.includeCreatedDate) headers.push('Created');
      
      headers.forEach((header, i) => {
        doc.text(header, xPos, yPos);
        xPos += colWidths[i];
      });
      yPos += 10;
      
      // Table data
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(sizes.body);
      
      dataToExport.forEach((income, index) => {
        if (yPos > pageHeight - 20) {
          doc.addPage();
          yPos = margin;
        }
        
        xPos = margin;
        const rowData = [
          income.source.substring(0, 15),
          income.category,
          `₹${income.amount.toLocaleString()}`,
          options.dateFormat === 'long' 
            ? new Date(income.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : new Date(income.date).toLocaleDateString()
        ];
        
        if (options.includeDescription) {
          rowData.push((income.description || '-').substring(0, 20));
        }
        if (options.includeRecurring) {
          rowData.push(income.isRecurring ? `Yes${income.frequency ? ` (${income.frequency})` : ''}` : 'No');
        }
        if (options.includeCreatedDate) {
          rowData.push(new Date(income.createdAt).toLocaleDateString());
        }
        
        // Alternate row background
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(margin, yPos - 3, pageWidth - 2 * margin, 6, 'F');
        }
        
        rowData.forEach((data, i) => {
          if (i === 2) { // Amount column - right align
            doc.text(data, xPos + colWidths[i] - 5, yPos, { align: 'right' });
          } else {
            doc.text(data, xPos, yPos);
          }
          xPos += colWidths[i];
        });
        yPos += 6;
      });
      
      // Footer - Add page numbers
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      }
      
      doc.save(`${options.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF exported successfully');
    } catch {
      toast.error('Failed to export PDF');
    }
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
                        Export ({selectedRows.length})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleCSVExport(true)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Export Selected CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setIsSelectedExport(true);
                        setIsPDFExportOpen(true);
                      }}>
                        <FileText className="mr-2 h-4 w-4" />
                        Export Selected PDF
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
                    Export All
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleCSVExport(false)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export All CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setIsSelectedExport(false);
                    setIsPDFExportOpen(true);
                  }}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export All PDF
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
                      checked={selectedRows.length === incomes.length && incomes.length > 0}
                      onCheckedChange={toggleAllRows}
                    />
                  </TableHead>
                  <TableHead className="min-w-[80px]">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('date')} className="h-auto p-0 font-medium">
                      Date {getSortIcon('date')}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('source')} className="h-auto p-0 font-medium">
                      Source {getSortIcon('source')}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell min-w-[100px]">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('category')} className="h-auto p-0 font-medium">
                      Category {getSortIcon('category')}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell min-w-[120px]">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('description')} className="h-auto p-0 font-medium">
                      Description {getSortIcon('description')}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell min-w-[80px]">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('isRecurring')} className="h-auto p-0 font-medium">
                      Recurring {getSortIcon('isRecurring')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right min-w-[80px]">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('amount')} className="h-auto p-0 font-medium">
                      Amount {getSortIcon('amount')}
                    </Button>
                  </TableHead>
                  <TableHead className="w-8 sm:w-12"></TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell className="hidden sm:table-cell"><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell className="hidden md:table-cell"><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell className="hidden md:table-cell"><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                  </TableRow>
                ))
              ) : incomes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No incomes found
                  </TableCell>
                </TableRow>
              ) : (
                incomes.map((income) => (
                  <TableRow key={income._id}>
                    <TableCell className="py-2">
                      <Checkbox
                        checked={selectedRows.includes(income._id)}
                        onCheckedChange={() => toggleRowSelection(income._id)}
                      />
                    </TableCell>
                    <TableCell className="py-2 text-xs sm:text-sm">
                      {new Date(income.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="font-medium text-sm truncate max-w-[120px] sm:max-w-none">
                        {income.source}
                      </div>
                      <div className="sm:hidden">
                        <Badge variant="secondary" className="text-xs mt-1">{income.category}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell py-2">
                      <Badge variant="secondary" className="text-xs">{income.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-2">
                      <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {income.description || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-2">
                      {income.isRecurring ? (
                        <Badge variant="outline" className="text-xs">
                          {income.frequency || 'Recurring'}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">One-time</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium py-2 text-sm">
                      <div className="flex items-center justify-end gap-1">
                        <span className={getIncomeAmountColor(income.isConnected || false)}>
                          +₹{income.amount.toLocaleString()}
                        </span>
                        {income.isConnected && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" title={getIncomeTooltip(income.isConnected)} />
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
                          <DropdownMenuItem onClick={() => handleEdit(income)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(income._id)}
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
        incomes={isSelectedExport ? incomes.filter(income => selectedRows.includes(income._id)) : incomes}
        onExport={(options: PDFExportOptions) => handlePDFExport({...options, selectedOnly: isSelectedExport})}
        isSelectedExport={isSelectedExport}
        selectedCount={selectedRows.length}
      />
    </Card>
  );
}