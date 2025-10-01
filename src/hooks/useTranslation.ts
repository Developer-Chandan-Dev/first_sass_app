'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export function useAppTranslations() {
  const t = useTranslations();
  const tCommon = useTranslations('common');
  const tNav = useTranslations('navigation');
  const tDashboard = useTranslations('dashboard');
  const tExpenses = useTranslations('expenses');
  const tIncome = useTranslations('income');
  const tAuth = useTranslations('auth');

  return useMemo(() => ({
    // Common translations
    common: {
      save: tCommon('save'),
      cancel: tCommon('cancel'),
      delete: tCommon('delete'),
      edit: tCommon('edit'),
      loading: tCommon('loading'),
      search: tCommon('search'),
      add: tCommon('add'),
      create: tCommon('create'),
      update: tCommon('update'),
      view: tCommon('view'),
      close: tCommon('close'),
      submit: tCommon('submit'),
      getStarted: tCommon('getStarted'),
    },
    
    // Navigation
    nav: {
      home: tNav('home'),
      about: tNav('about'),
      contact: tNav('contact'),
      services: tNav('services'),
      pricing: tNav('pricing'),
      guide: tNav('guide'),
    },
    
    // Dashboard
    dashboard: {
      title: tDashboard('title'),
      subtitle: tDashboard('subtitle'),
      expenses: tDashboard('expenses'),
      income: tDashboard('income'),
      analytics: tDashboard('analytics'),
      settings: tDashboard('settings'),
      budgets: tDashboard('budgets'),
      categories: tDashboard('categories'),
      notifications: tDashboard('notifications'),
    },
    
    // Expenses
    expenses: {
      title: tExpenses('title'),
      freeExpenses: tExpenses('freeExpenses'),
      budgetExpenses: tExpenses('budgetExpenses'),
      description: tExpenses('description'),
      category: tExpenses('category'),
      amount: tExpenses('amount'),
      date: tExpenses('date'),
      search: tExpenses('search'),
      noExpenses: tExpenses('noExpenses'),
      overview: tExpenses('overview'),
      table: tExpenses('table'),
      charts: tExpenses('charts'),
    },
    
    // Income
    income: {
      title: tIncome('title'),
      addIncome: tIncome('addIncome'),
      source: tIncome('source'),
      totalIncome: tIncome('totalIncome'),
      monthlyIncome: tIncome('monthlyIncome'),
    },
    
    // Auth
    auth: {
      login: tAuth('login'),
      register: tAuth('register'),
      logout: tAuth('logout'),
      signIn: tAuth('signIn'),
      signUp: tAuth('signUp'),
    },
    
    // Raw translator for dynamic keys
    t,
  }), [t, tCommon, tNav, tDashboard, tExpenses, tIncome, tAuth]);
}