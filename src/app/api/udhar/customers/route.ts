import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import UdharCustomer from '@/models/UdharCustomer';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const customers = await UdharCustomer.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(customers);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, phone, address, creditLimit } = await req.json();
    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    await connectDB();
    const customer = await UdharCustomer.create({ userId, name, phone, address, creditLimit, totalOutstanding: 0 });
    return NextResponse.json(customer, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
