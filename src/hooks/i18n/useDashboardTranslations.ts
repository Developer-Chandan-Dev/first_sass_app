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
        // Missing keys for budget expenses
        remaining: safeTExpenses('remaining', 'Remaining'),
        spent: safeTExpenses('spent', 'Spent'),
        available: safeTExpenses('available', 'Available'),
        exceeded: safeTExpenses('exceeded', 'Exceeded'),
        totalBudget: safeTExpenses('totalBudget', 'Total Budget'),
        activeBudgets: safeTExpenses('activeBudgets', 'Active Budgets'),
        budgetSpent: safeTExpenses('budgetSpent', 'Budget Spent'),
        budgetLeft: safeTExpenses('budgetLeft', 'Budget Left'),
        budgetExpensesCount: safeTExpenses(
          'budgetExpensesCount',
          'Budget Expenses Count'
        ),
        // Missing keys for table
        exportAll: safeTExpenses('exportAll', 'Export All'),
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
        oneTime: safeTExpenses('oneTime', 'One Time'),
        showing: safeTExpenses('showing', 'Showing'),
        entries: safeTExpenses('entries', 'entries'),
        perPage: safeTExpenses('perPage', 'per page'),
        lastMonth: safeTExpenses('lastMonth', 'Last Month'),
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
        incomeOverview: safeTIncome('overview', 'Overview'),
        incomeTable: safeTIncome('table', 'Table'),
        incomeCharts: safeTIncome('charts', 'Charts'),
        viewExpenses: safeTIncome('viewExpenses', 'View Expenses'),
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
          incomeDate: safeTIncome('form.date', 'Date'),
          incomeDescription: safeTIncome('form.description', 'Description'),
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
        }
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
          workingOnFeatures: safeTDashboard(
            'pages.budgets.workingOnFeatures',
            "We're working on advanced features"
          ),
        },
        cards: {
          title: safeTDashboard('pages.cards.title', 'Cards'),
          description: safeTDashboard(
            'pages.cards.description',
            'Manage your cards'
          ),
          comingSoon: safeTDashboard('pages.cards.comingSoon', 'Coming Soon'),
        },
        categories: {
          title: safeTDashboard('pages.categories.title', 'Categories'),
          description: safeTDashboard(
            'pages.categories.description',
            'Manage expense categories'
          ),
        },
        notifications: {
          title: safeTDashboard('pages.notifications.title', 'Notifications'),
          description: safeTDashboard(
            'pages.notifications.description',
            'Manage your notifications'
          ),
          comingSoon: safeTDashboard(
            'pages.notifications.comingSoon',
            'Coming Soon'
          ),
        },
        settings: {
          title: safeTDashboard('pages.settings.title', 'Settings'),
          description: safeTDashboard(
            'pages.settings.description',
            'Application settings'
          ),
          comingSoon: safeTDashboard(
            'pages.settings.comingSoon',
            'Coming Soon'
          ),
          workingOnFeatures: safeTDashboard(
            'pages.settings.workingOnFeatures',
            "We're working on advanced features"
          ),
        },
      },

      // Raw translator for dynamic keys
      t,
    }),
    [
      baseTranslations,
      t,
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
    ]
  );
}
