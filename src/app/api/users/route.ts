import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

export async function POST() {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: userId });
    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    // Create new user
    const newUser = await User.create({
      clerkId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      plan: clerkUser.publicMetadata?.plan || 'free',
      limits: {
        maxExpenses: 10000,
        maxBudgets: 100,
      },
    });

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
