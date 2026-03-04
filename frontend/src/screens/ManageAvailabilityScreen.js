import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ManageAvailabilityScreen = ({ navigation }) => {
    const [recurring, setRecurring] = useState(true);
    const [activeTab, setActiveTab] = useState('Calendar View');

    // Mock data for UI alignment
    const activeRules = [
        { id: '1', days: 'Mon, Tue, Wed Morning', time: '09:00 AM - 12:00 PM' },
        { id: '2', days: 'Friday Afternoon', time: '01:00 PM - 03:00 PM' }
    ];

    const renderCalendarGrid = () => {
        return (
            <View style={styles.calendarGrid}>
                {/* Headers */}
                <View style={styles.gridHeaderRow}>
                    <View style={styles.timeAxisLabel} />
                    {['MON\n18', 'TUE\n19', 'WED\n20', 'THU\n21', 'FRI\n22', 'SAT\n23', 'SUN\n24'].map((day, i) => (
                        <View key={i} style={styles.dayColHeader}>
                            <Text style={styles.dayColText}>{day}</Text>
                        </View>
                    ))}
                </View>

                {/* Grid Rows */}
                {['08 AM', '10 AM', '12 PM', '02 PM', '04 PM'].map((time, rowIdx) => (
                    <View key={rowIdx} style={styles.gridRow}>
                        <Text style={styles.timeAxisLabelText}>{time}</Text>

                        <View style={styles.gridCellsRow}>
                            {[0, 1, 2, 3, 4, 5, 6].map((colIdx) => {
                                // Mock some available slots
                                const isAvailable =
                                    (rowIdx === 1 && [0, 1, 3].includes(colIdx)) ||
                                    (rowIdx === 3 && [1, 2, 4].includes(colIdx));

                                return (
                                    <View
                                        key={colIdx}
                                        style={[styles.gridCell, isAvailable && styles.gridCellActive]}
                                    />
                                );
                            })}
                        </View>
                    </View>
                ))}

                {/* Lunch break marker overlay mock */}
                <View style={styles.lunchBreakOverlay}>
                    <Text style={styles.lunchBreakText}>LUNCH BREAK</Text>
                </View>

                <Text style={styles.dragHint}>Tap and drag on the grid to add availability</Text>
            </View>
        );
    };

    const renderListRules = () => {
        return (
            <View style={styles.rulesList}>
                <View style={styles.rulesHeader}>
                    <Text style={styles.rulesHeaderTitle}>Active Availability Rules</Text>
                </View>
                {activeRules.map(rule => (
                    <View key={rule.id} style={styles.ruleCard}>
                        <View style={styles.ruleIconBox}>
                            <Ionicons name="calendar-outline" size={20} color="#0066FF" />
                        </View>
                        <View style={styles.ruleInfo}>
                            <Text style={styles.ruleDaysText}>{rule.days}</Text>
                            <Text style={styles.ruleTimeText}>{rule.time}</Text>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="ellipsis-vertical" size={20} color="#A0AEC0" />
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity style={styles.addRuleBtn}>
                    <Ionicons name="add" size={18} color="#0066FF" style={{ marginRight: 8 }} />
                    <Text style={styles.addRuleBtnText}>Add New Rule</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="chevron-back" size={24} color="#1A202C" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Availability Manager</Text>
                <TouchableOpacity>
                    <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.weekSelector}>
                    <Text style={styles.weekLabel}>WEEK OF</Text>
                    <View style={styles.weekControlRow}>
                        <TouchableOpacity>
                            <Ionicons name="chevron-back" size={20} color="#1A202C" />
                        </TouchableOpacity>
                        <Text style={styles.weekValue}>Sep 18 - Sep 24, 2023</Text>
                        <TouchableOpacity>
                            <Ionicons name="chevron-forward" size={20} color="#1A202C" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.recurringCard}>
                    <View style={styles.recurringInfo}>
                        <Ionicons name="repeat" size={24} color="#0066FF" style={{ marginRight: 10 }} />
                        <View>
                            <Text style={styles.recurringTitle}>Recurring Slots</Text>
                            <Text style={styles.recurringSub}>Apply to all upcoming weeks</Text>
                        </View>
                    </View>
                    <Switch
                        value={recurring}
                        onValueChange={setRecurring}
                        trackColor={{ false: "#E2E8F0", true: "#0066FF" }}
                        thumbColor="#FFF"
                    />
                </View>

                <View style={styles.tabsContainer}>
                    {['Calendar View', 'List Rules'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {activeTab === 'Calendar View' ? renderCalendarGrid() : renderListRules()}

            </ScrollView>

            {activeTab === 'List Rules' && (
                <TouchableOpacity style={styles.fab}>
                    <Ionicons name="add" size={30} color="#FFF" />
                </TouchableOpacity>
            )}
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
    saveBtnText: { color: '#0066FF', fontSize: 16, fontWeight: 'bold' },
    container: { paddingBottom: 60, paddingHorizontal: 20 },
    weekSelector: { alignItems: 'center', marginVertical: 20 },
    weekLabel: { fontSize: 11, fontWeight: 'bold', color: '#A0AEC0', letterSpacing: 1, marginBottom: 8 },
    weekControlRow: { flexDirection: 'row', alignItems: 'center' },
    weekValue: { fontSize: 16, fontWeight: 'bold', color: '#1A202C', marginHorizontal: 20 },
    recurringCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        elevation: 1,
    },
    recurringInfo: { flexDirection: 'row', alignItems: 'center' },
    recurringTitle: { fontSize: 15, fontWeight: 'bold', color: '#1A202C', marginBottom: 2 },
    recurringSub: { fontSize: 12, color: '#718096' },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#F7FAFC',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, elevation: 1 },
    tabText: { fontSize: 14, fontWeight: '600', color: '#718096' },
    activeTabText: { color: '#1A202C' },

    // Calendar Grid Styles
    calendarGrid: { marginBottom: 30, position: 'relative' },
    gridHeaderRow: { flexDirection: 'row', marginBottom: 10, marginLeft: 20 },
    timeAxisLabel: { width: 40 },
    dayColHeader: { flex: 1, alignItems: 'center' },
    dayColText: { textAlign: 'center', fontSize: 10, color: '#718096', fontWeight: 'bold', lineHeight: 14 },
    gridRow: { flexDirection: 'row', alignItems: 'center', height: 40, marginBottom: 8 },
    timeAxisLabelText: { width: 40, textAlign: 'right', paddingRight: 8, fontSize: 10, color: '#A0AEC0', fontWeight: '600' },
    gridCellsRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
    gridCell: { flex: 1, height: '100%', backgroundColor: '#F7FAFC', marginHorizontal: 2, borderRadius: 4, borderWidth: 1, borderColor: '#E2E8F0' },
    gridCellActive: { backgroundColor: '#BEE3F8', borderColor: '#90CDF4' },
    lunchBreakOverlay: {
        position: 'absolute',
        top: 140, // Mock position for 12 PM row
        left: 50,
        right: 0,
        height: 20,
        backgroundColor: '#F7FAFC',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lunchBreakText: { fontSize: 10, color: '#A0AEC0', fontWeight: 'bold', letterSpacing: 1 },
    dragHint: { textAlign: 'center', color: '#A0AEC0', fontSize: 12, marginTop: 20, fontStyle: 'italic' },

    // List Rules Styles
    rulesList: { paddingBottom: 30 },
    rulesHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    rulesHeaderTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A202C' },
    ruleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    ruleIconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#EBF4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    ruleInfo: { flex: 1 },
    ruleDaysText: { fontSize: 15, fontWeight: 'bold', color: '#1A202C', marginBottom: 4 },
    ruleTimeText: { fontSize: 13, color: '#4A5568' },
    addRuleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F7FAFC',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#CBD5E0',
        borderRadius: 12,
        paddingVertical: 16,
        marginTop: 10,
    },
    addRuleBtnText: { color: '#0066FF', fontSize: 15, fontWeight: 'bold' },
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

export default ManageAvailabilityScreen;
