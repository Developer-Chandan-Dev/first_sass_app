import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Expense from '@/models/Expense';
import Income from '@/models/Income';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface ChartDataPoint {
  period: string;
  income: number;
  expenses: number;
  net: number;
}

interface AggregationResult {
  _id: string;
  total: number;
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') || 'monthly') as Period;
    const yearParam = searchParams.get('year');
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();
    
    if (isNaN(year) || year < 1900 || year > 2100) {
      return NextResponse.json({ error: 'Invalid year parameter' }, { status: 400 });
    }

    await connectDB();

    let groupBy: Record<string, unknown>;
    let periods: string[];
    let startDate: Date;
    let endDate: Date;

    const now = new Date();
    
    switch (period) {
      case 'daily': {
        // Last 7 days
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        
        periods = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          return date.toISOString().split('T')[0];
        });
        groupBy = {
          $dateToString: { format: '%Y-%m-%d', date: '$date' }
        };
        break;
      }

      case 'weekly': {
        // Last 4 weeks
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 27);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        
        periods = Array.from({ length: 4 }, (_, i) => {
          const weekStart = new Date(startDate);
          weekStart.setDate(weekStart.getDate() + (i * 7));
          const year = weekStart.getFullYear();
          const weekNum = Math.ceil((weekStart.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
          return `Week ${weekNum}`;
        });
        groupBy = {
          $dateToString: { format: '%Y-%U', date: '$date' }
        };
        break;
      }

      case 'yearly': {
        // Last 3 years
        startDate = new Date(year - 2, 0, 1);
        endDate = new Date(year, 11, 31, 23, 59, 59, 999);
        
        periods = Array.from({ length: 3 }, (_, i) => (year - 2 + i).toString());
        groupBy = {
          $toString: { $year: '$date' }
        };
        break;
      }

      case 'monthly':
      default: {
        // 12 months of current year
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 11, 31, 23, 59, 59, 999);
        
        periods = Array.from({ length: 12 }, (_, i) => {
          return new Date(year, i).toLocaleDateString('en-US', { month: 'short' });
        });
        groupBy = {
          $dateToString: { format: '%Y-%m', date: '$date' }
        };
        break;
      }
    }

    // Get expenses data
    const expensesData = await Expense.aggregate<AggregationResult>([
      {
        $match: {
          userId,
          date: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: groupBy,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get incomes data
    const incomesData = await Income.aggregate<AggregationResult>([
      {
        $match: {
          userId,
          date: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: groupBy,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Create lookup maps
    const expensesMap = new Map<string, number>(expensesData.map(item => [item._id, item.total]));
    const incomesMap = new Map<string, number>(incomesData.map(item => [item._id, item.total]));

    // Generate chart data
    const chartData: ChartDataPoint[] = periods.map((periodLabel, index) => {
      let periodKey: string;
      
      switch (period) {
        case 'daily':
          periodKey = periods[index];
          break;
        case 'weekly': {
          const weekStart = new Date(startDate);
          weekStart.setDate(weekStart.getDate() + (index * 7));
          const year = weekStart.getFullYear();
          const weekNum = Math.ceil((weekStart.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
          periodKey = `${year}-${String(weekNum).padStart(2, '0')}`;
          break;
        }
        case 'monthly':
          periodKey = `${year}-${String(index + 1).padStart(2, '0')}`;
          break;
        case 'yearly':
          periodKey = (year - 2 + index).toString();
          break;
        default:
          periodKey = periods[index];
      }

      const expenses = expensesMap.get(periodKey) || 0;
      const income = incomesMap.get(periodKey) || 0;

      return {
        period: periodLabel,
        income: Math.round(income * 100) / 100,
        expenses: Math.round(expenses * 100) / 100,
        net: Math.round((income - expenses) * 100) / 100
      };
    });

    const summary = {
      totalIncome: Math.round(chartData.reduce((sum, item) => sum + item.income, 0) * 100) / 100,
      totalExpenses: Math.round(chartData.reduce((sum, item) => sum + item.expenses, 0) * 100) / 100,
      netTotal: Math.round(chartData.reduce((sum, item) => sum + item.net, 0) * 100) / 100
    };

    return NextResponse.json({
      data: chartData,
      period,
      year,
      summary
    });

  } catch (error) {
    console.error('Dashboard chart API error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to fetch chart data: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}