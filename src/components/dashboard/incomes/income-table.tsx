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
import { PDFExportModal, PDFExportOptions } from './pdf-export-modal';
import { toast } from 'sonner';

type SortField = 'source' | 'category' | 'amount' | 'date' | 'description' | 'isRecurring' | 'createdAt';
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
  const [showPDFModal, setShowPDFModal] = useState(false);

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
      Frequency: income.frequency || 'N/A',
      Created: formatDate(income.createdAt)
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

  const handleExportPDF = async (options: PDFExportOptions) => {
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
      const sizes = fontSizes[options.fontSize];
      
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
      doc.setFontSize(sizes.subtitle);
      doc.text(`Total Entries: ${sortedIncomes.length}`, margin, yPos);
      doc.text(`Total Amount: ₹${sortedIncomes.reduce((sum, income) => sum + income.amount, 0).toLocaleString()}`, margin + 60, yPos);
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
      
      sortedIncomes.forEach((income, index) => {
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
            : formatDate(income.date)
        ];
        
        if (options.includeDescription) {
          rowData.push((income.description || '-').substring(0, 20));
        }
        if (options.includeRecurring) {
          rowData.push(income.isRecurring ? `Yes${income.frequency ? ` (${income.frequency})` : ''}` : 'No');
        }
        if (options.includeCreatedDate) {
          rowData.push(formatDate(income.createdAt));
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
      let aVal: string | number | Date | boolean = a[sortField] ?? '';
      let bVal: string | number | Date | boolean = b[sortField] ?? '';
      
      if (sortField === 'amount') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else if (sortField === 'date' || sortField === 'createdAt') {
        aVal = new Date(aVal as string);
        bVal = new Date(bVal as string);
      } else if (sortField === 'isRecurring') {
        aVal = aVal ? 1 : 0;
        bVal = bVal ? 1 : 0;
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
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
        <div className="flex flex-col gap-2 sm:gap-4">
          <CardTitle className="text-base sm:text-lg lg:text-xl">Incomes ({totalCount})</CardTitle>
          
          {/* Search Row */}
          <div className="flex gap-1 sm:gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pl-7 sm:pl-8 h-8 sm:h-9 text-xs sm:text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSearch}
              className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 p-0 sm:p-2"
            >
              <Search className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline ml-1">Search</span>
            </Button>
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 p-0 sm:p-2"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1">Clear</span>
              </Button>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col xs:flex-row gap-2 justify-between">
            <div className="flex gap-1 sm:gap-2">
              {selectedIncomes.size > 0 && (
                <>
                  <Button size="sm" variant="outline" onClick={handleCopySelected} className="h-7 px-2 text-xs flex-1 xs:flex-none">
                    <Copy className="h-3 w-3 mr-1" />
                    Copy ({selectedIncomes.size})
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleBulkDelete} className="h-7 px-2 text-xs flex-1 xs:flex-none">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete ({selectedIncomes.size})
                  </Button>
                </>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    <span className="hidden xs:inline">Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleExportCSV} className="text-xs">
                    Export CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowPDFModal(true)} className="text-xs">
                    Export PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Select value={pageSize.toString()} onValueChange={(value) => dispatch(setPageSize(Number(value)))}>
              <SelectTrigger className="h-7 w-full xs:w-20 sm:w-24 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400" style={{ scrollbarWidth: 'thin' }}>
          <Table className="min-w-[900px]">
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
                <TableHead className="min-w-[100px] px-2">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('category')} className="h-6 px-1 text-xs font-medium">
                    Category {getSortIcon('category')}
                  </Button>
                </TableHead>
                <TableHead className="text-right min-w-[90px] px-2">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('amount')} className="h-6 px-1 text-xs font-medium">
                    Amount {getSortIcon('amount')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[120px] px-2">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('description')} className="h-6 px-1 text-xs font-medium">
                    Description {getSortIcon('description')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[80px] px-2">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('isRecurring')} className="h-6 px-1 text-xs font-medium">
                    Recurring {getSortIcon('isRecurring')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[90px] px-2">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('date')} className="h-6 px-1 text-xs font-medium">
                    Date {getSortIcon('date')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[90px] px-2">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('createdAt')} className="h-6 px-1 text-xs font-medium">
                    Created {getSortIcon('createdAt')}
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
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                  </TableRow>
                ))
              ) : sortedIncomes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground text-sm">
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
                      <p className="truncate text-xs sm:text-sm font-medium">{income.source}</p>
                    </TableCell>
                    <TableCell className="px-2">
                      <Badge className={`text-xs h-4 px-1 ${getCategoryColor(income.category)}`}>
                        {income.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600 px-2">
                      <span className="text-xs sm:text-sm">+₹{income.amount.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="px-2">
                      <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {income.description || '-'}
                      </p>
                    </TableCell>
                    <TableCell className="px-2">
                      <div className="flex items-center gap-1">
                        <Badge variant={income.isRecurring ? 'default' : 'secondary'} className="text-xs h-4 px-1">
                          {income.isRecurring ? 'Yes' : 'No'}
                        </Badge>
                        {income.isRecurring && income.frequency && (
                          <Badge variant="outline" className="text-xs h-4 px-1">
                            {income.frequency}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground px-2">
                      <span className="text-xs">{formatDate(income.date)}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground px-2">
                      <span className="text-xs">{formatDate(income.createdAt)}</span>
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
      
      <PDFExportModal
        isOpen={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        incomes={sortedIncomes}
        onExport={handleExportPDF}
      />
      </CardContent>
    </Card>
  );
}