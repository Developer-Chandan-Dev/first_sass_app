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
import { useCategories } from '@/hooks/useCategories';

interface BulkExpense {
  amount: string;
  category: string;
  reason: string;
  date: string;
}

interface BulkAddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  expenseType?: 'free' | 'budget';
}

export function BulkAddExpenseModal({ open, onOpenChange, onSuccess, expenseType = 'free' }: BulkAddExpenseModalProps) {
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [expenses, setExpenses] = useState<BulkExpense[]>([
    { amount: '', category: '', reason: '', date: new Date().toISOString().split('T')[0] }
  ]);
  const [loading, setLoading] = useState(false);
  const { categoryOptions } = useCategories();

  const addExpenseRow = () => {
    const lastExpense = expenses[expenses.length - 1];
    const inheritedCategory = lastExpense?.category || '';
    setExpenses([...expenses, { 
      amount: '', 
      category: inheritedCategory, 
      reason: '', 
      date: new Date().toISOString().split('T')[0] 
    }]);
  };

  const removeExpenseRow = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const updateExpense = (index: number, field: keyof BulkExpense, value: string) => {
    const updated = [...expenses];
    updated[index][field] = value;
    setExpenses(updated);
  };

  const parseBulkText = () => {
    if (!bulkText.trim()) {
      toast.error('Please enter some data to parse');
      return;
    }

    const lines = bulkText.split('\n').filter(line => line.trim());
    const parsed: BulkExpense[] = [];
    let errorCount = 0;
    
    lines.forEach((line) => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 3 && parts[0] && parts[1] && parts[2]) {
        const amount = parts[0].replace(/[^0-9.-]/g, ''); // Remove non-numeric chars
        if (amount && !isNaN(parseFloat(amount))) {
          parsed.push({
            amount: amount,
            category: parts[1],
            reason: parts[2],
            date: parts[3] || new Date().toISOString().split('T')[0]
          });
        } else {
          errorCount++;
        }
      } else {
        errorCount++;
      }
    });
    
    if (parsed.length === 0) {
      toast.error('No valid entries found. Format: amount, category, reason, date');
      return;
    }

    setExpenses(parsed);
    toast.success(`Parsed ${parsed.length} entries${errorCount > 0 ? ` (${errorCount} errors)` : ''}`);
  };

  const handleSubmit = async () => {
    const validExpenses = expenses.filter(exp => exp.amount && exp.category && exp.reason);
    
    if (validExpenses.length === 0) {
      toast.error('Please add at least one valid expense');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/expenses/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expenses: validExpenses.map(expense => ({
            amount: parseFloat(expense.amount),
            category: expense.category,
            reason: expense.reason,
            date: expense.date,
            type: expenseType
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add expenses');
      }

      const result = await response.json();
      toast.success(`Successfully added ${result.added} expenses`);
      
      // Force immediate refresh
      setTimeout(() => {
        onSuccess();
      }, 100);
      
      onOpenChange(false);
      setExpenses([{ amount: '', category: '', reason: '', date: new Date().toISOString().split('T')[0] }]);
      setBulkText('');
      setIsBulkMode(false);
    } catch {
      toast.error('Failed to add expenses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Add {expenseType === 'budget' ? 'Budget' : 'Free'} Expenses</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch checked={isBulkMode} onCheckedChange={setIsBulkMode} />
            <Label>Bulk Text Mode</Label>
          </div>

          {isBulkMode ? (
            <div className="space-y-2">
              <Label>Paste expenses (Format: amount, category, reason, date)</Label>
              <Textarea
                placeholder="100, Food and Dining, Lunch, 2024-01-15
50, Transportation, Bus fare, 2024-01-15
200, Shopping, Groceries, 2024-01-16"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={8}
              />
              <Button onClick={parseBulkText} variant="outline">Parse Text</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 items-end">
                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={expense.amount}
                      onChange={(e) => updateExpense(index, 'amount', e.target.value)}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={expense.category}
                      onValueChange={(value) => updateExpense(index, 'category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category.key} value={category.backendKey}>
                            {category.icon} {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={expense.reason}
                      onChange={(e) => updateExpense(index, 'reason', e.target.value)}
                      placeholder="Lunch"
                    />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={expense.date}
                      onChange={(e) => updateExpense(index, 'date', e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeExpenseRow(index)}
                    disabled={expenses.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addExpenseRow} variant="outline" size="sm">
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
              {loading ? 'Adding...' : `Add ${expenses.filter(e => e.amount && e.category && e.reason).length} Expenses`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}