import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import Meeting from '../models/Meeting';
import Availability from '../models/Availability';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalLecturers = await User.countDocuments({ role: 'lecturer' });
    const totalMeetings = await Meeting.countDocuments();
    const totalAvailabilities = await Availability.countDocuments();

    res.status(200).json({
      totalStudents,
      totalLecturers,
      totalMeetings,
      totalAvailabilities,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-passwordHash');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, batch, program, idNumber, title, department, faculty } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      passwordHash,
      role,
      batch,
      program,
      idNumber,
      title,
      department,
      faculty
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: { id: newUser._id, email: newUser.email, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Do not allow password update through this generic endpoint (for security)
    if (updates.password) {
      delete updates.password;
    }
    
    if (updates.passwordHash) {
      delete updates.passwordHash;
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-passwordHash');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllSchedules = async (req: Request, res: Response): Promise<void> => {
  try {
    const availabilities = await Availability.find().populate('lecturerId', 'name email department');
    res.status(200).json(availabilities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const schedule = await Availability.findByIdAndDelete(id);
    if (!schedule) {
      res.status(404).json({ message: 'Schedule not found' });
      return;
    }
    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllMeetings = async (req: Request, res: Response): Promise<void> => {
  try {
    const meetings = await Meeting.find()
      .populate('studentId', 'name email idNumber')
      .populate('lecturerId', 'name email title department')
      .populate('availabilityId', 'date startTime endTime')
      .sort({ createdAt: -1 });
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteMeeting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findByIdAndDelete(id);
    if (!meeting) {
      res.status(404).json({ message: 'Meeting not found' });
      return;
    }
    res.status(200).json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// In-memory store for dynamic network configuration
// This avoids hardcoding IPs and allows the mobile app to report its own URI
let networkConfig = {
  expoUrl: 'exp://192.168.8.138:8081', // Default fallback
  webPortalUrl: 'http://192.168.8.138:5173',
  lastUpdated: new Date()
};

export const getNetworkConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json(networkConfig);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateNetworkConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const { expoUrl, webPortalUrl } = req.body;
    
    if (expoUrl) networkConfig.expoUrl = expoUrl;
    if (webPortalUrl) networkConfig.webPortalUrl = webPortalUrl;
    
    networkConfig.lastUpdated = new Date();
    
    res.status(200).json({ message: 'Network configuration updated', config: networkConfig });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
