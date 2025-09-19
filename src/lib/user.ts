import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

export async function ensureUser() {
  const { userId } = await auth();
  if (!userId) return null;

  await connectDB();
  
  let user = await User.findOne({ clerkId: userId });
  
  if (!user) {
    // Auto-create user if doesn't exist
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/users`, {
      method: 'POST',
    });
    user = await User.findOne({ clerkId: userId });
  }
  
  return user;
}