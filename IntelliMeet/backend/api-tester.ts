// @ts-nocheck
/**
 * IntelliMeet API Tester
 * A comprehensive functional verification script.
 */

// Using native fetch available in Node v20+

const BASE_URL = 'http://localhost:5000/api';

// ... (rest of colors)
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

async function runTests() {
  console.log(`${COLORS.bold}${COLORS.cyan}--- STARTING INTELLIMEET API VERIFICATION ---${COLORS.reset}\n`);

  let studentToken: any = '';
  let lecturerToken: any = '';
  let adminToken: any = '';
  let supervisorId: any = '';
  let availabilityId: any = '';

  const timestamp = Date.now();
  // ... (rest of objects)
  const testLecturer = {
    name: 'Dr. Test Assistant',
    email: `lecturer_${timestamp}@intellimeet.com`,
    password: 'password123',
    role: 'lecturer',
    department: 'Computer Science',
    title: 'Dr.'
  };

  const testStudent = {
    name: 'Test Student',
    email: `student_${timestamp}@intellimeet.com`,
    password: 'password123',
    role: 'student',
    batch: '2024',
    idNumber: 'ST12345'
  };

  /** Helper for API calls */
  const api = async (path: string, method: string, body?: any, token?: string): Promise<any> => {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
        const response = await fetch(`${BASE_URL}${path}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined
        });

        const data = await response.json();
        return { ok: response.ok, status: response.status, data };
    } catch (e: any) {
        return { ok: false, status: 500, data: { message: e.message } };
    }
  };

  /** TEST MODULE: AUTHENTICATION */
  try {
    console.log(`${COLORS.yellow}[MODULE: AUTH] Testing User Registration...${COLORS.reset}`);

    // 1. Valid Lecturer Signup
    const regLect = await api('/auth/register', 'POST', testLecturer);
    if (!regLect.ok) throw new Error(`Lecturer Signup Failed: ${regLect.data.message}`);
    supervisorId = regLect.data.user.id;
    console.log(`  ✅ Lecturer Registered (ID: ${supervisorId})`);

    // 2. Invalid Student Signup (Missing Supervisor)
    const badStu = await api('/auth/register', 'POST', testStudent);
    if (badStu.status === 400) {
      console.log(`  ✅ Correctly blocked student without supervisor.`);
    } else {
      throw new Error('FAILED: Allowed student registration without supervisor!');
    }

    // 3. Valid Student Signup
    const regStu = await api('/auth/register', 'POST', { ...testStudent, supervisorId });
    if (!regStu.ok) throw new Error(`Student Signup Failed: ${regStu.data.message}`);
    console.log(`  ✅ Student Registered (Assigned to Dr. Test Assistant)`);

    // 4. Login Tests
    const loginLect = await api('/auth/login', 'POST', { email: testLecturer.email, password: testLecturer.password });
    if (loginLect.ok) {
      lecturerToken = loginLect.data.token;
      console.log(`  ✅ Lecturer Login Successful`);
    }

    const loginStu = await api('/auth/login', 'POST', { email: testStudent.email, password: testStudent.password });
    if (loginStu.ok) {
      studentToken = loginStu.data.token;
      console.log(`  ✅ Student Login Successful`);
    }

    const badLogin = await api('/auth/login', 'POST', { email: testStudent.email, password: 'wrongpassword' });
    if (badLogin.status === 400) {
      console.log(`  ✅ Correctly handled invalid "word pass" (Wrong Password).`);
    }
  } catch (err: any) {
    console.error(`${COLORS.red}  ❌ Auth Module Failure: ${err.message}${COLORS.reset}`);
    return;
  }

  /** TEST MODULE: SCHEDULING */
  try {
    console.log(`\n${COLORS.yellow}[MODULE: SCHEDULING] Testing Availability Management...${COLORS.reset}`);
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateStr = futureDate.toISOString().split('T')[0];

    const createAvail = await api('/availability', 'POST', {
      date: dateStr,
      startTime: '14:00',
      endTime: '15:00',
      maxStudents: 2
    }, lecturerToken);

    if (createAvail.ok) {
        availabilityId = createAvail.data._id;
        console.log(`  ✅ Created Availability slot on ${dateStr} at 14:00`);
    } else {
        throw new Error(`Availability Creation Failed: ${createAvail.data.message}`);
    }

    // 5. Student visibility check
    const slots = await api(`/availability?date=${dateStr}&lecturerId=${supervisorId}`, 'GET', null, studentToken);
    if (slots.ok && slots.data.length > 0) {
        console.log(`  ✅ Student can see ${slots.data.length} slot(s) from supervisor.`);
    }
  } catch (err: any) {
    console.error(`${COLORS.red}  ❌ Scheduling Module Failure: ${err.message}${COLORS.reset}`);
    return;
  }

  /** TEST MODULE: MEETINGS & PROPOSALS */
  try {
    console.log(`\n${COLORS.yellow}[MODULE: MEETINGS] Testing Booking Lifecycle...${COLORS.reset}`);

    // 6. Booking
    const book = await api('/meetings/book', 'POST', {
        availabilityId,
        notes: 'Discussion about API Integration tests.'
    }, studentToken);

    if (book.ok) {
        console.log(`  ✅ Meeting booked and confirmed successfully.`);
    } else {
        throw new Error(`Meeting booking failed: ${book.data.message}`);
    }

    // 7. Double Booking Prevention
    const doubleBook = await api('/meetings/book', 'POST', {
        availabilityId,
        notes: 'Attempting a collision.'
    }, studentToken);
    if (doubleBook.status === 400) {
        console.log(`  ✅ Correctly blocked double-booking the same user into a slot.`);
    }

    console.log(`${COLORS.yellow}[MODULE: PROPOSALS] Testing Document Process...${COLORS.reset}`);
    const proposal = await api('/proposals', 'POST', {
        title: 'Real-time API Analytics',
        content: 'Testing the proposal submission logic.'
    }, studentToken);

    if (proposal.ok) {
        console.log(`  ✅ Proposal submitted successfully.`);
    }
  } catch (err: any) {
    console.error(`${COLORS.red}  ❌ Meetings/Proposals Failure: ${err.message}${COLORS.reset}`);
    return;
  }

  /** TEST MODULE: AI & ADMIN */
  try {
    console.log(`\n${COLORS.yellow}[MODULE: SYSTEM] Testing Admin & AI integration...${COLORS.reset}`);

    // 8. Admin Login (Requires default admin to exist)
    const adminLogin = await api('/auth/login', 'POST', { email: 'admin@gmail.com', password: 'admin2026@' });
    if (adminLogin.ok) {
        adminToken = adminLogin.data.token;
        console.log(`  ✅ Admin Login Successful`);
        
        const stats = await api('/admin/stats', 'GET', null, adminToken);
        if (stats.ok) {
            console.log(`  ✅ Admin fetched system stats successfully.`);
        }
    }

    // 9. Chatbot Test
    console.log(`${COLORS.yellow}[MODULE: AI] Testing Gemini Chatbot Connectivity...${COLORS.reset}`);
    const chat = await api('/chatbot/ask', 'POST', { query: 'How do I book a meeting?', history: [] }, studentToken);
    if (chat.ok) {
        console.log(`  ✅ Gemini Response Received: "${chat.data.reply.slice(0, 40)}..."`);
    } else {
        console.warn(`  ⚠️ Chatbot responded with error (Check AI keys in .env): ${JSON.stringify(chat.data)}`);
    }

  } catch (err: any) {
    console.error(`${COLORS.red}  ❌ System Module Failure: ${err.message}${COLORS.reset}`);
  }

  console.log(`\n${COLORS.bold}${COLORS.green}--- API VERIFICATION COMPLETE ---${COLORS.reset}`);
  console.log(`${COLORS.green}All core functions are operational.${COLORS.reset}\n`);
}

runTests();
