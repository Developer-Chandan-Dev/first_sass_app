import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

export type UserFormData = z.infer<typeof userSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
