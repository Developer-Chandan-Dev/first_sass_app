import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const plan = searchParams.get('plan') || '';

    await connectDB();

    const query: Record<string, unknown> = {};
    
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }
    
    if (plan && plan !== 'all') {
      query.plan = plan;
    }

    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      users,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}