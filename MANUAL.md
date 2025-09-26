# 💰 Advanced Expense Management System - User Manual

## Table of Contents
1. [Getting Started](#getting-started)
2. [Income Management](#income-management)
3. [Expense Tracking](#expense-tracking)
4. [Balance System](#balance-system)
5. [Visual Indicators](#visual-indicators)
6. [Features Overview](#features-overview)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Time Setup
1. **Register/Login** using Clerk authentication
2. **Navigate to Dashboard** - Your main control center
3. **Add your first income source** - Start with your primary income
4. **Add your first expense** - Track your spending
5. **Explore the features** - Charts, filters, exports

### Dashboard Overview
- **Overview Tab**: Summary cards and coming soon features
- **Income Section**: Manage all income sources
- **Expenses Section**: Track all your spending
- **Analytics**: Visual charts and insights

---

## Income Management

### Adding Income Sources

#### Step-by-Step Process:
1. Go to **Dashboard → Income**
2. Click **"Add Income"** button
3. Fill in the form:
   - **Amount**: Enter the income amount
   - **Source**: Select from dropdown (Salary, Freelancing, Business, etc.)
   - **Description**: Brief description of the income
   - **Date**: When you received it
   - **Connect to Balance**: Toggle ON/OFF
   - **Recurring**: Set if it's a regular income
   - **Frequency**: Daily/Weekly/Monthly/Yearly (if recurring)

#### Income Connection Options:

**🔵 Connected Income (Blue Indicator)**
- ✅ Affects balance calculation
- ✅ Expenses can reduce from it
- ✅ Used for budget management
- ✅ Best for: Salary, regular income

**🟢 Unconnected Income (Green, No Indicator)**
- ✅ Tracking purposes only
- ✅ Doesn't affect balance
- ✅ Shows in total income
- ✅ Best for: Gifts, bonuses, one-time payments

---

## Expense Tracking

### Adding Expenses

#### Step-by-Step Process:
1. Go to **Dashboard → Expenses**
2. Click **"Add Expense"** button
3. Fill in the form:
   - **Amount**: Enter expense amount
   - **Category**: Select or create custom category
   - **Reason**: Describe what the expense was for
   - **Date**: When the expense occurred
   - **Reduce from Balance**: Toggle ON/OFF
   - **Recurring**: Set if it's a regular expense
   - **Frequency**: Daily/Weekly/Monthly/Yearly (if recurring)

#### Expense Types:

**🔴 Balance-Affecting Expenses (Red Indicator)**
- ✅ Reduces from connected income
- ✅ Affects balance calculation
- ✅ Best for: Rent, groceries, utilities, regular expenses

**⚫ Regular Expenses (Gray, No Indicator)**
- ✅ Tracking purposes only
- ✅ Doesn't affect balance
- ✅ Best for: Business expenses, reimbursable items

---

## Balance System

### How Balance Works

**Formula**: `Balance = Connected Income - Balance-Affecting Expenses`

### Example Scenario:
```
Connected Income:
├── Salary: +₹50,000 🔵
└── Freelance: +₹15,000 🔵
Total Connected: ₹65,000

Unconnected Income:
└── Gift: +₹5,000 🟢

Balance-Affecting Expenses:
├── Rent: -₹20,000 🔴
├── Groceries: -₹8,000 🔴
└── Utilities: -₹3,000 🔴
Total Balance-Affecting: ₹31,000

Regular Expenses:
└── Business Lunch: -₹2,000 ⚫

RESULT:
├── Balance: ₹34,000 (₹65,000 - ₹31,000)
├── Total Income: ₹70,000
└── Total Expenses: ₹33,000
```

---

## Visual Indicators

### Income Table Indicators:
- **🔵 Blue Dot + Blue Amount**: Connected income (affects balance)
- **🟢 Green Amount (no dot)**: Unconnected income (tracking only)

### Expense Table Indicators:
- **🔴 Red Dot + Red Amount**: Balance-affecting expense (reduces balance)
- **⚫ Gray Amount (no dot)**: Regular expense (tracking only)

### Dashboard Cards:
- **Balance Card**: Only appears when you have connected income
- **Connected Income Card**: Shows breakdown of balance-affecting income
- **Status Badge**: "Balance Tracking Active" when connections exist

---

## Features Overview

### 🔍 Search & Filter
- **Search**: Find transactions by description or category
- **Date Filters**: Today, Week, Month, Custom range
- **Category Filter**: Filter by specific categories
- **Recurring Filter**: Show only recurring or one-time transactions
- **Sorting**: Click column headers to sort

### 📊 Analytics & Charts
- **Spending Trends**: 7-day expense charts
- **Category Breakdown**: Pie charts showing spending distribution
- **Statistics Cards**: Key metrics with trend indicators
- **Recent Activity**: Timeline of latest transactions

### 📥 Export Options
- **CSV Export**: Spreadsheet-compatible format
- **PDF Export**: Customizable reports with multiple layout options
- **Bulk Operations**: Select multiple items for batch actions
- **Copy to Clipboard**: Quick data sharing

### 🔄 Recurring Transactions
- **Frequencies**: Daily, Weekly, Monthly, Yearly
- **Auto-tracking**: Automatic categorization
- **Easy Management**: Edit or delete recurring items
- **Visual Indicators**: Badges showing frequency

---

## Best Practices

### ✅ Recommended Setup:
1. **Connect your main income sources** (salary, primary business income)
2. **Use balance-affecting for regular expenses** (rent, utilities, groceries)
3. **Keep business expenses separate** (use regular tracking)
4. **Set up recurring transactions** for predictable income/expenses
5. **Review balance regularly** to stay on track
6. **Export data monthly** for record-keeping

### ❌ Common Mistakes to Avoid:
1. **Not connecting regular income** - You won't see balance tracking
2. **Making all expenses balance-affecting** - Skews your actual available funds
3. **Forgetting to categorize** - Makes analytics less useful
4. **Not using recurring features** - More manual work
5. **Mixing personal and business** - Complicates tax reporting

### 💡 Pro Tips:
1. **Use descriptive transaction names** for easy searching
2. **Leverage bulk operations** for efficiency
3. **Export reports for tax purposes** 
4. **Monitor balance trends** to spot spending patterns
5. **Set up budget categories** for better organization
6. **Use search shortcuts** (Ctrl+F) for quick finding

---

## Troubleshooting

### Balance Not Updating?
- ✅ Check if income is marked as "Connected"
- ✅ Verify expenses have "Reduce from Balance" enabled
- ✅ Refresh the page to sync latest data

### Missing Transactions?
- ✅ Check date filters - expand date range
- ✅ Clear search terms that might be filtering results
- ✅ Verify you're in the correct expense type (Free vs Budget)

### Export Not Working?
- ✅ Ensure you have transactions to export
- ✅ Check browser popup blockers
- ✅ Try different export format (CSV vs PDF)

### Performance Issues?
- ✅ Clear browser cache and cookies
- ✅ Reduce page size in table settings
- ✅ Use date filters to limit data range

---

## Quick Reference

### Keyboard Shortcuts:
- `Ctrl + N` - New transaction
- `Ctrl + F` - Search
- `Ctrl + E` - Export
- `Enter` - Confirm search
- `Esc` - Close modals

### Color Code:
- 🔵 **Blue**: Connected income/balance elements
- 🟢 **Green**: Unconnected income/positive values
- 🔴 **Red**: Balance-affecting expenses/negative values
- ⚫ **Gray**: Regular tracking items

### Navigation:
- **Dashboard**: Main overview and stats
- **Income**: Manage all income sources
- **Expenses**: Track all spending
- **Analytics**: Charts and insights
- **Settings**: Account and preferences

---

## Support

For additional help:
1. **Visit the Guide**: `/guide` page in the application
2. **Check Documentation**: Comprehensive in-app help
3. **Review Examples**: Sample scenarios in the guide
4. **Best Practices**: Follow recommended setup procedures

**Remember**: The key to effective expense management is consistent tracking and proper categorization of your income and expenses!