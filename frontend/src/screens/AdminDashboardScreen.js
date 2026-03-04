import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const AdminDashboardScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <View style={styles.logoBox}>
                        <Ionicons name="grid" size={20} color="#4F46E5" />
                    </View>
                    <View>
                        <Text style={styles.appTitle}>IntelliMeet</Text>
                        <Text style={styles.appSubTitle}>ADMIN PORTAL</Text>
                    </View>
                </View>
                <View style={styles.headerIconsRow}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="notifications-outline" size={24} color="#0F172A" />
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.avatarBtn, { marginLeft: 16 }]} onPress={() => navigation.navigate('Profile')}>
                        <Ionicons name="person-circle" size={36} color="#94A3B8" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.pageTitle}>System Dashboard</Text>
                <Text style={styles.pageSubtitle}>Overview of university scheduling metrics</Text>

                {/* Main Metrics */}
                <View style={styles.metricCardLarge}>
                    <View style={styles.metricHeaderRow}>
                        <Text style={styles.metricLabel}>Total Students</Text>
                        <Feather name="users" size={20} color="#4F46E5" />
                    </View>
                    <View style={styles.metricValueRow}>
                        <Text style={styles.metricValueLarge}>12,450</Text>
                        <Text style={styles.metricTrendUp}>↑ 2.1%</Text>
                    </View>
                </View>

                {/* Sub Metrics Row */}
                <View style={styles.metricsRow}>
                    <View style={[styles.metricCardSmall, { marginRight: 10 }]}>
                        <Text style={styles.metricLabel}>Lecturers</Text>
                        <Text style={styles.metricValueSmall}>842</Text>
                        <Text style={styles.metricTrendUp}>↑ 0.5%</Text>
                    </View>

                    <View style={[styles.metricCardSmall, { marginLeft: 10 }]}>
                        <Text style={styles.metricLabel}>Meetings Today</Text>
                        <Text style={styles.metricValueSmall}>156</Text>
                        <Text style={styles.metricTrendDown}>↓ 1.2%</Text>
                    </View>
                </View>

                {/* Verification Queue */}
                <View style={styles.verificationQueueCard}>
                    <View style={styles.vqHeaderRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="checkmark-circle-outline" size={22} color="#4F46E5" style={{ marginRight: 8 }} />
                            <Text style={styles.vqTitle}>Verification Queue</Text>
                        </View>
                        <View style={styles.vqBadge}>
                            <Text style={styles.vqBadgeText}>14</Text>
                        </View>
                    </View>
                    <Text style={styles.vqSubtitle}>14 lecturer applications are pending final review and approval.</Text>

                    <TouchableOpacity
                        style={styles.primaryBtn}
                        onPress={() => navigation.navigate('Members')} // Assuming 'Members' tab handles verification filtering
                    >
                        <Text style={styles.primaryBtnText}>Review Applications</Text>
                    </TouchableOpacity>
                </View>

                {/* System Overview */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>System Overview</Text>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>View Logs</Text>
                    </TouchableOpacity>
                </View>

                {/* Log Item 1 */}
                <View style={styles.logCard}>
                    <View style={[styles.logIconBox, { backgroundColor: '#DCFCE7' }]}>
                        <Ionicons name="checkmark" size={20} color="#16A34A" />
                    </View>
                    <View style={styles.logInfo}>
                        <Text style={styles.logTitle}>API Services</Text>
                        <Text style={styles.logDesc}>All core systems operational</Text>
                    </View>
                    <Text style={styles.logStatusGreen}>Healthy</Text>
                </View>

                {/* Log Item 2 */}
                <View style={styles.logCard}>
                    <View style={[styles.logIconBox, { backgroundColor: '#F1F5F9' }]}>
                        <Ionicons name="time-outline" size={20} color="#64748B" />
                    </View>
                    <View style={styles.logInfo}>
                        <Text style={styles.logTitle}>Recent Log</Text>
                        <Text style={styles.logDesc}>Database backup completed fully</Text>
                    </View>
                    <Text style={styles.logTime}>2m ago</Text>
                </View>

                {/* Log Item 3 */}
                <View style={styles.logCard}>
                    <View style={[styles.logIconBox, { backgroundColor: '#FEF3C7' }]}>
                        <Ionicons name="warning-outline" size={20} color="#D97706" />
                    </View>
                    <View style={styles.logInfo}>
                        <Text style={styles.logTitle}>Sync Delay</Text>
                        <Text style={styles.logDesc}>Google Calendar API delayed</Text>
                    </View>
                    <Text style={styles.logTime}>1h ago</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 20,
        backgroundColor: '#F8FAFC',
    },
    headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
    logoBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#EEF2FF', // Indigo 50
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    appTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
    appSubTitle: { fontSize: 11, fontWeight: 'bold', color: '#4F46E5', letterSpacing: 1.5, marginTop: 2 },
    headerIconsRow: { flexDirection: 'row', alignItems: 'center' },
    iconBtn: { padding: 4, position: 'relative' },
    notificationDot: {
        position: 'absolute',
        top: 2,
        right: 4,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#EF4444',
        borderWidth: 2,
        borderColor: '#F8FAFC',
    },
    avatarBtn: { padding: 0 },
    container: { padding: 24, paddingBottom: 60 },
    pageTitle: { fontSize: 28, fontWeight: '900', color: '#0F172A', marginBottom: 6, letterSpacing: -0.5 },
    pageSubtitle: { fontSize: 15, color: '#64748B', marginBottom: 32, fontWeight: '500' },

    // Metrics
    metricCardLarge: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9', // Slate 100
    },
    metricHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    metricLabel: { fontSize: 15, color: '#64748B', fontWeight: '700', letterSpacing: 0.5 },
    metricValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    metricValueLarge: { fontSize: 40, fontWeight: '900', color: '#0F172A', marginRight: 12 },
    metricTrendUp: { fontSize: 14, fontWeight: 'bold', color: '#16A34A' },
    metricTrendDown: { fontSize: 14, fontWeight: 'bold', color: '#DC2626' },

    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    metricCardSmall: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    metricValueSmall: { fontSize: 28, fontWeight: '900', color: '#0F172A', marginTop: 12, marginBottom: 4 },

    // Verification Queue
    verificationQueueCard: {
        backgroundColor: '#0F172A', // Slate 900
        borderRadius: 24,
        padding: 24,
        marginBottom: 36,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 6,
    },
    vqHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    vqTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
    vqBadge: {
        backgroundColor: '#EF4444', // Red 500
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    vqBadgeText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
    vqSubtitle: { fontSize: 15, color: '#94A3B8', marginBottom: 24, lineHeight: 22 },
    primaryBtn: {
        backgroundColor: '#4F46E5', // Indigo 600
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

    // System Overview
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
    linkText: { fontSize: 15, fontWeight: '700', color: '#4F46E5' },
    logCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F8FAFC',
    },
    logIconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    logInfo: { flex: 1, marginRight: 10 },
    logTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
    logDesc: { fontSize: 14, color: '#64748B', lineHeight: 20 },
    logStatusGreen: { fontSize: 13, fontWeight: '800', color: '#16A34A', alignSelf: 'flex-start', marginTop: 4 },
    logTime: { fontSize: 13, color: '#94A3B8', fontWeight: '600', alignSelf: 'flex-start', marginTop: 4 },
});

export default AdminDashboardScreen;
