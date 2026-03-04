import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const MeetingDetailsScreen = ({ route, navigation }) => {
    const { user } = useContext(AuthContext);
    const isLecturer = user?.role === 'Lecturer';

    // In a real app we'd fetch details by ID. Using mocked data for the UI prototype.
    const { meetingId } = route.params || {};

    // Dynamic mock
    const meeting = {
        otherPersonName: isLecturer ? 'Alice Johnson' : 'Dr. Sarah Jenkins',
        otherPersonTitle: isLecturer ? 'BSc CompSci - Year 3' : 'Senior Lecturer',
        department: isLecturer ? 'Student ID: CS10293' : 'Computer Science Department',
        date: 'Monday, Oct 24 • 10:00 AM - 11:00 AM',
        link: 'zoom.us/j/44281048572',
        room: 'Building 4, Room 204B (Hybrid)',
        topic: 'Thesis Proposal Discussion',
        notes: isLecturer
            ? 'Student sent proposal document. Needs feedback on methodology chapter.'
            : 'Discussion regarding the final year project milestones and repository structure. Please bring your updated SRS document and a list of technologies you plan to use for the frontend.'
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="chevron-back" size={24} color="#1A202C" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Meeting Details</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.profileSection}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{meeting.otherPersonName.charAt(0)}</Text>
                    </View>
                    <Text style={styles.nameText}>{meeting.otherPersonName}</Text>
                    <Text style={styles.titleText}>{meeting.otherPersonTitle}</Text>
                    <Text style={styles.deptText}>{meeting.department}</Text>

                    {isLecturer ? (
                        <TouchableOpacity style={styles.messageBtn}>
                            <Ionicons name="chatbubble-ellipses-outline" size={16} color="#0066FF" style={{ marginRight: 6 }} />
                            <Text style={styles.messageBtnText}>Message Student</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.badgesRow}>
                            <View style={styles.badgeConfirmed}>
                                <Text style={styles.badgeTextConfirmed}>CONFIRMED</Text>
                            </View>
                            <View style={styles.badgeAdvisory}>
                                <Text style={styles.badgeTextAdvisory}>ACADEMIC ADVISORY</Text>
                            </View>
                        </View>
                    )}
                </View>

                {isLecturer && (
                    <View style={styles.discussionBox}>
                        <Text style={styles.discussionBoxTitle}>Discussion Topic</Text>
                        <Text style={styles.discussionBoxValue}>{meeting.topic}</Text>
                    </View>
                )}

                <View style={styles.detailsList}>
                    <View style={styles.detailItem}>
                        <View style={styles.detailIconBox}>
                            <Ionicons name="calendar" size={20} color="#0066FF" />
                        </View>
                        <View style={styles.detailTextCol}>
                            <Text style={styles.detailLabel}>Schedule</Text>
                            <Text style={styles.detailValue}>{meeting.date}</Text>
                        </View>
                    </View>

                    <View style={styles.detailItem}>
                        <View style={styles.detailIconBox}>
                            <Ionicons name="videocam" size={20} color="#0066FF" />
                        </View>
                        <View style={styles.detailTextCol}>
                            <Text style={styles.detailLabel}>Online Meeting</Text>
                            <Text style={styles.detailLinkValue}>{meeting.link}</Text>
                        </View>
                        <TouchableOpacity style={styles.copyIcon}>
                            <Ionicons name="copy-outline" size={20} color="#A0AEC0" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.detailItem}>
                        <View style={styles.detailIconBox}>
                            <Ionicons name="location" size={20} color="#0066FF" />
                        </View>
                        <View style={styles.detailTextCol}>
                            <Text style={styles.detailLabel}>Room Number</Text>
                            <Text style={styles.detailValue}>{meeting.room}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.notesSection}>
                    <Text style={styles.notesTitle}>{isLecturer ? '— INTERNAL NOTES' : '— MEETING NOTES'}</Text>
                    <Text style={styles.notesBody}>{meeting.notes}</Text>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.primaryBtn}>
                        <Ionicons name="videocam-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.primaryBtnText}>Join Online Meeting</Text>
                    </TouchableOpacity>

                    <View style={styles.secondaryActionsRow}>
                        <TouchableOpacity style={styles.rescheduleBtn}>
                            <Ionicons name="calendar-outline" size={18} color="#0066FF" style={{ marginRight: 6 }} />
                            <Text style={styles.rescheduleText}>Reschedule</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelBtn}>
                            <Ionicons name="close-circle-outline" size={18} color="#E02020" style={{ marginRight: 6 }} />
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FCFCFD' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: '#FCFCFD',
    },
    iconBtn: { padding: 5, marginLeft: -5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A202C' },
    container: { padding: 24, paddingBottom: 60 },
    profileSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#2D3748',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
    nameText: { fontSize: 22, fontWeight: '800', color: '#1A202C', marginBottom: 4 },
    titleText: { fontSize: 15, fontWeight: '600', color: '#0066FF', marginBottom: 2 },
    deptText: { fontSize: 13, color: '#4A5568', marginBottom: 16 },
    badgesRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeConfirmed: {
        backgroundColor: '#E5F6EB',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 8,
    },
    badgeTextConfirmed: { color: '#00B050', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
    badgeAdvisory: {
        backgroundColor: '#EBF4FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeTextAdvisory: { color: '#0066FF', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
    detailsList: {
        marginBottom: 30,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        elevation: 1,
    },
    detailIconBox: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: '#EBF4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    detailTextCol: { flex: 1 },
    detailLabel: { fontSize: 13, color: '#718096', marginBottom: 4, fontWeight: '500' },
    detailValue: { fontSize: 14, color: '#1A202C', fontWeight: '600' },
    detailLinkValue: { fontSize: 14, color: '#0066FF', fontWeight: '600', textDecorationLine: 'underline' },
    copyIcon: { padding: 5 },
    notesSection: {
        marginBottom: 40,
    },
    notesTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0066FF',
        letterSpacing: 1,
        marginBottom: 12,
    },
    notesBody: {
        fontSize: 14,
        lineHeight: 22,
        color: '#4A5568',
    },
    actionButtons: {},
    primaryBtn: {
        flexDirection: 'row',
        backgroundColor: '#0066FF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#0066FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        elevation: 4,
    },
    primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    secondaryActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rescheduleBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#EBF4FF',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    rescheduleText: { color: '#0066FF', fontSize: 15, fontWeight: 'bold' },
    cancelBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#FDECEC',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    cancelText: { color: '#E02020', fontSize: 15, fontWeight: 'bold' },
    messageBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EBF4FF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    messageBtnText: { color: '#0066FF', fontSize: 13, fontWeight: 'bold' },
    discussionBox: {
        backgroundColor: '#F7FAFC',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderLeftWidth: 3,
        borderLeftColor: '#0066FF',
    },
    discussionBoxTitle: { fontSize: 12, color: '#A0AEC0', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
    discussionBoxValue: { fontSize: 15, fontWeight: 'bold', color: '#1A202C' },

});

export default MeetingDetailsScreen;
