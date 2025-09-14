import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

export const expenseSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.enum(['Food', 'Travel', 'Shopping', 'Bills', 'Others']),
  reason: z.string().min(1, 'Reason is required'),
  date: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
