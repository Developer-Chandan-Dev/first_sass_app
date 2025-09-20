import mongoose from 'mongoose';
import connectDB from '../src/lib/mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

const Category =
  mongoose.models.Category || mongoose.model('Category', CategorySchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  try {
    await connectDB();

    // Create default categories
    const categories = ['Food & Dining', 'Transportation', 'Entertainment', 'Groceries', 'Shopping', 'Healthcare', 'Utilities', 'Education' ,'Travel', 'Others'];

    for (const categoryName of categories) {
      await Category.findOneAndUpdate(
        { name: categoryName },
        { name: categoryName },
        { upsert: true, new: true }
      );
    }

    console.log('✅ Categories seeded successfully');

    // Create admin user (you'll need to update with actual Clerk ID)
    await User.findOneAndUpdate(
      { email: 'admin@example.com' },
      {
        clerkId: 'admin_clerk_id_placeholder',
        email: 'admin@example.com',
        role: 'admin',
      },
      { upsert: true, new: true }
    );

    console.log('✅ Admin user seeded successfully');
    console.log('🎉 Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
