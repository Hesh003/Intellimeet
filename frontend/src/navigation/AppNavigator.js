import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import LecturerListScreen from '../screens/LecturerListScreen';
import ManageAvailabilityScreen from '../screens/ManageAvailabilityScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import LecturerProfileScreen from '../screens/LecturerProfileScreen';
import BookMeetingScreen from '../screens/BookMeetingScreen';
import MeetingDetailsScreen from '../screens/MeetingDetailsScreen';
import RequestDetailsScreen from '../screens/RequestDetailsScreen';

// Admin specific stack screens
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminLecturerProfileScreen from '../screens/AdminLecturerProfileScreen';
import DeactivateLecturerModal from '../screens/DeactivateLecturerModal';
import AdminTimetablesScreen from '../screens/AdminTimetablesScreen';

// The new Tab Navigator
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

                {/* Main App with Tabs */}
                <Stack.Screen name="Dashboard" component={MainTabNavigator} />

                {/* Screens that go on top of tabs */}
                <Stack.Screen name="LecturerList" component={LecturerListScreen} />
                <Stack.Screen name="ManageAvailability" component={ManageAvailabilityScreen} />
                <Stack.Screen name="Notifications" component={NotificationsScreen} />
                <Stack.Screen name="LecturerProfile" component={LecturerProfileScreen} />
                <Stack.Screen name="BookMeeting" component={BookMeetingScreen} />
                <Stack.Screen name="MeetingDetails" component={MeetingDetailsScreen} />
                <Stack.Screen name="RequestDetails" component={RequestDetailsScreen} />

                {/* Admin Screens */}
                <Stack.Screen name="AdminLecturerProfile" component={AdminLecturerProfileScreen} />
                <Stack.Screen name="AdminTimetablesScreen" component={AdminTimetablesScreen} />
                <Stack.Screen
                    name="DeactivateLecturerModal"
                    component={DeactivateLecturerModal}
                    options={{ presentation: 'transparentModal' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
