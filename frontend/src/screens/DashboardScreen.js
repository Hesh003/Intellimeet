import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const DashboardScreen = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            fetchMeetings();
        }, [])
    );

    const fetchMeetings = async () => {
        try {
            const res = await api.get('/meetings');
            if (res.data.success) {
                setMeetings(res.data.data);
            }
        } catch (err) {
            console.error('Fetch meetings error', err);
        } finally {
            setLoading(false);
        }
    };

    const updateMeetingStatus = async (id, status) => {
        try {
            // Create a mock zoom link if approved
            const meetingLink = status === 'Approved' ? `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}` : '';

            const res = await api.put(`/meetings/${id}/status`, { status, meetingLink });
            if (res.data.success) {
                // Refresh meetings
                fetchMeetings();
            }
        } catch (err) {
            Alert.alert('Error', err.response?.data?.error || 'Failed to update meeting');
        }
    };

    const handleLogout = () => {
        logout();
        navigation.replace('Login');
    };

    const renderStudentDashboard = () => {
        return (
            <View style={styles.contentArea}>
                <Text style={styles.sectionTitle}>Your Upcoming Meetings</Text>

                {loading ? <ActivityIndicator color="#0066FF" /> :
                    meetings.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No upcoming meetings.</Text>
                        </View>
                    ) : (
                        meetings.map(m => (
                            <View key={m._id} style={styles.meetingCard}>
                                <Text style={styles.meetingTopic}>{m.topic}</Text>
                                <Text style={styles.meetingSub}>With {m.lecturerId?.fullName}</Text>
                                <Text style={styles.meetingTime}>
                                    {m.availabilityId ? `${new Date(m.availabilityId.date).toLocaleDateString()} at ${m.availabilityId.startTime}` : 'Date TBD'}
                                </Text>
                                <View style={styles.statusBadge}>
                                    <Text style={[styles.statusText, { color: m.status === 'Approved' ? 'green' : m.status === 'Rejected' ? 'red' : '#F5A623' }]}>
                                        {m.status}
                                    </Text>
                                </View>
                                {m.status === 'Approved' && m.meetingLink ? (
                                    <Text selectable style={styles.linkText}>Link: {m.meetingLink}</Text>
                                ) : null}
                            </View>
                        ))
                    )
                }

                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('LecturerList')}
                >
                    <Text style={styles.actionBtnText}>Book a New Meeting</Text>
                </TouchableOpacity>
            </View>
        )
    };

    const renderLecturerDashboard = () => {
        const pendingMeetings = meetings.filter(m => m.status === 'Pending');

        return (
            <View style={styles.contentArea}>
                <Text style={styles.sectionTitle}>Pending Requests</Text>

                {loading ? <ActivityIndicator color="#0066FF" /> :
                    pendingMeetings.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No pending requests.</Text>
                        </View>
                    ) : (
                        pendingMeetings.map(m => (
                            <View key={m._id} style={styles.meetingCard}>
                                <Text style={styles.meetingTopic}>{m.topic}</Text>
                                <Text style={styles.meetingSub}>From {m.studentId?.fullName} ({m.studentId?.idNumber})</Text>
                                <Text style={styles.meetingTime}>
                                    {m.availabilityId ? `${new Date(m.availabilityId.date).toLocaleDateString()} at ${m.availabilityId.startTime}` : 'Date TBD'}
                                </Text>

                                <View style={styles.actionRow}>
                                    <TouchableOpacity style={styles.approveBtn} onPress={() => updateMeetingStatus(m._id, 'Approved')}>
                                        <Text style={styles.approveBtnText}>Approve</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.rejectBtn} onPress={() => updateMeetingStatus(m._id, 'Rejected')}>
                                        <Text style={styles.rejectBtnText}>Reject</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )
                }

                <Text style={styles.sectionTitle}>Confirmed Meetings</Text>
                {meetings.filter(m => m.status === 'Approved').map(m => (
                    <View key={m._id} style={styles.meetingCard}>
                        <Text style={styles.meetingTopic}>{m.topic}</Text>
                        <Text style={styles.meetingSub}>With {m.studentId?.fullName}</Text>
                        <Text style={styles.meetingTime}>
                            {m.availabilityId ? `${new Date(m.availabilityId.date).toLocaleDateString()} at ${m.availabilityId.startTime}` : 'Date TBD'}
                        </Text>
                        <Text selectable style={styles.linkText}>Link: {m.meetingLink}</Text>
                    </View>
                ))}

                <TouchableOpacity
                    style={styles.actionBtnSecondary}
                    onPress={() => navigation.navigate('ManageAvailability')}
                >
                    <Text style={styles.actionBtnSecondaryText}>Manage Availability</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
                        <Text style={styles.roleText}>{user?.role || 'Role'}</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.iconBtn}>
                            <Text style={styles.iconText}>🔔</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
                            <Text style={styles.iconText}>🚪</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {user?.role === 'Student' ? renderStudentDashboard() : null}
                {user?.role === 'Lecturer' ? renderLecturerDashboard() : null}
                {user?.role === 'Admin' ? (
                    <View style={styles.contentArea}>
                        <Text style={styles.emptyText}>Admin Dashboard under construction.</Text>
                    </View>
                ) : null}

                {/* Mock representation of recent activity regardless of role */}
                <View style={styles.recentActivity}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <View style={styles.activityCard}>
                        <Text style={styles.activitySub}>System</Text>
                        <Text style={styles.activityTitle}>Welcome to IntelliMeet!</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    container: {
        padding: 20,
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    roleText: {
        fontSize: 14,
        color: '#0066FF',
        fontWeight: '600',
        marginTop: 4,
    },
    headerActions: {
        flexDirection: 'row',
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    iconText: {
        fontSize: 18,
    },
    contentArea: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    emptyState: {
        height: 120,
        backgroundColor: '#FFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EFEFEF',
        borderStyle: 'dashed',
        marginBottom: 20,
    },
    emptyText: {
        color: '#999',
        fontSize: 14,
    },
    actionBtn: {
        backgroundColor: '#0066FF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#0066FF',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    actionBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionBtnSecondary: {
        backgroundColor: '#FFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#0066FF',
    },
    actionBtnSecondaryText: {
        color: '#0066FF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    recentActivity: {
        marginTop: 10,
    },
    activityCard: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    activitySub: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    activityTitle: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    meetingCard: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#0066FF',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    meetingTopic: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    meetingSub: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    meetingTime: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0066FF',
        marginBottom: 10,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#F0F5FF',
        borderRadius: 4,
        marginBottom: 5,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    linkText: {
        fontSize: 12,
        color: '#0066FF',
        marginTop: 5,
    },
    actionRow: {
        flexDirection: 'row',
        marginTop: 10,
    },
    approveBtn: {
        flex: 1,
        backgroundColor: '#E5F6EB',
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
        marginRight: 5,
    },
    approveBtnText: {
        color: '#00B050',
        fontWeight: 'bold',
    },
    rejectBtn: {
        flex: 1,
        backgroundColor: '#FDECEC',
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
        marginLeft: 5,
    },
    rejectBtnText: {
        color: '#E02020',
        fontWeight: 'bold',
    },
});

export default DashboardScreen;
