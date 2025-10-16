'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import { useDashboardTranslations } from '@/hooks/i18n';

interface CategoryFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function CategoryFilter({
  value,
  onValueChange,
  className,
}: CategoryFilterProps) {
  const { categoryOptions, loading } = useCategories();
  const { common } = useDashboardTranslations();

  const handleValueChange = (selectedValue: string) => {
    onValueChange(selectedValue === 'all' ? '' : selectedValue);
  };

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger className={className}>
          <SelectValue placeholder="Loading..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value || 'all'} onValueChange={handleValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={common?.category || 'Category'} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categoryOptions.map((category) => (
          <SelectItem key={category.key} value={category.backendKey}>
            <div className="flex items-center gap-2">
              {category.icon && <span>{category.icon}</span>}
              <span>{category.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
