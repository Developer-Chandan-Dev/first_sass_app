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

interface ExpenseFiltersProps {
  categories?: string[];
  expenseType?: 'free' | 'budget';
  budgets?: Array<{_id: string; name: string}>;
}

export function ExpenseFilters({ categories = ['Food & Dining', 'Transportation', 'Entertainment', 'Groceries', 'Shopping', 'Healthcare', 'Utilities', 'Education' ,'Travel', 'Others'], expenseType = 'free', budgets = [] }: ExpenseFiltersProps) {
  const dispatch = useAppDispatch();
  const { filters, currentPage, pageSize, loading } = useAppSelector(state => state.expenses);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const periods = [
    { key: 'all', label: 'All Time' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'Last 7 Days' },
    { key: 'month', label: 'Last 30 Days' }
  ];

  const updateFilter = (key: keyof typeof filters, value: string) => {
    dispatch(setFilters({ [key]: value }));
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
    dispatch(fetchExpenses({ 
      expenseType, 
      filters, 
      page: currentPage, 
      pageSize 
    }));
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'all').length;

  return (
    <Card>
      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Quick Filters */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          {periods.map((period) => (
            <Button
              key={period.key}
              variant={filters.period === period.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilter('period', period.key)}
              className="text-xs sm:text-sm"
            >
              {period.label}
            </Button>
          ))}
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full sm:w-auto justify-start"
          >
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full sm:w-auto">
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t">
            {/* Category Filter */}
            <div>
              <Label className="text-sm font-medium">Category</Label>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mt-2">
                <Button
                  variant={filters.category === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilter('category', '')}
                  className="text-xs sm:text-sm"
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={filters.category === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFilter('category', category)}
                    className="text-xs sm:text-sm truncate"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label className="text-sm font-medium">Recurring</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={filters.isRecurring === '' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFilter('isRecurring', '')}
                    className="text-xs sm:text-sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={filters.isRecurring === 'true' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFilter('isRecurring', 'true')}
                    className="text-xs sm:text-sm"
                  >
                    Recurring
                  </Button>
                  <Button
                    variant={filters.isRecurring === 'false' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFilter('isRecurring', 'false')}
                    className="text-xs sm:text-sm"
                  >
                    One-time
                  </Button>
                </div>
              </div>
              
              {expenseType === 'budget' && budgets.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Budget</Label>
                  <Select
                    value={filters.budgetId || 'all'}
                    onValueChange={(value) => updateFilter('budgetId', value === 'all' ? '' : value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="All Budgets" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Budgets</SelectItem>
                      {budgets.map((budget) => (
                        <SelectItem key={budget._id} value={budget._id}>
                          {budget.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label className="text-sm font-medium">Start Date</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => updateFilter('startDate', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">End Date</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => updateFilter('endDate', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}