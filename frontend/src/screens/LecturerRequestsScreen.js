import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LecturerRequestsScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Pending');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data for UI alignment
    const pendingRequests = [
        {
            id: '1',
            studentName: 'Alice Johnson',
            studentId: 'New',
            topic: 'Thesis Proposal Discussion',
            date: 'Mon, Oct 22 • 10:00 AM'
        },
        {
            id: '2',
            studentName: 'David Smith',
            studentId: 'Yr 3',
            topic: 'Project Review/Intro to AI',
            date: 'Tue, Oct 24 • 03:30 PM'
        },
        {
            id: '3',
            studentName: 'Sarah Chen',
            studentId: 'Yr 2',
            topic: 'Research Assistanceship Interest',
            date: 'Wed, Oct 25 • 11:15 AM'
        },
        {
            id: '4',
            studentName: 'Michael Brown',
            studentId: 'Yr 4',
            topic: 'Final Project Peer Matching',
            date: 'Fri, Oct 27 • 09:00 AM'
        }
    ];

    const renderRequestCard = (req) => (
        <TouchableOpacity
            key={req.id}
            style={styles.card}
            onPress={() => navigation.navigate('RequestDetails', { requestId: req.id })}
        >
            <View style={styles.cardHeaderRow}>
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{req.studentName.charAt(0)}</Text>
                </View>
                <View style={styles.infoWrapper}>
                    <Text style={styles.nameText}>{req.studentName}</Text>
                    <Text style={styles.topicText}>{req.topic}</Text>
                    <View style={styles.dateRow}>
                        <Ionicons name="calendar-outline" size={12} color="#718096" style={{ marginRight: 4 }} />
                        <Text style={styles.dateText}>{req.date}</Text>
                    </View>
                </View>
                {req.studentId === 'New' && (
                    <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>New</Text>
                    </View>
                )}
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.approveBtn}>
                    <Ionicons name="checkmark-circle-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.approveBtnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.declineBtn}>
                    <Ionicons name="close-circle-outline" size={16} color="#E02020" style={{ marginRight: 6 }} />
                    <Text style={styles.declineBtnText}>Decline</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="chevron-back" size={24} color="#1A202C" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pending Requests</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="notifications-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <View style={styles.tabsContainer}>
                {['Pending', 'Approved', 'Archive'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search students..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity>
                        <Ionicons name="filter" size={20} color="#999" />
                    </TouchableOpacity>
                </View>

                {activeTab === 'Pending' && (
                    <View style={styles.listHeaderRow}>
                        <Text style={styles.listHeaderTitle}>New Requests ({pendingRequests.length})</Text>
                        <TouchableOpacity>
                            <Text style={styles.listHeaderLink}>Select All</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {activeTab === 'Pending' && pendingRequests.map(renderRequestCard)}

                {activeTab !== 'Pending' && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No {activeTab.toLowerCase()} requests found.</Text>
                    </View>
                )}
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
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        paddingHorizontal: 20,
        backgroundColor: '#FCFCFD',
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#0066FF',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#718096',
    },
    activeTabText: {
        color: '#0066FF',
    },
    container: {
        padding: 24,
        paddingBottom: 40,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#2D3748',
    },
    listHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    listHeaderTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A202C',
    },
    listHeaderLink: {
        color: '#0066FF',
        fontSize: 14,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        elevation: 1.5,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    avatarPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#4A5568',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    nameText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 2,
    },
    topicText: {
        fontSize: 13,
        color: '#0066FF',
        marginBottom: 4,
        fontWeight: '500',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 12,
        color: '#718096',
    },
    newBadge: {
        backgroundColor: '#EBF4FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    newBadgeText: {
        color: '#0066FF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    approveBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#00B050',
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    approveBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    declineBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FDECEC',
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        borderWidth: 1,
        borderColor: '#FDECEC',
    },
    declineBtnText: {
        color: '#E02020',
        fontSize: 14,
        fontWeight: 'bold',
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

export default LecturerRequestsScreen;
