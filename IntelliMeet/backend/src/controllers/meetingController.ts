import { Response } from 'express';
import Meeting from '../models/Meeting';
import Availability from '../models/Availability';
import Notification from '../models/Notification';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendPushNotification } from '../services/pushNotificationService';

export const bookMeeting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'student') {
      res.status(403).json({ message: 'Only students can book meetings' });
      return;
    }

    const { availabilityId, notes, startTime, endTime, requirement } = req.body;

    const REQUIREMENT_DURATIONS: Record<string, number> = {
      'Coursework clarification': 15,
      'Lesson/module clarification': 15,
      'Project discussion (group projects, research, capstone projects)': 40,
      'Final year project supervision meeting': 60,
      'Exam discussion (marks clarification, paper discussion, re-correction inquiries)': 15,
      'Other academic matters': 35
    };

    // Requirement is optional — if not provided, skip duration validation
    const maxDuration: number | undefined = requirement ? REQUIREMENT_DURATIONS[requirement] : undefined;
    if (requirement && maxDuration === undefined) {
      res.status(400).json({ message: 'Invalid requirement' });
      return;
    }

    // Only validate time bounds if student provided explicit times
    let reqStartMins: number | undefined;
    let reqEndMins: number | undefined;

    if (startTime && endTime) {
      const [reqStartH, reqStartM] = startTime.split(':').map(Number);
      const [reqEndH, reqEndM] = endTime.split(':').map(Number);
      const rStart = reqStartH * 60 + reqStartM;
      const rEnd = reqEndH * 60 + reqEndM;
      reqStartMins = rStart;
      reqEndMins = rEnd;

      if (rStart >= rEnd) {
        res.status(400).json({ message: 'End time must be after start time' });
        return;
      }

      if (maxDuration !== undefined) {
        const requestedDuration = rEnd - rStart;
        if (requestedDuration > maxDuration) {
          res.status(400).json({ message: `This specific reason allows a maximum of ${maxDuration} minutes.` });
          return;
        }
      }
    }

    const availability = await Availability.findById(availabilityId);
    if (!availability) {
      res.status(404).json({ message: 'Slot not found' });
      return;
    }

    const slotDate = new Date(availability.date);
    const timeParts = availability.startTime.split(':');
    slotDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
    if (slotDate < new Date()) {
      res.status(400).json({ message: 'Cannot book a meeting for a slot that has already passed' });
      return;
    }

    const dayAvailabilities = await Availability.find({ date: availability.date });
    const dayAvailabilityIds = dayAvailabilities.map(a => a._id);

    const existingDayMeeting = await Meeting.findOne({
      studentId: req.user.userId,
      availabilityId: { $in: dayAvailabilityIds },
      status: { $in: ['pending', 'confirmed', 'completed'] }
    });

    if (existingDayMeeting) {
      res.status(400).json({ message: 'You already have a meeting scheduled for this day.' });
      return;
    }

    const currentBookings = await Meeting.countDocuments({ 
      availabilityId, 
      status: { $in: ['pending', 'confirmed', 'completed'] } 
    });

    if (currentBookings >= (availability.maxStudents || 1)) {
      res.status(400).json({ message: 'This slot is already full' });
      return;
    }

    const lecturer = await User.findById(availability.lecturerId);
    const leadTimeDays = lecturer?.bookingLeadTimeDays ?? 0;
    
    // Only enforce lead time if the lecturer has configured it (> 0)
    if (leadTimeDays > 0) {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const meetingDate = new Date(availability.date);
      const diffTime = meetingDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < leadTimeDays) {
        res.status(400).json({ message: `Bookings for this lecturer must be made at least ${leadTimeDays} days in advance.` });
        return;
      }
    }

    // Only validate block boundaries and overlaps if times were provided
    if (reqStartMins !== undefined && reqEndMins !== undefined) {
      const rStart = reqStartMins;
      const rEnd = reqEndMins;
      const [blockStartH, blockStartM] = availability.startTime.split(':').map(Number);
      const [blockEndH, blockEndM] = availability.endTime.split(':').map(Number);
      const blockStartMins = blockStartH * 60 + blockStartM;
      const blockEndMins = blockEndH * 60 + blockEndM;

      if (rStart < blockStartMins || rEnd > blockEndMins) {
        res.status(400).json({ message: 'Requested time is outside the availability block' });
        return;
      }

      const existingMeetings = await Meeting.find({
        availabilityId,
        status: { $in: ['pending', 'confirmed', 'completed'] }
      });

      for (const em of existingMeetings) {
        if (!em.startTime || !em.endTime) continue;
        const [emStartH, emStartM] = em.startTime.split(':').map(Number);
        const [emEndH, emEndM] = em.endTime.split(':').map(Number);
        const emStartMins = emStartH * 60 + emStartM;
        const emEndMins = emEndH * 60 + emEndM;

        if (rStart < emEndMins && rEnd > emStartMins) {
          res.status(400).json({ message: 'Requested time overlaps with an existing meeting' });
          return;
        }
      }
    }

    const newMeeting = new Meeting({
      studentId: req.user.userId,
      lecturerId: availability.lecturerId,
      availabilityId,
      notes,
      requirement: requirement || 'Other academic matters',
      startTime: startTime || availability.startTime,
      endTime: endTime || availability.endTime,
      status: 'pending'
    });

    await newMeeting.save();

    const pushNotes = notes ? `\nContext: ${notes}` : '';
    await sendPushNotification(
      availability.lecturerId.toString(),
      'New Meeting Request',
      `You have a new meeting request for ${availability.date.toLocaleDateString()} at ${startTime}.${pushNotes}`
    );

    res.status(201).json(newMeeting);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMeetings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let filter: any = {};
    
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (req.user.role === 'student') {
      filter.studentId = req.user.userId;
      if (req.query.lecturerId) {
        filter.lecturerId = req.query.lecturerId;
      }
    } else {
      filter.lecturerId = req.user.userId;
    }

    const meetings = await Meeting.find(filter)
      .populate('studentId', 'name email batch')
      .populate('lecturerId', 'name email department profileImage isOnline title faculty idNumber')
      .populate('availabilityId', 'date startTime endTime');

    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateMeetingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, meetingLink } = req.body;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      res.status(404).json({ message: 'Meeting not found' });
      return;
    }

    // Access control check
    if (req.user?.role === 'student') {
      if (meeting.studentId.toString() !== req.user.userId) {
        res.status(403).json({ message: 'Unauthorized access to this meeting' });
        return;
      }
      if (status !== 'cancelled') {
        res.status(403).json({ message: 'Students can only cancel meetings' });
        return;
      }
    } else if (req.user?.role === 'lecturer') {
       if (meeting.lecturerId.toString() !== req.user.userId) {
         res.status(403).json({ message: 'This meeting is not assigned to you' });
         return;
       }
    }

    // NEW: Check if slot has already passed when accepting/confirming
    if (status !== 'cancelled') {
      const availability = await Availability.findById(meeting.availabilityId);
      if (availability) {
        const slotDate = new Date(availability.date);
        const timeParts = availability.startTime.split(':');
        slotDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
        if (slotDate < new Date()) {
          res.status(400).json({ message: 'Cannot update status for a slot that has already passed' });
          return;
        }
      }
    }

    meeting.status = status;
    if (meetingLink) meeting.meetingLink = meetingLink;

    await meeting.save({ validateModifiedOnly: true });

    // If cancelled, free up availability
    if (status === 'cancelled') {
      await Availability.findByIdAndUpdate(meeting.availabilityId, { status: 'available' });
    }

    // Push notification to the other party
    const isStudent = req.user?.role === 'student';
    const targetUserId = isStudent ? meeting.lecturerId.toString() : meeting.studentId.toString();
    const updaterRole = isStudent ? 'Student' : 'Lecturer';
    
    await sendPushNotification(
      targetUserId,
      `Meeting ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      `The ${updaterRole.toLowerCase()} has updated the meeting status to ${status}.`
    );

    res.status(200).json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const manualAssignMeeting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'lecturer') {
      res.status(403).json({ message: 'Only lecturers can assign students' });
      return;
    }

    const { availabilityId, studentId, notes } = req.body;

    const availability = await Availability.findById(availabilityId);
    if (!availability) {
      res.status(404).json({ message: 'Slot not found' });
      return;
    }

    // NEW: Check if slot has already passed
    const slotDate = new Date(availability.date);
    const timeParts = availability.startTime.split(':');
    slotDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
    if (slotDate < new Date()) {
      res.status(400).json({ message: 'Cannot manually assign a meeting to a slot that has already passed' });
      return;
    }

    // NEW: Check if student already has a meeting on this day
    const dayAvailabilities = await Availability.find({ date: availability.date });
    const dayAvailabilityIds = dayAvailabilities.map(a => a._id);

    const existingDayMeeting = await Meeting.findOne({
      studentId,
      availabilityId: { $in: dayAvailabilityIds },
      status: { $in: ['pending', 'confirmed', 'completed'] }
    });

    if (existingDayMeeting) {
      res.status(400).json({ message: 'Student already has a meeting scheduled for this day.' });
      return;
    }

    // Check capacity
    const currentBookings = await Meeting.countDocuments({ 
      availabilityId, 
      status: { $in: ['pending', 'confirmed', 'completed'] } 
    });

    if (currentBookings >= (availability.maxStudents || 1)) {
      res.status(400).json({ message: 'This slot is already full' });
      return;
    }

    const newMeeting = new Meeting({
      studentId,
      lecturerId: req.user.userId,
      availabilityId,
      notes: notes || 'Manually assigned by lecturer',
      startTime: req.body.startTime || availability.startTime,
      endTime: req.body.endTime || availability.endTime,
      requirement: req.body.requirement || 'Other academic matters',
      status: 'confirmed'
    });

    await newMeeting.save();

    // If full now, mark slot as booked
    if (currentBookings + 1 >= (availability.maxStudents || 1)) {
      availability.status = 'booked';
      await availability.save();
    }

    // Internal Notification
    const notification = new Notification({
      userId: studentId,
      title: 'Meeting Assigned',
      message: `Your supervisor has assigned you to a meeting slot on ${availability.date.toLocaleDateString()} at ${availability.startTime}.`
    });
    await notification.save();

    // Push Notification
    await sendPushNotification(
      studentId, 
      'Meeting Assigned', 
      `Your supervisor assigned you a slot on ${availability.date.toLocaleDateString()} at ${availability.startTime}.`
    );

    res.status(201).json(newMeeting);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteMeeting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findById(id);

    if (!meeting) {
      res.status(404).json({ message: 'Meeting not found' });
      return;
    }

    if (req.user?.role !== 'lecturer' || meeting.lecturerId.toString() !== req.user.userId) {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    await Meeting.findByIdAndDelete(id);
    await Availability.findByIdAndUpdate(meeting.availabilityId, { status: 'available' });

    res.status(200).json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const notifyNextStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'lecturer') {
      res.status(403).json({ message: 'Only lecturers can notify students' });
      return;
    }

    const { availabilityId } = req.body;

    const nextMeeting = await Meeting.findOne({
      availabilityId,
      status: { $in: ['pending', 'confirmed'] }
    }).sort({ createdAt: 1 }).populate('studentId', 'name');

    if (!nextMeeting) {
      res.status(404).json({ message: 'No more students in line for this slot' });
      return;
    }

    const studentId = nextMeeting.studentId._id.toString();

    // Internal Notification
    const notification = new Notification({
      userId: studentId,
      title: 'Your Turn!',
      message: 'The lecturer is ready to see you now. Please head over or join the meeting link.'
    });
    await notification.save();

    // Push Notification
    await sendPushNotification(
      studentId, 
      'Your Turn!', 
      'The lecturer is ready to see you now. Please join the session.'
    );

    res.status(200).json({ message: `Notified ${(nextMeeting.studentId as any).name}`, meeting: nextMeeting });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const parseDateTime = (dateStr: string, timeStr: string) => {
  try {
    const formattedTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    const dateOnly = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const dateObj = new Date(`${dateOnly}T${formattedTime}`);
    if (isNaN(dateObj.getTime())) return null;
    return dateObj;
  } catch (e) {
    return null;
  }
};

export const directCreateMeeting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'lecturer') {
      res.status(403).json({ message: 'Only lecturers can create direct meetings' });
      return;
    }

    const { studentId, date, startTime, endTime, notes } = req.body;

    const parsedDate = parseDateTime(date, startTime);
    if (!parsedDate) {
      res.status(400).json({ message: 'Invalid date or time format' });
      return;
    }

    // NEW: Check if the slot date is in the past
    if (parsedDate < new Date()) {
      res.status(400).json({ message: 'Cannot create a meeting for a date that has already passed' });
      return;
    }

    // 1. Create a "ghost" availability slot
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    const newAvailability = new Availability({
      lecturerId: req.user.userId,
      date: normalizedDate,
      startTime,
      endTime,
      maxStudents: 1,
      status: 'booked'
    });

    await newAvailability.save();

    // 2. Create the Meeting
    const newMeeting = new Meeting({
      studentId,
      lecturerId: req.user.userId,
      availabilityId: newAvailability._id,
      notes: notes || 'Directly scheduled by lecturer',
      startTime,
      endTime,
      requirement: req.body.requirement || 'Other academic matters',
      status: 'confirmed'
    });

    await newMeeting.save();

    // 3. Notify Student
    const notification = new Notification({
      userId: studentId,
      title: 'Meeting Scheduled!',
      message: `Your supervisor has scheduled a meeting with you on ${new Date(date).toLocaleDateString()} at ${startTime}.`
    });
    await notification.save();

    // Push Notification
    await sendPushNotification(
      studentId, 
      'Meeting Scheduled!', 
      `Your supervisor scheduled a meeting on ${new Date(date).toLocaleDateString()} at ${startTime}.`
    );

    res.status(201).json(newMeeting);
  } catch (error) {
    console.error('Direct Meeting Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const clearMeeting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findById(id);

    if (!meeting) {
      res.status(404).json({ message: 'Meeting not found' });
      return;
    }

    if (req.user?.role === 'student' && meeting.studentId.toString() === req.user.userId) {
      meeting.clearedByStudent = true;
    } else if (req.user?.role === 'lecturer' && meeting.lecturerId.toString() === req.user.userId) {
      meeting.clearedByLecturer = true;
    } else {
      res.status(403).json({ message: 'Permission denied to clear this meeting' });
      return;
    }

    await meeting.save();
    res.status(200).json({ message: 'Meeting cleared successfully from dashboard', meeting });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
