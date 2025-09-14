'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface ExpenseFiltersType {
  period: 'all' | 'today' | 'week' | 'month';
  category: string;
  startDate: string;
  endDate: string;
  search: string;
}

interface ExpenseFiltersProps {
  filters: ExpenseFiltersType;
  onFiltersChange: (filters: ExpenseFiltersType) => void;
  categories: string[];
}

export function ExpenseFilters({ filters, onFiltersChange, categories }: ExpenseFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const periods = [
    { key: 'all', label: 'All Time' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'Last 7 Days' },
    { key: 'month', label: 'Last 30 Days' }
  ];

  const updateFilter = (key: keyof ExpenseFiltersType, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      period: 'all',
      category: '',
      startDate: '',
      endDate: '',
      search: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'all').length;

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Search */}
        <div>
          <Input
            placeholder="Search expenses..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

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

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            {/* Category Filter */}
            <div>
              <Label className="text-sm font-medium">Category</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant={filters.category === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilter('category', '')}
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={filters.category === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFilter('category', category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Start Date</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => updateFilter('startDate', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">End Date</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => updateFilter('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}