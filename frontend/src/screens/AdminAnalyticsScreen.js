import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminAnalyticsScreen = ({ navigation }) => {
    const [activeSubTab, setActiveSubTab] = useState('Overview');

    const renderChartMock = () => {
        // Simple DOM bars to represent the Meeting Trends chart without relying on an external library.
        const dataHeights = [40, 80, 120, 90, 60, 30, 20];
        const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

        return (
            <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>Meeting Trends</Text>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#A0AEC0" />
                </View>

                <View style={styles.chartArea}>
                    {dataHeights.map((h, i) => (
                        <View key={i} style={styles.barCol}>
                            <View style={[styles.bar, { height: h, backgroundColor: i === 2 ? '#0066FF' : '#BEE3F8' }]} />
                            <Text style={styles.barLabel}>{days[i]}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                        <Ionicons name="menu" size={24} color="#1A202C" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>System Analytics</Text>
                </View>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="notifications-outline" size={24} color="#1A202C" />
                </TouchableOpacity>
            </View>

            <View style={styles.tabsContainer}>
                {['Overview', 'Departments', 'Trends'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeSubTab === tab && styles.activeTab]}
                        onPress={() => setActiveSubTab(tab)}
                    >
                        <Text style={[styles.tabText, activeSubTab === tab && styles.activeTabText]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.filtersRow}>
                    <TouchableOpacity style={styles.filterChip}>
                        <Text style={styles.filterChipText}>Fall 2023</Text>
                        <Ionicons name="chevron-down" size={14} color="#4A5568" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterChip}>
                        <Text style={styles.filterChipText}>Computer Science</Text>
                        <Ionicons name="chevron-down" size={14} color="#4A5568" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filterChip, { backgroundColor: '#EBF4FF', borderWidth: 0 }]}>
                        <Text style={[styles.filterChipText, { color: '#0066FF' }]}>All Data</Text>
                    </TouchableOpacity>
                </View>

                {/* Key Metrics */}
                <View style={styles.metricsRow}>
                    <View style={styles.metricBox}>
                        <Text style={styles.metricLabel}>TOTAL MEETINGS</Text>
                        <Text style={styles.metricValue}>1,284</Text>
                        <Text style={styles.metricTrendUp}>↑ 12.3%</Text>
                    </View>
                    <View style={styles.metricBox}>
                        <Text style={styles.metricLabel}>AVG. ATTENDANCE</Text>
                        <Text style={styles.metricValue}>85%</Text>
                        <Text style={styles.metricTrendDown}>↓ 2.1%</Text>
                    </View>
                </View>

                <View style={styles.occupancyBar}>
                    <View style={styles.occTextRow}>
                        <Text style={styles.occLabel}>PEAK OCCUPANCY</Text>
                        <Text style={styles.occValue}>92% Capacity</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: '92%' }]} />
                    </View>
                    <Text style={styles.occSub}>Typically occurs Tuesday at 11:00 AM</Text>
                </View>

                {renderChartMock()}

                <View style={styles.breakdownCard}>
                    <Text style={styles.breakdownTitle}>Departmental Breakdown</Text>

                    <View style={styles.deptRow}>
                        <View style={styles.deptInfo}>
                            <View style={[styles.deptIcon, { backgroundColor: '#EBF4FF' }]}><Ionicons name="desktop-outline" size={14} color="#0066FF" /></View>
                            <Text style={styles.deptName}>Computer Science</Text>
                        </View>
                        <Text style={styles.deptValue}>423 meetings</Text>
                    </View>
                    <View style={styles.progressBarBgSub}><View style={[styles.progressBarFillSub, { width: '80%', backgroundColor: '#0066FF' }]} /></View>

                    <View style={styles.deptRow}>
                        <View style={styles.deptInfo}>
                            <View style={[styles.deptIcon, { backgroundColor: '#F5F3FF' }]}><Ionicons name="construct-outline" size={14} color="#805AD5" /></View>
                            <Text style={styles.deptName}>Engineering</Text>
                        </View>
                        <Text style={styles.deptValue}>312 meetings</Text>
                    </View>
                    <View style={styles.progressBarBgSub}><View style={[styles.progressBarFillSub, { width: '60%', backgroundColor: '#805AD5' }]} /></View>

                    <View style={styles.deptRow}>
                        <View style={styles.deptInfo}>
                            <View style={[styles.deptIcon, { backgroundColor: '#E5F6EB' }]}><Ionicons name="flask-outline" size={14} color="#00B050" /></View>
                            <Text style={styles.deptName}>Life Sciences</Text>
                        </View>
                        <Text style={styles.deptValue}>245 meetings</Text>
                    </View>
                    <View style={styles.progressBarBgSub}><View style={[styles.progressBarFillSub, { width: '45%', backgroundColor: '#00B050' }]} /></View>

                    <TouchableOpacity style={styles.viewAllBtn}>
                        <Text style={styles.viewAllText}>View All Departments</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionHeader}>System Insights</Text>
                <View style={styles.insightBox}>
                    <Ionicons name="bulb-outline" size={24} color="#0066FF" style={{ marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.insightText}><Text style={{ fontWeight: 'bold' }}>Efficiency Tip:</Text> Friday afternoons have 40% unutilized space in the Science Wing.</Text>
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
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#FCFCFD',
    },
    headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
    iconBtn: { padding: 4, marginRight: 8 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A202C', marginLeft: 10 },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        paddingHorizontal: 20,
        backgroundColor: '#FCFCFD',
        marginBottom: 10,
    },
    tab: {
        marginRight: 24,
        paddingVertical: 12,
    },
    activeTab: { borderBottomWidth: 2, borderBottomColor: '#0066FF' },
    tabText: { fontSize: 14, fontWeight: '600', color: '#718096' },
    activeTabText: { color: '#0066FF' },
    container: { padding: 20, paddingBottom: 80 },
    filtersRow: { flexDirection: 'row', marginBottom: 24 },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    filterChipText: { fontSize: 13, color: '#4A5568', fontWeight: '500' },

    // Metrics
    metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    metricBox: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        elevation: 1,
    },
    metricLabel: { fontSize: 11, fontWeight: 'bold', color: '#A0AEC0', marginBottom: 8, letterSpacing: 0.5 },
    metricValue: { fontSize: 28, fontWeight: '800', color: '#1A202C', marginBottom: 4 },
    metricTrendUp: { fontSize: 12, fontWeight: 'bold', color: '#00B050' },
    metricTrendDown: { fontSize: 12, fontWeight: 'bold', color: '#E02020' },

    // Occupancy
    occupancyBar: { marginBottom: 30, paddingHorizontal: 4 },
    occTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    occLabel: { fontSize: 11, fontWeight: 'bold', color: '#A0AEC0', letterSpacing: 0.5 },
    occValue: { fontSize: 12, fontWeight: 'bold', color: '#0066FF' },
    progressBarBg: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, marginBottom: 8 },
    progressBarFill: { height: '100%', backgroundColor: '#0066FF', borderRadius: 4 },
    occSub: { fontSize: 11, color: '#A0AEC0' },

    // Chart
    chartCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        elevation: 1,
    },
    chartHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A202C' },
    chartArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150, paddingTop: 20 },
    barCol: { alignItems: 'center' },
    bar: { width: 32, borderRadius: 6, marginBottom: 8 },
    barLabel: { fontSize: 10, color: '#A0AEC0', fontWeight: 'bold' },

    // Breakdown
    breakdownCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        elevation: 1,
    },
    breakdownTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A202C', marginBottom: 20 },
    deptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    deptInfo: { flexDirection: 'row', alignItems: 'center' },
    deptIcon: { width: 24, height: 24, borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    deptName: { fontSize: 14, fontWeight: '600', color: '#4A5568' },
    deptValue: { fontSize: 13, color: '#A0AEC0', fontWeight: '500' },
    progressBarBgSub: { height: 4, backgroundColor: '#F0F0F0', borderRadius: 2, marginBottom: 20 },
    progressBarFillSub: { height: '100%', borderRadius: 2 },
    viewAllBtn: { alignItems: 'center', marginTop: 10 },
    viewAllText: { color: '#0066FF', fontSize: 13, fontWeight: 'bold' },

    // Insights
    sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#1A202C', marginBottom: 12 },
    insightBox: {
        flexDirection: 'row',
        backgroundColor: '#EBF4FF',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#0066FF',
    },
    insightText: { fontSize: 14, color: '#2D3748', lineHeight: 20 }
});

export default AdminAnalyticsScreen;
