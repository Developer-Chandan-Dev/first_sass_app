import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import UdharCustomer from '@/models/UdharCustomer';
import UdharTransaction from '@/models/UdharTransaction';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectDB();
    
    const customer = await UdharCustomer.findOne({ _id: id, userId });
    if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    const transactions = await UdharTransaction.find({ customerId: id, userId }).sort({ date: -1 });
    return NextResponse.json({ customer, transactions });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { name, phone, address, creditLimit } = await req.json();

    await connectDB();
    const customer = await UdharCustomer.findOneAndUpdate(
      { _id: id, userId },
      { name, phone, address, creditLimit },
      { new: true }
    );

    if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    return NextResponse.json(customer);
  } catch {
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const customer = await UdharCustomer.findOneAndDelete({ _id: id, userId });
    if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    await UdharTransaction.deleteMany({ customerId: id, userId });
    return NextResponse.json({ message: 'Customer deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}
