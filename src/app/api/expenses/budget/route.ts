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
      return NextResponse.json(
        {
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          details: 'User authentication required',
        },
        { status: 401 }
      );
    }

    await connectDB();

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: 'Invalid JSON data',
          code: 'INVALID_JSON',
          details: 'Request body must be valid JSON',
        },
        { status: 400 }
      );
    }

    const { name, amount, category, duration, startDate, endDate } = body;

    // Detailed field validation
    const validationErrors = [];

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      validationErrors.push({
        field: 'name',
        message: 'Budget name is required',
      });
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      validationErrors.push({
        field: 'amount',
        message: 'Amount must be a positive number',
      });
    }

    if (!duration || !['monthly', 'weekly', 'custom'].includes(duration)) {
      validationErrors.push({
        field: 'duration',
        message: 'Duration must be monthly, weekly, or custom',
      });
    }

    if (!startDate || isNaN(Date.parse(startDate))) {
      validationErrors.push({
        field: 'startDate',
        message: 'Valid start date is required',
      });
    }

    if (!endDate || isNaN(Date.parse(endDate))) {
      validationErrors.push({
        field: 'endDate',
        message: 'Valid end date is required',
      });
    }

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      validationErrors.push({
        field: 'endDate',
        message: 'End date must be after start date',
      });
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Check user limits
    const [user, budgetCount] = await Promise.all([
      User.findOne({ clerkId: userId }),
      Budget.countDocuments({ userId, isActive: true }),
    ]);

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found',
          code: 'USER_NOT_FOUND',
          details: 'User account not found in database',
        },
        { status: 404 }
      );
    }

    if (budgetCount >= user.limits.maxBudgets) {
      return NextResponse.json(
        {
          error: `Budget limit reached. Upgrade to create more than ${user.limits.maxBudgets} budgets.`,
          code: 'BUDGET_LIMIT_REACHED',
          details: {
            currentCount: budgetCount,
            maxAllowed: user.limits.maxBudgets,
            userPlan: user.plan,
          },
        },
        { status: 403 }
      );
    }

    const budgetData = {
      userId,
      name,
      amount: parseFloat(amount),
      category,
      duration,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: true,
    };

    const budget = new Budget(budgetData);
    await budget.save();

    return NextResponse.json({
      success: true,
      data: budget,
      message: 'Budget created successfully',
    });
  } catch (error) {
    console.error('Error creating budget:', error);

    // Handle specific MongoDB errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        {
          error: 'Database validation failed',
          code: 'DB_VALIDATION_ERROR',
          details: error.message,
        },
        { status: 400 }
      );
    }

    if (
      error instanceof Error &&
      (error.name === 'MongoError' || error.name === 'MongoServerError')
    ) {
      return NextResponse.json(
        {
          error: 'Database operation failed',
          code: 'DATABASE_ERROR',
          details: 'Please try again later',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create budget',
        code: 'INTERNAL_ERROR',
        details: 'An unexpected error occurred',
      },
      { status: 500 }
    );
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
          budgetId: { $exists: true },
        },
      },
      {
        $group: {
          _id: '$budgetId',
          spent: { $sum: '$amount' },
        },
      },
    ]);

    // Create lookup map for O(1) access
    const spentMap = expenseStats.reduce(
      (acc, stat) => {
        acc[stat._id] = stat.spent;
        return acc;
      },
      {} as Record<string, number>
    );

    // Calculate stats for each budget
    const budgetsWithStats = budgets.map((budget) => {
      const spentAmount = spentMap[budget._id.toString()] || 0;
      const remaining = Math.max(0, budget.amount - spentAmount);
      const percentage =
        budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0;

      return {
        ...budget.toObject(),
        spent: spentAmount,
        remaining,
        percentage,
      };
    });

    return NextResponse.json(budgetsWithStats);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}
