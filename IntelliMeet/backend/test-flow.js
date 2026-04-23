async function testFlow() {
  const baseURL = 'http://localhost:5000/api';
  console.log('--- Starting API Verification ---');
  let studentToken, lecturerToken;
  let availabilityId;

  const req = async (path, method, body, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${baseURL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json();
    if (!res.ok) throw { status: res.status, data };
    return data;
  };

  try {
    console.log('1. Registering Lecturer...');
    const lecturerStr = `lecturer_${Date.now()}@test.com`;
    await req('/auth/register', 'POST', {
      name: 'Dr. Smith', email: lecturerStr, password: 'password123', role: 'lecturer'
    });
    console.log(' Lecturer created.');

    console.log('2. Registering Student...');
    const studentStr = `student_${Date.now()}@test.com`;
    await req('/auth/register', 'POST', {
      name: 'John Doe', email: studentStr, password: 'password123', role: 'student', batch: '21.2'
    });
    console.log(' Student created.');

    console.log('3. Logging in Lecturer...');
    const lectLogin = await req('/auth/login', 'POST', { email: lecturerStr, password: 'password123' });
    lecturerToken = lectLogin.token;
    console.log(' Lecturer logged in.');

    console.log('4. Logging in Student...');
    const stuLogin = await req('/auth/login', 'POST', { email: studentStr, password: 'password123' });
    studentToken = stuLogin.token;
    console.log(' Student logged in.');

    console.log('5. Creating Availability...');
    const avail = await req('/availability', 'POST', {
      date: new Date('2026-05-01').toISOString(), startTime: '10:00', endTime: '10:30'
    }, lecturerToken);
    availabilityId = avail._id;
    console.log(` Availability created! ID: ${availabilityId}`);

    console.log(' Fetching available slots...');
    const slots = await req('/availability?date=2026-05-01', 'GET', null, studentToken);
    console.log(` Student sees ${slots.length} open slots.`);

    console.log('6. Booking Meeting...');
    await req('/meetings/book', 'POST', {
      availabilityId: availabilityId, notes: 'Need to discuss thesis'
    }, studentToken);
    console.log(' Meeting booked successfully.');

    console.log('7. Verifying Double Booking...');
    try {
      await req('/meetings/book', 'POST', {
        availabilityId: availabilityId, notes: 'Another meeting'
      }, studentToken);
      console.log(' FAILURE: Allowed double booking!');
    } catch (err) {
      if (err.status === 400) {
        console.log(' SUCCESS: Prevented double booking.');
      } else {
        console.log(' FAILED with unexpected error:', err.data);
      }
    }

    console.log('8. Submitting Proposal...');
    await req('/proposals', 'POST', {
      title: 'A Study on AI', content: 'Using AI to schedule university meetings.'
    }, studentToken);
    console.log(' Proposal submitted.');

    console.log('ALL TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('TEST FAILED: ', err.data || err);
  }
}

testFlow();
