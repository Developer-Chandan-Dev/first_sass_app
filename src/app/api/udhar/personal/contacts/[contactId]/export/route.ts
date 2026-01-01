import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import PersonalTransaction from '@/models/PersonalTransaction';
import PersonalContact from '@/models/PersonalContact';

export async function GET(req: Request, { params }: { params: Promise<{ contactId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contactId } = await params;
    await connectDB();
    
    const contact = await PersonalContact.findOne({ _id: contactId, userId });
    const transactions = await PersonalTransaction.find({ userId, contactId }).sort({ date: 1 });

    // Generate CSV
    let csv = 'Date,Type,Amount,Description\n';
    transactions.forEach((txn) => {
      csv += `${new Date(txn.date).toLocaleDateString()},${txn.type},${txn.amount},"${txn.description || ''}"\n`;
    });

    csv += `\nSummary\n`;
    csv += `Contact Name,${contact?.name}\n`;
    csv += `Total Amount,${contact?.totalAmount}\n`;
    csv += `Paid Amount,${contact?.paidAmount}\n`;
    csv += `Remaining Amount,${contact?.remainingAmount}\n`;

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${contact?.name}_transactions.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
