import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { Category } from '@/models/Category';
import connectDB from '@/lib/mongoose';

// GET - Fetch user's custom categories
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const categories = await Category.find({ userId }).sort({ createdAt: -1 });
    const categoryNames = categories.map((cat) => cat.name);

    return NextResponse.json({ categories: categoryNames });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new custom category
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const categoryName = name.trim();

    await connectDB();

    // Check if category already exists for this user
    const existingCategory = await Category.findOne({
      userId,
      name: categoryName,
    });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      );
    }

    // Create new category
    const category = new Category({
      userId,
      name: categoryName,
    });

    await category.save();

    return NextResponse.json({
      category: categoryName,
      message: 'Category created successfully',
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update custom category
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { oldName, newName } = await request.json();

    if (
      !oldName ||
      !newName ||
      typeof oldName !== 'string' ||
      typeof newName !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Old name and new name are required' },
        { status: 400 }
      );
    }

    const trimmedOldName = oldName.trim();
    const trimmedNewName = newName.trim();

    if (trimmedNewName.length === 0) {
      return NextResponse.json(
        { error: 'New category name cannot be empty' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if old category exists
    const existingCategory = await Category.findOne({
      userId,
      name: trimmedOldName,
    });
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if new name already exists (and it's different from old name)
    if (trimmedOldName !== trimmedNewName) {
      const duplicateCategory = await Category.findOne({
        userId,
        name: trimmedNewName,
      });
      if (duplicateCategory) {
        return NextResponse.json(
          { error: 'Category with this name already exists' },
          { status: 400 }
        );
      }
    }

    // Update category
    await Category.updateOne(
      { userId, name: trimmedOldName },
      { name: trimmedNewName }
    );

    return NextResponse.json({
      message: 'Category updated successfully',
      oldName: trimmedOldName,
      newName: trimmedNewName,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete custom category
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const categoryName = name.trim();

    await connectDB();

    // Check if category exists
    const existingCategory = await Category.findOne({
      userId,
      name: categoryName,
    });
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Delete category
    await Category.deleteOne({ userId, name: categoryName });

    return NextResponse.json({
      message: 'Category deleted successfully',
      deletedCategory: categoryName,
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
