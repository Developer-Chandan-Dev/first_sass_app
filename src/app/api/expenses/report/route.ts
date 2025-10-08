import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import Expense from '@/models/Expense';
import { sanitizeString } from '@/lib/input-sanitizer';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'monthly';
    const type = searchParams.get('type') || 'free';

    await connectDB();

    let groupBy: Record<string, unknown>;
    let dateRange: Date;
    const now = new Date();

    switch (period) {
      case 'daily':
        dateRange = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
        groupBy = {
          $dateToString: { format: "%Y-%m-%d", date: "$date" }
        };
        break;
      case 'weekly':
        dateRange = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000); // Last 12 weeks
        groupBy = {
          $dateToString: { format: "%Y-W%U", date: "$date" }
        };
        break;
      case 'yearly':
        dateRange = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000); // Last 5 years
        groupBy = {
          $dateToString: { format: "%Y", date: "$date" }
        };
        break;
      default: // monthly
        dateRange = new Date(now.getTime() - 12 * 30 * 24 * 60 * 60 * 1000); // Last 12 months
        groupBy = {
          $dateToString: { format: "%Y-%m", date: "$date" }
        };
    }

    const reportData = await Expense.aggregate([
      { 
        $match: { 
          userId, 
          type, 
          date: { $gte: dateRange } 
        } 
      },
      {
        $group: {
          _id: groupBy,
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const result = reportData.map(item => ({
      period: sanitizeString(item._id),
      amount: item.amount,
      count: item.count
    }));

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching report data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}