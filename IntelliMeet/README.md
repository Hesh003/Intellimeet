# IntelliMeet – Smart University Meeting Scheduling System

IntelliMeet is a comprehensive scheduling system designed to bridge the gap between students and lecturers. It features a React Native (Expo) frontend, a fast Node.js/Express REST API backend, and utilizes MongoDB for data persistence. 

## Features
- **Role-Based Access:** Dual interfaces for Students and Lecturers.
- **Smart Calendar Scheduling:** Lecturers create slots, students book them, averting double-booking gracefully.
- **AI Proposal Feedback Mechanism:** Students submit abstracts and receive fully mock-scored AI feedback reports.

---

## Prerequisites

Before running the application, make sure you have installed:
- **Node.js** (v18+ recommended)
- **Expo Go** application installed on your physical mobile device (Android/iOS) or an active Emulator on your machine.
- Your devices must be connected to the same Wi-Fi network for physical testing!

---

## 1. Running the Backend API

The backend serves all data and authenticates users via JWT.

1. Open a new terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *You should see `Connected to MongoDB` and `Server running on port 5000` in the output.*

---

## 2. Running the Mobile Application

The frontend is built with React Native and Expo Router.

1. Open a **second** terminal and navigate to the mobile folder:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **IMPORTANT CONFIGURATION**: 
   Open `mobile/services/api.ts`.
   If you are testing on an **Android Emulator**, the app connects to the API via `http://10.0.2.2:5000`.
   If you are testing using the **Expo Go app on your physical phone**, you MUST change the URL to match your computer's local Wi-Fi IP address (e.g., `http://192.168.1.100:5000/api`).

4. Start the Expo development packager:
   ```bash
   npx expo start -c
   npx expo start -c --tunnel
   ```

5. **Scan the QR Code**: 
   - Open the **Expo Go** app on your phone.
   - Scan the large QR code printed in the terminal.
   - The app will securely bundle and launch natively on your device!

## Technologies Used
- **Frontend**: React Native, Expo, React Navigation (Expo Router), Axios, React Native Calendars.
- **Backend**: Node.js, Express, TypeScript, Mongoose, JSON Web Tokens (JWT), Bcrypt.
- **Database**: MongoDB Atlas Cloud.

## Testing part
  npx ts-node --transpile-only api-tester.ts
