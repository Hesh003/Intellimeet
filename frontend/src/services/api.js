import axios from 'axios';
import { Platform } from 'react-native';

// For Android emulator, use 10.0.2.2. For iOS emulator or real device, use IP or localhost.
// Replace with your local IP if testing on a physical device.
const API_URL = Platform.OS === 'android' ? 'http://192.168.8.46:5000/api/v1' : 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
