import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import PersonalContact from '@/models/PersonalContact';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const contacts = await PersonalContact.find({ userId }).sort({ type: 1, name: 1 });

    // Generate CSV
    let csv = 'Name,Phone,Email,Type,Total Amount,Paid Amount,Remaining Amount,Notes\n';
    
    contacts.forEach((contact) => {
      csv += `"${contact.name}","${contact.phone || ''}","${contact.email || ''}",${contact.type},${contact.totalAmount},${contact.paidAmount},${contact.remainingAmount},"${contact.notes || ''}"\n`;
    });

    const totalLent = contacts.filter(c => c.type === 'lent').reduce((sum, c) => sum + c.remainingAmount, 0);
    const totalBorrowed = contacts.filter(c => c.type === 'borrowed').reduce((sum, c) => sum + c.remainingAmount, 0);

    csv += `\nSummary\n`;
    csv += `Total Money Lent (Remaining),${totalLent}\n`;
    csv += `Total Money Borrowed (Remaining),${totalBorrowed}\n`;
    csv += `Net Balance,${totalLent - totalBorrowed}\n`;

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="personal_udhar_report.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
