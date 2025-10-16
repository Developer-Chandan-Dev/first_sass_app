import { useState, useEffect } from 'react';
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
import { sanitizeString, sanitizeForLog } from '@/lib/input-sanitizer';

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

export function useIncomeTable() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    incomes,
    loading,
    filters,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
  } = useSelector((state: RootState) => state.incomes);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [editingIncome, setEditingIncome] = useState<IncomeItem | null>(null);
  const [isPDFExportOpen, setIsPDFExportOpen] = useState(false);
  const [isSelectedExport, setIsSelectedExport] = useState(false);
  const [viewingExpenses, setViewingExpenses] = useState<IncomeItem | null>(
    null
  );

  // Fetch incomes when component mounts or when filters/pagination changes
  useEffect(() => {
    const filtersWithSearch = { ...filters, search: activeSearchTerm };
    dispatch(
      fetchIncomes({
        filters: filtersWithSearch,
        page: currentPage,
        pageSize,
      })
    );
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

    dispatch(deleteIncomeOptimistic(id));
    toast.success('Income deleted successfully!');

    try {
      await dispatch(deleteIncome(id)).unwrap();
    } catch (error) {
      console.error(
        'Delete income error:',
        sanitizeForLog(error instanceof Error ? error.message : 'Unknown error')
      );
      toast.error('Failed to delete income');
      dispatch(
        fetchIncomes({
          filters: { ...filters, search: activeSearchTerm },
          page: currentPage,
          pageSize,
        })
      );
    }
  };

  const handleBulkDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${selectedRows.length} incomes?`
      )
    ) {
      return;
    }

    selectedRows.forEach((id) => {
      dispatch(deleteIncomeOptimistic(id));
    });
    toast.success(`${selectedRows.length} incomes deleted successfully!`);
    setSelectedRows([]);

    try {
      const response = await fetch('/api/incomes/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedRows }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete incomes');
      }
    } catch (error) {
      console.error(
        'Bulk delete incomes error:',
        sanitizeForLog(error instanceof Error ? error.message : 'Unknown error')
      );
      toast.error('Failed to delete incomes');
      dispatch(
        fetchIncomes({
          filters: { ...filters, search: activeSearchTerm },
          page: currentPage,
          pageSize,
        })
      );
    }
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows(
      selectedRows.length === incomes.length
        ? []
        : incomes.map((income) => income._id)
    );
  };

  const handleEdit = (income: IncomeItem) => {
    setEditingIncome(income);
  };

  const handleSort = (column: string) => {
    const newSortOrder =
      filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setFilters({ sortBy: column, sortOrder: newSortOrder }));
  };

  const handleCSVExport = (selectedOnly = false) => {
    const dataToExport = selectedOnly
      ? incomes.filter((income) => selectedRows.includes(income._id))
      : incomes;

    if (dataToExport.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = [
      'Date',
      'Source',
      'Category',
      'Amount',
      'Description',
      'Recurring',
      'Frequency',
      'Created Date',
    ];
    const csvData = dataToExport.map((income) => [
      new Date(income.date).toLocaleDateString(),
      sanitizeString(income.source || ''),
      sanitizeString(income.category || ''),
      income.amount,
      sanitizeString(income.description || ''),
      income.isRecurring ? 'Yes' : 'No',
      sanitizeString(income.frequency || ''),
      new Date(income.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `incomes-${selectedOnly ? 'selected-' : ''}${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`${dataToExport.length} incomes exported to CSV!`);
  };

  const handlePDFExport = async (options: PDFExportOptions) => {
    try {
      const jsPDF = (await import('jspdf')).default;
      const doc = new jsPDF({
        orientation: options.orientation,
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;

      const fontSizes = {
        small: { title: 16, subtitle: 10, header: 8, body: 7 },
        medium: { title: 18, subtitle: 11, header: 9, body: 8 },
        large: { title: 20, subtitle: 12, header: 10, body: 9 },
      };
      const sizes =
        fontSizes[options.fontSize as keyof typeof fontSizes] ||
        fontSizes.medium;

      let yPos = margin;

      doc.setFontSize(sizes.title);
      doc.setFont('helvetica', 'bold');
      doc.text(options.title, margin, yPos);
      yPos += 10;

      if (options.subtitle) {
        doc.setFontSize(sizes.subtitle);
        doc.setFont('helvetica', 'normal');
        const subtitleLines = doc.splitTextToSize(
          options.subtitle,
          pageWidth - 2 * margin
        );
        doc.text(subtitleLines, margin, yPos);
        yPos += subtitleLines.length * 5 + 5;
      }

      const dataToExport = isSelectedExport
        ? incomes.filter((income) => selectedRows.includes(income._id))
        : incomes;

      doc.setFontSize(sizes.subtitle);
      doc.text(`Total Entries: ${dataToExport.length}`, margin, yPos);
      doc.text(
        `Total Amount: ₹${dataToExport.reduce((sum, income) => sum + income.amount, 0).toLocaleString()}`,
        margin + 60,
        yPos
      );
      yPos += 15;

      const colWidths =
        options.orientation === 'landscape'
          ? [
              40,
              25,
              25,
              30,
              ...(options.includeDescription ? [35] : []),
              ...(options.includeRecurring ? [25] : []),
              ...(options.includeCreatedDate ? [25] : []),
            ]
          : [
              35,
              20,
              20,
              25,
              ...(options.includeDescription ? [30] : []),
              ...(options.includeRecurring ? [20] : []),
              ...(options.includeCreatedDate ? [20] : []),
            ];

      let xPos = margin;

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

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(sizes.body);

      dataToExport.forEach((income, index) => {
        if (yPos > pageHeight - 20) {
          doc.addPage();
          yPos = margin;
        }

        xPos = margin;
        const rowData = [
          sanitizeString(income.source || '').substring(0, 15),
          sanitizeString(income.category || ''),
          `₹${income.amount.toLocaleString()}`,
          options.dateFormat === 'long'
            ? new Date(income.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : new Date(income.date).toLocaleDateString(),
        ];

        if (options.includeDescription) {
          rowData.push(
            sanitizeString(income.description || '-').substring(0, 20)
          );
        }
        if (options.includeRecurring) {
          rowData.push(
            income.isRecurring
              ? `Yes${income.frequency ? ` (${sanitizeString(income.frequency || '')})` : ''}`
              : 'No'
          );
        }
        if (options.includeCreatedDate) {
          rowData.push(new Date(income.createdAt).toLocaleDateString());
        }

        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(margin, yPos - 3, pageWidth - 2 * margin, 6, 'F');
        }

        rowData.forEach((data, i) => {
          if (i === 2) {
            doc.text(data, xPos + colWidths[i] - 5, yPos, { align: 'right' });
          } else {
            doc.text(data, xPos, yPos);
          }
          xPos += colWidths[i];
        });
        yPos += 6;
      });

      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Page ${i} of ${totalPages}`,
          pageWidth - margin,
          pageHeight - 10,
          { align: 'right' }
        );
      }

      doc.save(
        `${options.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
      );
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error(
        'PDF export error:',
        sanitizeForLog(error instanceof Error ? error.message : 'Unknown error')
      );
      toast.error('Failed to export PDF');
    }
  };

  return {
    // State
    incomes,
    loading,
    filters,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    selectedRows,
    searchTerm,
    activeSearchTerm,
    editingIncome,
    isPDFExportOpen,
    isSelectedExport,
    viewingExpenses,

    // Setters
    setSelectedRows,
    setSearchTerm,
    setEditingIncome,
    setIsPDFExportOpen,
    setIsSelectedExport,
    setViewingExpenses,

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
    handlePDFExport,

    // Redux actions
    dispatch,
    setCurrentPage: (page: number) => dispatch(setCurrentPage(page)),
    setPageSize: (size: number) => dispatch(setPageSize(size)),
  };
}

export type { IncomeItem, PDFExportOptions };
