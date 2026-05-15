import { Response } from 'express';
import Proposal from '../models/Proposal';
import User from '../models/User';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/authMiddleware';

export const submitProposal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'student') {
      res.status(403).json({ message: 'Only students can submit proposals' });
      return;
    }

    const { title, content, supervisorId } = req.body;
    let documentUrl;

    if (req.file) {
      documentUrl = `/uploads/${req.file.filename}`;
    }

    const newProposal = new Proposal({
      studentId: req.user.userId,
      supervisorId: supervisorId || undefined,
      title,
      content,
      documentUrl,
    });

    await newProposal.save();
    
    // Notify supervisor: use form-selected supervisorId first, fall back to student's assigned supervisor
    const student = await User.findById(req.user.userId);
    const notifyId = supervisorId || student?.supervisorId;
    if (notifyId) {
      const notif = new Notification({
        userId: notifyId,
        title: 'New Proposal Submitted',
        message: `${student?.name} has submitted a new proposal: ${title}`
      });
      await notif.save();
    }

    res.status(201).json(newProposal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getProposals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let filter: any = {};
    if (req.user?.role === 'student') {
      filter.studentId = req.user.userId;
    } else {
      // If lecturer, only show proposals of their assigned students
      const assignedStudents = await User.find({ supervisorId: req.user?.userId }).select('_id');
      const studentIds = assignedStudents.map(s => s._id);
      filter.studentId = { $in: studentIds };
    }

    const proposals = await Proposal.find(filter)
      .populate('studentId', 'name email idNumber')
      .populate('manualFeedback.lecturerId', 'name');

    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'lecturer') {
      res.status(403).json({ message: 'Only lecturers can provide feedback' });
      return;
    }

    const { id } = req.params;
    const { message } = req.body;

    const proposal = await Proposal.findById(id);
    if (!proposal) {
      res.status(404).json({ message: 'Proposal not found' });
      return;
    }

    // Security check: Is this student assigned to this lecturer?
    const student = await User.findById(proposal.studentId);
    if (!student || student.supervisorId?.toString() !== req.user.userId) {
       res.status(403).json({ message: 'Unauthorized: This student is not assigned to you' });
       return;
    }

    proposal.manualFeedback.push({
      message,
      lecturerId: req.user.userId as any,
      createdAt: new Date()
    });
    proposal.status = 'evaluated';
    await proposal.save();

    // Trigger Notification to student
    const lecturer = await User.findById(req.user.userId);
    const notif = new Notification({
      userId: proposal.studentId,
      title: 'New Feedback Received',
      message: `${lecturer?.name} has reviewed your proposal: ${proposal.title}`
    });
    await notif.save();

    res.status(200).json(proposal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteProposal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'lecturer') {
      res.status(403).json({ message: 'Only lecturers can delete proposals' });
      return;
    }

    const { id } = req.params;
    const proposal = await Proposal.findById(id);

    if (!proposal) {
      res.status(404).json({ message: 'Proposal not found' });
      return;
    }

    // Security check: Is this student assigned to this lecturer?
    const student = await User.findById(proposal.studentId);
    if (!student || student.supervisorId?.toString() !== req.user.userId) {
       res.status(403).json({ message: 'Unauthorized access' });
       return;
    }

    await Proposal.findByIdAndDelete(id);
    res.status(200).json({ message: 'Proposal deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
