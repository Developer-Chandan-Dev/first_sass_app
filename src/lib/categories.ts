// Centralized category management system

export interface Category {
  key: string;
  translationKey: string;
  icon?: string;
  isDefault: boolean;
}

// Default categories that always exist
export const DEFAULT_CATEGORIES: Category[] = [
  {
    key: 'food',
    translationKey: 'expenses.categories.food',
    icon: '🍽️',
    isDefault: true,
  },
  {
    key: 'transport',
    translationKey: 'expenses.categories.transport',
    icon: '🚗',
    isDefault: true,
  },
  {
    key: 'shopping',
    translationKey: 'expenses.categories.shopping',
    icon: '🛍️',
    isDefault: true,
  },
  {
    key: 'entertainment',
    translationKey: 'expenses.categories.entertainment',
    icon: '🎬',
    isDefault: true,
  },
  {
    key: 'bills',
    translationKey: 'expenses.categories.bills',
    icon: '💡',
    isDefault: true,
  },
  {
    key: 'healthcare',
    translationKey: 'expenses.categories.healthcare',
    icon: '🏥',
    isDefault: true,
  },
  {
    key: 'education',
    translationKey: 'expenses.categories.education',
    icon: '📚',
    isDefault: true,
  },
  {
    key: 'travel',
    translationKey: 'expenses.categories.travel',
    icon: '✈️',
    isDefault: true,
  },
  {
    key: 'other',
    translationKey: 'expenses.categories.other',
    icon: '📦',
    isDefault: true,
  },
];

// Backend mapping for consistent data storage
export const BACKEND_CATEGORY_MAP: Record<string, string> = {
  food: 'Food and Dining',
  transport: 'Transportation',
  shopping: 'Shopping',
  entertainment: 'Entertainment',
  bills: 'Bills and Utilities',
  healthcare: 'Healthcare',
  education: 'Education',
  travel: 'Travel',
  other: 'Other',
};

// Get translated category label
export function getCategoryLabel(
  categoryKey: string,
  t: ReturnType<typeof import('@/hooks/i18n').useDashboardTranslations>
): string {
  const category = DEFAULT_CATEGORIES.find((cat) => cat.key === categoryKey);
  if (category) {
    return (
      (t.expenses.categories as Record<string, string>)[categoryKey] ||
      categoryKey
    );
  }
  // For custom categories, return as-is or from custom categories list
  return categoryKey;
}

// Get backend key for storage
export function getBackendCategoryKey(categoryKey: string): string {
  return BACKEND_CATEGORY_MAP[categoryKey] || categoryKey;
}

// Get frontend key from backend key
export function getFrontendCategoryKey(backendKey: string): string {
  const entry = Object.entries(BACKEND_CATEGORY_MAP).find(
    ([, value]) => value === backendKey
  );
  return entry ? entry[0] : backendKey;
}

// Normalize category name to handle encoding issues
export function normalizeCategoryName(category: string): string {
  if (!category) return '';
  
  // Handle common HTML entity issues
  return category
    .replace(/&amp;/g, 'and')
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ')
    .trim();
}

// Create category options for UI
export function createCategoryOptions(
  t: ReturnType<typeof import('@/hooks/i18n').useDashboardTranslations>,
  customCategories: string[] = []
) {
  const defaultOptions = DEFAULT_CATEGORIES.map((cat) => ({
    key: cat.key,
    label: getCategoryLabel(cat.key, t),
    backendKey: getBackendCategoryKey(cat.key),
    icon: cat.icon,
    isDefault: true,
  }));

  const customOptions = customCategories.map((cat) => {
    const normalizedCat = normalizeCategoryName(cat);
    return {
      key: normalizedCat,
      label: normalizedCat,
      backendKey: normalizedCat,
      icon: '📁',
      isDefault: false,
    };
  });

  return [...defaultOptions, ...customOptions];
}
