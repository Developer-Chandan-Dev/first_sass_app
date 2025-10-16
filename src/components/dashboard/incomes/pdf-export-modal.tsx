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

import { IncomeItem } from '@/lib/redux/income/incomeSlice';

interface PDFExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  incomes: IncomeItem[];
  onExport: (options: PDFExportOptions) => void;
  isSelectedExport?: boolean;
  selectedCount?: number;
}

export interface PDFExportOptions {
  title: string;
  subtitle?: string;
  includeDescription: boolean;
  includeRecurring: boolean;
  includeCreatedDate: boolean;
  dateFormat: 'short' | 'long';
  orientation: 'portrait' | 'landscape';
  fontSize: 'small' | 'medium' | 'large';
  selectedOnly?: boolean;
}

export function PDFExportModal({
  isOpen,
  onClose,
  incomes,
  onExport,
  isSelectedExport = false,
  selectedCount = 0,
}: PDFExportModalProps) {
  const t = useTranslations('pdfExport');
  const tCommon = useTranslations('common');

  const [options, setOptions] = useState<PDFExportOptions>({
    title: isSelectedExport
      ? t('selectedReport', { type: 'Income', count: selectedCount })
      : t('incomeReport'),
    subtitle: t('generatedOn', { date: new Date().toLocaleDateString() }),
    includeDescription: true,
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

    onExport(options);
    onClose();
  };

  const totalAmount = incomes.reduce((sum, income) => sum + income.amount, 0);

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
                placeholder={t('incomeReport')}
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
                  id="description"
                  checked={options.includeDescription}
                  onCheckedChange={(checked) =>
                    setOptions({
                      ...options,
                      includeDescription: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="description" className="text-sm">
                  {t('description')}
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
            <div>• {t('incomeEntries', { count: incomes.length })}</div>
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
