import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const LecturerProfileScreen = ({ route, navigation }) => {
    const { lecturerId } = route.params || {};
    const [lecturer, setLecturer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (lecturerId) {
            fetchLecturerDetails();
        } else {
            // Mock data for UI preview if no ID passed
            setLecturer({
                _id: 'mock1',
                fullName: 'Dr. Sarah Jenkins',
                email: 'sarah.j@university.edu',
                department: 'Computer Science Dept.',
                title: 'Senior Lecturer',
                room: 'Room 402, Building A',
                expertise: ['AI & Machine Learning', 'Data Ethics', 'Neural Networks']
            });
            setLoading(false);
        }
    }, [lecturerId]);

    const fetchLecturerDetails = async () => {
        try {
            // Assuming an endpoint exists, or we get basic info from the list
            const res = await api.get(`/users/${lecturerId}`);
            if (res.data.success) {
                const data = res.data.data;
                // Add mock fields for UI completeness
                data.department = 'Computer Science Dept.';
                data.title = 'Senior Lecturer';
                data.room = 'Room 402, Building A';
                data.expertise = ['AI & Machine Learning', 'Data Ethics', 'Neural Networks'];
                setLecturer(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0066FF" />
            </View>
        );
    }

    if (!lecturer) {
        return (
            <View style={styles.centerContainer}>
                <Text>Lecturer not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#0066FF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lecturer Profile</Text>
                <TouchableOpacity style={styles.backBtn}>
                    <Ionicons name="notifications-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.profileSection}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{lecturer.fullName.charAt(0)}</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.nameText}>{lecturer.fullName}</Text>
                        <Text style={styles.titleText}>{lecturer.title}</Text>
                        <Text style={styles.deptText}>{lecturer.department}</Text>
                        <View style={styles.roomRow}>
                            <Ionicons name="location-outline" size={14} color="#A0AEC0" />
                            <Text style={styles.roomText}>{lecturer.room}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.expertiseSection}>
                    <Text style={styles.sectionTitle}>EXPERTISE</Text>
                    <View style={styles.chipsContainer}>
                        {lecturer.expertise.map((item, index) => (
                            <View key={index} style={styles.expertiseChip}>
                                <Text style={styles.expertiseText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.actionButtonsRow}>
                    <TouchableOpacity style={styles.messageBtn}>
                        <Ionicons name="chatbubble-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.messageBtnText}>Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareBtn}>
                        <Ionicons name="share-social-outline" size={18} color="#0066FF" style={{ marginRight: 8 }} />
                        <Text style={styles.shareBtnText}>Share</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.officeHoursSection}>
                    <View style={styles.officeHoursHeader}>
                        <Text style={styles.officeTitle}>Office Hours</Text>
                        <View style={styles.monthSelector}>
                            <Ionicons name="chevron-back" size={16} color="#0066FF" />
                            <Text style={styles.monthText}>Oct 14 - 18</Text>
                            <Ionicons name="chevron-forward" size={16} color="#0066FF" />
                        </View>
                    </View>

                    {/* Mock Calendar Grid for UI */}
                    <View style={styles.calendarGrid}>
                        <View style={styles.daysRow}>
                            {['MON\n14', 'TUE\n15', 'WED\n16', 'THU\n17', 'FRI\n18'].map((day, i) => (
                                <Text key={i} style={styles.dayColText}>{day}</Text>
                            ))}
                        </View>
                        <View style={styles.timeSlotsContainer}>
                            {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'].map((time, rowIdx) => (
                                <View key={rowIdx} style={styles.timeRow}>
                                    <Text style={styles.timeLabel}>{time}</Text>
                                    <View style={styles.gridBoxes}>
                                        {[0, 1, 2, 3, 4].map((colIdx) => {
                                            const isSelected = rowIdx === 1 && colIdx === 2; // Mock selected slot Wed 10:00
                                            const isBusy = (rowIdx === 2 && colIdx === 1) || (rowIdx === 4 && colIdx === 3);
                                            return (
                                                <TouchableOpacity
                                                    key={colIdx}
                                                    style={[
                                                        styles.gridBox,
                                                        isSelected && styles.gridBoxSelected,
                                                        isBusy && styles.gridBoxBusy
                                                    ]}
                                                    onPress={() => {
                                                        if (!isBusy) {
                                                            navigation.navigate('BookMeeting', { lecturerId: lecturer._id, lecturerName: lecturer.fullName })
                                                        }
                                                    }}
                                                >
                                                    {isSelected && <Ionicons name="checkmark" size={16} color="#FFF" />}
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FCFCFD' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: '#FCFCFD',
    },
    backBtn: { padding: 5, marginLeft: -5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A202C' },
    container: { padding: 24, paddingBottom: 40 },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#2D3748',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        elevation: 4,
    },
    avatarText: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
    profileInfo: { flex: 1 },
    nameText: { fontSize: 22, fontWeight: '800', color: '#1A202C', marginBottom: 4 },
    titleText: { fontSize: 15, fontWeight: '600', color: '#0066FF', marginBottom: 2 },
    deptText: { fontSize: 13, color: '#4A5568', marginBottom: 6 },
    roomRow: { flexDirection: 'row', alignItems: 'center' },
    roomText: { fontSize: 12, color: '#A0AEC0', marginLeft: 4 },
    expertiseSection: { marginBottom: 30 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#A0AEC0', letterSpacing: 1, marginBottom: 12 },
    chipsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    expertiseChip: {
        backgroundColor: '#EBF4FF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    expertiseText: { color: '#0066FF', fontSize: 13, fontWeight: '600' },
    actionButtonsRow: {
        flexDirection: 'row',
        marginBottom: 40,
    },
    messageBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#0066FF',
        paddingVertical: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        shadowColor: '#0066FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        elevation: 4,
    },
    messageBtnText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
    shareBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFF',
        paddingVertical: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    shareBtnText: { color: '#0066FF', fontSize: 15, fontWeight: 'bold' },
    officeHoursSection: {},
    officeHoursHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    officeTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A202C' },
    monthSelector: { flexDirection: 'row', alignItems: 'center' },
    monthText: { color: '#0066FF', fontSize: 14, fontWeight: '600', marginHorizontal: 8 },
    calendarGrid: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        elevation: 1,
    },
    daysRow: {
        flexDirection: 'row',
        marginLeft: 50,
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    dayColText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 11,
        fontWeight: 'bold',
        color: '#A0AEC0',
        lineHeight: 16,
    },
    timeSlotsContainer: {},
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    timeLabel: {
        width: 40,
        fontSize: 11,
        color: '#A0AEC0',
        marginRight: 10,
        textAlign: 'right',
    },
    gridBoxes: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    gridBox: {
        flex: 1,
        height: 36,
        backgroundColor: '#F7FAFC',
        marginHorizontal: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridBoxSelected: {
        backgroundColor: '#0066FF',
        borderColor: '#0066FF',
        shadowColor: '#0066FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        elevation: 2,
    },
    gridBoxBusy: {
        backgroundColor: '#E2E8F0',
        borderColor: '#CBD5E0',
    },
});

export default LecturerProfileScreen;
