'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, FileDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import jsPDF from 'jspdf'

interface Expense {
  _id: string;
  amount: number;
  category: string;
  reason: string;
  date: string;
  type: string;
}

interface IncomeExpensesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incomeId: string;
  incomeSource: string;
  incomeAmount: number;
}

export function IncomeExpensesModal({ 
  open, 
  onOpenChange, 
  incomeId, 
  incomeSource, 
  incomeAmount 
}: IncomeExpensesModalProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  useEffect(() => {
    const fetchIncomeExpenses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/expenses/by-income/${incomeId}`);
        
        if (response.ok) {
          const data = await response.json();
          setExpenses(data.expenses);
          setFilteredExpenses(data.expenses);
          setTotalSpent(data.totalSpent);
        } else {
          toast.error('Failed to fetch expenses');
        }
      } catch (error) {
        console.error('Error fetching income expenses:', error);
        toast.error('Failed to fetch expenses');
      } finally {
        setLoading(false);
      }
    };

    if (open && incomeId) {
      fetchIncomeExpenses();
    }
  }, [open, incomeId]);

  const remainingAmount = incomeAmount - totalSpent;

  useEffect(() => {
    let filtered = expenses;
    
    if (searchTerm) {
      filtered = filtered.filter(expense => 
        expense.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(expense => expense.type === filterType);
    }
    
    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(expense => new Date(expense.date) >= filterDate);
    }
    
    setFilteredExpenses(filtered);
  }, [expenses, searchTerm, filterType, dateRange]);

  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) {
      toast.error('No expenses to export');
      return;
    }
    
    const headers = ['Date', 'Category', 'Description', 'Type', 'Amount'];
    const csvData = filteredExpenses.map(expense => [
      new Date(expense.date).toLocaleDateString(),
      expense.category,
      expense.reason,
      expense.type,
      expense.amount
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${incomeSource}-expenses-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Expenses exported to CSV!');
  };

  const handleExportPDF = async () => {
    if (filteredExpenses.length === 0) {
      toast.error('No expenses to export');
      return;
    }

    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      let yPos = margin;
      
      // Header
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(`Expenses Report: ${incomeSource}`, margin, yPos);
      yPos += 15;
      
      // Summary section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, margin, yPos);
      doc.text(`Total Expenses: ${filteredExpenses.length}`, margin + 80, yPos);
      yPos += 10;
      
      // Financial summary
      doc.setFillColor(240, 248, 255);
      doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 25, 'F');
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Financial Summary:', margin + 5, yPos + 5);
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Income: ₹${incomeAmount.toLocaleString()}`, margin + 5, yPos + 12);
      doc.text(`Total Spent: ₹${totalSpent.toLocaleString()}`, margin + 80, yPos + 12);
      doc.text(`Remaining: ₹${remainingAmount.toLocaleString()}`, margin + 150, yPos + 12);
      doc.text(`Usage: ${((totalSpent / incomeAmount) * 100).toFixed(1)}%`, margin + 220, yPos + 12);
      yPos += 35;
      
      // Table header
      doc.setFillColor(230, 230, 230);
      doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 10, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Date', margin + 5, yPos);
      doc.text('Category', margin + 35, yPos);
      doc.text('Description', margin + 80, yPos);
      doc.text('Type', margin + 160, yPos);
      doc.text('Amount', margin + 200, yPos);
      yPos += 15;
      
      // Table data
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      
      filteredExpenses.forEach((expense, index) => {
        if (yPos > 180) {
          doc.addPage();
          yPos = margin;
        }
        
        // Alternate row background
        if (index % 2 === 0) {
          doc.setFillColor(248, 248, 248);
          doc.rect(margin, yPos - 3, pageWidth - 2 * margin, 8, 'F');
        }
        
        doc.text(new Date(expense.date).toLocaleDateString(), margin + 5, yPos);
        doc.text(expense.category.substring(0, 15), margin + 35, yPos);
        doc.text(expense.reason.substring(0, 25), margin + 80, yPos);
        doc.text(expense.type, margin + 160, yPos);
        doc.text(`₹${expense.amount.toLocaleString()}`, margin + 200, yPos);
        yPos += 8;
      });
      
      // Footer
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, 200, { align: 'right' });
      }
      
      doc.save(`${incomeSource}-expenses-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Expenses from: {incomeSource}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-foreground border-input"
            >
              <option value="all">All Types</option>
              <option value="free">Free</option>
              <option value="budget">Budget</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-foreground border-input"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="3months">Last 3 Months</option>
            </select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExportCSV}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg">
              <p className="text-xs text-purple-600 dark:text-purple-400">Total Expenses</p>
              <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{expenses.length}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
              <p className="text-xs text-blue-600 dark:text-blue-400">Total Income</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">₹{incomeAmount.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
              <p className="text-xs text-red-600 dark:text-red-400">Total Spent</p>
              <p className="text-lg font-bold text-red-700 dark:text-red-300">₹{totalSpent.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
              <p className="text-xs text-green-600 dark:text-green-400">Remaining</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-300">₹{remainingAmount.toLocaleString()}</p>
              <div className="text-xs text-muted-foreground mt-1">
                {((remainingAmount / incomeAmount) * 100).toFixed(1)}% left
              </div>
            </div>
          </div>
          
          {(searchTerm || filterType !== 'all' || dateRange !== 'all') && (
            <div className="bg-muted/50 p-3 rounded-lg mb-4">
              <div className="flex items-center justify-between text-sm">
                <span>Showing {filteredExpenses.length} of {expenses.length} expenses</span>
                <span className="font-medium">
                  Filtered Total: ₹{filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading expenses...</div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {expenses.length === 0 ? 'No expenses found for this income source' : 'No expenses match your filters'}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden bg-card">
              <div className="overflow-x-auto">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-24 sm:w-28 font-semibold">Date</TableHead>
                      <TableHead className="w-28 sm:w-32 font-semibold">Category</TableHead>
                      <TableHead className="min-w-[150px] sm:min-w-[200px] lg:min-w-[300px] font-semibold">Description</TableHead>
                      <TableHead className="w-20 sm:w-24 font-semibold">Type</TableHead>
                      <TableHead className="text-right w-24 sm:w-28 font-semibold">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense) => (
                      <TableRow key={expense._id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="py-4">
                          <div className="text-xs sm:text-sm font-medium whitespace-nowrap">
                            {new Date(expense.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: '2-digit'
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="secondary" className="text-xs whitespace-nowrap">
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="text-xs sm:text-sm text-foreground">
                            <div className="max-w-[120px] sm:max-w-[180px] lg:max-w-[280px] break-words" title={expense.reason}>
                              {expense.reason}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge 
                            variant={expense.type === 'budget' ? 'default' : 'outline'} 
                            className="text-xs whitespace-nowrap"
                          >
                            {expense.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold py-4">
                          <div className="text-xs sm:text-sm whitespace-nowrap">
                            <span className="text-red-600 dark:text-red-400 font-medium">
                              -₹{expense.amount.toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}