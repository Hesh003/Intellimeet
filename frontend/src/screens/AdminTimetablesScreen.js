import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminTimetablesScreen = () => {
    const [userType, setUserType] = useState('Lecturers'); // Lecturers or Students
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    // Mock DB of users for search
    const mockUsers = [
        { id: '1', name: 'Dr. Sarah Jenkins', role: 'Lecturers', dept: 'Computer Science' },
        { id: '2', name: 'Prof. Michael Chen', role: 'Lecturers', dept: 'Mathematics' },
        { id: '3', name: 'Alice Johnson', role: 'Students', dept: 'Year 3, BSc IT' },
    ];

    const filteredUsers = mockUsers.filter(u => u.role === userType && u.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleUpload = () => {
        Alert.alert("Upload Timetable", "Select a CSV or PDF file from the university database to override this user's current schedule.", [
            { text: "Cancel", style: "cancel" },
            { text: "Select File", onPress: () => console.log('File picker triggered') }
        ]);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Timetable Management</Text>
            </View>

            <View style={styles.tabsContainer}>
                <TouchableOpacity style={[styles.tab, userType === 'Lecturers' && styles.activeTab]} onPress={() => { setUserType('Lecturers'); setSelectedUser(null); }}>
                    <Text style={[styles.tabText, userType === 'Lecturers' && styles.activeTabText]}>Lecturer Schedules</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, userType === 'Students' && styles.activeTab]} onPress={() => { setUserType('Students'); setSelectedUser(null); }}>
                    <Text style={[styles.tabText, userType === 'Students' && styles.activeTabText]}>Student Schedules</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#64748B" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={`Search ${userType.toLowerCase()}...`}
                        placeholderTextColor="#94A3B8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {!selectedUser ? (
                    <View style={styles.listArea}>
                        <Text style={styles.sectionTitle}>Select a {userType.slice(0, -1)}</Text>
                        {filteredUsers.map(u => (
                            <TouchableOpacity key={u.id} style={styles.userCard} onPress={() => setSelectedUser(u)}>
                                <View style={styles.userAvatar}><Text style={styles.userAvatarText}>{u.name.charAt(0)}</Text></View>
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{u.name}</Text>
                                    <Text style={styles.userDept}>{u.dept}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View style={styles.scheduleView}>
                        <TouchableOpacity style={styles.backLink} onPress={() => setSelectedUser(null)}>
                            <Ionicons name="arrow-back" size={18} color="#4F46E5" />
                            <Text style={styles.backLinkText}> Back to List</Text>
                        </TouchableOpacity>

                        <View style={styles.targetUserHeader}>
                            <Text style={styles.targetUserName}>{selectedUser.name}</Text>
                            <Text style={styles.targetUserDept}>{selectedUser.dept}</Text>
                        </View>

                        <View style={styles.actionsRow}>
                            <TouchableOpacity style={styles.primaryBtn} onPress={handleUpload}>
                                <Ionicons name="cloud-upload-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                                <Text style={styles.primaryBtnText}>Override Data</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.secondaryBtn}>
                                <Ionicons name="pencil-outline" size={20} color="#0F172A" style={{ marginRight: 8 }} />
                                <Text style={styles.secondaryBtnText}>Manual Edit</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.previewTitle}>Current Schedule Preview</Text>
                        <View style={styles.gridMockup}>
                            <View style={styles.gridHeader}>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => <Text key={d} style={styles.gridDay}>{d}</Text>)}
                            </View>
                            <View style={styles.gridBody}>
                                <View style={styles.gridTimeCol}>
                                    <Text style={styles.gridTime}>09:00</Text>
                                    <Text style={styles.gridTime}>10:00</Text>
                                    <Text style={styles.gridTime}>11:00</Text>
                                    <Text style={styles.gridTime}>12:00</Text>
                                </View>
                                <View style={styles.gridSlots}>
                                    {/* Mock Block */}
                                    <View style={[styles.timeBlock, { top: 10, left: 10, width: '18%', height: 80, backgroundColor: '#EEF2FF', borderColor: '#4F46E5' }]}>
                                        <Text style={[styles.blockText, { color: '#4F46E5' }]}>Lecture</Text>
                                    </View>
                                    <View style={[styles.timeBlock, { top: 110, left: '42%', width: '18%', height: 40, backgroundColor: '#DCFCE7', borderColor: '#16A34A' }]}>
                                        <Text style={[styles.blockText, { color: '#16A34A' }]}>Office</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    headerTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },

    tabsContainer: { flexDirection: 'row', backgroundColor: '#FFF', paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    tab: { flex: 1, alignItems: 'center', paddingVertical: 16, borderBottomWidth: 3, borderBottomColor: 'transparent' },
    activeTab: { borderBottomColor: '#4F46E5' },
    tabText: { fontSize: 15, fontWeight: '600', color: '#64748B' },
    activeTabText: { color: '#4F46E5', fontWeight: '800' },

    searchSection: { paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, paddingHorizontal: 16, height: 50 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#0F172A', fontWeight: '500' },

    container: { padding: 24, paddingBottom: 60 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 20, letterSpacing: -0.5 },

    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    userAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    userAvatarText: { fontSize: 18, fontWeight: '800', color: '#4F46E5' },
    userInfo: { flex: 1 },
    userName: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
    userDept: { fontSize: 13, color: '#64748B', fontWeight: '500' },

    scheduleView: { flex: 1 },
    backLink: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, paddingVertical: 8, alignSelf: 'flex-start' },
    backLinkText: { fontSize: 15, fontWeight: '700', color: '#4F46E5', marginLeft: 4 },
    targetUserHeader: { marginBottom: 28, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    targetUserName: { fontSize: 28, fontWeight: '900', color: '#0F172A', marginBottom: 6, letterSpacing: -0.5 },
    targetUserDept: { fontSize: 15, color: '#64748B', fontWeight: '500' },

    actionsRow: { flexDirection: 'row', marginBottom: 36 },
    primaryBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#4F46E5',
        paddingVertical: 14,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    primaryBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },
    secondaryBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingVertical: 14,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    secondaryBtnText: { color: '#0F172A', fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },

    previewTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 16, letterSpacing: -0.5 },
    gridMockup: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 20,
        overflow: 'hidden',
        height: 420,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    gridHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingLeft: 60, height: 48, alignItems: 'center', backgroundColor: '#F8FAFC' },
    gridDay: { flex: 1, textAlign: 'center', fontSize: 13, fontWeight: '800', color: '#64748B' },
    gridBody: { flexDirection: 'row', flex: 1, backgroundColor: '#FFF' },
    gridTimeCol: { width: 60, borderRightWidth: 1, borderRightColor: '#F1F5F9', paddingTop: 16, backgroundColor: '#F8FAFC' },
    gridTime: { fontSize: 11, color: '#94A3B8', textAlign: 'center', marginBottom: 38, fontWeight: '600' },
    gridSlots: { flex: 1, position: 'relative' },
    timeBlock: { position: 'absolute', borderWidth: 1, borderRadius: 8, padding: 6, justifyContent: 'center', alignItems: 'center' },
    blockText: { fontSize: 11, fontWeight: '800' },
});

export default AdminTimetablesScreen;
