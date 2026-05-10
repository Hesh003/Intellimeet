import { Response } from 'express';
import Availability from '../models/Availability';
import Meeting from '../models/Meeting';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

const normalizeDate = (date: Date | string) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

const parseDateTime = (dateStr: string, timeStr: string) => {
  try {
    // Standardize time format (HH:mm -> HH:mm:00)
    const formattedTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    const dateOnly = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const isoString = `${dateOnly}T${formattedTime}`;
    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) throw new Error('Invalid Date');
    return dateObj;
  } catch (e) {
    console.error(`Failed to parse DateTime: ${dateStr}T${timeStr}`, e);
    return null;
  }
};

export const createAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'lecturer') {
      res.status(403).json({ message: 'Only lecturers can create availability' });
      return;
    }

    const { date, startTime, endTime, duration, maxStudents } = req.body;

    // If duration is provided, we do bulk creation
    if (duration) {
      const slots = [];
      const start = parseDateTime(date, startTime);
      const end = parseDateTime(date, endTime);

      if (!start || !end) {
        res.status(400).json({ message: 'Invalid start or end time format' });
        return;
      }

      const durMs = duration * 60000;

      let current = start;
      while (current.getTime() + durMs <= end.getTime()) {
        const slotStart = current.toTimeString().slice(0, 5);
        const nextDate = new Date(current.getTime() + durMs);
        const slotEnd = nextDate.toTimeString().slice(0, 5);

        slots.push({
          lecturerId: req.user.userId,
          date: normalizeDate(start), // Standardize to midnight
          startTime: slotStart,
          endTime: slotEnd,
          maxStudents: maxStudents || 1
        });
        current = nextDate;
      }

      await Availability.insertMany(slots);
      res.status(201).json({ message: `${slots.length} slots created successfully`, slots });
      return;
    }

    // Otherwise standard single slot creation
    const newAvailability = new Availability({
      lecturerId: req.user.userId,
      date: normalizeDate(date),
      startTime,
      endTime,
      maxStudents: maxStudents || 1
    });

    await newAvailability.save();
    res.status(201).json(newAvailability);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAvailabilities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lecturerId, date } = req.query;
    
    let filter: any = {};
    if (lecturerId) filter.lecturerId = lecturerId;
    if (date) filter.date = normalizeDate(date as string);

    // Students should pass lecturerId to view that lecturer's slots.
    // If lecturer is requesting, show their own slots.
    if (req.user?.role === 'lecturer') {
      filter.lecturerId = req.user.userId;
    }

    const availabilities = await Availability.find(filter).populate('lecturerId', 'name email department');
    res.status(200).json(availabilities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAvailabilityStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lecturerId } = req.query;
    if (!lecturerId) {
      res.status(400).json({ message: 'Lecturer ID is required' });
      return;
    }

    const availabilities = await Availability.find({ lecturerId: lecturerId as string });
    const statusMap: any = {};

    for (const item of availabilities) {
      const dateStr = item.date.toISOString().split('T')[0];
      if (!statusMap[dateStr]) {
        statusMap[dateStr] = { total: 0, booked: 0 };
      }
      statusMap[dateStr].total += item.maxStudents;
      
      const bookedCount = await Meeting.countDocuments({ 
        availabilityId: item._id, 
        status: { $in: ['pending', 'confirmed', 'completed'] } 
      });
      statusMap[dateStr].booked += bookedCount;
    }

    const result: any = {};
    Object.keys(statusMap).forEach(date => {
      const { total, booked } = statusMap[date];
      if (booked >= total && total > 0) {
        result[date] = 'full';
      } else if (total > 0) {
        result[date] = 'available';
      }
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if there are any meetings for this availability
    const meetings = await Meeting.find({ availabilityId: id });
    if (meetings.length > 0) {
      res.status(400).json({ message: 'Cannot delete availability with scheduled meetings' });
      return;
    }

    const deletedAvailability = await Availability.findOneAndDelete({ _id: id, lecturerId: req.user?.userId });
    
    if (!deletedAvailability) {
      res.status(404).json({ message: 'Availability not found or unauthorized' });
      return;
    }

    res.status(200).json({ message: 'Availability deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const blockDay = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { date } = req.body;
    if (!date) {
      res.status(400).json({ message: 'Date is required' });
      return;
    }
    const targetDate = normalizeDate(date);
    const lecturerId = req.user?.userId;

    // Delete all "available" slots for this date
    await Availability.deleteMany({
      lecturerId,
      date: targetDate,
      status: 'available'
    });

    res.status(200).json({ message: 'Date blocked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
