import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import UdharVendor from '@/models/UdharVendor';
import VendorTransaction from '@/models/VendorTransaction';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const vendors = await UdharVendor.find({ userId });
    const totalVendors = vendors.length;
    const totalOwed = vendors.reduce((sum, v) => sum + v.totalOwed, 0);
    const activeVendors = vendors.filter(v => v.totalOwed > 0).length;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const allTransactions = await VendorTransaction.find({ userId }).sort({ date: -1 });
    
    const todayTransactions = allTransactions.filter(t => new Date(t.date) >= startOfToday);
    const weekTransactions = allTransactions.filter(t => new Date(t.date) >= startOfWeek);
    const monthTransactions = allTransactions.filter(t => new Date(t.date) >= startOfMonth);

    const todayPayments = todayTransactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.amount, 0);
    const weekPayments = weekTransactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.amount, 0);
    const monthPayments = monthTransactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.amount, 0);

    const todayPurchases = todayTransactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0);
    const weekPurchases = weekTransactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0);
    const monthPurchases = monthTransactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0);

    const topCreditors = vendors
      .filter(v => v.totalOwed > 0)
      .sort((a, b) => b.totalOwed - a.totalOwed)
      .slice(0, 5)
      .map(v => ({ _id: v._id, name: v.name, phone: v.phone, owed: v.totalOwed }));

    const recentTransactions = allTransactions.slice(0, 10).map(t => ({
      _id: t._id,
      type: t.type,
      amount: t.amount,
      description: t.description,
      date: t.date,
      vendorId: t.vendorId
    }));

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      const dayTransactions = allTransactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= dayStart && tDate < dayEnd;
      });
      return {
        date: date.toISOString().split('T')[0],
        purchases: dayTransactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0),
        payments: dayTransactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.amount, 0)
      };
    }).reverse();

    const paymentMethods = allTransactions
      .filter(t => t.type === 'payment' && t.paymentMethod)
      .reduce((acc, t) => {
        const method = t.paymentMethod || 'other';
        acc[method] = (acc[method] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return NextResponse.json({
      totalVendors,
      totalOwed,
      activeVendors,
      todayPayments,
      weekPayments,
      monthPayments,
      todayPurchases,
      weekPurchases,
      monthPurchases,
      topCreditors,
      recentTransactions,
      chartData: last7Days,
      paymentMethods,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
