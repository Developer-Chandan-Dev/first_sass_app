import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import VendorTransaction from '@/models/VendorTransaction';
import UdharVendor from '@/models/UdharVendor';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { vendorId, type, amount, paidAmount, description, items, paymentMethod, dueDate } = await req.json();
    
    if (!vendorId || !type || !amount || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const finalPaidAmount = paidAmount || 0;
    const remaining = type === 'purchase' ? amount - finalPaidAmount : 0;
    const status = type === 'purchase' ? (remaining === 0 ? 'completed' : 'pending') : 'completed';

    const transaction = await VendorTransaction.create({
      userId,
      vendorId,
      type,
      amount,
      paidAmount: finalPaidAmount,
      description,
      items: items || undefined,
      paymentMethod: paymentMethod || undefined,
      status,
      remainingAmount: remaining,
      dueDate: dueDate || undefined,
    });

    // If purchase with partial payment, create automatic payment entry
    if (type === 'purchase' && finalPaidAmount > 0) {
      await VendorTransaction.create({
        userId,
        vendorId,
        type: 'payment',
        amount: finalPaidAmount,
        paidAmount: 0,
        description: `Payment for: ${description}`,
        paymentMethod: paymentMethod || 'cash',
        status: 'completed',
        remainingAmount: 0,
      });
    }

    const vendor = await UdharVendor.findById(vendorId);
    if (vendor) {
      if (type === 'purchase') {
        vendor.totalOwed += (amount - (paidAmount || 0));
      } else if (type === 'payment') {
        vendor.totalOwed -= amount;
      }
      await vendor.save();
    }

    return NextResponse.json(transaction, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');

    await connectDB();
    const query: { userId: string; vendorId?: string } = { userId };
    if (vendorId) query.vendorId = vendorId;

    const transactions = await VendorTransaction.find(query).sort({ date: -1 }).populate('vendorId');
    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
