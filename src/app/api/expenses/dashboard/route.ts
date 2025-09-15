import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Budget from '@/models/Budget';
import Expense from '@/models/Expense';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'free';

    await connectDB();

    if (type === 'budget') {
      // Budget dashboard data
      const [budgets, budgetExpenses, expenseStats] = await Promise.all([
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

      return NextResponse.json({
        budgets: budgetsWithStats,
        expenses: budgetExpenses,
        categories: expenseStats[0].byCategory.map((c: { _id: string }) => c._id),
        stats: {
          totalBudget: budgets.reduce((sum, b) => sum + b.amount, 0),
          totalSpent: expenseStats[0].total[0]?.total || 0,
          totalExpenses: expenseStats[0].total[0]?.count || 0,
          categoryBreakdown: expenseStats[0].byCategory
        }
      });
    } else {
      // Free expenses dashboard data
      const [expenses, expenseStats] = await Promise.all([
        Expense.find({ userId, type: 'free' }).sort({ date: -1 }).limit(10),
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
        ])
      ]);

      return NextResponse.json({
        expenses,
        categories: expenseStats[0].byCategory.map((c: { _id: string }) => c._id),
        stats: {
          totalSpent: expenseStats[0].total[0]?.total || 0,
          totalExpenses: expenseStats[0].total[0]?.count || 0,
          categoryBreakdown: expenseStats[0].byCategory,
          recentTrend: expenseStats[0].recent
        }
      });
    }
  } catch (error) {
    console.error('Expenses dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}