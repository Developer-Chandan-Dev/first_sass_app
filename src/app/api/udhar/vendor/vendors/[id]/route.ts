import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import UdharVendor from '@/models/UdharVendor';
import VendorTransaction from '@/models/VendorTransaction';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const vendor = await UdharVendor.findOne({ _id: id, userId });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    return NextResponse.json(vendor);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch vendor' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { name, phone, address } = await req.json();
    await connectDB();

    const vendor = await UdharVendor.findOneAndUpdate(
      { _id: id, userId },
      { name, phone, address },
      { new: true }
    );

    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    return NextResponse.json(vendor);
  } catch {
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const vendor = await UdharVendor.findOne({ _id: id, userId });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    await VendorTransaction.deleteMany({ vendorId: id, userId });
    await vendor.deleteOne();

    return NextResponse.json({ message: 'Vendor deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 });
  }
}
