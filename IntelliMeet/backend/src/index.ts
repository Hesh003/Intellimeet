import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import User from './models/User';

import authRoutes from './routes/authRoutes';
import availabilityRoutes from './routes/availabilityRoutes';
import meetingRoutes from './routes/meetingRoutes';
import proposalRoutes from './routes/proposalRoutes';
import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import adminRoutes from './routes/adminRoutes';
import path from 'path';
import fs from 'fs';

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/intellimeet';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatbot', chatRoutes);
app.use('/api/admin', adminRoutes);

// Enable static serving of Document Uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, async () => {
      console.log(`Server running on port ${PORT}`);

      // Seed/Sync Admin User
      try {
        const adminEmail = 'admin@gmail.com';
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin2026@', salt);

        const adminUser = await User.findOne({ email: adminEmail });
        
        if (!adminUser) {
          const newAdmin = new User({
            name: 'System Admin',
            email: adminEmail,
            passwordHash: passwordHash,
            role: 'admin'
          });
          await newAdmin.save();
          console.log('✅ Default admin account created: admin@gmail.com / admin2026@');
        } else {
          // Force update password and role to match user request
          adminUser.passwordHash = passwordHash;
          adminUser.role = 'admin';
          await adminUser.save();
          console.log('Success');
        }
      } catch (seedError) {
        console.error('Failed to seed/sync admin user:', seedError);
      }
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
