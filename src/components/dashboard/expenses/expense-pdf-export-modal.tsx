'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { ExpenseItem } from '@/lib/redux/expense/expenseSlice';

interface ExpensePDFExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: ExpenseItem[];
  isSelectedExport?: boolean;
  selectedCount?: number;
}

export interface ExpensePDFExportOptions {
  title: string;
  subtitle?: string;
  includeCategory: boolean;
  includeRecurring: boolean;
  includeCreatedDate: boolean;
  dateFormat: 'short' | 'long';
  orientation: 'portrait' | 'landscape';
  fontSize: 'small' | 'medium' | 'large';
}

export function ExpensePDFExportModal({
  isOpen,
  onClose,
  expenses,
  isSelectedExport = false,
  selectedCount = 0,
}: ExpensePDFExportModalProps) {
  const t = useTranslations('pdfExport');
  const tCommon = useTranslations('common');

  const [options, setOptions] = useState<ExpensePDFExportOptions>({
    title: isSelectedExport
      ? t('selectedReport', { type: 'Expense', count: selectedCount })
      : t('expenseReport'),
    subtitle: t('generatedOn', { date: new Date().toLocaleDateString() }),
    includeCategory: true,
    includeRecurring: true,
    includeCreatedDate: false,
    dateFormat: 'short',
    orientation: 'landscape',
    fontSize: 'medium',
  });

  const handleExport = () => {
    if (!options.title.trim()) {
      toast.error(t('pleaseEnterTitle'));
      return;
    }

    generatePDF();
    onClose();
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: options.orientation,
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // Font sizes
    const fontSizes = {
      small: { title: 16, subtitle: 10, header: 8, body: 7 },
      medium: { title: 18, subtitle: 12, header: 10, body: 8 },
      large: { title: 20, subtitle: 14, header: 12, body: 10 },
    };
    const sizes = fontSizes[options.fontSize];

    let yPosition = margin;

    // Title
    doc.setFontSize(sizes.title);
    doc.setFont('helvetica', 'bold');
    doc.text(options.title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // Subtitle
    if (options.subtitle) {
      doc.setFontSize(sizes.subtitle);
      doc.setFont('helvetica', 'normal');
      doc.text(options.subtitle, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;
    }

    // Summary
    const totalAmount = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    doc.setFontSize(sizes.body);
    doc.text(
      `Total Expenses: ${expenses.length} | Total Amount: ₹${totalAmount.toLocaleString()}`,
      margin,
      yPosition
    );
    yPosition += 15;

    // Table headers
    const headers = ['Date', 'Description'];
    if (options.includeCategory) headers.push('Category');
    if (options.includeRecurring) headers.push('Recurring');
    if (options.includeCreatedDate) headers.push('Created');
    headers.push('Amount');

    const colWidth = contentWidth / headers.length;

    doc.setFontSize(sizes.header);
    doc.setFont('helvetica', 'bold');
    headers.forEach((header, index) => {
      doc.text(header, margin + index * colWidth, yPosition);
    });
    yPosition += 8;

    // Table rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(sizes.body);

    expenses.forEach((expense, index) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }

      const rowData = [];

      // Date
      const date = new Date(expense.date);
      rowData.push(
        options.dateFormat === 'short'
          ? date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: '2-digit',
            })
          : date.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })
      );

      // Description
      rowData.push(
        expense.reason.length > 20
          ? expense.reason.substring(0, 20) + '...'
          : expense.reason
      );

      // Category
      if (options.includeCategory) {
        rowData.push(expense.category);
      }

      // Recurring
      if (options.includeRecurring) {
        rowData.push(expense.isRecurring ? expense.frequency || 'Yes' : 'No');
      }

      // Created Date
      if (options.includeCreatedDate) {
        const createdDate = new Date(expense.createdAt);
        rowData.push(
          createdDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        );
      }

      // Amount
      rowData.push(`₹${expense.amount.toLocaleString()}`);

      // Alternating row colors
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, yPosition - 4, contentWidth, 6, 'F');
      }

      rowData.forEach((data, colIndex) => {
        doc.text(data, margin + colIndex * colWidth, yPosition);
      });

      yPosition += 6;
    });

    // Footer
    const pageCount = (
      doc as unknown as { getNumberOfPages(): number }
    ).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: 'right' }
      );
    }

    doc.save(
      `expense-report-${isSelectedExport ? 'selected-' : ''}${new Date().toISOString().split('T')[0]}.pdf`
    );
    toast.success(t('pdfExportedSuccess'));
  };

  const totalAmount = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isSelectedExport
              ? t('selectedItems', { count: selectedCount })
              : t('title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Report Info */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="title">{t('reportTitleRequired')}</Label>
              <Input
                id="title"
                value={options.title}
                onChange={(e) =>
                  setOptions({ ...options, title: e.target.value })
                }
                placeholder={t('expenseReport')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">{t('subtitle')}</Label>
              <Textarea
                id="subtitle"
                value={options.subtitle}
                onChange={(e) =>
                  setOptions({ ...options, subtitle: e.target.value })
                }
                placeholder={t('additionalInfo')}
                rows={2}
              />
            </div>
          </div>

          {/* Layout Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">{t('layoutOptions')}</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('orientation')}</Label>
                <Select
                  value={options.orientation}
                  onValueChange={(value: 'portrait' | 'landscape') =>
                    setOptions({ ...options, orientation: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">{t('portrait')}</SelectItem>
                    <SelectItem value="landscape">{t('landscape')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('fontSize')}</Label>
                <Select
                  value={options.fontSize}
                  onValueChange={(value: 'small' | 'medium' | 'large') =>
                    setOptions({ ...options, fontSize: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">{t('small')}</SelectItem>
                    <SelectItem value="medium">{t('medium')}</SelectItem>
                    <SelectItem value="large">{t('large')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('dateFormat')}</Label>
              <Select
                value={options.dateFormat}
                onValueChange={(value: 'short' | 'long') =>
                  setOptions({ ...options, dateFormat: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">{t('shortDate')}</SelectItem>
                  <SelectItem value="long">{t('longDate')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Column Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">{t('includeColumns')}</h4>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category"
                  checked={options.includeCategory}
                  onCheckedChange={(checked) =>
                    setOptions({
                      ...options,
                      includeCategory: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="category" className="text-sm">
                  {t('category')}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recurring"
                  checked={options.includeRecurring}
                  onCheckedChange={(checked) =>
                    setOptions({
                      ...options,
                      includeRecurring: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="recurring" className="text-sm">
                  {t('recurringStatus')}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="createdDate"
                  checked={options.includeCreatedDate}
                  onCheckedChange={(checked) =>
                    setOptions({
                      ...options,
                      includeCreatedDate: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="createdDate" className="text-sm">
                  {t('createdDate')}
                </Label>
              </div>
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-muted p-3 rounded-lg text-sm">
            <div className="font-medium mb-1">{t('reportPreview')}:</div>
            <div>• {t('expenseEntries', { count: expenses.length })}</div>
            <div>
              • {t('totalAmount', { amount: totalAmount.toLocaleString() })}
            </div>
            <div>• {t('format', { orientation: options.orientation })}</div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {tCommon('cancel')}
            </Button>
            <Button onClick={handleExport} className="flex-1">
              {t('generatePDF')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
