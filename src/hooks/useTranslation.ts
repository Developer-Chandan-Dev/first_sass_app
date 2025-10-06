'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

// Utility function for formatting currency
export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

// Utility function for formatting dates
export function formatDate(date: Date | string, locale = 'en-US', options?: Intl.DateTimeFormatOptions) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options || {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}

// Utility function for formatting numbers
export function formatNumber(number: number, locale = 'en-US') {
  return new Intl.NumberFormat(locale).format(number);
}

// Create a safe translator that handles missing keys
function createSafeTranslator(t: (key: string) => string) {
  return (key: string, fallback: string = '') => {
    try {
      const result = t(key);
      // If the result is the same as the key, it means the translation is missing
      if (result === key && fallback) {
        return fallback;
      }
      return result;
    } catch (error: unknown) {
      // Return fallback silently to prevent console spam
      return fallback || key;
    }
  };
}

export function useAppTranslations() {
  const t = useTranslations();
  const tCommon = useTranslations('common');
  const tNav = useTranslations('navigation');
  const tDashboard = useTranslations('dashboard');
  const tSidebar = useTranslations('sidebar');
  const tExpenses = useTranslations('expenses');
  const tIncome = useTranslations('income');
  const tAuth = useTranslations('auth');
  const tErrors = useTranslations('errors');
  const tSuccess = useTranslations('success');
  const tTable = useTranslations('table');
  const tAdmin = useTranslations('admin');
  const tLanding = useTranslations('landing');
  const tFeatures = useTranslations('features');
  const tPricing = useTranslations('pricing');
  const tPages = useTranslations('pages');
  const tFooter = useTranslations('footer');
  const tStats = useTranslations('stats');
  const tTestimonials = useTranslations('testimonials');
  const tCurrency = useTranslations('currency');
  const tDateFormat = useTranslations('dateFormat');
  const tExpenseCards = useTranslations('expenseCards');

  // Create safe translators
  const safeTCommon = createSafeTranslator(tCommon);
  const safeTNav = createSafeTranslator(tNav);
  const safeTSidebar = createSafeTranslator(tSidebar);
  const safeTDashboard = createSafeTranslator(tDashboard);
  const safeTExpenses = createSafeTranslator(tExpenses);
  const safeTIncome = createSafeTranslator(tIncome);
  const safeTAuth = createSafeTranslator(tAuth);
  const safeTErrors = createSafeTranslator(tErrors);
  const safeTSuccess = createSafeTranslator(tSuccess);
  const safeTTable = createSafeTranslator(tTable);
  const safeTAdmin = createSafeTranslator(tAdmin);
  const safeTLanding = createSafeTranslator(tLanding);
  const safeTFeatures = createSafeTranslator(tFeatures);
  const safeTPricing = createSafeTranslator(tPricing);
  const safeTPages = createSafeTranslator(tPages);
  const safeTFooter = createSafeTranslator(tFooter);
  const safeTStats = createSafeTranslator(tStats);
  const safeTTestimonials = createSafeTranslator(tTestimonials);
  const safeTCurrency = createSafeTranslator(tCurrency);
  const safeTDateFormat = createSafeTranslator(tDateFormat);
  const safeTExpenseCards = createSafeTranslator(tExpenseCards);

  return useMemo(() => ({
    // Common translations
    common: {
      dashboard: safeTCommon('dashboard', 'Dashboard'),
      expenses: safeTCommon('expenses', 'Expenses'),
      budgets: safeTCommon('budgets', 'Budgets'),
      income: safeTCommon('income', 'Income'),
      analytics: safeTCommon('analytics', 'Analytics'),
      settings: safeTCommon('settings', 'Settings'),
      categories: safeTCommon('categories', 'Categories'),
      notifications: safeTCommon('notifications', 'Notifications'),
      cards: safeTCommon('cards', 'Cards'),
      logout: safeTCommon('logout', 'Logout'),
      login: safeTCommon('login', 'Login'),
      register: safeTCommon('register', 'Register'),
      save: safeTCommon('save', 'Save'),
      cancel: safeTCommon('cancel', 'Cancel'),
      delete: safeTCommon('delete', 'Delete'),
      edit: safeTCommon('edit', 'Edit'),
      add: safeTCommon('add', 'Add'),
      create: safeTCommon('create', 'Create'),
      update: safeTCommon('update', 'Update'),
      view: safeTCommon('view', 'View'),
      search: safeTCommon('search', 'Search'),
      filter: safeTCommon('filter', 'Filter'),
      loading: safeTCommon('loading', 'Loading...'),
      noData: safeTCommon('noData', 'No data available'),
      total: safeTCommon('total', 'Total'),
      amount: safeTCommon('amount', 'Amount'),
      date: safeTCommon('date', 'Date'),
      category: safeTCommon('category', 'Category'),
      description: safeTCommon('description', 'Description'),
      actions: safeTCommon('actions', 'Actions'),
      getStarted: safeTCommon('getStarted', 'Get Started'),
      learnMore: safeTCommon('learnMore', 'Learn More'),
      viewAll: safeTCommon('viewAll', 'View All'),
      close: safeTCommon('close', 'Close'),
      submit: safeTCommon('submit', 'Submit'),
      reset: safeTCommon('reset', 'Reset'),
      confirm: safeTCommon('confirm', 'Confirm'),
      yes: safeTCommon('yes', 'Yes'),
      no: safeTCommon('no', 'No'),
      success: safeTCommon('success', 'Success'),
      error: safeTCommon('error', 'Error'),
      warning: safeTCommon('warning', 'Warning'),
      info: safeTCommon('info', 'Info'),
    },
    
    // Navigation
    nav: {
      home: safeTNav('home', 'Home'),
      about: safeTNav('about', 'About'),
      contact: safeTNav('contact', 'Contact'),
      services: safeTNav('services', 'Services'),
      pricing: safeTNav('pricing', 'Pricing'),
      guide: safeTNav('guide', 'Guide'),
    },
    
    // Sidebar
    sidebar: {
      overview: safeTSidebar('overview', 'Overview'),
      expenses: safeTSidebar('expenses', 'Expenses'),
      income: safeTSidebar('income', 'Income'),
      analytics: safeTSidebar('analytics', 'Analytics'),
      categories: safeTSidebar('categories', 'Categories'),
      budgets: safeTSidebar('budgets', 'Budgets'),
      cards: safeTSidebar('cards', 'Cards'),
      notifications: safeTSidebar('notifications', 'Notifications'),
      settings: safeTSidebar('settings', 'Settings'),
    },
    
    // Dashboard
    dashboard: {
      overview: safeTDashboard('overview', 'Dashboard Overview'),
      description: safeTDashboard('description', 'Track your financial progress and manage expenses efficiently.'),
      totalExpenses: safeTDashboard('totalExpenses', 'Total Expenses'),
      budgetUsage: safeTDashboard('budgetUsage', 'Budget Usage'),
      categories: safeTDashboard('categories', 'Categories'),
      transactions: safeTDashboard('transactions', 'Transactions'),
      recentTransactions: safeTDashboard('recentTransactions', 'Recent Transactions'),
      monthlySpending: safeTDashboard('monthlySpending', 'Monthly Spending'),
      budgetStatus: safeTDashboard('budgetStatus', 'Budget Status'),
      addExpense: safeTDashboard('addExpense', 'Add Expense'),
      addBudget: safeTDashboard('addBudget', 'Add Budget'),
      addIncome: safeTDashboard('addIncome', 'Add Income'),
      spendingTrends: safeTDashboard('spendingTrends', 'Spending Trends'),
      comingSoon: safeTDashboard('comingSoon', 'Coming Soon'),
      quickActions: safeTDashboard('quickActions', 'Quick Actions'),
      financialSummary: safeTDashboard('financialSummary', 'Financial Summary'),
      thisMonth: safeTDashboard('thisMonth', 'This Month'),
      lastMonth: safeTDashboard('lastMonth', 'Last Month'),
      thisYear: safeTDashboard('thisYear', 'This Year'),
      change: safeTDashboard('change', 'Change'),
      increase: safeTDashboard('increase', 'Increase'),
      decrease: safeTDashboard('decrease', 'Decrease'),
      noChange: safeTDashboard('noChange', 'No Change'),
      totalSpent: safeTDashboard('totalSpent', 'Total Spent'),
      averageExpense: safeTDashboard('averageExpense', 'Average Expense'),
      previousMonth: safeTDashboard('previousMonth', 'Previous Month'),
      perTransaction: safeTDashboard('perTransaction', 'per transaction'),
      vsLastMonth: safeTDashboard('vsLastMonth', 'vs last month'),
      financialCalendar: safeTDashboard('financialCalendar', 'Financial Calendar'),
      setBudgetTargets: safeTDashboard('setBudgetTargets', 'Set and track monthly budget targets'),
      advancedSpendingAnalysis: safeTDashboard('advancedSpendingAnalysis', 'Advanced spending pattern analysis'),
      neverMissPayment: safeTDashboard('neverMissPayment', 'Never miss a payment deadline'),
      planExpensesAhead: safeTDashboard('planExpensesAhead', 'Plan your expenses ahead'),
      expectedRelease: safeTDashboard('expectedRelease', 'Expected release: Next update'),
      workingOnFeatures: safeTDashboard('workingOnFeatures', "We're working on advanced features"),
      nextUpdate: safeTDashboard('nextUpdate', 'Next update'),
    },
    
    // Expenses - UPDATED to match JSON structure
    expenses: {
      title: safeTExpenses('title', 'Expense Management'),
      subTitle: safeTExpenses('subTitle', 'Choose how you want to track your expenses'),
      // Updated expenseType array access
      expenseType: [
        {
          title: safeTExpenses('expenseType.0.title', 'Free Expenses'),
          description: safeTExpenses('expenseType.0.description', 'Track your daily expenses without budget constraints'),
          features: [
            safeTExpenses('expenseType.0.features.0', 'Unlimited tracking'),
            safeTExpenses('expenseType.0.features.1', 'Category management'),
            safeTExpenses('expenseType.0.features.2', 'Analytics & reports'),
            safeTExpenses('expenseType.0.features.3', 'Export data'),
          ],
        },
        {
          title: safeTExpenses('expenseType.1.title', 'Budget Expenses'),
          description: safeTExpenses('expenseType.1.description', 'Manage expenses within predefined budget limits.'),
          features: [
            safeTExpenses('expenseType.1.features.0', 'Budget limits'),
            safeTExpenses('expenseType.1.features.1', 'Spending alerts'),
            safeTExpenses('expenseType.1.features.2', 'Goal tracking'),
            safeTExpenses('expenseType.1.features.3', 'Budget analysis'),
          ],
        }
      ],
      // Updated expenseCards structure to match JSON
      expenseCards: [
        {
          totalExpenses: safeTExpenses('expenseCards.0.totalExpenses', 'Total Expenses'),
          vsLastMonth: safeTExpenses('expenseCards.0.vsLastMonth', 'vs last month'),
        },
        {
          thisMonth: safeTExpenses('expenseCards.1.thisMonth', 'This Month'),
          currentMonth: safeTExpenses('expenseCards.1.currentMonth', 'Current Month'),
        },
        {
          categories: safeTExpenses('expenseCards.2.categories', 'Categories'),
          activeCategories: safeTExpenses('expenseCards.2.activeCategories', 'active categories'),
        },
        {
          aveDay: safeTExpenses('expenseCards.3.aveDay', 'Avg/Day'),
          last30days: safeTExpenses('expenseCards.3.last30days', 'last 30 days'),
        }
      ],
      addExpense: safeTExpenses('addExpense', 'Add Expense'),
      editExpense: safeTExpenses('editExpense', 'Edit Expense'),
      deleteExpense: safeTExpenses('deleteExpense', 'Delete Expense'),
      expenseDetails: safeTExpenses('expenseDetails', 'Expense Details'),
      noExpenses: safeTExpenses('noExpenses', 'No expenses found'),
      searchPlaceholder: safeTExpenses('searchPlaceholder', 'Search expenses...'),
      filterByCategory: safeTExpenses('filterByCategory', 'Filter by category'),
      filterByDate: safeTExpenses('filterByDate', 'Filter by date'),
      allCategories: safeTExpenses('allCategories', 'All Categories'),
      today: safeTExpenses('today', 'Today'),
      thisWeek: safeTExpenses('thisWeek', 'This Week'),
      thisMonth: safeTExpenses('thisMonth', 'This Month'),
      allTime: safeTExpenses('allTime', 'All Time'),
      customRange: safeTExpenses('customRange', 'Custom Range'),
      from: safeTExpenses('from', 'From'),
      to: safeTExpenses('to', 'To'),
      apply: safeTExpenses('apply', 'Apply'),
      clear: safeTExpenses('clear', 'Clear'),
      deleteConfirm: safeTExpenses('deleteConfirm', 'Are you sure you want to delete this expense?'),
      deleteSuccess: safeTExpenses('deleteSuccess', 'Expense deleted successfully!'),
      addSuccess: safeTExpenses('addSuccess', 'Expense added successfully!'),
      updateSuccess: safeTExpenses('updateSuccess', 'Expense updated successfully!'),
      recurring: safeTExpenses('recurring', 'Recurring'),
      frequency: safeTExpenses('frequency', 'Frequency'),
      budget: safeTExpenses('budget', 'Budget'),
      overview: safeTExpenses('overview', 'Overview'),
      table: safeTExpenses('table', 'Table'),
      charts: safeTExpenses('charts', 'Charts'),
      totalExpenses: safeTExpenses('totalExpenses', 'Total Expenses'),
      averageExpense: safeTExpenses('averageExpense', 'Average Expense'),
      highestExpense: safeTExpenses('highestExpense', 'Highest Expense'),
      categoryBreakdown: safeTExpenses('categoryBreakdown', 'Category Breakdown'),
      monthlyTrend: safeTExpenses('monthlyTrend', 'Monthly Trend'),
      recentExpenses: safeTExpenses('recentExpenses', 'Recent Expenses'),
      bulkActions: safeTExpenses('bulkActions', 'Bulk Actions'),
      selectAll: safeTExpenses('selectAll', 'Select All'),
      deselectAll: safeTExpenses('deselectAll', 'Deselect All'),
      deleteSelected: safeTExpenses('deleteSelected', 'Delete Selected'),
      exportData: safeTExpenses('exportData', 'Export Data'),
      importData: safeTExpenses('importData', 'Import Data'),
      getStarted: safeTExpenses('getStarted', 'Get Started'),
      viewAll: safeTExpenses('viewAll', 'View All'),
      freeExpenses: safeTExpenses('freeExpenses', 'Free Expenses'),
      budgetExpenses: safeTExpenses('budgetExpenses', 'Budget Expenses'),
      trackAndManageDailyExpenses: safeTExpenses('trackAndManageDailyExpenses', 'Track and manage your daily expenses'),
      manageExpensesWithinBudgetLimits: safeTExpenses('manageExpensesWithinBudgetLimits', 'Manage expenses within predefined budget limits'),
      backToExpenses: safeTExpenses('backToExpenses', 'Back to Expenses'),
      addBudgetExpense: safeTExpenses('addBudgetExpense', 'Add Budget Expense'),
      expensesByCategory: safeTExpenses('expensesByCategory', 'Expenses by Category'),
      recentActivity: safeTExpenses('recentActivity', 'Recent Activity'),
      budgets: safeTExpenses('budgets', 'Budgets'),
      analytics: safeTExpenses('analytics', 'Analytics'),
      searchExpenses: safeTExpenses('searchExpenses', 'Search expenses...'),
      noExpensesFound: safeTExpenses('noExpensesFound', 'No expenses found'),
      exportSelected: safeTExpenses('exportSelected', 'Export ({count})'),
      exportSelectedCSV: safeTExpenses('exportSelectedCSV', 'Export Selected CSV'),
      exportSelectedPDF: safeTExpenses('exportSelectedPDF', 'Export Selected PDF'),
      exportAll: safeTExpenses('exportAll', 'Export All'),
      exportAllCSV: safeTExpenses('exportAllCSV', 'Export All CSV'),
      exportAllPDF: safeTExpenses('exportAllPDF', 'Export All PDF'),
      deleteSelectedBulk: safeTExpenses('deleteSelected', 'Delete ({count})'),
      expenseDate: safeTExpenses('date', 'Date'),
      expenseDescription: safeTExpenses('description', 'Description'),
      expenseBudget: safeTExpenses('budget', 'Budget'),
      expenseRecurring: safeTExpenses('recurring', 'Recurring'),
      expenseAmount: safeTExpenses('amount', 'Amount'),
      oneTime: safeTExpenses('oneTime', 'One-time'),
      editExpenseAction: safeTExpenses('edit', 'Edit'),
      deleteExpenseAction: safeTExpenses('delete', 'Delete'),
      showing: safeTExpenses('showing', 'Showing'),
      toPage: safeTExpenses('to', 'to'),
      ofTotal: safeTExpenses('of', 'of'),
      entries: safeTExpenses('entries', 'entries'),
      perPage: safeTExpenses('perPage', 'per page'),
      noDataToExport: safeTExpenses('noDataToExport', 'No data to export'),
      expensesExportedToCSV: safeTExpenses('expensesExportedToCSV', '{count} expenses exported to CSV!'),
      areYouSureDeleteExpense: safeTExpenses('areYouSureDeleteExpense', 'Are you sure you want to delete this expense?'),
      areYouSureDeleteExpenses: safeTExpenses('areYouSureDeleteExpenses', 'Are you sure you want to delete {count} expenses?'),
      expensesDeletedSuccessfully: safeTExpenses('expensesDeletedSuccessfully', '{count} expenses deleted successfully!'),
      failedToDeleteExpenses: safeTExpenses('failedToDeleteExpenses', 'Failed to delete expenses'),
      totalBudget: safeTExpenses('totalBudget', 'Total Budget'),
      budgetSpent: safeTExpenses('budgetSpent', 'Budget Spent'),
      remaining: safeTExpenses('remaining', 'Remaining'),
      budgetExpensesCount: safeTExpenses('budgetExpensesCount', 'Budget Expenses'),
      spent: safeTExpenses('spent', 'spent'),
      activeBudgets: safeTExpenses('activeBudgets', 'active budgets'),
      available: safeTExpenses('available', 'Available'),
      exceeded: safeTExpenses('exceeded', 'Exceeded'),
      budgetLeft: safeTExpenses('budgetLeft', 'budget left'),
      lastMonth: safeTExpenses('lastMonth', 'Last Month'),
      // NEWLY ADDED FIELDS
      addNewExpense: safeTExpenses('addNewExpense', 'Add New Expense'),
      reason: safeTExpenses('reason', 'Reason'),
      reasonPlaceholder: safeTExpenses('reasonPlaceholder', 'What was this expense for?'),
      selectCategory: safeTExpenses('selectCategory', 'Select category'),
      enterCustomCategory: safeTExpenses('enterCustomCategory', 'Enter custom category'),
      recurringExpense: safeTExpenses('recurringExpense', 'Recurring Expense'),
      regularExpense: safeTExpenses('regularExpense', 'Regular expense'),
      reduceFromBalance: safeTExpenses('reduceFromBalance', 'Reduce from Balance'),
      deductFromConnectedIncome: safeTExpenses('deductFromConnectedIncome', 'Deduct from connected income'),
      selectIncomeSource: safeTExpenses('selectIncomeSource', 'Select Income Source'),
      chooseIncomeToReduceFrom: safeTExpenses('chooseIncomeToReduceFrom', 'Choose income to reduce from'),
      selectFrequency: safeTExpenses('selectFrequency', 'Select frequency'),
      adding: safeTExpenses('adding', 'Adding...'),
      advancedFilters: safeTExpenses('advancedFilters', 'Advanced Filters'),
      refresh: safeTExpenses('refresh', 'Refresh'),
      allTypes: safeTExpenses('allTypes', 'All Types'),
      allBudgets: safeTExpenses('allBudgets', 'All Budgets'),
      startDate: safeTExpenses('startDate', 'Start Date'),
      endDate: safeTExpenses('endDate', 'End Date'),
      last7Days: safeTExpenses('last7Days', 'Last 7 Days'),
      last30Days: safeTExpenses('last30Days', 'Last 30 Days'),
      recentTransactions: safeTExpenses('recentTransactions', 'Recent Transactions'),
      noRecentTransactions: safeTExpenses('noRecentTransactions', 'No recent transactions'),
      justNow: safeTExpenses('justNow', 'Just now'),
      hoursAgo: safeTExpenses('hoursAgo', 'hours ago'),
      dayAgo: safeTExpenses('dayAgo', '1 day ago'),
      daysAgo: safeTExpenses('daysAgo', 'days ago'),
      frequencies: {
        daily: safeTExpenses('frequencies.daily', 'Daily'),
        weekly: safeTExpenses('frequencies.weekly', 'Weekly'),
        monthly: safeTExpenses('frequencies.monthly', 'Monthly'),
        yearly: safeTExpenses('frequencies.yearly', 'Yearly'),
      },
      // Expense categories
      categories: {
        food: safeTExpenses('categories.food', 'Food & Dining'),
        transport: safeTExpenses('categories.transport', 'Transportation'),
        shopping: safeTExpenses('categories.shopping', 'Shopping'),
        entertainment: safeTExpenses('categories.entertainment', 'Entertainment'),
        bills: safeTExpenses('categories.bills', 'Bills & Utilities'),
        healthcare: safeTExpenses('categories.healthcare', 'Healthcare'),
        education: safeTExpenses('categories.education', 'Education'),
        travel: safeTExpenses('categories.travel', 'Travel'),
        other: safeTExpenses('categories.other', 'Other'),
      },
      // Form fields
      form: {
        title: safeTExpenses('form.title', 'Title'),
        titlePlaceholder: safeTExpenses('form.titlePlaceholder', 'Enter expense title'),
        amount: safeTExpenses('form.amount', 'Amount'),
        amountPlaceholder: safeTExpenses('form.amountPlaceholder', '0.00'),
        category: safeTExpenses('form.category', 'Category'),
        selectCategory: safeTExpenses('form.selectCategory', 'Select a category'),
        date: safeTExpenses('form.date', 'Date'),
        description: safeTExpenses('form.description', 'Description'),
        descriptionPlaceholder: safeTExpenses('form.descriptionPlaceholder', 'Enter expense description (optional)'),
        receipt: safeTExpenses('form.receipt', 'Receipt'),
        uploadReceipt: safeTExpenses('form.uploadReceipt', 'Upload Receipt'),
        removeReceipt: safeTExpenses('form.removeReceipt', 'Remove Receipt'),
        validation: {
          titleRequired: safeTExpenses('form.validation.titleRequired', 'Title is required'),
          amountRequired: safeTExpenses('form.validation.amountRequired', 'Amount is required'),
          amountPositive: safeTExpenses('form.validation.amountPositive', 'Amount must be positive'),
          categoryRequired: safeTExpenses('form.validation.categoryRequired', 'Category is required'),
          dateRequired: safeTExpenses('form.validation.dateRequired', 'Date is required'),
          descriptionTooLong: safeTExpenses('form.validation.descriptionTooLong', 'Description is too long'),
          reasonRequired: safeTExpenses('form.validation.reasonRequired', 'Reason is required'),
          amountGreaterThanZero: safeTExpenses('form.validation.amountGreaterThanZero', 'Amount must be greater than 0'),
        },
      },
    },
    
    // Income - UPDATED with new fields
    income: {
      title: safeTIncome('title', 'Income Management'),
      addIncome: safeTIncome('addIncome', 'Add Income'),
      editIncome: safeTIncome('editIncome', 'Edit Income'),
      deleteIncome: safeTIncome('deleteIncome', 'Delete Income'),
      source: safeTIncome('source', 'Source'),
      totalIncome: safeTIncome('totalIncome', 'Total Income'),
      monthlyIncome: safeTIncome('monthlyIncome', 'Monthly Income'),
      connected: safeTIncome('connected', 'Connected'),
      balance: safeTIncome('balance', 'Balance'),
      noIncome: safeTIncome('noIncome', 'No income records found'),
      searchPlaceholder: safeTIncome('searchPlaceholder', 'Search income...'),
      deleteConfirm: safeTIncome('deleteConfirm', 'Are you sure you want to delete this income record?'),
      deleteSuccess: safeTIncome('deleteSuccess', 'Income deleted successfully!'),
      addSuccess: safeTIncome('addSuccess', 'Income added successfully!'),
      updateSuccess: safeTIncome('updateSuccess', 'Income updated successfully!'),
      // NEWLY ADDED FIELDS
      addIncomeSource: safeTIncome('addIncomeSource', 'Add Income Source'),
      connectToBalance: safeTIncome('connectToBalance', 'Connect to Balance'),
      expensesWillReduceFromThisIncome: safeTIncome('expensesWillReduceFromThisIncome', 'Expenses will reduce from this income'),
      recurringIncome: safeTIncome('recurringIncome', 'Recurring Income'),
      regularIncomeSource: safeTIncome('regularIncomeSource', 'Regular income source'),
      selectIncomeCategory: safeTIncome('selectIncomeCategory', 'Select income category'),
      briefDescriptionOfIncomeSource: safeTIncome('briefDescriptionOfIncomeSource', 'Brief description of income source'),
      addingIncome: safeTIncome('addingIncome', 'Adding...'),
      incomeManagement: safeTIncome('incomeManagement', 'Income Management'),
      trackAndManageIncome: safeTIncome('trackAndManageIncome', 'Track and manage your income sources'),
      incomeOverview: safeTIncome('overview', 'Overview'),
      incomeTable: safeTIncome('table', 'Table'),
      incomeCharts: safeTIncome('charts', 'Charts'),
      sources: {
        salary: safeTIncome('sources.salary', 'Salary'),
        freelancing: safeTIncome('sources.freelancing', 'Freelancing'),
        freelance: safeTIncome('sources.freelance', 'Freelance'),
        business: safeTIncome('sources.business', 'Business'),
        investment: safeTIncome('sources.investment', 'Investment'),
        rental: safeTIncome('sources.rental', 'Rental'),
        commission: safeTIncome('sources.commission', 'Commission'),
        bonus: safeTIncome('sources.bonus', 'Bonus'),
        other: safeTIncome('sources.other', 'Other'),
      },
      form: {
        title: safeTIncome('form.title', 'Title'),
        titlePlaceholder: safeTIncome('form.titlePlaceholder', 'Enter income title'),
        amount: safeTIncome('form.amount', 'Amount'),
        amountPlaceholder: safeTIncome('form.amountPlaceholder', '0.00'),
        source: safeTIncome('form.source', 'Source'),
        selectSource: safeTIncome('form.selectSource', 'Select income source'),
        incomeDate: safeTIncome('form.date', 'Date'),
        incomeDescription: safeTIncome('form.description', 'Description'),
        descriptionPlaceholder: safeTIncome('form.descriptionPlaceholder', 'Enter income description (optional)'),
        validation: {
          titleRequired: safeTIncome('form.validation.titleRequired', 'Title is required'),
          amountRequired: safeTIncome('form.validation.amountRequired', 'Amount is required'),
          amountPositive: safeTIncome('form.validation.amountPositive', 'Amount must be positive'),
          sourceRequired: safeTIncome('form.validation.sourceRequired', 'Source is required'),
          dateRequired: safeTIncome('form.validation.dateRequired', 'Date is required'),
        },
      },
    },
    
    // Auth
    auth: {
      login: safeTAuth('login', 'Login'),
      register: safeTAuth('register', 'Register'),
      logout: safeTAuth('logout', 'Logout'),
      signIn: safeTAuth('signIn', 'Sign In'),
      signUp: safeTAuth('signUp', 'Sign Up'),
      welcome: safeTAuth('welcome', 'Welcome'),
      welcomeBack: safeTAuth('welcomeBack', 'Welcome back'),
      createAccount: safeTAuth('createAccount', 'Create your account'),
      forgotPassword: safeTAuth('forgotPassword', 'Forgot password?'),
      rememberMe: safeTAuth('rememberMe', 'Remember me'),
      alreadyHaveAccount: safeTAuth('alreadyHaveAccount', 'Already have an account?'),
      dontHaveAccount: safeTAuth('dontHaveAccount', "Don't have an account?"),
      signInWith: safeTAuth('signInWith', 'Sign in with'),
      signUpWith: safeTAuth('signUpWith', 'Sign up with'),
      orContinueWith: safeTAuth('orContinueWith', 'Or continue with'),
      email: safeTAuth('email', 'Email'),
      password: safeTAuth('password', 'Password'),
      confirmPassword: safeTAuth('confirmPassword', 'Confirm Password'),
      firstName: safeTAuth('firstName', 'First Name'),
      lastName: safeTAuth('lastName', 'Last Name'),
      agreeToTerms: safeTAuth('agreeToTerms', 'I agree to the Terms of Service and Privacy Policy'),
      validation: {
        emailRequired: safeTAuth('validation.emailRequired', 'Email is required'),
        emailInvalid: safeTAuth('validation.emailInvalid', 'Please enter a valid email'),
        passwordRequired: safeTAuth('validation.passwordRequired', 'Password is required'),
        passwordTooShort: safeTAuth('validation.passwordTooShort', 'Password must be at least 8 characters'),
        passwordsNotMatch: safeTAuth('validation.passwordsNotMatch', 'Passwords do not match'),
        firstNameRequired: safeTAuth('validation.firstNameRequired', 'First name is required'),
        lastNameRequired: safeTAuth('validation.lastNameRequired', 'Last name is required'),
        termsRequired: safeTAuth('validation.termsRequired', 'You must agree to the terms'),
      },
    },
    
    // Errors
    errors: {
      generic: safeTErrors('generic', 'Something went wrong. Please try again.'),
      network: safeTErrors('network', 'Network error. Please check your connection.'),
      unauthorized: safeTErrors('unauthorized', 'You are not authorized to perform this action.'),
      forbidden: safeTErrors('forbidden', 'Access denied.'),
      notFound: safeTErrors('notFound', 'The requested resource was not found.'),
      validation: safeTErrors('validation', 'Please check your input and try again.'),
      server: safeTErrors('server', 'Server error. Please try again later.'),
      timeout: safeTErrors('timeout', 'Request timed out. Please try again.'),
    },
    
    // Success messages
    success: {
      saved: safeTSuccess('saved', 'Saved successfully!'),
      updated: safeTSuccess('updated', 'Updated successfully!'),
      deleted: safeTSuccess('deleted', 'Deleted successfully!'),
      created: safeTSuccess('created', 'Created successfully!'),
      uploaded: safeTSuccess('uploaded', 'Uploaded successfully!'),
      sent: safeTSuccess('sent', 'Sent successfully!'),
    },
    
    // Table
    table: {
      noResults: safeTTable('noResults', 'No results found'),
      loading: safeTTable('loading', 'Loading...'),
      error: safeTTable('error', 'Error loading data'),
      retry: safeTTable('retry', 'Retry'),
      rowsPerPage: safeTTable('rowsPerPage', 'Rows per page'),
      page: safeTTable('page', 'Page'),
      of: safeTTable('of', 'of'),
      previous: safeTTable('previous', 'Previous'),
      next: safeTTable('next', 'Next'),
      first: safeTTable('first', 'First'),
      last: safeTTable('last', 'Last'),
      showing: safeTTable('showing', 'Showing'),
      entries: safeTTable('entries', 'entries'),
    },
    
    // Admin
    admin: {
      users: safeTAdmin('users', 'Users'),
      plans: safeTAdmin('plans', 'Plans'),
      revenue: safeTAdmin('revenue', 'Revenue'),
      userManagement: safeTAdmin('userManagement', 'User Management'),
      platformSettings: safeTAdmin('platformSettings', 'Platform Settings'),
      dashboard: safeTAdmin('dashboard', 'Admin Dashboard'),
      analytics: safeTAdmin('analytics', 'Analytics'),
      reports: safeTAdmin('reports', 'Reports'),
      settings: safeTAdmin('settings', 'Settings'),
      totalUsers: safeTAdmin('totalUsers', 'Total Users'),
      activeUsers: safeTAdmin('activeUsers', 'Active Users'),
      growthRate: safeTAdmin('growthRate', 'Growth Rate'),
      activePlans: safeTAdmin('activePlans', 'Active Plans'),
      fromLastMonth: safeTAdmin('fromLastMonth', 'from last month'),
    },
    
    // Landing
    landing: {
      title: safeTLanding('title', 'TrackWise'),
      subtitle: safeTLanding('subtitle', 'The Future of Expense Tracking'),
      description: safeTLanding('description', 'Take control of your finances with intelligent expense tracking and budget management. Get insights, set budgets, and achieve your financial goals with TrackWise.'),
      aiPowered: safeTLanding('aiPowered', 'AI-Powered Financial Intelligence'),
      startTrial: safeTLanding('startTrial', 'Start Free Trial'),
      goToDashboard: safeTLanding('goToDashboard', 'Go to Dashboard'),
      readGuide: safeTLanding('readGuide', 'Read Guide'),
      features: safeTLanding('features', 'Features'),
      pricing: safeTLanding('pricing', 'Pricing'),
      testimonials: safeTLanding('testimonials', 'Testimonials'),
      noCreditCard: safeTLanding('noCreditCard', 'No credit card required'),
      freeTrial: safeTLanding('freeTrial', '14-day free trial'),
      cancelAnytime: safeTLanding('cancelAnytime', 'Cancel anytime'),
      intelligentFinancial: safeTLanding('intelligentFinancial', 'Intelligent Financial'),
      management: safeTLanding('management', 'Management'),
      nextGeneration: safeTLanding('nextGeneration', 'Experience the next generation of expense tracking with AI-driven insights and automation'),
      chooseYour: safeTLanding('chooseYour', 'Choose Your'),
      plan: safeTLanding('plan', 'Plan'),
      flexiblePricing: safeTLanding('flexiblePricing', 'Flexible pricing for individuals and teams'),
      lovedBy: safeTLanding('lovedBy', 'Loved by'),
      thousands: safeTLanding('thousands', 'Thousands'),
      readyToTransform: safeTLanding('readyToTransform', 'Ready to Transform Your'),
      finances: safeTLanding('finances', 'Finances?'),
      joinMillions: safeTLanding('joinMillions', 'Join millions of users who have revolutionized their financial management with AI-powered insights.'),
      mostPopular: safeTLanding('mostPopular', 'Most Popular'),
      forever: safeTLanding('forever', 'forever'),
      perMonth: safeTLanding('perMonth', 'per month'),
    },
    
    // Features
    features: {
      aiInsights: {
        title: safeTFeatures('aiInsights.title', 'AI-Powered Insights'),
        description: safeTFeatures('aiInsights.description', 'Machine learning algorithms analyze your spending patterns and provide personalized recommendations'),
      },
      predictiveAnalytics: {
        title: safeTFeatures('predictiveAnalytics.title', 'Predictive Analytics'),
        description: safeTFeatures('predictiveAnalytics.description', 'Forecast future expenses and identify potential savings opportunities before they happen'),
      },
      smartCategorization: {
        title: safeTFeatures('smartCategorization.title', 'Smart Categorization'),
        description: safeTFeatures('smartCategorization.description', 'Automatic expense categorization with 99% accuracy using advanced pattern recognition'),
      },
      bankSecurity: {
        title: safeTFeatures('bankSecurity.title', 'Bank-Level Security'),
        description: safeTFeatures('bankSecurity.description', 'Enterprise-grade encryption and security protocols protect your financial data'),
      },
      mobileFirst: {
        title: safeTFeatures('mobileFirst.title', 'Mobile-First Design'),
        description: safeTFeatures('mobileFirst.description', 'Seamless experience across all devices with real-time synchronization'),
      },
      globalCurrency: {
        title: safeTFeatures('globalCurrency.title', 'Global Currency Support'),
        description: safeTFeatures('globalCurrency.description', 'Track expenses in 150+ currencies with real-time exchange rates'),
      },
    },
    
    // Stats
    stats: {
      activeUsers: safeTStats('activeUsers', 'Active Users'),
      trackedExpenses: safeTStats('trackedExpenses', 'Tracked Expenses'),
      uptime: safeTStats('uptime', 'Uptime'),
      countries: safeTStats('countries', 'Countries'),
    },
    
    // Pricing
    pricing: {
      monthly: safeTPricing('monthly', 'Monthly'),
      yearly: safeTPricing('yearly', 'Yearly'),
      save: safeTPricing('save', 'Save'),
      mostPopular: safeTPricing('mostPopular', 'Most Popular'),
      getStarted: safeTPricing('getStarted', 'Get Started'),
      currentPlan: safeTPricing('currentPlan', 'Current Plan'),
      upgrade: safeTPricing('upgrade', 'Upgrade'),
      downgrade: safeTPricing('downgrade', 'Downgrade'),
      plans: {
        free: {
          name: safeTPricing('plans.free.name', 'Free'),
          features: [
            safeTPricing('plans.free.features.0', 'Basic expense tracking'),
            safeTPricing('plans.free.features.1', '5 categories'),
            safeTPricing('plans.free.features.2', 'Mobile app'),
            safeTPricing('plans.free.features.3', 'Email support'),
          ],
        },
        pro: {
          name: safeTPricing('plans.pro.name', 'Pro'),
          features: [
            safeTPricing('plans.pro.features.0', 'Unlimited tracking'),
            safeTPricing('plans.pro.features.1', 'AI insights'),
            safeTPricing('plans.pro.features.2', 'Advanced analytics'),
            safeTPricing('plans.pro.features.3', 'Priority support'),
          ],
        },
        premium: {
          name: safeTPricing('plans.premium.name', 'Premium'),
          features: [
            safeTPricing('plans.premium.features.0', 'Team collaboration'),
            safeTPricing('plans.premium.features.1', 'Custom categories'),
            safeTPricing('plans.premium.features.2', 'API access'),
            safeTPricing('plans.premium.features.3', 'White-label options'),
          ],
        },
        ultra: {
          name: safeTPricing('plans.ultra.name', 'Ultra'),
          features: [
            safeTPricing('plans.ultra.features.0', 'Enterprise features'),
            safeTPricing('plans.ultra.features.1', 'Dedicated support'),
            safeTPricing('plans.ultra.features.2', 'Custom integrations'),
            safeTPricing('plans.ultra.features.3', 'SLA guarantee'),
          ],
        },
      },
      faq: {
        title: safeTPricing('faq.title', 'Frequently Asked Questions'),
        changePlans: {
          question: safeTPricing('faq.changePlans.question', 'Can I change plans anytime?'),
          answer: safeTPricing('faq.changePlans.answer', 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'),
        },
        freeTrial: {
          question: safeTPricing('faq.freeTrial.question', 'Is there a free trial?'),
          answer: safeTPricing('faq.freeTrial.answer', 'All paid plans come with a 14-day free trial. No credit card required to start.'),
        },
        payment: {
          question: safeTPricing('faq.payment.question', 'What payment methods do you accept?'),
          answer: safeTPricing('faq.payment.answer', 'We accept all major credit cards, PayPal, and bank transfers for enterprise plans.'),
        },
        dataPrivacy: {
          question: safeTPricing('faq.dataPrivacy.question', 'How is my data protected?'),
          answer: safeTPricing('faq.dataPrivacy.answer', 'We use bank-level encryption and never share your personal financial data with third parties.'),
        },
        support: {
          question: safeTPricing('faq.support.question', 'What support do you offer?'),
          answer: safeTPricing('faq.support.answer', 'We provide 24/7 email support for all plans, with priority support for Pro and above.'),
        },
      },
    },
    
    // Testimonials
    testimonials: {
      sarah: {
        name: safeTTestimonials('sarah.name', 'Sarah Chen'),
        role: safeTTestimonials('sarah.role', 'Startup Founder'),
        content: safeTTestimonials('sarah.content', "TrackWise's AI insights helped me reduce business expenses by 30%. The predictive analytics are game-changing."),
      },
      marcus: {
        name: safeTTestimonials('marcus.name', 'Marcus Johnson'),
        role: safeTTestimonials('marcus.role', 'Freelancer'),
        content: safeTTestimonials('marcus.content', 'Finally, an expense tracker that understands my workflow. The automation saves me hours every week.'),
      },
      emily: {
        name: safeTTestimonials('emily.name', 'Emily Rodriguez'),
        role: safeTTestimonials('emily.role', 'Finance Manager'),
        content: safeTTestimonials('emily.content', "The team collaboration features are incredible. We've streamlined our entire expense approval process."),
      },
    },
    
    // Currency
    currency: {
      usd: safeTCurrency('usd', 'USD'),
      eur: safeTCurrency('eur', 'EUR'),
      gbp: safeTCurrency('gbp', 'GBP'),
      inr: safeTCurrency('inr', 'INR'),
      jpy: safeTCurrency('jpy', 'JPY'),
      cad: safeTCurrency('cad', 'CAD'),
      aud: safeTCurrency('aud', 'AUD'),
    },
    
    // Date Format
    dateFormat: {
      short: safeTDateFormat('short', 'MM/dd/yyyy'),
      long: safeTDateFormat('long', 'MMMM d, yyyy'),
      time: safeTDateFormat('time', 'h:mm a'),
      dateTime: safeTDateFormat('dateTime', 'MM/dd/yyyy h:mm a'),
    },
    
    // Pages
    pages: {
      analytics: {
        title: safeTPages('analytics.title', 'Analytics'),
        description: safeTPages('analytics.description', 'Detailed insights and reports for your expenses'),
        comingSoon: safeTPages('analytics.comingSoon', 'Analytics Coming Soon'),
        workingOnFeatures: safeTPages('analytics.workingOnFeatures', "We're working on advanced analytics features including expense trends, category insights, and detailed reports."),
      },
      budgets: {
        title: safeTPages('budgets.title', 'Budgets'),
        description: safeTPages('budgets.description', 'Detailed insights and reports for your expenses'),
        comingSoon: safeTPages('budgets.comingSoon', 'Budgets Coming Soon'),
        workingOnFeatures: safeTPages('budgets.workingOnFeatures', "We're working on advanced budgets features including expense trends, category insights, and detailed reports."),
      },
      settings: {
        title: safeTPages('settings.title', 'Settings'),
        description: safeTPages('settings.description', 'Detailed insights and reports for your expenses'),
        comingSoon: safeTPages('settings.comingSoon', 'Settings Coming Soon'),
        workingOnFeatures: safeTPages('settings.workingOnFeatures', "We're working on advanced settings features including expense trends, category insights, and detailed reports."),
      },
      categories: {
        title: safeTPages('categories.title', 'Categories'),
        description: safeTPages('categories.description', 'Manage your expense categories'),
        comingSoon: safeTPages('categories.comingSoon', 'Categories Coming Soon'),
      },
      cards: {
        title: safeTPages('cards.title', 'Cards'),
        description: safeTPages('cards.description', 'Manage your payment cards'),
        comingSoon: safeTPages('cards.comingSoon', 'Cards Coming Soon'),
      },
      notifications: {
        title: safeTPages('notifications.title', 'Notifications'),
        description: safeTPages('notifications.description', 'Manage your notifications'),
        comingSoon: safeTPages('notifications.comingSoon', 'Notifications Coming Soon'),
      },
      about: {
        badge: safeTPages('about.badge', 'About Us'),
        title: safeTPages('about.title', 'About'),
        subtitle: safeTPages('about.subtitle', "We're on a mission to make financial management accessible, intelligent, and effortless for everyone."),
        stats: {
          users: { 
            title: safeTPages('about.stats.users.title', '1M+ Users'), 
            desc: safeTPages('about.stats.users.desc', 'Trust our platform') 
          },
          ai: { 
            title: safeTPages('about.stats.ai.title', 'AI-Powered'), 
            desc: safeTPages('about.stats.ai.desc', 'Smart insights') 
          },
          award: { 
            title: safeTPages('about.stats.award.title', 'Award Winning'), 
            desc: safeTPages('about.stats.award.desc', 'Industry recognition') 
          },
          global: { 
            title: safeTPages('about.stats.global.title', 'Global Reach'), 
            desc: safeTPages('about.stats.global.desc', '150+ countries') 
          },
        },
        story: {
          title: safeTPages('about.story.title', 'Our Story'),
          paragraph1: safeTPages('about.story.paragraph1', "Founded with a vision to democratize financial management, TrackWise emerged from the need for simple yet powerful expense tracking tools. We recognized that managing personal and business finances shouldn't require complex software or financial expertise."),
          paragraph2: safeTPages('about.story.paragraph2', "Today, TrackWise serves users worldwide with intelligent expense tracking and budget management features. Our platform helps users gain control over their finances through smart categorization, budget alerts, and insightful analytics."),
          paragraph3: safeTPages('about.story.paragraph3', "We believe that everyone deserves access to sophisticated financial management tools. That's why we've built TrackWise to be both powerful and intuitive, helping you make better financial decisions every day."),
        },
      },
      contact: {
        badge: safeTPages('contact.badge', 'Contact Us'),
        title: safeTPages('contact.title', 'Get in'),
        titleHighlight: safeTPages('contact.titleHighlight', 'Touch'),
        subtitle: safeTPages('contact.subtitle', "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."),
        info: {
          title: safeTPages('contact.info.title', 'Contact Information'),
          email: safeTPages('contact.info.email', 'Email'),
          phone: safeTPages('contact.info.phone', 'Phone'),
          address: safeTPages('contact.info.address', 'Address'),
          addressValue: safeTPages('contact.info.addressValue', '123 Tech Street, San Francisco, CA 94105'),
          hours: safeTPages('contact.info.hours', 'Hours'),
          hoursValue: safeTPages('contact.info.hoursValue', 'Mon-Fri 9AM-6PM PST'),
        },
        form: {
          title: safeTPages('contact.form.title', 'Send us a Message'),
          firstName: safeTPages('contact.form.firstName', 'First Name'),
          lastName: safeTPages('contact.form.lastName', 'Last Name'),
          email: safeTPages('contact.form.email', 'Email'),
          subject: safeTPages('contact.form.subject', 'Subject'),
          message: safeTPages('contact.form.message', 'Your message...'),
          send: safeTPages('contact.form.send', 'Send Message'),
          sending: safeTPages('contact.form.sending', 'Sending...'),
          sent: safeTPages('contact.form.sent', 'Message sent successfully!'),
          error: safeTPages('contact.form.error', 'Failed to send message. Please try again.'),
          validation: {
            firstNameRequired: safeTPages('contact.form.validation.firstNameRequired', 'First name is required'),
            lastNameRequired: safeTPages('contact.form.validation.lastNameRequired', 'Last name is required'),
            emailRequired: safeTPages('contact.form.validation.emailRequired', 'Email is required'),
            emailInvalid: safeTPages('contact.form.validation.emailInvalid', 'Please enter a valid email'),
            subjectRequired: safeTPages('contact.form.validation.subjectRequired', 'Subject is required'),
            messageRequired: safeTPages('contact.form.validation.messageRequired', 'Message is required'),
            messageTooShort: safeTPages('contact.form.validation.messageTooShort', 'Message must be at least 10 characters'),
          },
        },
      },
      services: {
        badge: safeTPages('services.badge', 'Our Services'),
        title: safeTPages('services.title', 'Comprehensive'),
        titleHighlight: safeTPages('services.titleHighlight', 'Financial Solutions'),
        subtitle: safeTPages('services.subtitle', 'From AI-powered insights to enterprise integrations, we provide everything you need to master your finances.'),
        services: {
          expenseTracking: {
            title: safeTPages('services.services.expenseTracking.title', 'Smart Expense Tracking'),
            description: safeTPages('services.services.expenseTracking.description', 'Automatically categorize and track your expenses with AI-powered insights.'),
          },
          budgetManagement: {
            title: safeTPages('services.services.budgetManagement.title', 'Budget Management'),
            description: safeTPages('services.services.budgetManagement.description', "Set budgets, track spending, and get alerts when you're approaching limits."),
          },
          analytics: {
            title: safeTPages('services.services.analytics.title', 'Advanced Analytics'),
            description: safeTPages('services.services.analytics.description', 'Get detailed insights into your spending patterns and financial trends.'),
          },
          reporting: {
            title: safeTPages('services.services.reporting.title', 'Custom Reporting'),
            description: safeTPages('services.services.reporting.description', 'Generate detailed reports for personal or business financial analysis.'),
          },
        },
        cta: {
          title: safeTPages('services.cta.title', 'Ready to Get Started?'),
          subtitle: safeTPages('services.cta.subtitle', "Choose the plan that's right for you and start transforming your financial management today."),
          startTrial: safeTPages('services.cta.startTrial', 'Start Free Trial'),
          viewPricing: safeTPages('services.cta.viewPricing', 'View Pricing'),
        },
      },
      pricing: {
        badge: safeTPages('pricing.badge', 'Pricing Plans'),
        title: safeTPages('pricing.title', 'Simple,'),
        titleHighlight: safeTPages('pricing.titleHighlight', 'Transparent Pricing'),
        subtitle: safeTPages('pricing.subtitle', 'Choose the perfect plan for your needs. All plans include our core features with no hidden fees.'),
      },
    },
    
    // Footer
    footer: {
      description: safeTFooter('description', 'The future of expense management. Track, analyze, and optimize your finances with AI-powered insights.'),
      product: {
        title: safeTFooter('product.title', 'Product'),
        features: safeTFooter('product.features', 'Features'),
        pricing: safeTFooter('product.pricing', 'Pricing'),
        api: safeTFooter('product.api', 'API'),
      },
      company: {
        title: safeTFooter('company.title', 'Company'),
        about: safeTFooter('company.about', 'About'),
        blog: safeTFooter('company.blog', 'Blog'),
        careers: safeTFooter('company.careers', 'Careers'),
        contact: safeTFooter('company.contact', 'Contact'),
      },
      connect: {
        title: safeTFooter('connect.title', 'Connect'),
      },
      copyright: safeTFooter('copyright', '© 2025 TrackWise. All rights reserved.'),
      privacy: safeTFooter('privacy', 'Privacy Policy'),
      terms: safeTFooter('terms', 'Terms of Service'),
    },
    
    // Expense Cards (separate namespace)
    expenseCards: {
      totalExpenses: {
        title: safeTExpenseCards('totalExpenses.title', 'Total Expenses'),
        description: safeTExpenseCards('totalExpenses.description', 'vs last month'),
      },
      thisMonth: {
        title: safeTExpenseCards('thisMonth.title', 'This Month'),
        description: safeTExpenseCards('thisMonth.description', 'current month'),
      },
      categories: {
        title: safeTExpenseCards('categories.title', 'Categories'),
        description: safeTExpenseCards('categories.description', 'active categories'),
      },
      avgPerDay: {
        title: safeTExpenseCards('avgPerDay.title', 'Avg/Day'),
        description: safeTExpenseCards('avgPerDay.description', 'last 30 days'),
      },
    },
    
    // Raw translator for dynamic keys
    t,
  }), [
    t, safeTCommon, safeTNav, safeTSidebar, safeTDashboard, safeTExpenses, 
    safeTIncome, safeTAuth, safeTErrors, safeTSuccess, safeTTable, safeTAdmin, 
    safeTLanding, safeTFeatures, safeTPricing, safeTPages, safeTFooter,
    safeTStats, safeTTestimonials, safeTCurrency, safeTDateFormat, safeTExpenseCards
  ]);
}