import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MyMeetingsScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Upcoming');

    // Mock data based on the UI design
    const meetings = [
        {
            id: '1',
            status: 'Approved',
            title: 'Advanced Calculus Seminar',
            date: 'Oct 24, 2023 • 10:00 AM - 11:00 AM',
            with: 'Dr. Sarah Jenkins',
            location: 'Room 402, Science Wing',
        },
        {
            id: '2',
            status: 'Pending',
            title: 'Thesis Project Review',
            date: 'Oct 26, 2023 • 02:00 PM - 03:00 PM',
            with: 'Prof. Michael Chen',
            location: 'Online • Zoom link in details',
        },
        {
            id: '3',
            status: 'Rejected',
            title: 'Internship Workshop',
            date: 'Oct 28, 2023 • 09:00 AM',
            with: 'Career Center Team',
            location: 'Online',
            reason: '* Instructor unavailable due to sudden conference schedule conflict.',
        }
    ];

    const renderMeetingCard = ({ item }) => {
        let badgeStyle = styles.badgePending;
        let badgeTextStyle = styles.badgeTextPending;

        if (item.status === 'Approved') {
            badgeStyle = styles.badgeApproved;
            badgeTextStyle = styles.badgeTextApproved;
        } else if (item.status === 'Rejected') {
            badgeStyle = styles.badgeRejected;
            badgeTextStyle = styles.badgeTextRejected;
        }

        return (
            <View style={styles.card}>
                <View style={[styles.badgeContainer, badgeStyle]}>
                    <Text style={badgeTextStyle}>{item.status}</Text>
                </View>

                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-vertical" size={20} color="#A0AEC0" />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={14} color="#718096" style={styles.infoIcon} />
                    <Text style={styles.infoText}>{item.date}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={14} color="#718096" style={styles.infoIcon} />
                    <Text style={styles.infoText}>{item.with}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={14} color="#718096" style={styles.infoIcon} />
                    <Text style={styles.infoText}>{item.location}</Text>
                </View>

                {item.reason && (
                    <Text style={styles.reasonText}>{item.reason}</Text>
                )}

                <View style={styles.actionRow}>
                    {item.status === 'Approved' && (
                        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('MeetingDetails', { meetingId: item.id })}>
                            <Text style={styles.primaryBtnText}>View Details</Text>
                        </TouchableOpacity>
                    )}
                    {item.status === 'Pending' && (
                        <>
                            <TouchableOpacity style={styles.secondaryBtn}>
                                <Text style={styles.secondaryBtnText}>Edit Request</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.grayBtn}>
                                <Text style={styles.grayBtnText}>Cancel</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    {item.status === 'Rejected' && (
                        <TouchableOpacity style={styles.primaryBtn}>
                            <Text style={styles.primaryBtnText}>Reschedule</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="chevron-back" size={24} color="#0066FF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Meetings</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="search" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Upcoming' && styles.activeTab]}
                    onPress={() => setActiveTab('Upcoming')}
                >
                    <Text style={[styles.tabText, activeTab === 'Upcoming' && styles.activeTabText]}>Upcoming</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'History' && styles.activeTab]}
                    onPress={() => setActiveTab('History')}
                >
                    <Text style={[styles.tabText, activeTab === 'History' && styles.activeTabText]}>History</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={activeTab === 'Upcoming' ? meetings : []}
                keyExtractor={(item) => item.id}
                renderItem={renderMeetingCard}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No {activeTab.toLowerCase()} meetings found.</Text>
                    </View>
                }
            />

            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('LecturerList')}>
                <Ionicons name="add" size={30} color="#FFF" />
            </TouchableOpacity>
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
    tabsContainer: {
        flexDirection: 'row',
        marginHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#0066FF',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#718096',
    },
    activeTabText: {
        color: '#0066FF',
    },
    listContainer: {
        paddingHorizontal: 24,
        paddingBottom: 100, // space for fab
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        elevation: 1.5,
    },
    badgeContainer: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 12,
    },
    badgeApproved: { backgroundColor: '#E5F6EB' },
    badgePending: { backgroundColor: '#FFF5EB' },
    badgeRejected: { backgroundColor: '#FDECEC' },
    badgeTextApproved: { color: '#00B050', fontSize: 11, fontWeight: 'bold' },
    badgeTextPending: { color: '#F5A623', fontSize: 11, fontWeight: 'bold' },
    badgeTextRejected: { color: '#E02020', fontSize: 11, fontWeight: 'bold' },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    cardTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A202C',
        marginRight: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    infoIcon: {
        marginRight: 8,
        width: 16,
    },
    infoText: {
        fontSize: 13,
        color: '#718096',
    },
    reasonText: {
        color: '#E02020',
        fontSize: 12,
        marginTop: 10,
        fontStyle: 'italic',
    },
    actionRow: {
        flexDirection: 'row',
        marginTop: 16,
    },
    primaryBtn: {
        flex: 1,
        backgroundColor: '#0066FF',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    primaryBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    secondaryBtn: {
        flex: 2,
        backgroundColor: '#EBF4FF',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 10,
    },
    secondaryBtnText: {
        color: '#0066FF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    grayBtn: {
        flex: 1,
        backgroundColor: '#F7FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    grayBtnText: {
        color: '#4A5568',
        fontSize: 14,
        fontWeight: 'bold',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#0066FF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0066FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        elevation: 5,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#A0AEC0',
        fontSize: 15,
    },
});

export default MyMeetingsScreen;
