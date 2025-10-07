import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Budget from '@/models/Budget';
import Expense from '@/models/Expense';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    
    const { name, amount, category, duration, startDate, endDate } = body;

    if (!name || !amount || !duration || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check user limits
    const [user, budgetCount] = await Promise.all([
      User.findOne({ clerkId: userId }),
      Budget.countDocuments({ userId, isActive: true })
    ]);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (budgetCount >= user.limits.maxBudgets) {
      return NextResponse.json({ 
        error: `Budget limit reached. Upgrade to create more than ${user.limits.maxBudgets} budgets.` 
      }, { status: 403 });
    }
    
    const budgetData = {
      userId,
      name,
      amount: parseFloat(amount),
      category,
      duration,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: true
    };
    
    const budget = new Budget(budgetData);
    await budget.save();
    
    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    await connectDB();

    const query: Record<string, unknown> = { userId };
    if (activeOnly) {
      query.isActive = true;
    }

    const budgets = await Budget.find(query).sort({ createdAt: -1 });

    // Single aggregation to get all budget expenses at once
    const expenseStats = await Expense.aggregate([
      {
        $match: {
          userId,
          type: 'budget',
          budgetId: { $exists: true }
        }
      },
      {
        $group: {
          _id: '$budgetId',
          spent: { $sum: '$amount' }
        }
      }
    ]);

    // Create lookup map for O(1) access
    const spentMap = expenseStats.reduce((acc, stat) => {
      acc[stat._id] = stat.spent;
      return acc;
    }, {} as Record<string, number>);

    // Calculate stats for each budget
    const budgetsWithStats = budgets.map(budget => {
      const spentAmount = spentMap[budget._id.toString()] || 0;
      const remaining = Math.max(0, budget.amount - spentAmount);
      const percentage = budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0;

      return {
        ...budget.toObject(),
        spent: spentAmount,
        remaining,
        percentage
      };
    });

    return NextResponse.json(budgetsWithStats);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}