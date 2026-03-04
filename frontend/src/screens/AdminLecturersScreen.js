import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminLecturersScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data based on the Figma UI
    const lecturers = [
        {
            id: '1',
            name: 'Dr. Sarah Jenkins',
            department: 'Computer Science Dept.',
            staffId: 'ID: 557-4-1992-041',
            status: 'Pending',
            avatarText: 'S',
            color: '#ED8936'
        },
        {
            id: '2',
            name: 'Prof. Michael Chen',
            department: 'Mathematics & Physics',
            staffId: 'ID: 557-4-1992-041',
            status: 'Verified',
            avatarText: 'M',
            color: '#4A5568'
        },
        {
            id: '3',
            name: 'Dr. Elena Rodriguez',
            department: 'Business Management',
            staffId: 'ID: 557-4-1992-041',
            status: 'Verified',
            avatarText: 'E',
            color: '#2B6CB0'
        }
    ];

    const getFilteredLecturers = () => {
        if (activeTab === 'All') return lecturers;
        return lecturers.filter(l => l.status === activeTab);
    };

    const renderLecturerCard = (lecturer) => {
        const isPending = lecturer.status === 'Pending';
        return (
            <View key={lecturer.id} style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={[styles.avatar, { backgroundColor: lecturer.color }]}>
                        <Text style={styles.avatarText}>{lecturer.avatarText}</Text>
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={styles.nameText}>{lecturer.name}</Text>
                        <Text style={styles.deptText}>{lecturer.department}</Text>
                        <Text style={styles.idText}>{lecturer.staffId}</Text>
                    </View>

                    <View style={isPending ? styles.badgePending : styles.badgeVerified}>
                        <Text style={isPending ? styles.badgeTextPending : styles.badgeTextVerified}>
                            {isPending ? 'PENDING' : 'VERIFIED'}
                        </Text>
                    </View>
                </View>

                {isPending ? (
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
                            <Text style={styles.primaryBtnText}>Verify Account</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.secondaryBtn]}
                            onPress={() => navigation.navigate('AdminLecturerProfile')}
                        >
                            <Text style={styles.secondaryBtnText}>Details</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]}>
                            <Text style={styles.secondaryBtnText}>Edit Schedule</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.dangerBtn]}
                            onPress={() => navigation.navigate('DeactivateLecturerModal')}
                        >
                            <Text style={styles.dangerBtnText}>Deactivate</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                        <Ionicons name="chevron-back" size={24} color="#1A202C" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Lecturers</Text>
                </View>
                <TouchableOpacity style={styles.inviteBtn}>
                    <Ionicons name="add" size={16} color="#FFF" />
                    <Text style={styles.inviteBtnText}>Invite</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#A0AEC0" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by name, ID or department"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <View style={styles.tabsContainer}>
                {['All', 'Verified', 'Pending'].map(tab => {
                    const count = tab === 'All' ? 42 : tab === 'Verified' ? 34 : 8;
                    return (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                {tab} ({count})
                            </Text>
                            {tab === 'Pending' && activeTab !== 'Pending' && (
                                <View style={styles.notificationDot} />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            <ScrollView contentContainerStyle={styles.listContainer}>
                {getFilteredLecturers().map(renderLecturerCard)}
            </ScrollView>

            <TouchableOpacity style={styles.fab}>
                <Ionicons name="person-add" size={24} color="#FFF" />
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
        paddingHorizontal: 16,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#FCFCFD',
    },
    headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
    iconBtn: { padding: 4, marginLeft: -4, marginRight: 8 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A202C' },
    inviteBtn: {
        flexDirection: 'row',
        backgroundColor: '#0066FF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
    },
    inviteBtnText: { color: '#FFF', fontSize: 13, fontWeight: 'bold', marginLeft: 4 },
    searchContainer: { paddingHorizontal: 20, marginBottom: 15 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 14, color: '#1A202C' },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    tab: {
        marginRight: 24,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeTab: { borderBottomWidth: 2, borderBottomColor: '#0066FF' },
    tabText: { fontSize: 14, fontWeight: '600', color: '#718096' },
    activeTabText: { color: '#0066FF' },
    notificationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E02020',
        marginLeft: 4,
        marginTop: -8,
    },
    listContainer: { padding: 20, paddingBottom: 80 },
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
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    infoWrapper: { flex: 1, justifyContent: 'center' },
    nameText: { fontSize: 16, fontWeight: 'bold', color: '#1A202C', marginBottom: 2 },
    deptText: { fontSize: 13, color: '#4A5568', marginBottom: 2 },
    idText: { fontSize: 11, color: '#A0AEC0' },
    badgePending: { backgroundColor: '#FFF5EB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
    badgeTextPending: { color: '#ED8936', fontSize: 10, fontWeight: 'bold' },
    badgeVerified: { backgroundColor: '#E5F6EB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
    badgeTextVerified: { color: '#00B050', fontSize: 10, fontWeight: 'bold' },

    // Actions
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 16,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtn: { backgroundColor: '#F0F6FF', marginRight: 8 },
    primaryBtnText: { color: '#0066FF', fontSize: 14, fontWeight: 'bold' },
    secondaryBtn: { backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E2E8F0', marginLeft: 8 },
    secondaryBtnText: { color: '#4A5568', fontSize: 14, fontWeight: 'bold' },
    dangerBtn: { flex: 1, marginLeft: 8 },
    dangerBtnText: { color: '#E02020', fontSize: 14, fontWeight: 'bold' },

    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
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
    }
});

export default AdminLecturersScreen;
