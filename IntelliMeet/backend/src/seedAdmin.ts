import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User';

dotenv.config();

const seedAdmin = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/intellimeet';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    const adminEmail = 'admin@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    const adminUser = new User({
      name: 'System Admin',
      email: adminEmail,
      passwordHash,
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin setup complete: admin@gmail.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
