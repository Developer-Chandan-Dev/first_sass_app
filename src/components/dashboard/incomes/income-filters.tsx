'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Filter, X, RefreshCw } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { setFilters, fetchIncomes } from '@/lib/redux/income/incomeSlice';

interface IncomeFiltersProps {
  categories?: string[];
}

const incomeCategories = [
  'Salary',
  'Freelance', 
  'Business',
  'Investment',
  'Rental',
  'Other'
];

const periods = [
  { key: 'all', label: 'All Time' },
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Last 7 Days' },
  { key: 'month', label: 'Last 30 Days' }
];

export function IncomeFilters({ categories = incomeCategories }: IncomeFiltersProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { filters, currentPage, pageSize, loading } = useSelector((state: RootState) => state.incomes);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    dispatch(setFilters({ [key]: value }));
  };

  const clearFilters = () => {
    dispatch(setFilters({
      period: 'all',
      category: '',
      startDate: '',
      endDate: '',
      search: ''
    }));
  };

  const handleRefresh = () => {
    dispatch(fetchIncomes({ 
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