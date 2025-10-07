import { z } from 'zod';

// Create validation schemas with internationalized error messages
export const createExpenseSchema = (translations?: ReturnType<typeof import('@/hooks/useTranslation').useAppTranslations>) => {
  return z.object({
    amount: z.number().min(0.01, translations?.expenses?.form?.validation?.amountGreaterThanZero || 'Amount must be greater than 0'),
    category: z.string().min(1, translations?.expenses?.form?.validation?.categoryRequired || 'Category is required'),
    reason: z.string().min(1, translations?.expenses?.form?.validation?.reasonRequired || 'Reason is required'),
    date: z.string().min(1, translations?.expenses?.form?.validation?.dateRequired || 'Date is required'),
    isRecurring: z.boolean().default(false),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
    affectsBalance: z.boolean().default(false),
    incomeId: z.string().optional(),
  });
};

export const createIncomeSchema = (translations?: ReturnType<typeof import('@/hooks/useTranslation').useAppTranslations>) => {
  return z.object({
    amount: z.number().min(0.01, translations?.income?.form?.validation?.amountPositive || 'Amount must be positive'),
    source: z.string().min(1, translations?.income?.form?.validation?.sourceRequired || 'Source is required'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().min(1, 'Description is required'),
    date: z.string().min(1, translations?.income?.form?.validation?.dateRequired || 'Date is required'),
    isConnected: z.boolean().optional().default(false),
    isRecurring: z.boolean().optional().default(false),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  });
};

export const createBudgetSchema = (translations?: ReturnType<typeof import('@/hooks/useTranslation').useAppTranslations>) => {
  return z.object({
    name: z.string().min(1, translations?.expenses?.form?.validation?.titleRequired || 'Name is required'),
    amount: z.number().min(0.01, translations?.expenses?.form?.validation?.amountGreaterThanZero || 'Amount must be positive'),
    category: z.string().min(1, translations?.expenses?.form?.validation?.categoryRequired || 'Category is required'),
    description: z.string().optional(),
    startDate: z.string().min(1, translations?.expenses?.form?.validation?.dateRequired || 'Start date is required'),
    endDate: z.string().min(1, translations?.expenses?.form?.validation?.dateRequired || 'End date is required'),
    alertThreshold: z.number().min(0).max(100).optional(),
  });
};

// Type exports
export type ExpenseFormData = z.infer<ReturnType<typeof createExpenseSchema>>;
export type IncomeFormData = z.infer<ReturnType<typeof createIncomeSchema>>;
export type BudgetFormData = z.infer<ReturnType<typeof createBudgetSchema>>;