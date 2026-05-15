import { Response } from 'express';
import Availability from '../models/Availability';
import Meeting from '../models/Meeting';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';
import { getSriLankaHolidays } from '../services/holidayService';

export const getHolidays = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const holidays = await getSriLankaHolidays(year);
    res.status(200).json(holidays);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

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

    const { date, startTime, endTime, duration, maxStudents, recurUntil } = req.body;

    const slots = [];
    const baseStart = parseDateTime(date, startTime);
    const baseEnd = parseDateTime(date, endTime);

    if (!baseStart || !baseEnd) {
      res.status(400).json({ message: 'Invalid start or end time format' });
      return;
    }
    
    // NEW: Block adding slots to past dates/times
    if (baseStart < new Date()) {
      res.status(400).json({ message: 'Cannot create availability for a past date or time' });
      return;
    }

    let targetEndDate = normalizeDate(date);
    if (recurUntil) {
      const parsedRecur = normalizeDate(recurUntil);
      if (!isNaN(parsedRecur.getTime()) && parsedRecur > targetEndDate) {
        targetEndDate = parsedRecur;
      }
    }

    let currentDate = normalizeDate(baseStart);
    
    while (currentDate <= targetEndDate) {
      const start = new Date(currentDate);
      start.setHours(baseStart.getHours(), baseStart.getMinutes(), 0, 0);
      const end = new Date(currentDate);
      end.setHours(baseEnd.getHours(), baseEnd.getMinutes(), 0, 0);

      // Check for overlapping slots
      const reqStartMins = start.getHours() * 60 + start.getMinutes();
      const reqEndMins = end.getHours() * 60 + end.getMinutes();

      const existingAvailabilities = await Availability.find({
        lecturerId: req.user.userId,
        date: normalizeDate(start)
      });

      for (const ex of existingAvailabilities) {
        const [exStartH, exStartM] = ex.startTime.split(':').map(Number);
        const [exEndH, exEndM] = ex.endTime.split(':').map(Number);
        const exStartMins = exStartH * 60 + exStartM;
        const exEndMins = exEndH * 60 + exEndM;

        if (reqStartMins < exEndMins && reqEndMins > exStartMins) {
          const formattedDate = start.toLocaleDateString();
          res.status(400).json({ 
            message: `This time period is already covered by an existing slot from ${ex.startTime} to ${ex.endTime} on ${formattedDate}.`
          });
          return;
        }
      }

      // If duration is provided, we do bulk creation for this day
      if (duration) {
        const durMs = duration * 60000;
        let currentSlotTime = start;

        while (currentSlotTime.getTime() + durMs <= end.getTime()) {
          const slotStart = currentSlotTime.toTimeString().slice(0, 5);
          const nextDate = new Date(currentSlotTime.getTime() + durMs);
          const slotEnd = nextDate.toTimeString().slice(0, 5);

          slots.push({
            lecturerId: req.user.userId,
            date: normalizeDate(start), // Standardize to midnight
            startTime: slotStart,
            endTime: slotEnd,
            maxStudents: maxStudents || 1
          });
          currentSlotTime = nextDate;
        }
      } else {
        // Otherwise standard single slot creation for this day
        slots.push({
          lecturerId: req.user.userId,
          date: normalizeDate(start),
          startTime,
          endTime,
          maxStudents: maxStudents || 1
        });
      }
      
      // Advance by 7 days
      currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    await Availability.insertMany(slots);
    res.status(201).json({ message: `${slots.length} slots created successfully`, slots });
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

    const availabilities = await Availability.find(filter).populate('lecturerId', 'name email department').lean();
    
    // Fetch non-cancelled meetings for these blocks so the frontend can calculate free times
    const availabilityIds = availabilities.map(a => a._id);
    const meetings = await Meeting.find({
      availabilityId: { $in: availabilityIds },
      status: { $in: ['pending', 'confirmed', 'completed'] }
    }).select('availabilityId startTime endTime requirement').lean();

    const result = availabilities.map(a => ({
      ...a,
      meetings: meetings.filter(m => m.availabilityId.toString() === a._id.toString())
    }));

    res.status(200).json(result);
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

export const updateAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.body;

    // Check if there are any meetings for this availability
    const meetings = await Meeting.find({ availabilityId: id });
    if (meetings.length > 0) {
      res.status(400).json({ message: 'Cannot edit availability with scheduled meetings' });
      return;
    }

    const availability = await Availability.findOne({ _id: id, lecturerId: req.user?.userId });
    
    if (!availability) {
      res.status(404).json({ message: 'Availability not found or unauthorized' });
      return;
    }

    // NEW: Check if the slot date is in the past
    const slotDate = new Date(availability.date);
    const timeParts = (startTime || availability.startTime).split(':');
    slotDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
    if (slotDate < new Date()) {
      res.status(400).json({ message: 'Cannot edit an availability slot that has already passed' });
      return;
    }

    const newStartTime = startTime || availability.startTime;
    const newEndTime = endTime || availability.endTime;

    const [reqStartH, reqStartM] = newStartTime.split(':').map(Number);
    const [reqEndH, reqEndM] = newEndTime.split(':').map(Number);
    const reqStartMins = reqStartH * 60 + reqStartM;
    const reqEndMins = reqEndH * 60 + reqEndM;

    const existingAvailabilities = await Availability.find({
      lecturerId: req.user?.userId,
      date: availability.date,
      _id: { $ne: id } // Exclude the current one being updated
    });

    for (const ex of existingAvailabilities) {
      const [exStartH, exStartM] = ex.startTime.split(':').map(Number);
      const [exEndH, exEndM] = ex.endTime.split(':').map(Number);
      const exStartMins = exStartH * 60 + exStartM;
      const exEndMins = exEndH * 60 + exEndM;

      if (reqStartMins < exEndMins && reqEndMins > exStartMins) {
        const formattedDate = slotDate.toLocaleDateString();
        res.status(400).json({ 
          message: `This time period is already covered by an existing slot from ${ex.startTime} to ${ex.endTime} on ${formattedDate}.`
        });
        return;
      }
    }

    if (startTime) availability.startTime = startTime;
    if (endTime) availability.endTime = endTime;

    await availability.save();

    res.status(200).json({ message: 'Availability updated successfully', availability });
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
