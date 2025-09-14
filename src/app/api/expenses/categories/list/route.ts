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

    const categories = await Expense.distinct('category', { userId, type });
    const filteredCategories = categories.filter(Boolean);
    
    console.log('Categories found:', filteredCategories);
    return NextResponse.json(filteredCategories);

  } catch (error) {
    console.error('Error fetching categories list:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}