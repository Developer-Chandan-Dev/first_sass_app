import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
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

    const categoryData = await Expense.aggregate([
      { $match: { userId, type } },
      { 
        $group: { 
          _id: '$category', 
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        } 
      },
      { $sort: { total: -1 } },
      { $limit: 8 }
    ]);

    const result = categoryData.map(item => ({
      category: item._id,
      total: item.total,
      count: item.count
    }));

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching category data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}