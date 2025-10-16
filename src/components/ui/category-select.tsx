'use client';

import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';

import { Plus, Check } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useDashboardTranslations } from '@/hooks/i18n';
import { toast } from 'sonner';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function CategorySelect({
  value,
  onChange,
  placeholder,
  className,
  id,
}: CategorySelectProps) {
  const t = useDashboardTranslations();
  const { categoryOptions, addCustomCategory } = useCategories();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCustomCategory = async () => {
    if (!customCategoryName.trim()) return;

    setIsAdding(true);
    const result = await addCustomCategory(customCategoryName.trim());

    if (result.success) {
      onChange(result.category);
      setCustomCategoryName('');
      setShowCustomInput(false);
      toast.success(t.success.created);
    } else {
      toast.error(result.error || t.errors.generic);
    }
    setIsAdding(false);
  };

  return (
    <div className="space-y-2">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-2 text-sm border rounded-md bg-background text-foreground border-input ${className}`}
      >
        <option value="">{placeholder || t.expenses.selectCategory}</option>
        {categoryOptions.map((cat) => (
          <option key={cat.key} value={cat.backendKey}>
            {cat.icon} {cat.label}
          </option>
        ))}
      </select>

      {!showCustomInput ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowCustomInput(true)}
          className="w-full"
        >
          <Plus className="h-3 w-3 mr-1" />
          {t.expenses.enterCustomCategory}
        </Button>
      ) : (
        <div className="flex gap-2">
          <Input
            value={customCategoryName}
            onChange={(e) => setCustomCategoryName(e.target.value)}
            placeholder={t.expenses.enterCustomCategory}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomCategory();
              }
              if (e.key === 'Escape') {
                setShowCustomInput(false);
                setCustomCategoryName('');
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleAddCustomCategory}
            disabled={!customCategoryName.trim() || isAdding}
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setShowCustomInput(false);
              setCustomCategoryName('');
            }}
          >
            {t.common.cancel}
          </Button>
        </div>
      )}
    </div>
  );
}
