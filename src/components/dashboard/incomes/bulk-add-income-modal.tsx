'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface BulkIncome {
  amount: string;
  source: string;
  category: string;
  description: string;
  date: string;
}

interface BulkAddIncomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

// Common income sources and categories
const INCOME_SOURCES = [
  { value: 'Salary', label: '💼 Salary' },
  { value: 'Freelance', label: '💻 Freelance' },
  { value: 'Business', label: '🏢 Business' },
  { value: 'Investment', label: '📈 Investment' },
  { value: 'Rental', label: '🏠 Rental' },
  { value: 'Side Job', label: '⚡ Side Job' },
  { value: 'Bonus', label: '🎁 Bonus' },
  { value: 'Other', label: '📦 Other' }
];

const INCOME_CATEGORIES = [
  { value: 'Job', label: '💼 Job' },
  { value: 'Business', label: '🏢 Business' },
  { value: 'Investment', label: '📈 Investment' },
  { value: 'Passive', label: '🔄 Passive' },
  { value: 'One-time', label: '⚡ One-time' },
  { value: 'Other', label: '📦 Other' }
];

export function BulkAddIncomeModal({ open, onOpenChange, onSuccess }: BulkAddIncomeModalProps) {
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [incomes, setIncomes] = useState<BulkIncome[]>([
    { amount: '', source: '', category: '', description: '', date: new Date().toISOString().split('T')[0] }
  ]);
  const [loading, setLoading] = useState(false);

  const addIncomeRow = () => {
    const lastIncome = incomes[incomes.length - 1];
    const inheritedSource = lastIncome?.source || '';
    const inheritedCategory = lastIncome?.category || '';
    setIncomes([...incomes, { 
      amount: '', 
      source: inheritedSource, 
      category: inheritedCategory, 
      description: '', 
      date: new Date().toISOString().split('T')[0] 
    }]);
  };

  const removeIncomeRow = (index: number) => {
    setIncomes(incomes.filter((_, i) => i !== index));
  };

  const updateIncome = (index: number, field: keyof BulkIncome, value: string) => {
    const updated = [...incomes];
    updated[index][field] = value;
    setIncomes(updated);
  };

  const parseBulkText = () => {
    if (!bulkText.trim()) {
      toast.error('Please enter some data to parse');
      return;
    }

    const lines = bulkText.split('\n').filter(line => line.trim());
    const parsed: BulkIncome[] = [];
    let errorCount = 0;
    
    lines.forEach((line) => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 4 && parts[0] && parts[1] && parts[2] && parts[3]) {
        const amount = parts[0].replace(/[^0-9.-]/g, ''); // Remove non-numeric chars
        if (amount && !isNaN(parseFloat(amount))) {
          parsed.push({
            amount: amount,
            source: parts[1],
            category: parts[2],
            description: parts[3],
            date: parts[4] || new Date().toISOString().split('T')[0]
          });
        } else {
          errorCount++;
        }
      } else {
        errorCount++;
      }
    });
    
    if (parsed.length === 0) {
      toast.error('No valid entries found. Format: amount, source, category, description, date');
      return;
    }

    setIncomes(parsed);
    toast.success(`Parsed ${parsed.length} entries${errorCount > 0 ? ` (${errorCount} errors)` : ''}`);
  };

  const handleSubmit = async () => {
    const validIncomes = incomes.filter(inc => inc.amount && inc.source && inc.category && inc.description);
    
    if (validIncomes.length === 0) {
      toast.error('Please add at least one valid income');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/incomes/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incomes: validIncomes.map(income => ({
            amount: parseFloat(income.amount),
            source: income.source,
            category: income.category,
            description: income.description,
            date: income.date,
            isConnected: false,
            isRecurring: false
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add incomes');
      }

      const result = await response.json();
      toast.success(`Successfully added ${result.added} incomes`);
      
      // Force immediate refresh
      setTimeout(() => {
        onSuccess();
      }, 100);
      
      onOpenChange(false);
      setIncomes([{ amount: '', source: '', category: '', description: '', date: new Date().toISOString().split('T')[0] }]);
      setBulkText('');
      setIsBulkMode(false);
    } catch {
      toast.error('Failed to add incomes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Add Incomes</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch checked={isBulkMode} onCheckedChange={setIsBulkMode} />
            <Label>Bulk Text Mode</Label>
          </div>

          {isBulkMode ? (
            <div className="space-y-2">
              <Label>Paste incomes (Format: amount, source, category, description, date)</Label>
              <Textarea
                placeholder="5000, Salary, Job, Monthly salary, 2024-01-15
1000, Freelance, Side Job, Project payment, 2024-01-15
2000, Business, Business, Client payment, 2024-01-16"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={8}
              />
              <Button onClick={parseBulkText} variant="outline">Parse Text</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {incomes.map((income, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-end">
                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={income.amount}
                      onChange={(e) => updateIncome(index, 'amount', e.target.value)}
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <Label>Source</Label>
                    <Select
                      value={income.source}
                      onValueChange={(value) => updateIncome(index, 'source', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        {INCOME_SOURCES.map((source) => (
                          <SelectItem key={source.value} value={source.value}>
                            {source.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={income.category}
                      onValueChange={(value) => updateIncome(index, 'category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {INCOME_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={income.description}
                      onChange={(e) => updateIncome(index, 'description', e.target.value)}
                      placeholder="Monthly salary"
                    />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={income.date}
                      onChange={(e) => updateIncome(index, 'date', e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeIncomeRow(index)}
                    disabled={incomes.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addIncomeRow} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Row
              </Button>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Adding...' : `Add ${incomes.filter(i => i.amount && i.source && i.category && i.description).length} Incomes`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}