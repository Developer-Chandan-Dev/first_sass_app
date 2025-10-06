'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Filter, X, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setFilters, fetchExpenses } from '@/lib/redux/expense/expenseSlice';
import { useAppTranslations } from '@/hooks/useTranslation';

interface ExpenseFiltersProps {
  categories?: string[];
  expenseType?: 'free' | 'budget';
  budgets?: Array<{_id: string; name: string}>;
}



export function ExpenseFilters({ 
  categories = [], 
  expenseType = 'free', 
  budgets = [] 
}: ExpenseFiltersProps) {
  const dispatch = useAppDispatch();
  const { filters, currentPage, pageSize, loading } = useAppSelector(state => state.expenses);
  const { expenses, common } = useAppTranslations();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const periods = [
    { key: 'all', label: expenses.allTime },
    { key: 'today', label: expenses.today },
    { key: 'week', label: expenses.last7Days },
    { key: 'month', label: expenses.last30Days }
  ];

  const filterOptions = {
    recurring: [
      { value: 'all', label: expenses.allTypes },
      { value: 'true', label: expenses.recurring },
      { value: 'false', label: expenses.oneTime }
    ]
  };

  console.log("ExpenseType: ", expenseType, budgets, budgets.length, 44);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    dispatch(setFilters({ [key]: value === 'all' ? '' : value }));
  };

  const clearFilters = () => {
    dispatch(setFilters({
      period: 'all',
      category: '',
      startDate: '',
      endDate: '',
      search: '',
      budgetId: '',
      isRecurring: '',
      sortBy: 'date',
      sortOrder: 'desc'
    }));
  };

  const handleRefresh = () => {
    dispatch(fetchExpenses({ expenseType, filters, page: currentPage, pageSize }));
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'all').length;

  const SelectFilter = ({ label, value, onValueChange, options, placeholder }: {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
  }) => (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      <Select value={value || 'all'} onValueChange={onValueChange}>
        <SelectTrigger className="mt-2">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <Button
              key={period.key}
              variant={filters.period === period.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilter('period', period.key)}
            >
              {period.label}
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex sm:flex-row sm:justify-between gap-2 max-sm:flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
            <Filter className="w-4 h-4 sm:mr-2" />
              <span className="max-sm:hidden">
                {expenses.advancedFilters}
              </span>
            {activeFiltersCount > 0 && <Badge variant="secondary" className="ml-1 sm:ml-2">{activeFiltersCount}</Badge>}
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              {expenses.refresh}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                {expenses.clear}
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            {/* Category, Recurring, and Budget in a row on larger screens */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <SelectFilter
                label={common.category}
                value={filters.category}
                onValueChange={(value) => updateFilter('category', value)}
                options={[
                  { value: 'all', label: expenses.allCategories },
                  ...categories.map(cat => ({ value: cat, label: cat }))
                ]}
                placeholder={expenses.allCategories}
              />

              <SelectFilter
                label={expenses.recurring}
                value={filters.isRecurring}
                onValueChange={(value) => updateFilter('isRecurring', value)}
                options={filterOptions.recurring}
                placeholder={expenses.allTypes}
              />
              
              {expenseType === 'budget' && budgets.length > 0 ? (
                <SelectFilter
                  label={expenses.budget}
                  value={filters.budgetId}
                  onValueChange={(value) => updateFilter('budgetId', value)}
                  options={[
                    { value: 'all', label: expenses.allBudgets },
                    ...budgets.map(budget => ({ value: budget._id, label: budget.name }))
                  ]}
                  placeholder={expenses.allBudgets}
                />
              ) : (
                <div />  // {/* Empty div to maintain grid layout */}
              )}
            </div>

            {/* Date Range - stays as 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">{expenses.startDate}</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => updateFilter('startDate', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">{expenses.endDate}</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => updateFilter('endDate', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}