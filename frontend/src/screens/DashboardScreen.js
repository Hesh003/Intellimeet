import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Ionicons, Feather } from '@expo/vector-icons';

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
            const meetingLink = status === 'Approved' ? `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}` : '';
            const res = await api.put(`/meetings/${id}/status`, { status, meetingLink });
            if (res.data.success) {
                fetchMeetings();
            }
        } catch (err) {
            Alert.alert('Error', err.response?.data?.error || 'Failed to update meeting');
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout", onPress: () => {
                        logout();
                        navigation.replace('Login');
                    }
                }
            ]
        );
    };

    const formatDate = (date) => {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    const renderStudentDashboard = () => {
        // Find today's meetings for agenda
        const todaysAgenda = meetings.filter(m => {
            if (!m.availabilityId) return false;
            const meetingDate = new Date(m.availabilityId.date).toDateString();
            const today = new Date().toDateString();
            return meetingDate === today && m.status === 'Approved';
        });

        return (
            <View style={styles.contentArea}>
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Today's Agenda</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.agendaScroll}>
                    {loading ? <ActivityIndicator color="#0066FF" /> :
                        todaysAgenda.length === 0 ? (
                            <View style={styles.agendaCardEmpty}>
                                <Text style={styles.emptyText}>No classes or meetings today.</Text>
                            </View>
                        ) : (
                            todaysAgenda.map(m => (
                                <View key={m._id} style={styles.agendaCard}>
                                    <View style={styles.agendaDetails}>
                                        <View style={styles.agendaTags}>
                                            <Text style={styles.tagTextBlue}>MEETING</Text>
                                            <Text style={styles.agendaTime}>{m.availabilityId.startTime}</Text>
                                        </View>
                                        <View style={styles.agendaImagePlaceholder}>
                                            <Ionicons name="people-outline" size={32} color="#FFF" />
                                            <Text style={styles.agendaImageText}>{m.meetingLink ? "Online" : "Physical"}</Text>
                                        </View>
                                        <Text style={styles.agendaTopic}>{m.topic}</Text>
                                        <Text style={styles.agendaSub}>Prof. {m.lecturerId?.fullName}</Text>
                                    </View>
                                </View>
                            ))
                        )
                    }
                    {/* Mock static card for UI demo as requested */}
                    {!loading && todaysAgenda.length === 0 && (
                        <View style={styles.agendaCard}>
                            <View style={styles.agendaDetails}>
                                <View style={styles.agendaTags}>
                                    <Text style={styles.tagTextBlue}>LECTURE</Text>
                                    <Text style={styles.agendaTime}>9:00 AM</Text>
                                </View>
                                <View style={[styles.agendaImagePlaceholder, { backgroundColor: '#1E1E1E' }]}>
                                    <Text style={styles.agendaImageText}>Hall B - Main Campus</Text>
                                </View>
                                <Text style={styles.agendaTopic}>Advanced Calculus</Text>
                                <Text style={styles.agendaSub}>Prof. Sarah Jenkins</Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActionsRow}>
                    <TouchableOpacity
                        style={styles.quickActionBox}
                        onPress={() => navigation.navigate('LecturerList')}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#0066FF' }]}>
                            <Ionicons name="add-outline" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.quickActionText}>Book Meeting</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quickActionBoxSecondary}
                        onPress={() => navigation.navigate('Calendar')}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#F0F5FF' }]}>
                            <Feather name="calendar" size={20} color="#0066FF" />
                        </View>
                        <Text style={styles.quickActionTextSecondary}>View Schedule</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <View style={styles.recentActivityList}>
                    <View style={styles.activityItem}>
                        <View style={[styles.activityIconCircle, { backgroundColor: '#EBF4FF' }]}>
                            <Ionicons name="calendar-outline" size={18} color="#0066FF" />
                        </View>
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>Meeting Confirmed</Text>
                            <Text style={styles.activityDesc}>With Prof. Jenkins for Friday</Text>
                        </View>
                        <Text style={styles.activityTime}>2h ago</Text>
                    </View>

                    <View style={styles.activityItem}>
                        <View style={[styles.activityIconCircle, { backgroundColor: '#EBF4FF' }]}>
                            <Ionicons name="checkmark-circle-outline" size={18} color="#0066FF" />
                        </View>
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>Grade Posted</Text>
                            <Text style={styles.activityDesc}>Quantum Physics Quiz 4</Text>
                        </View>
                        <Text style={styles.activityTime}>5h ago</Text>
                    </View>

                    <View style={styles.activityItem}>
                        <View style={[styles.activityIconCircle, { backgroundColor: '#FFF5EB' }]}>
                            <Ionicons name="document-text-outline" size={18} color="#F5A623" />
                        </View>
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>New Assignment</Text>
                            <Text style={styles.activityDesc}>Calculus Final Project Proposal</Text>
                        </View>
                        <Text style={styles.activityTime}>Yesterday</Text>
                    </View>
                </View>
            </View>
        )
    };

    const renderLecturerDashboard = () => {
        const pendingMeetings = meetings.filter(m => m.status === 'Pending');

        return (
            <View style={styles.contentArea}>
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Today's Schedule</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>View all</Text>
                    </TouchableOpacity>
                </View>

                {/* Horizontal Scroll for Schedule */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.agendaScroll}>
                    {/* Mock Lecture Card */}
                    <View style={styles.scheduleCard}>
                        <View style={styles.scheduleTags}>
                            <View style={styles.tagRedBox}>
                                <Text style={styles.tagTextRed}>LECTURE</Text>
                            </View>
                            <Text style={styles.agendaTime}>09:00 AM</Text>
                        </View>
                        <Text style={styles.agendaTopic}>Advanced Algorithms</Text>
                        <View style={styles.scheduleLocationRow}>
                            <Ionicons name="location-outline" size={14} color="#718096" />
                            <Text style={styles.agendaSub}>Room 402, Science Block</Text>
                        </View>
                        <View style={styles.avatarsRow}>
                            {/* Mock Student Avatars */}
                            <View style={styles.miniAvatar}><Text style={styles.miniAvatarText}>A</Text></View>
                            <View style={[styles.miniAvatar, { marginLeft: -10, backgroundColor: '#4A5568' }]}><Text style={styles.miniAvatarText}>B</Text></View>
                            <View style={[styles.miniAvatar, { marginLeft: -10, backgroundColor: '#2B6CB0' }]}><Text style={styles.miniAvatarText}>C</Text></View>
                        </View>
                    </View>

                    {/* Mock Meeting Card */}
                    <View style={styles.scheduleCard}>
                        <View style={styles.scheduleTags}>
                            <View style={styles.tagBlueBox}>
                                <Text style={styles.tagTextBlue}>MEETING</Text>
                            </View>
                            <Text style={styles.agendaTime}>10:30 AM</Text>
                        </View>
                        <Text style={styles.agendaTopic}>Thesis Supervision</Text>
                        <View style={styles.scheduleLocationRow}>
                            <Ionicons name="videocam-outline" size={14} color="#718096" />
                            <Text style={styles.agendaSub}>Google Meet</Text>
                        </View>
                        <View style={styles.studentInfoRow}>
                            <Ionicons name="person-outline" size={14} color="#718096" />
                            <Text style={styles.studentNameText}>Sarah Jenkins</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Dashboard Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumberRed}>{pendingMeetings.length || 12}</Text>
                        <Text style={styles.statLabel}>PENDING REQUESTS</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumberBlack}>4</Text>
                        <Text style={styles.statLabel}>TODAY'S TASKS</Text>
                    </View>
                </View>

                {/* Main Action Button */}
                <TouchableOpacity
                    style={styles.mainActionBtn}
                    onPress={() => navigation.navigate('ManageAvailability')}
                >
                    <Ionicons name="calendar" size={20} color="#FFF" style={{ marginRight: 10 }} />
                    <Text style={styles.mainActionBtnText}>Quick Manage Availability</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <View style={styles.recentActivityList}>
                    <View style={styles.activityItem}>
                        <View style={[styles.activityIconCircle, { backgroundColor: '#E5F6EB' }]}>
                            <Ionicons name="checkmark" size={18} color="#00B050" />
                        </View>
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>Room 201 booked</Text>
                            <Text style={styles.activityDesc}>For Friday's Seminar • 2m ago</Text>
                        </View>
                    </View>

                    <View style={styles.activityItem}>
                        <View style={[styles.activityIconCircle, { backgroundColor: '#FDECEC' }]}>
                            <Ionicons name="mail" size={18} color="#E02020" />
                        </View>
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>New request from Dean</Text>
                            <Text style={styles.activityDesc}>Faculty meeting update • 1h ago</Text>
                        </View>
                    </View>

                    <View style={styles.activityItem}>
                        <View style={[styles.activityIconCircle, { backgroundColor: '#EBF4FF' }]}>
                            <Ionicons name="person-add" size={18} color="#0066FF" />
                        </View>
                        <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>Sarah joined meeting</Text>
                            <Text style={styles.activityDesc}>Supervision slot confirmed • 3h ago</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerRow}>
                    <View style={styles.logoRow}>
                        <View style={styles.logoIconPlaceholder}>
                            <Ionicons name="school" size={16} color="#0066FF" />
                        </View>
                        <Text style={styles.brandTitle}>IntelliMeet</Text>
                    </View>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
                            <Ionicons name="log-out-outline" size={24} color="#666" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.bellIcon}>
                            <Ionicons name="notifications-outline" size={22} color="#333" />
                            <View style={styles.notificationDot} />
                        </TouchableOpacity>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{user?.name ? user.name.charAt(0) : 'U'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.greetingSection}>
                    <Text style={styles.greetingTitle}>Good morning, {user?.name ? user.name.split(' ')[0] : 'User'}</Text>
                    <Text style={styles.dateText}>{formatDate(new Date())}</Text>
                </View>

                {user?.role === 'Student' ? renderStudentDashboard() : null}
                {user?.role === 'Lecturer' ? renderLecturerDashboard() : null}
                {user?.role === 'Admin' ? (
                    <View style={styles.contentArea}>
                        <Text style={styles.emptyText}>Admin Dashboard under construction.</Text>
                    </View>
                ) : null}

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC', // Slate 50
    },
    container: {
        padding: 24,
        paddingTop: 20,
        paddingBottom: 80,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoIconPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#EEF2FF', // Indigo 50
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    brandTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A', // Slate 900
        letterSpacing: -0.5,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bellIcon: {
        marginRight: 18,
        position: 'relative',
    },
    notificationDot: {
        position: 'absolute',
        top: 0,
        right: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#EF4444', // Red 500
        borderWidth: 2,
        borderColor: '#F8FAFC',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FCE7F3', // Pink 100
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#BE185D', // Pink 700
        fontWeight: 'bold',
        fontSize: 18,
    },
    greetingSection: {
        marginBottom: 36,
    },
    greetingTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    dateText: {
        fontSize: 15,
        color: '#64748B', // Slate 500
        fontWeight: '500',
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    viewAllText: {
        color: '#4F46E5', // Indigo 600
        fontSize: 15,
        fontWeight: '700',
    },
    contentArea: {
        marginBottom: 10,
    },
    agendaScroll: {
        marginHorizontal: -24,
        paddingHorizontal: 24,
        marginBottom: 36,
        paddingBottom: 20, // Give room for big shadow
    },
    agendaCard: {
        width: 280,
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        marginRight: 20,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9', // Slate 100
    },
    agendaCardEmpty: {
        width: 280,
        height: 160,
        backgroundColor: '#F8FAFC', // Slate 50
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#CBD5E1', // Slate 300
    },
    agendaDetails: {},
    agendaTags: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    tagTextBlue: {
        color: '#4F46E5', // Indigo 600
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    agendaTime: {
        color: '#64748B', // Slate 500
        fontSize: 13,
        fontWeight: '700',
    },
    agendaImagePlaceholder: {
        height: 100,
        backgroundColor: '#334155', // Slate 700
        borderRadius: 16,
        justifyContent: 'flex-end',
        padding: 16,
        marginBottom: 20,
    },
    agendaImageText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    agendaTopic: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 6,
    },
    agendaSub: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    quickActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 36,
    },
    quickActionBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4F46E5', // Indigo 600
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    quickActionBoxSecondary: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9', // Slate 100
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    quickActionText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '800',
    },
    quickActionTextSecondary: {
        color: '#0F172A',
        fontSize: 15,
        fontWeight: '800',
    },
    recentActivityList: {},
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F8FAFC',
    },
    activityIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    activityDesc: {
        fontSize: 14,
        color: '#64748B',
    },
    activityTime: {
        fontSize: 13,
        color: '#94A3B8', // Slate 400
        fontWeight: '600',
    },
    emptyState: {
        height: 140,
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        marginBottom: 24,
    },
    emptyText: {
        color: '#94A3B8',
        fontSize: 15,
        fontWeight: '500',
    },
    scheduleCard: {
        width: 260,
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        marginRight: 20,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    scheduleTags: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    tagRedBox: {
        backgroundColor: '#FEF2F2', // Red 50
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    tagTextRed: {
        color: '#DC2626', // Red 600
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    tagBlueBox: {
        backgroundColor: '#EEF2FF', // Indigo 50
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    scheduleLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 6,
    },
    studentInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    studentNameText: {
        fontSize: 14,
        color: '#475569', // Slate 600
        marginLeft: 8,
        fontWeight: '600',
    },
    avatarsRow: {
        flexDirection: 'row',
        marginTop: 6,
    },
    miniAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F59E0B', // Amber 500
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    miniAvatarText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        marginHorizontal: 8,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F8FAFC',
    },
    statNumberRed: {
        fontSize: 32,
        fontWeight: '900',
        color: '#DC2626',
        marginBottom: 6,
    },
    statNumberBlack: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 6,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#64748B',
        letterSpacing: 1,
    },
    mainActionBtn: {
        flexDirection: 'row',
        backgroundColor: '#0F172A', // Slate 900
        paddingVertical: 20,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 36,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 6,
    },
    mainActionBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
});

export default DashboardScreen;
