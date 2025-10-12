import { useDashboardTranslations } from '@/hooks/i18n';

export function useValidationMessages() {
  const { t } = useDashboardTranslations();

  return {
    // Common validation messages
    required: (field: string) => t('common.validation.required', { field }),
    email: t('auth.validation.emailInvalid'),
    minLength: (field: string, min: number) => t('common.validation.minLength', { field, min }),
    maxLength: (field: string, max: number) => t('common.validation.maxLength', { field, max }),
    positive: (field: string) => t('common.validation.positive', { field }),
    
    // Expense validation messages
    expense: {
      titleRequired: t('expenses.form.validation.titleRequired'),
      amountRequired: t('expenses.form.validation.amountRequired'),
      amountPositive: t('expenses.form.validation.amountPositive'),
      categoryRequired: t('expenses.form.validation.categoryRequired'),
      dateRequired: t('expenses.form.validation.dateRequired'),
      descriptionTooLong: t('expenses.form.validation.descriptionTooLong'),
    },
    
    // Income validation messages
    income: {
      titleRequired: t('income.form.validation.titleRequired'),
      amountRequired: t('income.form.validation.amountRequired'),
      amountPositive: t('income.form.validation.amountPositive'),
      sourceRequired: t('income.form.validation.sourceRequired'),
      dateRequired: t('income.form.validation.dateRequired'),
    },
    
    // Auth validation messages
    auth: {
      emailRequired: t('auth.validation.emailRequired'),
      emailInvalid: t('auth.validation.emailInvalid'),
      passwordRequired: t('auth.validation.passwordRequired'),
      passwordTooShort: t('auth.validation.passwordTooShort'),
      passwordsNotMatch: t('auth.validation.passwordsNotMatch'),
      firstNameRequired: t('auth.validation.firstNameRequired'),
      lastNameRequired: t('auth.validation.lastNameRequired'),
      termsRequired: t('auth.validation.termsRequired'),
    },
    
    // Contact form validation messages
    contact: {
      firstNameRequired: t('pages.contact.form.validation.firstNameRequired'),
      lastNameRequired: t('pages.contact.form.validation.lastNameRequired'),
      emailRequired: t('pages.contact.form.validation.emailRequired'),
      emailInvalid: t('pages.contact.form.validation.emailInvalid'),
      subjectRequired: t('pages.contact.form.validation.subjectRequired'),
      messageRequired: t('pages.contact.form.validation.messageRequired'),
      messageTooShort: t('pages.contact.form.validation.messageTooShort'),
    },
  };
}

// Zod schema helpers with translations
export function useTranslatedZodSchema() {
  const messages = useValidationMessages();
  
  return {
    string: () => ({
      required_error: messages.required('field'),
      invalid_type_error: 'Invalid type',
    }),
    email: () => ({
      message: messages.email,
    }),
    min: (min: number, field: string) => ({
      message: messages.minLength(field, min),
    }),
    max: (max: number, field: string) => ({
      message: messages.maxLength(field, max),
    }),
    positive: (field: string) => ({
      message: messages.positive(field),
    }),
  };
}