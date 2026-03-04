import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Feather } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

// Student & Lecturer Screens
import DashboardScreen from '../screens/DashboardScreen';
import CalendarScreen from '../screens/CalendarScreen';
import MyMeetingsScreen from '../screens/MyMeetingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LecturerRequestsScreen from '../screens/LecturerRequestsScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminLecturersScreen from '../screens/AdminLecturersScreen';
import AdminAnalyticsScreen from '../screens/AdminAnalyticsScreen';
import AdminTimetablesScreen from '../screens/AdminTimetablesScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const { user } = useContext(AuthContext);

    // Fallback role safety
    const isLecturer = user?.role === 'Lecturer';
    const isAdmin = user?.role === 'Admin'; // assuming role is 'Admin'

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        return <Feather name="home" size={size} color={color} />;
                    } else if (route.name === 'Schedule' || route.name === 'Schedules') {
                        return <Feather name="calendar" size={size} color={color} />;
                    } else if (route.name === 'Meetings') {
                        return <Feather name="users" size={size} color={color} />;
                    } else if (route.name === 'Profile' || route.name === 'Settings') {
                        return <Feather name={route.name === 'Settings' ? 'settings' : 'user'} size={size} color={color} />;
                    } else if (route.name === 'Requests') {
                        return <Ionicons name={focused ? 'reader' : 'reader-outline'} size={size} color={color} />;
                    } else if (route.name === 'Members') {
                        return <Ionicons name={focused ? 'people' : 'people-outline'} size={size} color={color} />;
                    } else if (route.name === 'Analytics') {
                        return <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={size} color={color} />;
                    }
                },
                tabBarActiveTintColor: '#0066FF',
                tabBarInactiveTintColor: '#A0AEC0',
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#E2E8F0',
                    elevation: 0,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    backgroundColor: '#FFF'
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                }
            })}
        >
            {/* Conditional Tab Rendering based on Role */}

            {isAdmin ? (
                <>
                    <Tab.Screen name="Home" component={AdminDashboardScreen} />
                    <Tab.Screen name="Members" component={AdminLecturersScreen} />
                    <Tab.Screen name="Analytics" component={AdminAnalyticsScreen} />
                    <Tab.Screen name="Schedules" component={AdminTimetablesScreen} />
                </>
            ) : (
                <>
                    <Tab.Screen name="Home" component={DashboardScreen} />

                    {isLecturer ? (
                        <Tab.Screen name="Requests" component={LecturerRequestsScreen} />
                    ) : null}

                    <Tab.Screen name="Schedule" component={CalendarScreen} />

                    {!isLecturer ? (
                        <Tab.Screen name="Meetings" component={MyMeetingsScreen} />
                    ) : null}

                    <Tab.Screen name="Profile" component={ProfileScreen} />
                </>
            )}

        </Tab.Navigator>
    );
}
