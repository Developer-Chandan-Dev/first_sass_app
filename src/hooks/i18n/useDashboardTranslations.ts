'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import {
  useBaseTranslations,
  createSafeTranslator,
} from './useBaseTranslations';

export function useDashboardTranslations() {
  const baseTranslations = useBaseTranslations();

  const t = useTranslations();
  const tDashboard = useTranslations('dashboard');
  const tSidebar = useTranslations('sidebar');
  const tExpenses = useTranslations('expenses');
  const tIncome = useTranslations('income');
  const tTable = useTranslations('table');
  const tStats = useTranslations('stats');
  const tAdmin = useTranslations('admin');
  const tCurrency = useTranslations('currency');
  const tDateFormat = useTranslations('dateFormat');
  const tExpenseCards = useTranslations('expenseCards');
  const tUdhar = useTranslations('udhar');

  const safeTDashboard = createSafeTranslator(tDashboard);
  const safeTSidebar = createSafeTranslator(tSidebar);
  const safeTExpenses = createSafeTranslator(tExpenses);
  const safeTIncome = createSafeTranslator(tIncome);
  const safeTTable = createSafeTranslator(tTable);
  const safeTStats = createSafeTranslator(tStats);
  const safeTAdmin = createSafeTranslator(tAdmin);
  const safeTCurrency = createSafeTranslator(tCurrency);
  const safeTDateFormat = createSafeTranslator(tDateFormat);
  const safeTExpenseCards = createSafeTranslator(tExpenseCards);
  const safeTUdhar = createSafeTranslator(tUdhar);

  return useMemo(
    () => ({
      ...baseTranslations,

      sidebar: {
        overview: safeTSidebar('overview', 'Overview'),
        expenses: safeTSidebar('expenses', 'Expenses'),
        income: safeTSidebar('income', 'Income'),
        analytics: safeTSidebar('analytics', 'Analytics'),
        categories: safeTSidebar('categories', 'Categories'),
        budgets: safeTSidebar('budgets', 'Budgets'),
        udhar: safeTSidebar('udhar', 'Udhar'),
        cards: safeTSidebar('cards', 'Cards'),
        notifications: safeTSidebar('notifications', 'Notifications'),
        settings: safeTSidebar('settings', 'Settings'),
      },

      dashboard: {
        overview: safeTDashboard('overview', 'Dashboard Overview'),
        description: safeTDashboard(
          'description',
          'Track your financial progress and manage expenses efficiently.'
        ),
        totalExpenses: safeTDashboard('totalExpenses', 'Total Expenses'),
        budgetUsage: safeTDashboard('budgetUsage', 'Budget Usage'),
        categories: safeTDashboard('categories', 'Categories'),
        transactions: safeTDashboard('transactions', 'Transactions'),
        recentTransactions: safeTDashboard(
          'recentTransactions',
          'Recent Transactions'
        ),
        monthlySpending: safeTDashboard('monthlySpending', 'Monthly Spending'),
        budgetStatus: safeTDashboard('budgetStatus', 'Budget Status'),
        addExpense: safeTDashboard('addExpense', 'Add Expense'),
        addBudget: safeTDashboard('addBudget', 'Add Budget'),
        addIncome: safeTDashboard('addIncome', 'Add Income'),
        spendingTrends: safeTDashboard('spendingTrends', 'Spending Trends'),
        comingSoon: safeTDashboard('comingSoon', 'Coming Soon'),
        quickActions: safeTDashboard('quickActions', 'Quick Actions'),
        financialSummary: safeTDashboard(
          'financialSummary',
          'Financial Summary'
        ),
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
        financialCalendar: safeTDashboard(
          'financialCalendar',
          'Financial Calendar'
        ),
        setBudgetTargets: safeTDashboard(
          'setBudgetTargets',
          'Set and track monthly budget targets'
        ),
        advancedSpendingAnalysis: safeTDashboard(
          'advancedSpendingAnalysis',
          'Advanced spending pattern analysis'
        ),
        neverMissPayment: safeTDashboard(
          'neverMissPayment',
          'Never miss a payment deadline'
        ),
        planExpensesAhead: safeTDashboard(
          'planExpensesAhead',
          'Plan your expenses ahead'
        ),
        expectedRelease: safeTDashboard(
          'expectedRelease',
          'Expected release: Next update'
        ),
        workingOnFeatures: safeTDashboard(
          'workingOnFeatures',
          "We're working on advanced features"
        ),
        nextUpdate: safeTDashboard('nextUpdate', 'Next update'),
      },

      expenses: {
        title: safeTExpenses('title', 'Expense Management'),
        subTitle: safeTExpenses(
          'subTitle',
          'Choose how you want to track your expenses'
        ),
        expenseType: [
          {
            title: safeTExpenses('expenseType.0.title', 'Free Expenses'),
            description: safeTExpenses(
              'expenseType.0.description',
              'Track your daily expenses without budget constraints'
            ),
            features: [
              safeTExpenses('expenseType.0.features.0', 'Unlimited tracking'),
              safeTExpenses('expenseType.0.features.1', 'Category management'),
              safeTExpenses('expenseType.0.features.2', 'Analytics & reports'),
              safeTExpenses('expenseType.0.features.3', 'Export data'),
            ],
          },
          {
            title: safeTExpenses('expenseType.1.title', 'Budget Expenses'),
            description: safeTExpenses(
              'expenseType.1.description',
              'Manage expenses within predefined budget limits.'
            ),
            features: [
              safeTExpenses('expenseType.1.features.0', 'Budget limits'),
              safeTExpenses('expenseType.1.features.1', 'Spending alerts'),
              safeTExpenses('expenseType.1.features.2', 'Goal tracking'),
              safeTExpenses('expenseType.1.features.3', 'Budget analysis'),
            ],
          },
        ],
        expenseCards: [
          {
            totalExpenses: safeTExpenses(
              'expenseCards.0.totalExpenses',
              'Total Expenses'
            ),
            vsLastMonth: safeTExpenses(
              'expenseCards.0.vsLastMonth',
              'vs last month'
            ),
          },
          {
            thisMonth: safeTExpenses('expenseCards.1.thisMonth', 'This Month'),
            currentMonth: safeTExpenses(
              'expenseCards.1.currentMonth',
              'Current Month'
            ),
          },
          {
            categories: safeTExpenses(
              'expenseCards.2.categories',
              'Categories'
            ),
            activeCategories: safeTExpenses(
              'expenseCards.2.activeCategories',
              'active categories'
            ),
          },
          {
            aveDay: safeTExpenses('expenseCards.3.aveDay', 'Avg/Day'),
            last30days: safeTExpenses(
              'expenseCards.3.last30days',
              'last 30 days'
            ),
          },
        ],
        addExpense: safeTExpenses('addExpense', 'Add Expense'),
        editExpense: safeTExpenses('editExpense', 'Edit Expense'),
        deleteExpense: safeTExpenses('deleteExpense', 'Delete Expense'),
        expenseDetails: safeTExpenses('expenseDetails', 'Expense Details'),
        noExpenses: safeTExpenses('noExpenses', 'No expenses found'),
        searchPlaceholder: safeTExpenses(
          'searchPlaceholder',
          'Search expenses...'
        ),
        filterByCategory: safeTExpenses(
          'filterByCategory',
          'Filter by category'
        ),
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
        deleteConfirm: safeTExpenses(
          'deleteConfirm',
          'Are you sure you want to delete this expense?'
        ),
        deleteSuccess: safeTExpenses(
          'deleteSuccess',
          'Expense deleted successfully!'
        ),
        addSuccess: safeTExpenses('addSuccess', 'Expense added successfully!'),
        updateSuccess: safeTExpenses(
          'updateSuccess',
          'Expense updated successfully!'
        ),
        recurring: safeTExpenses('recurring', 'Recurring'),
        frequency: safeTExpenses('frequency', 'Frequency'),
        budget: safeTExpenses('budget', 'Budget'),
        overview: safeTExpenses('overview', 'Overview'),
        table: safeTExpenses('table', 'Table'),
        charts: safeTExpenses('charts', 'Charts'),
        totalExpenses: safeTExpenses('totalExpenses', 'Total Expenses'),
        averageExpense: safeTExpenses('averageExpense', 'Average Expense'),
        highestExpense: safeTExpenses('highestExpense', 'Highest Expense'),
        categoryBreakdown: safeTExpenses(
          'categoryBreakdown',
          'Category Breakdown'
        ),
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
        trackAndManageDailyExpenses: safeTExpenses(
          'trackAndManageDailyExpenses',
          'Track and manage your daily expenses'
        ),
        manageExpensesWithinBudgetLimits: safeTExpenses(
          'manageExpensesWithinBudgetLimits',
          'Manage expenses within predefined budget limits'
        ),
        backToExpenses: safeTExpenses('backToExpenses', 'Back to Expenses'),
        addBudgetExpense: safeTExpenses(
          'addBudgetExpense',
          'Add Budget Expense'
        ),
        expensesByCategory: safeTExpenses(
          'expensesByCategory',
          'Expenses by Category'
        ),
        recentActivity: safeTExpenses('recentActivity', 'Recent Activity'),
        budgets: safeTExpenses('budgets', 'Budgets'),
        analytics: safeTExpenses('analytics', 'Analytics'),
        searchExpenses: safeTExpenses('searchExpenses', 'Search expenses...'),
        noExpensesFound: safeTExpenses('noExpensesFound', 'No expenses found'),
        addNewExpense: safeTExpenses('addNewExpense', 'Add New Expense'),
        reason: safeTExpenses('reason', 'Reason'),
        reasonPlaceholder: safeTExpenses(
          'reasonPlaceholder',
          'What was this expense for?'
        ),
        selectCategory: safeTExpenses('selectCategory', 'Select category'),
        enterCustomCategory: safeTExpenses(
          'enterCustomCategory',
          'Enter custom category'
        ),
        recurringExpense: safeTExpenses(
          'recurringExpense',
          'Recurring Expense'
        ),
        regularExpense: safeTExpenses('regularExpense', 'Regular expense'),
        reduceFromBalance: safeTExpenses(
          'reduceFromBalance',
          'Reduce from Balance'
        ),
        deductFromConnectedIncome: safeTExpenses(
          'deductFromConnectedIncome',
          'Deduct from connected income'
        ),
        selectIncomeSource: safeTExpenses(
          'selectIncomeSource',
          'Select Income Source'
        ),
        chooseIncomeToReduceFrom: safeTExpenses(
          'chooseIncomeToReduceFrom',
          'Choose income to reduce from'
        ),
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
        recentTransactions: safeTExpenses(
          'recentTransactions',
          'Recent Transactions'
        ),
        noRecentTransactions: safeTExpenses(
          'noRecentTransactions',
          'No recent transactions'
        ),
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
        // Budget-related keys
        remaining: safeTExpenses('remaining', 'Remaining'),
        spent: safeTExpenses('spent', 'spent'),
        available: safeTExpenses('available', 'Available'),
        exceeded: safeTExpenses('exceeded', 'Exceeded'),
        totalBudget: safeTExpenses('totalBudget', 'Total Budget'),
        activeBudgets: safeTExpenses('activeBudgets', 'active budgets'),
        budgetSpent: safeTExpenses('budgetSpent', 'Budget Spent'),
        budgetLeft: safeTExpenses('budgetLeft', 'budget left'),
        budgetExpensesCount: safeTExpenses(
          'budgetExpensesCount',
          'Budget Expenses'
        ),
        budgetAlerts: safeTExpenses('budgetAlerts', 'Budget Alerts'),
        overBy: safeTExpenses('overBy', 'Over by'),
        fixBudget: safeTExpenses('fixBudget', 'Fix Budget'),
        noActiveBudgets: safeTExpenses('noActiveBudgets', 'No active budgets'),
        createBudget: safeTExpenses('createBudget', 'Create Budget'),
        completedBudgets: safeTExpenses(
          'completedBudgets',
          'Completed Budgets'
        ),
        budgetAnalytics: safeTExpenses('budgetAnalytics', 'Budget Analytics'),
        spendingRate: safeTExpenses('spendingRate', 'Spending Rate'),
        ofTotalBudgetUsed: safeTExpenses(
          'ofTotalBudgetUsed',
          'of total budget used'
        ),
        savingsRate: safeTExpenses('savingsRate', 'Savings Rate'),
        ofBudgetSaved: safeTExpenses('ofBudgetSaved', 'of budget saved'),
        daysLeft: safeTExpenses('daysLeft', 'days left'),
        used: safeTExpenses('used', 'used'),
        pause: safeTExpenses('pause', 'Pause'),
        complete: safeTExpenses('complete', 'Complete'),
        quickStart: safeTExpenses('quickStart', 'Quick Start'),
        createBudgetsFromTemplates: safeTExpenses(
          'createBudgetsFromTemplates',
          'Create budgets from templates'
        ),
        budgetManagement: safeTExpenses(
          'budgetManagement',
          'Budget Management'
        ),
        manageAllBudgetStatuses: safeTExpenses(
          'manageAllBudgetStatuses',
          'Manage all budget statuses'
        ),
        advancedAnalytics: safeTExpenses(
          'advancedAnalytics',
          'Advanced Analytics'
        ),
        detailedBudgetInsights: safeTExpenses(
          'detailedBudgetInsights',
          'Detailed budget insights'
        ),
        comingSoon: safeTExpenses('comingSoon', 'Coming Soon'),
        upcomingFeatures: safeTExpenses(
          'upcomingFeatures',
          'Upcoming features'
        ),
        active: safeTExpenses('active', 'Active'),
        uncategorized: safeTExpenses('uncategorized', 'Uncategorized'),
        monthlyBudgetTrends: safeTExpenses('monthlyBudgetTrends', 'Monthly Budget Trends'),
        budgetAmount: safeTExpenses('budgetAmount', 'Budget Amount'),
        budgetByCategory: safeTExpenses('budgetByCategory', 'Budget by category'),
        noBudgetCategoriesFound: safeTExpenses('noBudgetCategoriesFound', 'No Budget Category Found'),
        quickStartCommonCategories: safeTExpenses('quickStartCommonCategories', 'Quick start with common budget categories'),
        customize: safeTExpenses('customize', 'Customize'),
        groceries: safeTExpenses('groceries', 'Groceries'),
        food: safeTExpenses('food', 'Food'),
        monthlyGroceryBudget: safeTExpenses('monthlyGroceryBudget', 'Monthly grocery shopping budget'),
        transportation: safeTExpenses('transportation', 'Transportation'),
        transport: safeTExpenses('transport', 'Transport'),
        fuelTransportParking: safeTExpenses('fuelTransportParking', 'Fuel, public transport, parking'),
        rentUtilities: safeTExpenses('rentUtilities', 'Rent & Utilities'),
        housing: safeTExpenses('housing', 'Housing'),
        monthlyHousingExpenses: safeTExpenses('monthlyHousingExpenses', 'Monthly housing expenses'),
        diningOut: safeTExpenses('diningOut', 'Dining Out'),
        restaurantsTakeout: safeTExpenses('restaurantsTakeout', 'Restaurants and takeout'),
        entertainment: safeTExpenses('entertainment', 'Entertainment'),
        leisure: safeTExpenses('leisure', 'Leisure'),
        moviesGamesSubscriptions: safeTExpenses('moviesGamesSubscriptions', 'Movies, games, subscriptions'),
        healthcare: safeTExpenses('healthcare', 'Healthcare'),
        health: safeTExpenses('health', 'Health'),
        medicalExpensesInsurance: safeTExpenses('medicalExpensesInsurance', 'Medical expenses and insurance'),
        budgetManager: {
          title: safeTExpenses('budgetManager.title', 'Budget Manager'),
          running: safeTExpenses('budgetManager.running', 'Running'),
          completed: safeTExpenses('budgetManager.completed', 'Completed'),
          paused: safeTExpenses('budgetManager.paused', 'Paused'),
          expired: safeTExpenses('budgetManager.expired', 'Expired'),
          resume: safeTExpenses('budgetManager.resume', 'Resume'),
          saved: safeTExpenses('budgetManager.saved', 'Saved'),
          noRunningBudgets: safeTExpenses(
            'budgetManager.noRunningBudgets',
            'No running budgets'
          ),
          noCompletedBudgets: safeTExpenses(
            'budgetManager.noCompletedBudgets',
            'No completed budgets'
          ),
          noPausedBudgets: safeTExpenses(
            'budgetManager.noPausedBudgets',
            'No paused budgets'
          ),
          noExpiredBudgets: safeTExpenses(
            'budgetManager.noExpiredBudgets',
            'No expired budgets'
          ),
          noBudgetsFound: safeTExpenses(
            'budgetManager.noBudgetsFound',
            'No budgets found'
          ),
        },
        budgetTemplates: {
          title: safeTExpenses('budgetTemplates.title', 'Budget Templates'),
          description: safeTExpenses(
            'budgetTemplates.description',
            'Quick start with common budget categories'
          ),
          customize: safeTExpenses('budgetTemplates.customize', 'Customize'),
          templates: {
            groceries: {
              name: safeTExpenses(
                'budgetTemplates.templates.groceries.name',
                'Groceries'
              ),
              description: safeTExpenses(
                'budgetTemplates.templates.groceries.description',
                'Monthly grocery shopping budget'
              ),
            },
            transportation: {
              name: safeTExpenses(
                'budgetTemplates.templates.transportation.name',
                'Transportation'
              ),
              description: safeTExpenses(
                'budgetTemplates.templates.transportation.description',
                'Fuel, public transport, parking'
              ),
            },
            rentUtilities: {
              name: safeTExpenses(
                'budgetTemplates.templates.rentUtilities.name',
                'Rent & Utilities'
              ),
              description: safeTExpenses(
                'budgetTemplates.templates.rentUtilities.description',
                'Monthly housing expenses'
              ),
            },
            diningOut: {
              name: safeTExpenses(
                'budgetTemplates.templates.diningOut.name',
                'Dining Out'
              ),
              description: safeTExpenses(
                'budgetTemplates.templates.diningOut.description',
                'Restaurants and takeout'
              ),
            },
            entertainment: {
              name: safeTExpenses(
                'budgetTemplates.templates.entertainment.name',
                'Entertainment'
              ),
              description: safeTExpenses(
                'budgetTemplates.templates.entertainment.description',
                'Movies, games, subscriptions'
              ),
            },
            healthcare: {
              name: safeTExpenses(
                'budgetTemplates.templates.healthcare.name',
                'Healthcare'
              ),
              description: safeTExpenses(
                'budgetTemplates.templates.healthcare.description',
                'Medical expenses and insurance'
              ),
            },
          },
        },
        budgetStatusManager: safeTExpenses('budgetStatusManager', 'Budget Status Manager'),
        runningBudgets: safeTExpenses('runningBudgets', 'Running Budgets'),
        deleteThisBudget: safeTExpenses('deleteThisBudget', 'Delete this budget?'),
        // Export and table keys
        exportAll: safeTExpenses('exportAll', 'Export All'),
        exportSelected: safeTExpenses('exportSelected', 'Export Selected'),
        exportSelectedCSV: safeTExpenses(
          'exportSelectedCSV',
          'Export Selected CSV'
        ),
        exportSelectedPDF: safeTExpenses(
          'exportSelectedPDF',
          'Export Selected PDF'
        ),
        exportAllCSV: safeTExpenses('exportAllCSV', 'Export All CSV'),
        exportAllPDF: safeTExpenses('exportAllPDF', 'Export All PDF'),
        oneTime: safeTExpenses('oneTime', 'One-time'),
        showing: safeTExpenses('showing', 'Showing'),
        entries: safeTExpenses('entries', 'entries'),
        perPage: safeTExpenses('perPage', 'per page'),
        lastMonth: safeTExpenses('lastMonth', 'Last Month'),
        date: safeTExpenses('date', 'Date'),
        description: safeTExpenses('description', 'Description'),
        amount: safeTExpenses('amount', 'Amount'),
        edit: safeTExpenses('edit', 'Edit'),
        delete: safeTExpenses('delete', 'Delete'),
        of: safeTExpenses('of', 'of'),
        noDataToExport: safeTExpenses('noDataToExport', 'No data to export'),
        expensesExportedToCSV: safeTExpenses(
          'expensesExportedToCSV',
          'Expenses exported to CSV!'
        ),
        areYouSureDeleteExpense: safeTExpenses(
          'areYouSureDeleteExpense',
          'Are you sure you want to delete this expense?'
        ),
        areYouSureDeleteExpenses: safeTExpenses(
          'areYouSureDeleteExpenses',
          'Are you sure you want to delete these expenses?'
        ),
        confirmBulkDelete: (count: number) => {
          try {
            return tExpenses('confirmBulkDelete', { count });
          } catch {
            return `Are you sure you want to delete ${count} expenses?`;
          }
        },
        expensesDeletedSuccessfully: safeTExpenses(
          'expensesDeletedSuccessfully',
          'Expenses deleted successfully!'
        ),
        failedToDeleteExpenses: safeTExpenses(
          'failedToDeleteExpenses',
          'Failed to delete expenses'
        ),
        updateError: safeTExpenses('updateError', 'Failed to update expense'),
        updating: safeTExpenses('updating', 'Updating...'),
        updateExpense: safeTExpenses('updateExpense', 'Update Expense'),
        categories: {
          food: safeTExpenses('categories.food', 'Food & Dining'),
          transport: safeTExpenses('categories.transport', 'Transportation'),
          shopping: safeTExpenses('categories.shopping', 'Shopping'),
          entertainment: safeTExpenses(
            'categories.entertainment',
            'Entertainment'
          ),
          bills: safeTExpenses('categories.bills', 'Bills & Utilities'),
          healthcare: safeTExpenses('categories.healthcare', 'Healthcare'),
          education: safeTExpenses('categories.education', 'Education'),
          travel: safeTExpenses('categories.travel', 'Travel'),
          other: safeTExpenses('categories.other', 'Other'),
        },
        form: {
          title: safeTExpenses('form.title', 'Title'),
          titlePlaceholder: safeTExpenses(
            'form.titlePlaceholder',
            'Enter expense title'
          ),
          amount: safeTExpenses('form.amount', 'Amount'),
          amountPlaceholder: safeTExpenses('form.amountPlaceholder', '0.00'),
          category: safeTExpenses('form.category', 'Category'),
          selectCategory: safeTExpenses(
            'form.selectCategory',
            'Select a category'
          ),
          date: safeTExpenses('form.date', 'Date'),
          description: safeTExpenses('form.description', 'Description'),
          descriptionPlaceholder: safeTExpenses(
            'form.descriptionPlaceholder',
            'Enter expense description (optional)'
          ),
          receipt: safeTExpenses('form.receipt', 'Receipt'),
          uploadReceipt: safeTExpenses('form.uploadReceipt', 'Upload Receipt'),
          removeReceipt: safeTExpenses('form.removeReceipt', 'Remove Receipt'),
          validation: {
            titleRequired: safeTExpenses(
              'form.validation.titleRequired',
              'Title is required'
            ),
            amountRequired: safeTExpenses(
              'form.validation.amountRequired',
              'Amount is required'
            ),
            amountPositive: safeTExpenses(
              'form.validation.amountPositive',
              'Amount must be positive'
            ),
            categoryRequired: safeTExpenses(
              'form.validation.categoryRequired',
              'Category is required'
            ),
            dateRequired: safeTExpenses(
              'form.validation.dateRequired',
              'Date is required'
            ),
            descriptionTooLong: safeTExpenses(
              'form.validation.descriptionTooLong',
              'Description is too long'
            ),
            reasonRequired: safeTExpenses(
              'form.validation.reasonRequired',
              'Reason is required'
            ),
            amountGreaterThanZero: safeTExpenses(
              'form.validation.amountGreaterThanZero',
              'Amount must be greater than 0'
            ),
            pleaseEnterValidAmount: safeTExpenses(
              'form.validation.pleaseEnterValidAmount',
              'Please enter a valid amount'
            ),
            pleaseSelectCategory: safeTExpenses(
              'form.validation.pleaseSelectCategory',
              'Please select a category'
            ),
            pleaseEnterDescription: safeTExpenses(
              'form.validation.pleaseEnterDescription',
              'Please enter a description'
            ),
          },
        },
      },

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
        deleteConfirm: safeTIncome(
          'deleteConfirm',
          'Are you sure you want to delete this income record?'
        ),
        deleteSuccess: safeTIncome(
          'deleteSuccess',
          'Income deleted successfully!'
        ),
        addSuccess: safeTIncome('addSuccess', 'Income added successfully!'),
        updateSuccess: safeTIncome(
          'updateSuccess',
          'Income updated successfully!'
        ),
        addIncomeSource: safeTIncome('addIncomeSource', 'Add Income Source'),
        connectToBalance: safeTIncome('connectToBalance', 'Connect to Balance'),
        expensesWillReduceFromThisIncome: safeTIncome(
          'expensesWillReduceFromThisIncome',
          'Expenses will reduce from this income'
        ),
        recurringIncome: safeTIncome('recurringIncome', 'Recurring Income'),
        regularIncomeSource: safeTIncome(
          'regularIncomeSource',
          'Regular income source'
        ),
        selectIncomeCategory: safeTIncome(
          'selectIncomeCategory',
          'Select income category'
        ),
        briefDescriptionOfIncomeSource: safeTIncome(
          'briefDescriptionOfIncomeSource',
          'Brief description of income source'
        ),
        addingIncome: safeTIncome('addingIncome', 'Adding...'),
        incomeManagement: safeTIncome('incomeManagement', 'Income Management'),
        trackAndManageIncome: safeTIncome(
          'trackAndManageIncome',
          'Track and manage your income sources'
        ),
        overview: safeTIncome('overview', 'Overview'),
        table: safeTIncome('table', 'Table'),
        charts: safeTIncome('charts', 'Charts'),
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
        frequency: safeTIncome('frequency', 'Frequency'),
        updating: safeTIncome('updating', 'Updating...'),
        selectFrequency: safeTIncome('selectFrequency', 'Select frequency'),
        addError: safeTIncome('addError', 'Failed to add income'),
        sourcePlaceholder: safeTIncome(
          'sourcePlaceholder',
          'e.g., Company Name, Client Name'
        ),
        frequencies: {
          daily: safeTIncome('frequencies.daily', 'Daily'),
          weekly: safeTIncome('frequencies.weekly', 'Weekly'),
          monthly: safeTIncome('frequencies.monthly', 'Monthly'),
          yearly: safeTIncome('frequencies.yearly', 'Yearly'),
        },
        form: {
          title: safeTIncome('form.title', 'Title'),
          titlePlaceholder: safeTIncome(
            'form.titlePlaceholder',
            'Enter income title'
          ),
          amount: safeTIncome('form.amount', 'Amount'),
          amountPlaceholder: safeTIncome('form.amountPlaceholder', '0.00'),
          source: safeTIncome('form.source', 'Source'),
          selectSource: safeTIncome(
            'form.selectSource',
            'Select income source'
          ),
          date: safeTIncome('form.date', 'Date'),
          description: safeTIncome('form.description', 'Description'),
          descriptionPlaceholder: safeTIncome(
            'form.descriptionPlaceholder',
            'Enter income description (optional)'
          ),
          validation: {
            titleRequired: safeTIncome(
              'form.validation.titleRequired',
              'Title is required'
            ),
            amountRequired: safeTIncome(
              'form.validation.amountRequired',
              'Amount is required'
            ),
            amountPositive: safeTIncome(
              'form.validation.amountPositive',
              'Amount must be positive'
            ),
            sourceRequired: safeTIncome(
              'form.validation.sourceRequired',
              'Source is required'
            ),
            dateRequired: safeTIncome(
              'form.validation.dateRequired',
              'Date is required'
            ),
          },
        },
        exportSelectedCSV: safeTIncome(
          'exportSelectedCSV',
          'Export Selected CSV'
        ),
        exportSelectedPDF: safeTIncome(
          'exportSelectedPDF',
          'Export Selected PDF'
        ),
        exportAll: safeTIncome('exportAll', 'Export All'),
        exportAllCSV: safeTIncome('exportAllCSV', 'Export All CSV'),
        exportAllPDF: safeTIncome('exportAllPDF', 'Export All PDF'),
        oneTime: safeTIncome('oneTime', 'One-time'),
        viewExpenses: safeTIncome('viewExpenses', 'View Expenses'),
        allTimeEarnings: safeTIncome('allTimeEarnings', 'All time earnings'),
        entries: safeTIncome('entries', 'entries'),
        viewAll: safeTIncome('viewAll', 'View All'),
        avg: safeTIncome('avg', 'avg'),
        automatedIncome: safeTIncome('automatedIncome', 'automated income'),
        addRecurring: safeTIncome('addRecurring', 'Add Recurring'),
        weeklyIncome: safeTIncome('weeklyIncome', 'Weekly Income'),
        thisWeek: safeTIncome('thisWeek', 'This week'),
        topIncomeCategory: safeTIncome(
          'topIncomeCategory',
          'Top Income Category'
        ),
        ofTotalIncome: safeTIncome('ofTotalIncome', 'of total income'),
        noIncomeData: safeTIncome('noIncomeData', 'No income data available'),
        quickInsights: safeTIncome('quickInsights', 'Quick Insights'),
        averagePerEntry: safeTIncome('averagePerEntry', 'Average per entry'),
        recurringSources: safeTIncome('recurringSources', 'Recurring sources'),
        totalEntries: safeTIncome('totalEntries', 'Total entries'),
        allTime: safeTIncome('allTime', 'All Time'),
        today: safeTIncome('today', 'Today'),
        last7Days: safeTIncome('last7Days', 'Last 7 Days'),
        last30Days: safeTIncome('last30Days', 'Last 30 Days'),
        allTypes: safeTIncome('allTypes', 'All Types'),
        allCategories: safeTIncome('allCategories', 'All Categories'),
        advancedFilters: safeTIncome('advancedFilters', 'Advanced Filters'),
        refresh: safeTIncome('refresh', 'Refresh'),
        startDate: safeTIncome('startDate', 'Start Date'),
        endDate: safeTIncome('endDate', 'End Date'),
        incomeAnalytics: safeTIncome('incomeAnalytics', 'Income Analytics'),
        daily: safeTIncome('daily', 'Daily'),
        weekly: safeTIncome('weekly', 'Weekly'),
        monthly: safeTIncome('monthly', 'Monthly'),
        yearly: safeTIncome('yearly', 'Yearly'),
        days: safeTIncome('days', 'days'),
        weeks: safeTIncome('weeks', 'weeks'),
        months: safeTIncome('months', 'months'),
        years: safeTIncome('years', 'years'),
        incomeBy: safeTIncome('incomeBy', 'Income by'),
        incomeByCategory: safeTIncome('incomeByCategory', 'Income by Category'),
        sixMonthTrend: safeTIncome('sixMonthTrend', '6-Month Trend'),
        incomeSummary: safeTIncome('incomeSummary', 'Income Summary'),
        avgPerEntry: safeTIncome('avgPerEntry', 'Avg per Entry'),
        topCategories: safeTIncome('topCategories', 'Top Categories'),
      },

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
        to: safeTTable('to', 'to'),
        perPage: safeTTable('perPage', 'per page'),
      },

      stats: {
        activeUsers: safeTStats('activeUsers', 'Active Users'),
        trackedExpenses: safeTStats('trackedExpenses', 'Tracked Expenses'),
        uptime: safeTStats('uptime', 'Uptime'),
        countries: safeTStats('countries', 'Countries'),
      },

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

      currency: {
        usd: safeTCurrency('usd', 'USD'),
        eur: safeTCurrency('eur', 'EUR'),
        gbp: safeTCurrency('gbp', 'GBP'),
        inr: safeTCurrency('inr', 'INR'),
        jpy: safeTCurrency('jpy', 'JPY'),
        cad: safeTCurrency('cad', 'CAD'),
        aud: safeTCurrency('aud', 'AUD'),
      },

      dateFormat: {
        short: safeTDateFormat('short', 'MM/dd/yyyy'),
        long: safeTDateFormat('long', 'MMMM d, yyyy'),
        time: safeTDateFormat('time', 'h:mm a'),
        dateTime: safeTDateFormat('dateTime', 'MM/dd/yyyy h:mm a'),
      },

      expenseCards: {
        totalExpenses: {
          title: safeTExpenseCards('totalExpenses.title', 'Total Expenses'),
          description: safeTExpenseCards(
            'totalExpenses.description',
            'vs last month'
          ),
        },
        thisMonth: {
          title: safeTExpenseCards('thisMonth.title', 'This Month'),
          description: safeTExpenseCards(
            'thisMonth.description',
            'current month'
          ),
        },
        categoriesCard: {
          title: safeTExpenseCards('categories.title', 'Categories'),
          description: safeTExpenseCards(
            'categories.description',
            'active categories'
          ),
        },
        avgPerDay: {
          title: safeTExpenseCards('avgPerDay.title', 'Avg/Day'),
          description: safeTExpenseCards(
            'avgPerDay.description',
            'last 30 days'
          ),
        },
      },

      chart: {
        incomeVsExpenses: safeTDashboard('chart.incomeVsExpenses', 'Income vs Expenses Analysis'),
        totalIncome: safeTDashboard('chart.totalIncome', 'Total Income'),
        totalExpenses: safeTDashboard('chart.totalExpenses', 'Total Expenses'),
        netSavings: safeTDashboard('chart.netSavings', 'Net Savings'),
        netDeficit: safeTDashboard('chart.netDeficit', 'Net Deficit'),
        positive: safeTDashboard('chart.positive', 'Positive'),
        negative: safeTDashboard('chart.negative', 'Negative'),
        cashFlow: safeTDashboard('chart.cashFlow', 'cash flow'),
        showingData: (timePeriod: string) => {
          try {
            return tDashboard('chart.showingData', { timePeriod });
          } catch {
            return `Showing ${timePeriod} data`;
          }
        },
        periods: safeTDashboard('chart.periods', 'periods'),
        failedToLoad: safeTDashboard('chart.failedToLoad', 'Failed to load chart data'),
        retry: safeTDashboard('chart.retry', 'Retry'),
        barChart: safeTDashboard('chart.barChart', 'Bar Chart'),
        lineChart: safeTDashboard('chart.lineChart', 'Line Chart'),
        areaChart: safeTDashboard('chart.areaChart', 'Area Chart'),
        daily: safeTDashboard('chart.daily', 'Daily'),
        weekly: safeTDashboard('chart.weekly', 'Weekly'),
        monthly: safeTDashboard('chart.monthly', 'Monthly'),
        yearly: safeTDashboard('chart.yearly', 'Yearly'),
      },

      // Add pages namespace for page components
      pages: {
        analytics: {
          title: safeTDashboard('pages.analytics.title', 'Analytics'),
          description: safeTDashboard(
            'pages.analytics.description',
            'Advanced analytics and insights'
          ),
          comingSoon: safeTDashboard(
            'pages.analytics.comingSoon',
            'Coming Soon'
          ),
          workingOnFeatures: safeTDashboard(
            'pages.analytics.workingOnFeatures',
            "We're working on advanced features"
          ),
        },
        budgets: {
          title: safeTDashboard('pages.budgets.title', 'Budgets'),
          description: safeTDashboard(
            'pages.budgets.description',
            'Manage your budgets'
          ),
          comingSoon: safeTDashboard('pages.budgets.comingSoon', 'Coming Soon'),
          workingOnFeatures: safeTDashboard('pages.budgets.workingOnFeatures', "We're working on advanced features"),
        },
        cards: {
          title: safeTDashboard('pages.cards.title', 'Cards'),
          description: safeTDashboard('pages.cards.description', 'Manage your cards'),
          comingSoon: safeTDashboard('pages.cards.comingSoon', 'Coming Soon'),
        },
        categories: {
          title: safeTDashboard('pages.categories.title', 'Categories'),
          description: safeTDashboard('pages.categories.description', 'Manage expense categories'),
        },
        notifications: {
          title: safeTDashboard('pages.notifications.title', 'Notifications'),
          description: safeTDashboard('pages.notifications.description', 'Manage your notifications'),
          comingSoon: safeTDashboard('pages.notifications.comingSoon', 'Coming Soon'),
        },
        settings: {
          title: safeTDashboard('pages.settings.title', 'Settings'),
          description: safeTDashboard('pages.settings.description', 'Application settings'),
          comingSoon: safeTDashboard('pages.settings.comingSoon', 'Coming Soon'),
          workingOnFeatures: safeTDashboard('pages.settings.workingOnFeatures', "We're working on advanced features"),
        },
      },

      udhar: {
        title: safeTUdhar('title', 'Udhar Management'),
        shopkeeper: {
          title: safeTUdhar('shopkeeper.title', 'Shopkeeper Udhar'),
          description: safeTUdhar('shopkeeper.description', 'Manage your shop\'s udhar records, customers, and payments efficiently'),
          customers: safeTUdhar('shopkeeper.customers', 'Customers'),
          vendors: safeTUdhar('shopkeeper.vendors', 'Vendors'),
          addCustomer: safeTUdhar('shopkeeper.addCustomer', 'Add Customer'),
          totalCustomers: safeTUdhar('shopkeeper.totalCustomers', 'Total Customers'),
          totalOutstanding: safeTUdhar('shopkeeper.totalOutstanding', 'Total Outstanding'),
          highRisk: safeTUdhar('shopkeeper.highRisk', 'High Risk'),
          weekCollections: safeTUdhar('shopkeeper.weekCollections', 'Week Collections'),
          todayCollections: safeTUdhar('shopkeeper.todayCollections', 'Today Collections'),
          monthCollections: safeTUdhar('shopkeeper.monthCollections', 'Month Collections'),
          topDebtors: safeTUdhar('shopkeeper.topDebtors', 'Top Debtors'),
          recentActivity: safeTUdhar('shopkeeper.recentActivity', 'Recent Activity'),
          noOutstanding: safeTUdhar('shopkeeper.noOutstanding', 'No outstanding balances'),
          noRecentTransactions: safeTUdhar('shopkeeper.noRecentTransactions', 'No recent transactions'),
        },
        vendor: {
          title: safeTUdhar('vendor.title', 'Vendor Management'),
          description: safeTUdhar('vendor.description', 'Track purchases and payments to your suppliers'),
          addVendor: safeTUdhar('vendor.addVendor', 'Add Vendor'),
          totalVendors: safeTUdhar('vendor.totalVendors', 'Total Vendors'),
          totalOwed: safeTUdhar('vendor.totalOwed', 'Total Owed'),
          activeVendors: safeTUdhar('vendor.activeVendors', 'Active Vendors'),
          weekPayments: safeTUdhar('vendor.weekPayments', 'Week Payments'),
          topCreditors: safeTUdhar('vendor.topCreditors', 'Top Creditors'),
          noVendors: safeTUdhar('vendor.noVendors', 'No vendors found'),
        },
        customer: {
          name: safeTUdhar('customer.name', 'Name'),
          phone: safeTUdhar('customer.phone', 'Phone'),
          address: safeTUdhar('customer.address', 'Address'),
          creditLimit: safeTUdhar('customer.creditLimit', 'Credit Limit'),
          outstanding: safeTUdhar('customer.outstanding', 'Outstanding'),
          details: safeTUdhar('customer.details', 'Customer details'),
          notFound: safeTUdhar('customer.notFound', 'Customer not found'),
        },
        vendorDetails: {
          title: safeTUdhar('vendorDetails.title', 'Vendor details'),
          notFound: safeTUdhar('vendorDetails.notFound', 'Vendor not found'),
        },
        transaction: {
          purchase: safeTUdhar('transaction.purchase', 'Purchase'),
          payment: safeTUdhar('transaction.payment', 'Payment'),
          newPurchase: safeTUdhar('transaction.newPurchase', 'New Purchase'),
          recordPayment: safeTUdhar('transaction.recordPayment', 'Record Payment'),
          purchases: safeTUdhar('transaction.purchases', 'Purchases'),
          payments: safeTUdhar('transaction.payments', 'Payments'),
          total: safeTUdhar('transaction.total', 'Total'),
          noPurchases: safeTUdhar('transaction.noPurchases', 'No purchases yet'),
          noPayments: safeTUdhar('transaction.noPayments', 'No payments yet'),
          deleteConfirm: safeTUdhar('transaction.deleteConfirm', 'Delete Transaction?'),
          deleteMessage: safeTUdhar('transaction.deleteMessage', 'This action cannot be undone. This will permanently delete the transaction and update the outstanding balance.'),
          deleted: safeTUdhar('transaction.deleted', 'Transaction deleted'),
          updated: safeTUdhar('transaction.updated', 'Transaction updated'),
          edit: safeTUdhar('transaction.edit', 'Edit Transaction'),
        },
        stats: {
          today: safeTUdhar('stats.today', 'Today'),
          thisWeek: safeTUdhar('stats.thisWeek', 'This Week'),
          thisMonth: safeTUdhar('stats.thisMonth', 'This Month'),
          collections: safeTUdhar('stats.collections', 'Collections'),
          net: safeTUdhar('stats.net', 'Net'),
          netOwed: safeTUdhar('stats.netOwed', 'Net Owed'),
          sevenDayTrend: safeTUdhar('stats.sevenDayTrend', '7-Day Trend'),
          paymentMethods: safeTUdhar('stats.paymentMethods', 'Payment Methods'),
          noPaymentData: safeTUdhar('stats.noPaymentData', 'No payment data available'),
        },
        actions: {
          call: safeTUdhar('actions.call', 'Call'),
          whatsapp: safeTUdhar('actions.whatsapp', 'WhatsApp'),
          edit: safeTUdhar('actions.edit', 'Edit'),
          delete: safeTUdhar('actions.delete', 'Delete'),
          viewDetails: safeTUdhar('actions.viewDetails', 'View Details'),
        },
        tabs: {
          dashboard: safeTUdhar('tabs.dashboard', 'Dashboard'),
          customers: safeTUdhar('tabs.customers', 'Customers'),
          vendors: safeTUdhar('tabs.vendors', 'Vendors'),
          insights: safeTUdhar('tabs.insights', 'Insights'),
        },
        form: {
          amount: safeTUdhar('form.amount', 'Amount'),
          description: safeTUdhar('form.description', 'Description'),
          paymentMethod: safeTUdhar('form.paymentMethod', 'Payment Method'),
          cash: safeTUdhar('form.cash', 'Cash'),
          upi: safeTUdhar('form.upi', 'UPI'),
          card: safeTUdhar('form.card', 'Card'),
          other: safeTUdhar('form.other', 'Other'),
          save: safeTUdhar('form.save', 'Save'),
          saving: safeTUdhar('form.saving', 'Saving...'),
          cancel: safeTUdhar('form.cancel', 'Cancel'),
          required: safeTUdhar('form.required', 'Required'),
          enterValidAmount: safeTUdhar('form.enterValidAmount', 'Please enter a valid amount'),
        },
      },

      // Raw translator for dynamic keys
      t,
    }),
    [
      baseTranslations,
      t,
      tExpenses,
      tDashboard,
      safeTDashboard,
      safeTSidebar,
      safeTExpenses,
      safeTIncome,
      safeTTable,
      safeTStats,
      safeTAdmin,
      safeTCurrency,
      safeTDateFormat,
      safeTExpenseCards,
      safeTUdhar,
    ]
  );
}