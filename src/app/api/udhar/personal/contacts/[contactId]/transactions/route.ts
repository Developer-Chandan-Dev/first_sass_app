import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import PersonalTransaction from '@/models/PersonalTransaction';
import PersonalContact from '@/models/PersonalContact';
import { paymentSchema } from '@/lib/validation/personal-udhar-schemas';

export async function GET(req: Request, { params }: { params: Promise<{ contactId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contactId } = await params;
    await connectDB();
    
    const transactions = await PersonalTransaction.find({ userId, contactId }).sort({ date: -1 });

    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ contactId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contactId } = await params;
    const body = await req.json();
    
    // Validate with Zod
    const validationResult = paymentSchema.safeParse({
      amount: parseFloat(body.amount),
      description: body.description,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if contact exists and belongs to user
    const contact = await PersonalContact.findOne({ _id: contactId, userId });
    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Check if payment exceeds remaining amount
    if (validationResult.data.amount > contact.remainingAmount) {
      return NextResponse.json(
        { error: 'Payment amount exceeds remaining balance' },
        { status: 400 }
      );
    }

    const transaction = await PersonalTransaction.create({
      userId,
      contactId,
      type: 'payment',
      ...validationResult.data,
    });

    // Update contact amounts
    contact.paidAmount += validationResult.data.amount;
    contact.remainingAmount = contact.totalAmount - contact.paidAmount;
    await contact.save();

    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
