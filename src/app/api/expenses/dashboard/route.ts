import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Budget from '@/models/Budget';
import Expense from '@/models/Expense';
import { sanitizeString } from '@/lib/input-sanitizer';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'free';

    await connectDB();

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    if (type === 'budget') {
      // Budget dashboard data
      const [budgets, budgetExpenses, expenseStats, previousMonthStats] = await Promise.all([
        Budget.find({ userId }).sort({ createdAt: -1 }),
        Expense.find({ userId, type: 'budget' }).sort({ date: -1 }).limit(5),
        Expense.aggregate([
          { $match: { userId, type: 'budget' } },
          {
            $facet: {
              byBudget: [
                { $group: { _id: '$budgetId', spent: { $sum: '$amount' } } }
              ],
              byCategory: [
                { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } }
              ],
              total: [
                { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
              ]
            }
          }
        ]),
        Expense.aggregate([
          { 
            $match: { 
              userId, 
              type: 'budget',
              $expr: {
                $and: [
                  { $eq: [{ $month: '$date' }, lastMonth + 1] },
                  { $eq: [{ $year: '$date' }, lastMonthYear] }
                ]
              }
            } 
          },
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ])
      ]);

      const spentMap = expenseStats[0].byBudget.reduce((acc: Record<string, number>, stat: { _id: string; spent: number }) => {
        if (stat._id) acc[stat._id] = stat.spent;
        return acc;
      }, {} as Record<string, number>);

      const budgetsWithStats = budgets.map(budget => {
        const spent = spentMap[budget._id.toString()] || 0;
        const remaining = Math.max(0, budget.amount - spent);
        const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

        return {
          ...budget.toObject(),
          spent,
          remaining,
          percentage
        };
      });

      const currentSpent = expenseStats[0].total[0]?.total || 0;
      const currentExpenses = expenseStats[0].total[0]?.count || 0;
      const previousSpent = previousMonthStats[0]?.total || 0;
      const previousExpenses = previousMonthStats[0]?.count || 0;
      
      const monthlyChange = previousSpent > 0 ? ((currentSpent - previousSpent) / previousSpent) * 100 : 0;
      const expenseChange = previousExpenses > 0 ? currentExpenses - previousExpenses : 0;

      return NextResponse.json({
        budgets: budgetsWithStats,
        expenses: budgetExpenses,
        categories: expenseStats[0].byCategory.map((c: { _id: string }) => sanitizeString(c._id)),
        stats: {
          totalBudget: budgets.reduce((sum, b) => sum + b.amount, 0),
          totalSpent: currentSpent,
          totalExpenses: currentExpenses,
          categoryBreakdown: expenseStats[0].byCategory,
          previousMonthSpent: previousSpent,
          previousMonthExpenses: previousExpenses,
          monthlyChange: Math.round(monthlyChange * 100) / 100,
          expenseChange
        }
      });
    } else {
      // Free expenses dashboard data
      const [expenses, expenseStats, previousMonthStats] = await Promise.all([
        Expense.find({ userId, type: 'free' }).sort({ date: -1 }).limit(7),
        Expense.aggregate([
          { $match: { userId, type: 'free' } },
          {
            $facet: {
              byCategory: [
                { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } }
              ],
              total: [
                { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
              ],
              recent: [
                { $sort: { date: -1 } },
                { $limit: 7 },
                {
                  $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    total: { $sum: '$amount' }
                  }
                }
              ]
            }
          }
        ]),
        Expense.aggregate([
          { 
            $match: { 
              userId, 
              type: 'free',
              $expr: {
                $and: [
                  { $eq: [{ $month: '$date' }, lastMonth + 1] },
                  { $eq: [{ $year: '$date' }, lastMonthYear] }
                ]
              }
            } 
          },
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ])
      ]);

      const currentSpent = expenseStats[0].total[0]?.total || 0;
      const currentExpenses = expenseStats[0].total[0]?.count || 0;
      const previousSpent = previousMonthStats[0]?.total || 0;
      const previousExpenses = previousMonthStats[0]?.count || 0;
      
      const monthlyChange = previousSpent > 0 ? ((currentSpent - previousSpent) / previousSpent) * 100 : 0;
      const expenseChange = previousExpenses > 0 ? currentExpenses - previousExpenses : 0;

      return NextResponse.json({
        expenses,
        categories: expenseStats[0].byCategory.map((c: { _id: string }) => sanitizeString(c._id)),
        stats: {
          totalSpent: currentSpent,
          totalExpenses: currentExpenses,
          categoryBreakdown: expenseStats[0].byCategory.map((c: { _id: string; total: number; count: number }) => ({
            ...c,
            _id: sanitizeString(c._id)
          })),
          recentTrend: expenseStats[0].recent,
          previousMonthSpent: previousSpent,
          previousMonthExpenses: previousExpenses,
          monthlyChange: Math.round(monthlyChange * 100) / 100,
          expenseChange
        }
      });
    }
  } catch (error) {
    console.error('Expenses dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}