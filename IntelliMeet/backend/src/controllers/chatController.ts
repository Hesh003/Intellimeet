import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import Meeting from '../models/Meeting';
import Proposal from '../models/Proposal';
import Availability from '../models/Availability';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Gemini API Key Rotation System ---
// Keys are loaded from .env for security
const STUDENT_API_KEYS = [
  process.env.GEMINI_STUDENT_KEY_1 || '',
  process.env.GEMINI_STUDENT_KEY_2 || '',
  process.env.GEMINI_STUDENT_KEY_3 || '',
  process.env.GEMINI_STUDENT_KEY_4 || '',
].filter(k => k.length > 0);

const LECTURER_API_KEYS = [
  process.env.GEMINI_LECTURER_KEY_1 || '',
  process.env.GEMINI_LECTURER_KEY_2 || '',
  process.env.GEMINI_LECTURER_KEY_3 || '',
  process.env.GEMINI_LECTURER_KEY_4 || '',
].filter(k => k.length > 0);

let studentKeyIndex = 0;
let lecturerKeyIndex = 0;

function getStudentKey(): string {
  const key = STUDENT_API_KEYS[studentKeyIndex];
  studentKeyIndex = (studentKeyIndex + 1) % STUDENT_API_KEYS.length;
  return key;
}

function getLecturerKey(): string {
  const key = LECTURER_API_KEYS[lecturerKeyIndex];
  lecturerKeyIndex = (lecturerKeyIndex + 1) % LECTURER_API_KEYS.length;
  return key;
}

// --- Build context from database ---
async function buildStudentContext(userId: string): Promise<string> {
  const student = await User.findById(userId);
  let context = `The user is a student named "${student?.name}" (ID: ${student?.idNumber || 'N/A'}, Batch: ${student?.batch || 'N/A'}).`;

  // Supervisor info & their schedule
  if (student?.supervisorId) {
    const supervisor = await User.findById(student.supervisorId);
    if (supervisor) {
      context += ` Their assigned supervisor is ${supervisor.title || 'Dr.'} ${supervisor.name} (${supervisor.email}), who is currently ${supervisor.isOnline ? 'Online' : 'Offline'}.`;
      
      const availabilities = await Availability.find({ 
        lecturerId: supervisor._id, 
        status: 'available',
        date: { $gte: new Date().toISOString().split('T')[0] } 
      }).sort({ date: 1, startTime: 1 }).limit(10);

      if (availabilities.length > 0) {
        context += ' \n\nSUPERVISOR AVAILABLE SLOTS (The user can book these by reference):\n';
        availabilities.forEach((slot: any) => {
          context += `- [ID: ${slot._id}] ${new Date(slot.date).toLocaleDateString()} at ${slot.startTime} to ${slot.endTime} (Duration: ${slot.duration || 15} mins, Capacity: ${slot.maxStudents})\n`;
        });
      } else {
        context += ' \nThe supervisor currently has NO available slots listed.';
      }
    }
  }

  // Meeting info
  const meetings = await Meeting.find({ studentId: userId }).populate('lecturerId', 'name').populate('availabilityId', 'date startTime endTime');
  if (meetings.length > 0) {
    const pending = meetings.filter(m => m.status === 'pending').length;
    const confirmed = meetings.filter(m => m.status === 'confirmed').length;
    const completed = meetings.filter(m => m.status === 'completed').length;
    context += `\nMEETING HISTORY (${meetings.length} total, ${pending} pending, ${confirmed} confirmed, ${completed} completed):\n`;
    meetings.forEach((m: any) => {
      const dateStr = new Date(m.availabilityId?.date || m.createdAt).toLocaleDateString();
      context += `- [${dateStr} @ ${m.availabilityId?.startTime || 'TBD'}] Status: ${m.status.toUpperCase()}, Notes: "${m.notes || 'None'}"\n`;
    });
  } else {
    context += '\nMEETINGS: They have no meetings scheduled.';
  }

  // Proposal info
  const proposals = await Proposal.find({ studentId: userId });
  if (proposals.length > 0) {
    context += ` Proposals: ${proposals.length} submitted.`;
    proposals.forEach((p: any) => {
      context += ` [Title: "${p.title}", Status: ${p.status}${p.feedback ? ', Feedback: "' + p.feedback + '"' : ''}]`;
    });
  } else {
    context += ' They have not submitted any proposals.';
  }

  return context;
}

async function buildLecturerContext(userId: string): Promise<string> {
  const lecturer = await User.findById(userId);
  let context = `The user is a lecturer named "${lecturer?.name}" (ID: ${lecturer?.idNumber || 'N/A'}). They are currently ${lecturer?.isOnline ? 'Online' : 'Offline'}.`;

  // Assigned students
  const students = await User.find({ supervisorId: userId }).select('name idNumber batch email');
  context += ` They have ${students.length} students assigned.`;
  if (students.length > 0) {
    context += ' Students: ';
    students.forEach(s => {
      context += `[${s.name} (${s.idNumber || 'N/A'}, Batch: ${s.batch || 'N/A'})] `;
    });
  }

  // Lecturer Schedule / Availability
  const availabilities = await Availability.find({ 
    lecturerId: userId,
    date: { $gte: new Date().toISOString().split('T')[0] } 
  }).sort({ date: 1, startTime: 1 }).limit(10);

  if (availabilities.length > 0) {
    context += '\n\nYOUR SCHEDULE (Upcoming Slots):\n';
    availabilities.forEach((slot: any) => {
      context += `- ${new Date(slot.date).toLocaleDateString()} at ${slot.startTime} to ${slot.endTime} | Status: ${slot.status.toUpperCase()}\n`;
    });
  } else {
    context += '\nYOUR SCHEDULE: You have no slots listed for the future.';
  }

  // Pending meetings
  const meetings = await Meeting.find({ lecturerId: userId }).populate('studentId', 'name').populate('availabilityId', 'date startTime endTime');
  if (meetings.length > 0) {
    const pending = meetings.filter(m => m.status === 'pending').length;
    const confirmed = meetings.filter(m => m.status === 'confirmed').length;
    context += `\nMEETINGS OVERVIEW (${meetings.length} total, ${pending} pending requests, ${confirmed} confirmed upcoming).\n`;
    meetings.forEach((m: any) => {
      const dateStr = new Date(m.availabilityId?.date || m.createdAt).toLocaleDateString();
      context += `- [Student: ${m.studentId?.name}] ${dateStr} @ ${m.availabilityId?.startTime || 'TBD'} | Status: ${m.status.toUpperCase()}\n`;
    });
  }

  // Pending proposals for assigned students
  const studentIds = students.map(s => s._id);
  const proposals = await Proposal.find({ studentId: { $in: studentIds } });
  
  if (proposals.length > 0) {
    const pendingProposals = proposals.filter(p => p.status === 'submitted').length;
    context += ` Proposals: ${proposals.length} total (${pendingProposals} pending review).`;
    proposals.slice(0, 5).forEach((p: any) => {
      context += ` [Title: "${p.title}", Status: ${p.status}, Student: ${p.studentId}]`;
    });
  }

  return context;
}

// --- Action Execution Logic ---
async function executeAction(userId: string, role: string, reply: string): Promise<string> {
  let finalReply = reply;
  
  // 1. Lecturer: Create Slots
  // Pattern: [ACTION:CREATE_SLOTS{...}]
  const createMatch = reply.match(/\[ACTION:CREATE_SLOTS({.*?})\]/);
  if (createMatch && role === 'lecturer') {
    try {
      const params = JSON.parse(createMatch[1]);
      const { date, startTime, endTime, duration, maxStudents } = params;

      if (duration > 0) {
        const slots = [];
        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);
        const durMs = duration * 60000;

        let current = start;
        while (current.getTime() + durMs <= end.getTime()) {
          const slotStart = current.toTimeString().slice(0, 5);
          const next = new Date(current.getTime() + durMs);
          const slotEnd = next.toTimeString().slice(0, 5);

          const slotDate = new Date(`${date.includes('T') ? date.split('T')[0] : date}T12:00:00`);

          slots.push({
            lecturerId: userId,
            date: slotDate,
            startTime: slotStart,
            endTime: slotEnd,
            maxStudents: maxStudents || 1
          });
          current = next;
        }
        await Availability.insertMany(slots);
        finalReply = finalReply.replace(createMatch[0], `\n\n✅ CONFIRMED: I have successfully created ${slots.length} slots for you on ${date} from ${startTime} to ${endTime}.`);
      } else {
        const newAvailability = new Availability({
          lecturerId: userId,
          date: new Date(`${date.includes('T') ? date.split('T')[0] : date}T12:00:00`),
          startTime,
          endTime,
          maxStudents: maxStudents || 1
        });
        await newAvailability.save();
        finalReply = finalReply.replace(createMatch[0], `\n\n✅ CONFIRMED: I have added your availability for ${date} at ${startTime}.`);
      }
    } catch (e) {
      console.error('Action Error:', e);
      finalReply = finalReply.replace(createMatch[0], '\n\n❌ ERROR: I couldn\'t process that scheduling request. Please check the formats.');
    }
  }

  // 1.5 Lecturer: Direct Meeting (Manual Appointment)
  // Pattern: [ACTION:DIRECT_MEETING{"studentId":"...","date":"...","startTime":"...","endTime":"..."}]
  const directMatch = reply.match(/\[ACTION:DIRECT_MEETING({.*?})\]/);
  if (directMatch && role === 'lecturer') {
    try {
      const params = JSON.parse(directMatch[1]);
      const { studentId, date, startTime, endTime, notes } = params;
      const parsedDate = new Date(`${date.includes('T') ? date.split('T')[0] : date}T12:00:00`);
      if (isNaN(parsedDate.getTime())) throw new Error('Invalid Date');

      // Create ghost slot
      const newAvailability = new Availability({
        lecturerId: userId,
        date: parsedDate,
        startTime,
        endTime,
        maxStudents: 1,
        status: 'booked'
      });
      await newAvailability.save();

      // Create meeting
      const newMeeting = new Meeting({
        studentId,
        lecturerId: userId,
        availabilityId: newAvailability._id,
        notes: notes || 'Directly scheduled via AI Assistant',
        status: 'confirmed'
      });
      await newMeeting.save();

      finalReply = finalReply.replace(directMatch[0], `\n\n✅ CONFIRMED: I have scheduled a direct meeting for you on ${date} at ${startTime}. The student has been notified.`);
    } catch (e) {
      console.error('Direct Meeting Action Error:', e);
      finalReply = finalReply.replace(directMatch[0], '\n\n❌ ERROR: I couldn\'t schedule that direct meeting.');
    }
  }

  // 2. Student: Book Slot
  // Pattern: [ACTION:BOOK_SLOT{...}]
  const bookMatch = reply.match(/\[ACTION:BOOK_SLOT({.*?})\]/);
  if (bookMatch && role === 'student') {
    try {
      const params = JSON.parse(bookMatch[1]);
      const { slotId } = params;

      const availability = await Availability.findById(slotId);
      if (availability) {
        const newMeeting = new Meeting({
          studentId: userId,
          lecturerId: availability.lecturerId,
          availabilityId: slotId,
          status: 'confirmed'
        });
        await newMeeting.save();
        
        const currentBookings = await Meeting.countDocuments({ 
          availabilityId: slotId, 
          status: { $in: ['pending', 'confirmed', 'completed'] } 
        });
        if (currentBookings >= (availability.maxStudents || 1)) {
          availability.status = 'booked';
          await availability.save();
        }

        finalReply = finalReply.replace(bookMatch[0], `\n\n✅ CONFIRMED: Your meeting for ${new Date(availability.date).toLocaleDateString()} at ${availability.startTime} has been automatically booked and confirmed!`);
      }
    } catch (e) {
      console.error('Booking Error:', e);
      finalReply = finalReply.replace(bookMatch[0], '\n\n❌ ERROR: I couldn\'t book that slot for you.');
    }
  }

  return finalReply;
}

// --- Main Chatbot Handler ---
export const askChatbot = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query, history } = req.body;
    const userRole = req.user?.role;
    const userId = req.user?.userId;

    if (!query) {
      res.status(400).json({ reply: "Please ask me a question." });
      return;
    }

    // Build context from database
    let dbContext = '';
    let apiKey = '';

    if (userRole === 'student') {
      dbContext = await buildStudentContext(userId!);
      apiKey = getStudentKey();
    } else {
      dbContext = await buildLecturerContext(userId!);
      apiKey = getLecturerKey();
    }

    const systemPrompt = `You are IntelliMeet Assistant, a friendly and helpful AI assistant for a university meeting scheduling system called IntelliMeet. 
You help ${userRole === 'student' ? 'students manage their academic meetings, proposals, and supervisor communications' : 'lecturers manage student meetings, review proposals, and track their schedule'}.

Here is real-time data about this user from the database:
${dbContext}

- If asked about schedules, times, or availability, STRICTLY use the dates/times provided in the context above.
- Today's Date is: ${new Date().toLocaleDateString()} (Local Server Time).

- **CONVERSATIONAL BOOKING (Students)**:
  1. If the user wants to book a meeting, look at the "SUPERVISOR AVAILABLE SLOTS" provided in the context.
  2. Match their request (e.g., "this Friday morning") to the available IDs.
  3. If found, use the [ACTION:BOOK_SLOT{"slotId": "..."}] tag.
  4. If multiple slots match, ask the student to confirm which specific time they prefer.
  5. Today's Date is: ${new Date().toLocaleDateString()} (Local Server Time).

- **CONVERSATIONAL SCHEDULING (Lecturers)**:
  1. If the user provides a specific multi-parameter request, immediately identify: Date, Start Time, End Time, Duration (min), and Max Students.
  2. If any of these 5 are missing, ASK the user for them.
  3. Once you have ALL 5, output the action tag at the very end.
  4. The calendar update is automatic once the ACTION:CREATE_SLOTS tag is present.

- **ACTIONS (AGENT MODE)**:
  Append the action tag EXACTLY at the end of your message only when fully ready.
  
  2. **Lecturers (Create Slots)**:
     [ACTION:CREATE_SLOTS{"date":"YYYY-MM-DD","startTime":"HH:mm","endTime":"HH:mm","duration":15,"maxStudents":1}]
  
  3. **Lecturers (Direct Appointment)**: 
     Use when scheduling a SPECIFIC student by name. Find their ID in the context above.
     [ACTION:DIRECT_MEETING{"studentId":"STUDENT_ID","date":"YYYY-MM-DD","startTime":"HH:mm","endTime":"HH:mm","notes":"..."}]
  
  4. **Students (Book Slot)**:
     [ACTION:BOOK_SLOT{"slotId":"SLOT_ID_FROM_CONTEXT"}]

- If info is missing, ask for it. Do not guess parameters.
- Be concise and conversational (2-4 sentences max).
- **PRIVACY RULE**: Students must NEVER see data about other students.
- Always be professional and encouraging.`;

    // Sanitize History for Gemini (MUST start with a 'user' message)
    let sanitizedHistory = (history || []).filter((h: any) => h.role === 'user' || h.role === 'model');
    while (sanitizedHistory.length > 0 && sanitizedHistory[0].role !== 'user') {
      sanitizedHistory.shift();
    }

    // Try primary key, fallback to secondary
    let reply = '';
    let success = false;
    const keysToTry = userRole === 'student' ? STUDENT_API_KEYS : LECTURER_API_KEYS;

    if (keysToTry.length === 0) {
      console.warn('⚠️ No Gemini API keys found in .env! Chatbot will run in fallback mode.');
    }

    for (const key of keysToTry) {
      if (success) break;
      try {
        const genAI = new GoogleGenerativeAI(key);
        // Using gemini-pro as the most stable model name for generateContent
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Multi-turn chat session
        const chat = model.startChat({
          history: sanitizedHistory,
          generationConfig: {
            maxOutputTokens: 800,
          },
        });

        const result = await chat.sendMessage(systemPrompt + '\n\nUser: ' + query);
        reply = result.response.text();
        success = true;
      } catch (aiError: any) {
        const errorMsg = aiError?.message || 'Unknown error';
        console.error(`❌ Gemini Key Error [Key: ${key.slice(0, 10)}...]:`, errorMsg);
        
        // If it's a safety block, we still consider it a "success" in terms of API connectivity
        if (errorMsg.includes('SAFETY')) {
          reply = "I'm sorry, but I can't discuss that topic. Is there anything else academic I can help with?";
          success = true;
          break;
        }
        continue;
      }
    }

    if (!success) {
      // Fallback
      reply = getFallbackReply(query, userRole!, dbContext);
    } else {
      // AGENTIC ACTION PROCESSING
      reply = await executeAction(userId!, userRole!, reply);
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ reply: "I'm having trouble right now. Please try again in a moment." });
  }
};

// --- Fallback pattern matching if Gemini API is unavailable ---
function getFallbackReply(query: string, role: string, context: string): string {
  const q = query.toLowerCase();

  if (q.includes('hello') || q.includes('hi')) {
    return `Hello! 👋 I'm your IntelliMeet assistant. I'm currently in offline mode, but I can still help with basic queries. Ask me about your meetings or proposals!`;
  }
  if (q.includes('meeting')) {
    const meetingMatch = context.match(/(\d+) total/);
    return meetingMatch
      ? `You have ${meetingMatch[1]} meetings currently in the system. Check your dashboard for more details! 📅`
      : `I don't see any meetings in the system for you yet.`;
  }
  if (q.includes('proposal')) {
    const proposalMatch = context.match(/proposals: (\d+)/i);
    return proposalMatch
      ? `You have ${proposalMatch[1]} proposals in the system. Check the Proposals tab! 📄`
      : `No proposals found. You can submit one from the Proposals tab!`;
  }
  if (q.includes('supervisor') || q.includes('lecturer')) {
    const supervisorMatch = context.match(/supervisor is (.+?)( \(|$)/i);
    return supervisorMatch
      ? `Your supervisor is ${supervisorMatch[1].trim()}. Check their status on your dashboard! 👨‍🏫`
      : `I couldn't find specific supervisor details in your profile right now.`;
  }

  return "I'm in offline mode right now. Try asking about your meetings, proposals, or supervisor! 🤖";
}
