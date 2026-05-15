const axios = require('axios');
const jwt = require('jsonwebtoken');

async function run() {
  const token = jwt.sign({ userId: '69fd60581047638f8ea69f3b', role: 'lecturer' }, 'super_secret_jwt_intellimeet_key_2026', { expiresIn: '1h' });
  
  try {
    const res = await axios.put('http://localhost:5000/api/meetings/6a021e9bec43a71a4d9d1ddf/status', {
      status: 'confirmed'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Success:", res.data);
  } catch (error) {
    console.log("Error status:", error.response?.status);
    console.log("Error data:", error.response?.data);
  }
}
run();
