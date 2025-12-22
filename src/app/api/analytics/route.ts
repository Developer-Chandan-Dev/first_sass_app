import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import Expense from '@/models/Expense';
import Income from '@/models/Income';
import UdharCustomer from '@/models/UdharCustomer';
import UdharTransaction from '@/models/UdharTransaction';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Fetch Expenses and Income Data
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    
    // Fetch Udhar Data
    const udharCustomers = await UdharCustomer.find({ userId });
    const udharTransactions = await UdharTransaction.find({ userId }).sort({ date: -1 });

    // === EXPENSE ANALYTICS ===
    const categoryMap = new Map<string, { amount: number; count: number }>();
    expenses.forEach(exp => {
      const existing = categoryMap.get(exp.category) || { amount: 0, count: 0 };
      categoryMap.set(exp.category, {
        amount: existing.amount + exp.amount,
        count: existing.count + 1
      });
    });

    const expenseCategoryData = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      amount: data.amount,
      count: data.count
    })).sort((a, b) => b.amount - a.amount);

    // === UDHAR ANALYTICS ===
    const totalUdharOutstanding = udharCustomers.reduce((sum, c) => sum + c.totalOutstanding, 0);
    const totalUdharPurchases = udharTransactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0);
    const totalUdharPayments = udharTransactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.amount, 0);

    // === MONTHLY TREND (Last 6 months) ===
    const now = new Date();
    const monthlyMap = new Map<string, { expenses: number; income: number; udharPurchases: number; udharPayments: number }>();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyMap.set(monthKey, { expenses: 0, income: 0, udharPurchases: 0, udharPayments: 0 });
    }

    expenses.forEach(exp => {
      const expDate = new Date(exp.date);
      const monthKey = expDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const existing = monthlyMap.get(monthKey);
      if (existing) {
        existing.expenses += exp.amount;
      }
    });

    incomes.forEach(inc => {
      const incDate = new Date(inc.date);
      const monthKey = incDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const existing = monthlyMap.get(monthKey);
      if (existing) {
        existing.income += inc.amount;
      }
    });

    udharTransactions.forEach(trans => {
      const transDate = new Date(trans.date);
      const monthKey = transDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const existing = monthlyMap.get(monthKey);
      if (existing) {
        if (trans.type === 'purchase') {
          existing.udharPurchases += trans.amount;
        } else {
          existing.udharPayments += trans.amount;
        }
      }
    });

    const monthlyData = Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      expenses: data.expenses,
      income: data.income,
      udharPurchases: data.udharPurchases,
      udharPayments: data.udharPayments
    }));

    // === OVERALL STATS ===
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
    const topExpenseCategory = expenseCategoryData.length > 0 ? expenseCategoryData[0].category : '';

    // Monthly growth
    const currentMonth = monthlyData[monthlyData.length - 1]?.expenses || 0;
    const previousMonth = monthlyData[monthlyData.length - 2]?.expenses || 0;
    const expenseGrowth = previousMonth > 0 
      ? ((currentMonth - previousMonth) / previousMonth) * 100 
      : 0;

    return NextResponse.json({
      // Expense Analytics
      expenseStats: {
        total: totalExpenses,
        average: avgExpense,
        topCategory: topExpenseCategory,
        monthlyGrowth: expenseGrowth,
        transactionCount: expenses.length
      },
      expenseCategoryData,

      // Udhar Analytics
      udharStats: {
        totalOutstanding: totalUdharOutstanding,
        totalPurchases: totalUdharPurchases,
        totalPayments: totalUdharPayments,
        customerCount: udharCustomers.length,
        transactionCount: udharTransactions.length
      },

      // Combined Monthly Trend
      monthlyData,

      // Summary
      summary: {
        totalExpenses,
        totalUdharOutstanding,
        netCashFlow: totalUdharPayments - totalExpenses - totalUdharPurchases
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
