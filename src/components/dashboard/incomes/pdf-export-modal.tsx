'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

import { IncomeItem } from '@/lib/redux/income/incomeSlice';

interface PDFExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  incomes: IncomeItem[];
  onExport: (options: PDFExportOptions) => void;
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
}

export function PDFExportModal({ isOpen, onClose, incomes, onExport }: PDFExportModalProps) {
  const [options, setOptions] = useState<PDFExportOptions>({
    title: 'Income Report',
    subtitle: `Generated on ${new Date().toLocaleDateString()}`,
    includeDescription: true,
    includeRecurring: true,
    includeCreatedDate: false,
    dateFormat: 'short',
    orientation: 'landscape',
    fontSize: 'medium'
  });

  const handleExport = () => {
    if (!options.title.trim()) {
      toast.error('Please enter a title for the report');
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
          <DialogTitle>Export PDF Report</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Report Info */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="title">Report Title *</Label>
              <Input
                id="title"
                value={options.title}
                onChange={(e) => setOptions({ ...options, title: e.target.value })}
                placeholder="Income Report"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={options.subtitle}
                onChange={(e) => setOptions({ ...options, subtitle: e.target.value })}
                placeholder="Additional information..."
                rows={2}
              />
            </div>
          </div>

          {/* Layout Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Layout Options</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Orientation</Label>
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
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Font Size</Label>
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
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Date Format</Label>
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
                  <SelectItem value="short">Short (Jan 15, 2024)</SelectItem>
                  <SelectItem value="long">Long (January 15, 2024)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Column Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Include Columns</h4>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="description"
                  checked={options.includeDescription}
                  onCheckedChange={(checked) => 
                    setOptions({ ...options, includeDescription: checked as boolean })
                  }
                />
                <Label htmlFor="description" className="text-sm">Description</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recurring"
                  checked={options.includeRecurring}
                  onCheckedChange={(checked) => 
                    setOptions({ ...options, includeRecurring: checked as boolean })
                  }
                />
                <Label htmlFor="recurring" className="text-sm">Recurring Status</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="createdDate"
                  checked={options.includeCreatedDate}
                  onCheckedChange={(checked) => 
                    setOptions({ ...options, includeCreatedDate: checked as boolean })
                  }
                />
                <Label htmlFor="createdDate" className="text-sm">Created Date</Label>
              </div>
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-muted p-3 rounded-lg text-sm">
            <div className="font-medium mb-1">Report Preview:</div>
            <div>• {incomes.length} income entries</div>
            <div>• Total Amount: ₹{totalAmount.toLocaleString()}</div>
            <div>• Format: {options.orientation} PDF</div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleExport} className="flex-1">
              Generate PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}