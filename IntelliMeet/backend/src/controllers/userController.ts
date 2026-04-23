import { Response } from 'express';
import User from '../models/User';
import Notification from '../models/Notification';
import Meeting from '../models/Meeting';
import { AuthRequest } from '../middleware/authMiddleware';

// Toggle Online Status
export const toggleStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'lecturer') {
      res.status(403).json({ message: 'Only lecturers can toggle status' });
      return;
    }

    const { isOnline } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.isOnline = isOnline;
    await user.save();

    // Trigger Notification for all bound students
    const students = await User.find({ supervisorId: user._id });
    const notificationPromises = students.map(student => {
      const notif = new Notification({
        userId: student._id,
        title: 'Status Update',
        message: `Your supervisor, ${user.name}, is now ${isOnline ? 'Online' : 'Offline'}.`
      });
      return notif.save();
    });

    await Promise.all(notificationPromises);

    res.status(200).json({ isOnline: user.isOnline });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get Assigned Students
export const getAssignedStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'lecturer') {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const students = await User.find({ supervisorId: req.user.userId })
      .select('name email idNumber batch program expoPushToken profileImage');

    const studentsWithCounts = await Promise.all(students.map(async (student) => {
      const totalMeetings = await Meeting.countDocuments({ 
        studentId: student._id, 
        lecturerId: req.user?.userId 
      });
      return { ...student.toObject(), totalMeetings };
    }));

    res.status(200).json(studentsWithCounts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Edit Profile
export const editProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, batch, program } = req.body;
    // We strictly prevent editing email, role, idNumber, or supervisorId here for security.

    const user = await User.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (batch) user.batch = batch;
    if (program) user.program = program;
    // Allow clearing image by passing an empty string or null
    if (req.body.profileImage !== undefined) user.profileImage = req.body.profileImage;
    if (req.body.title) user.title = req.body.title;
    if (req.body.faculty) user.faculty = req.body.faculty;

    await user.save();
    
    // Populate supervisor if user is a student
    const populatedUser = await User.findById(user._id).populate('supervisorId', 'name email idNumber isOnline profileImage title faculty');
    
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      batch: user.batch,
      program: user.program,
      idNumber: user.idNumber,
      supervisorId: (populatedUser as any).supervisorId,
      profileImage: user.profileImage,
      title: user.title,
      faculty: user.faculty
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get Notifications
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const notifications = await Notification.find({ userId: req.user?.userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Mark Notification Read
export const markNotificationRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Clear All Notifications
export const clearNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.deleteMany({ userId: req.user?.userId });
    res.status(200).json({ success: true, message: 'All notifications cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Remove Student (Unassign from Lecturer)
export const removeStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'lecturer') {
      res.status(403).json({ message: 'Only lecturers can remove students' });
      return;
    }

    const { studentId } = req.params;
    const student = await User.findById(studentId);

    if (!student || student.supervisorId?.toString() !== req.user.userId) {
      res.status(403).json({ message: 'Unauthorized or student not found' });
      return;
    }

    // Unassign
    student.supervisorId = undefined;
    await student.save();

    res.status(200).json({ message: 'Student removed from your list' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get Current User Profile (with populated supervisor)
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).populate('supervisorId', 'name email idNumber isOnline profileImage title faculty faculty');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get List of all Lecturers (For Registration)
export const getLecturers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lecturers = await User.find({ role: 'lecturer' }).select('name _id idNumber isOnline email profileImage title faculty');
    res.status(200).json(lecturers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lecturers', error });
  }
};

// Update Push Token
export const updatePushToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    await User.findByIdAndUpdate(req.user?.userId, { expoPushToken: token });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error updating push token', error });
  }
};

