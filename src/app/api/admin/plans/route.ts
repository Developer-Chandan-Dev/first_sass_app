import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Plan from '@/models/Plan';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const plans = await Plan.find().sort({ price: 1 });
    
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Plans fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, price, interval, features } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    await connectDB();
    
    const plan = await Plan.create({
      name,
      price: parseFloat(price),
      interval: interval || 'monthly',
      features: {
        maxExpenses: features?.maxExpenses || 50,
        maxBudgets: features?.maxBudgets || 3,
        analytics: features?.analytics || false,
        export: features?.export || false,
        priority: features?.priority || false,
      },
    });

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Plan creation error:', error);
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}