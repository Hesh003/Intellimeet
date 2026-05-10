import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_me';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, batch, program, idNumber, title, faculty, department } = req.body;

    if (role === 'student' && !email.endsWith('@students.nsbm.ac.lk')) {
      res.status(400).json({ message: 'Student email must end with @students.nsbm.ac.lk' });
      return;
    }

    if (role === 'lecturer' && !email.endsWith('@nsbm.ac.lk')) {
      res.status(400).json({ message: 'Lecturer email must end with @nsbm.ac.lk' });
      return;
    }

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
      faculty,
      department
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        batch: newUser.batch,
        program: newUser.program,
        idNumber: newUser.idNumber,
        title: newUser.title,
        faculty: newUser.faculty,
        department: newUser.department
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    let { email, password } = req.body;
    email = email?.trim();

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    // Populate supervisor if user is a student
    const populatedUser = await User.findById(user._id).populate('supervisorId', 'name email idNumber isOnline profileImage title faculty');

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        batch: user.batch,
        program: user.program,
        idNumber: user.idNumber,
        supervisorId: (populatedUser as any).supervisorId,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getSupervisors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { faculty } = req.query;
    let filter: any = { role: 'lecturer' };
    if (faculty) filter.faculty = faculty;

    const supervisors = await User.find(filter).select('name email idNumber isOnline faculty title');
    res.status(200).json(supervisors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
