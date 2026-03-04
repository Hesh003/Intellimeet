import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminLecturerProfileScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Overview');

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="arrow-back" size={24} color="#1A202C" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lecturer Profile</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#1A202C" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarLarge}>
                        <Text style={styles.avatarTextLarge}>S</Text>
                    </View>
                    <Text style={styles.nameText}>Dr. Sarah Jenkins</Text>
                    <Text style={styles.titleText}>Senior Lecturer, Computer Science</Text>
                    <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={14} color="#00B050" style={{ marginRight: 4 }} />
                        <Text style={styles.verifiedText}>VERIFIED ACCOUNT</Text>
                    </View>

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]}>
                            <Ionicons name="chatbubble-outline" size={16} color="#4A5568" style={{ marginRight: 8 }} />
                            <Text style={styles.secondaryBtnText}>Contact</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
                            <Ionicons name="key-outline" size={16} color="#FFF" style={{ marginRight: 8 }} />
                            <Text style={styles.primaryBtnText}>Reset Access</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.tabsContainer}>
                    {['Overview', 'Meetings', 'Documents', 'Activity'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* OVERVIEW CONTENT */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Account Details</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Lecturer ID</Text>
                        <Text style={styles.detailValue}>LECT-88291</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Official Email</Text>
                        <Text style={styles.detailValue}>s.jenkins@university.edu</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Department</Text>
                        <Text style={styles.detailValue}>Software Engineering</Text>
                    </View>
                    <View style={[styles.detailRow, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
                        <Text style={styles.detailLabel}>Join Date</Text>
                        <Text style={styles.detailValue}>Aug 12, 2022</Text>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>Identity Documents</Text>
                        <TouchableOpacity><Text style={styles.linkText}>View All</Text></TouchableOpacity>
                    </View>

                    <View style={styles.docsRow}>
                        <View style={styles.docCard}>
                            <View style={[styles.docImagePlaceholder, { backgroundColor: '#EDF2F7' }]}>
                                <Ionicons name="id-card-outline" size={32} color="#A0AEC0" />
                            </View>
                            <Text style={styles.docName}>Staff_ID_Card.pdf</Text>
                            <Text style={styles.docMeta}>Updated 2 days ago</Text>
                        </View>
                        <View style={styles.docCard}>
                            <View style={[styles.docImagePlaceholder, { backgroundColor: '#F7FAFC' }]}>
                                <Ionicons name="document-text-outline" size={32} color="#A0AEC0" />
                            </View>
                            <Text style={styles.docName}>Verification_Doc.pdf</Text>
                            <Text style={styles.docMeta}>Verified Aug 4, 2023</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Recent History</Text>

                    <View style={styles.historyItem}>
                        <View style={[styles.historyIconBox, { backgroundColor: '#EBF4FF' }]}>
                            <Ionicons name="calendar-outline" size={16} color="#0066FF" />
                        </View>
                        <View style={styles.historyInfo}>
                            <Text style={styles.historyTitle}>Advanced Algorithms...</Text>
                            <Text style={styles.historyTime}>Today, 10:00 AM - 12:00 PM</Text>
                        </View>
                        <View style={styles.badgeFinished}><Text style={styles.badgeTextFinished}>COMPLETED</Text></View>
                    </View>

                    <View style={styles.historyItem}>
                        <View style={[styles.historyIconBox, { backgroundColor: '#F5F3FF' }]}>
                            <Ionicons name="people-outline" size={16} color="#805AD5" />
                        </View>
                        <View style={styles.historyInfo}>
                            <Text style={styles.historyTitle}>Thesis Review Session</Text>
                            <Text style={styles.historyTime}>Tomorrow, 02:00 PM</Text>
                        </View>
                        <View style={styles.badgeUpcoming}><Text style={styles.badgeTextUpcoming}>UPCOMING</Text></View>
                    </View>
                </View>

                <View style={styles.dangerZone}>
                    <Text style={styles.dangerZoneTitle}>Administrative Actions</Text>
                    <Text style={styles.dangerZoneDesc}>Warning: These actions are permanent and affect system access.</Text>

                    <TouchableOpacity
                        style={styles.dangerBtnFill}
                        onPress={() => navigation.navigate('DeactivateLecturerModal')}
                    >
                        <Text style={styles.dangerBtnFillText}>Suspend Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dangerBtnOutline}>
                        <Text style={styles.dangerBtnOutlineText}>Delete Records</Text>
                    </TouchableOpacity>
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
        paddingHorizontal: 16,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#FCFCFD',
    },
    iconBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A202C' },
    container: { paddingBottom: 60 },

    profileHeader: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24, backgroundColor: '#FCFCFD' },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ED8936',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarTextLarge: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
    nameText: { fontSize: 24, fontWeight: 'bold', color: '#1A202C', marginBottom: 4 },
    titleText: { fontSize: 14, color: '#4A5568', marginBottom: 12 },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E5F6EB',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 24,
    },
    verifiedText: { color: '#00B050', fontSize: 10, fontWeight: 'bold' },
    actionRow: { flexDirection: 'row', width: '100%', paddingHorizontal: 10 },
    actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: 8 },
    secondaryBtn: { backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 },
    secondaryBtnText: { color: '#4A5568', fontSize: 14, fontWeight: 'bold' },
    primaryBtn: { backgroundColor: '#0066FF', marginLeft: 8 },
    primaryBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },

    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        paddingHorizontal: 20,
        backgroundColor: '#FCFCFD',
        marginBottom: 20,
    },
    tab: { marginRight: 24, paddingVertical: 12 },
    activeTab: { borderBottomWidth: 2, borderBottomColor: '#0066FF' },
    tabText: { fontSize: 14, fontWeight: '600', color: '#718096' },
    activeTabText: { color: '#0066FF' },

    sectionContainer: {
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        elevation: 1,
    },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A202C', marginBottom: 16 },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    linkText: { fontSize: 14, fontWeight: '600', color: '#0066FF' },

    detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 12, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    detailLabel: { fontSize: 14, color: '#718096' },
    detailValue: { fontSize: 14, fontWeight: '600', color: '#1A202C' },

    docsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    docCard: { flex: 1, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, marginHorizontal: 4 },
    docImagePlaceholder: { height: 80, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    docName: { fontSize: 12, fontWeight: '600', color: '#1A202C', marginBottom: 4 },
    docMeta: { fontSize: 10, color: '#A0AEC0' },

    historyItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    historyIconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    historyInfo: { flex: 1 },
    historyTitle: { fontSize: 14, fontWeight: '600', color: '#1A202C', marginBottom: 4 },
    historyTime: { fontSize: 12, color: '#718096' },
    badgeFinished: { backgroundColor: '#F7FAFC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeTextFinished: { color: '#A0AEC0', fontSize: 10, fontWeight: 'bold' },
    badgeUpcoming: { backgroundColor: '#EBF4FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeTextUpcoming: { color: '#0066FF', fontSize: 10, fontWeight: 'bold' },

    dangerZone: {
        backgroundColor: '#FFF5F5',
        marginHorizontal: 20,
        marginBottom: 30,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#FED7D7',
    },
    dangerZoneTitle: { fontSize: 16, fontWeight: 'bold', color: '#C53030', marginBottom: 8 },
    dangerZoneDesc: { fontSize: 13, color: '#E53E3E', marginBottom: 20 },
    dangerBtnFill: { backgroundColor: '#E53E3E', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
    dangerBtnFillText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
    dangerBtnOutline: { backgroundColor: '#FFF', paddingVertical: 14, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#E53E3E' },
    dangerBtnOutlineText: { color: '#E53E3E', fontSize: 14, fontWeight: 'bold' },
});

export default AdminLecturerProfileScreen;
