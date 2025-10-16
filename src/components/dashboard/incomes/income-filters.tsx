'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Filter, X, RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { setFilters, fetchIncomes } from '@/lib/redux/income/incomeSlice';
import { useDashboardTranslations } from '@/hooks/i18n';

interface IncomeTranslations {
  allTime?: string;
  today?: string;
  last7Days?: string;
  last30Days?: string;
  allTypes?: string;
  recurringIncome?: string;
  oneTime?: string;
  allCategories?: string;
  advancedFilters?: string;
  refresh?: string;
  startDate?: string;
  endDate?: string;
}

const getPeriods = (income: IncomeTranslations) => [
  { key: 'all', label: income.allTime || 'All Time' },
  { key: 'today', label: income.today || 'Today' },
  { key: 'week', label: income.last7Days || 'Last 7 Days' },
  { key: 'month', label: income.last30Days || 'Last 30 Days' },
];

const categories = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Rental',
  'Other',
];

const getFilterOptions = (income: IncomeTranslations) => ({
  recurring: [
    { value: 'all', label: income.allTypes || 'All Types' },
    { value: 'true', label: income.recurringIncome || 'Recurring' },
    { value: 'false', label: income.oneTime || 'One-time' },
  ],
});

export function IncomeFilters() {
  const dispatch = useDispatch<AppDispatch>();
  const { filters, currentPage, pageSize, loading } = useSelector(
    (state: RootState) => state.incomes
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { income, common } = useDashboardTranslations();

  const periods = getPeriods(income);
  const filterOptions = getFilterOptions(income);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    dispatch(setFilters({ [key]: value === 'all' ? '' : value }));
  };

  const clearFilters = () => {
    dispatch(
      setFilters({
        period: 'all',
        category: '',
        startDate: '',
        endDate: '',
        search: '',
        isRecurring: undefined,
        sortBy: 'date',
        sortOrder: 'desc',
      })
    );
  };

  const handleRefresh = () => {
    dispatch(fetchIncomes({ filters, page: currentPage, pageSize }));
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v && v !== 'all'
  ).length;

  const SelectFilter = ({
    label,
    value,
    onValueChange,
    options,
    placeholder,
  }: {
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Filter className="w-4 h-4 sm:mr-2" />
            <span className="max-sm:hidden">
              {income.advancedFilters || 'Advanced Filters'}
            </span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 sm:ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`}
              />
              {income.refresh || 'Refresh'}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                {common.clear || 'Clear'}
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SelectFilter
                label={common.category}
                value={filters.category}
                onValueChange={(value) => updateFilter('category', value)}
                options={[
                  {
                    value: 'all',
                    label: income.allCategories || 'All Categories',
                  },
                  ...categories.map((cat) => ({ value: cat, label: cat })),
                ]}
                placeholder={income.allCategories || 'All Categories'}
              />

              <SelectFilter
                label={income.recurringIncome}
                value={filters.isRecurring?.toString() || 'all'}
                onValueChange={(value) =>
                  updateFilter('isRecurring', value === 'all' ? '' : value)
                }
                options={filterOptions.recurring}
                placeholder={income.allTypes || 'All Types'}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">
                  {income.startDate || 'Start Date'}
                </Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => updateFilter('startDate', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">
                  {income.endDate || 'End Date'}
                </Label>
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