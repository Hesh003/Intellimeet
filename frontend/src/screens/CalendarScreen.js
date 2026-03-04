import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CalendarScreen = ({ navigation }) => {

    const renderMonthGrid = () => {
        return (
            <View style={styles.calendarCard}>
                <View style={styles.monthHeaderRow}>
                    <TouchableOpacity>
                        <Ionicons name="chevron-back" size={20} color="#1A202C" />
                    </TouchableOpacity>
                    <Text style={styles.monthTitle}>October 2023</Text>
                    <TouchableOpacity>
                        <Ionicons name="chevron-forward" size={20} color="#1A202C" />
                    </TouchableOpacity>
                </View>

                {/* Days of week */}
                <View style={styles.daysRow}>
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
                        <Text key={i} style={styles.dayColText}>{day}</Text>
                    ))}
                </View>

                {/* Calendar Grid Mock (static for UI) */}
                <View style={styles.datesGrid}>
                    <View style={styles.dateRow}>
                        <Text style={[styles.dateCell, styles.dateCellMuted]}>24</Text>
                        <Text style={[styles.dateCell, styles.dateCellMuted]}>25</Text>
                        <Text style={[styles.dateCell, styles.dateCellMuted]}>26</Text>
                        <Text style={[styles.dateCell, styles.dateCellMuted]}>27</Text>
                        <Text style={[styles.dateCell, styles.dateCellMuted]}>28</Text>
                        <Text style={[styles.dateCell, styles.dateCellMuted]}>29</Text>
                        <Text style={[styles.dateCell, styles.dateCellMuted]}>30</Text>
                    </View>
                    <View style={styles.dateRow}>
                        <Text style={styles.dateCell}>1</Text>
                        <Text style={styles.dateCell}>2</Text>
                        <Text style={styles.dateCell}>3</Text>
                        <Text style={styles.dateCell}>4</Text>
                        <Text style={styles.dateCell}>5</Text>
                        <Text style={styles.dateCell}>6</Text>
                        <Text style={styles.dateCell}>7</Text>
                    </View>
                    <View style={styles.dateRow}>
                        <Text style={styles.dateCell}>8</Text>
                        <Text style={styles.dateCell}>9</Text>
                        <Text style={styles.dateCell}>10</Text>
                        <Text style={styles.dateCell}>11</Text>
                        <Text style={styles.dateCell}>12</Text>
                        <Text style={styles.dateCell}>13</Text>
                        <Text style={styles.dateCell}>14</Text>
                    </View>
                    <View style={styles.dateRow}>
                        <Text style={styles.dateCell}>15</Text>
                        <Text style={styles.dateCell}>16</Text>
                        <Text style={styles.dateCell}>17</Text>
                        <Text style={styles.dateCell}>18</Text>
                        <Text style={styles.dateCell}>19</Text>
                        <View style={styles.dateCellSelectedBox}>
                            <Text style={styles.dateCellSelectedText}>20</Text>
                        </View>
                        <Text style={styles.dateCell}>21</Text>
                    </View>
                    <View style={styles.dateRow}>
                        <Text style={styles.dateCell}>22</Text>
                        <Text style={styles.dateCell}>23</Text>
                        <Text style={styles.dateCell}>24</Text>
                        <Text style={styles.dateCell}>25</Text>
                        <Text style={[styles.dateCell, styles.dateCellMuted]}>26</Text>
                        <Text style={[styles.dateCell, styles.dateCellMuted]}>27</Text>
                        <Text style={[styles.dateCell, styles.dateCellMuted]}>28</Text>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <Ionicons name="calendar" size={24} color="#0066FF" style={{ marginRight: 10 }} />
                    <Text style={styles.headerTitle}>Full Schedule</Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="search" size={24} color="#1A202C" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconBtn, { marginLeft: 15 }]}>
                        <Ionicons name="ellipsis-vertical" size={24} color="#1A202C" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {renderMonthGrid()}

                <View style={styles.itineraryHeader}>
                    <Text style={styles.itineraryTitle}>Friday, Oct 20 Itinerary</Text>
                    <Text style={styles.itineraryCount}>3 Events</Text>
                </View>

                {/* Event 1 */}
                <View style={styles.eventCard}>
                    <View style={[styles.eventIconBox, { backgroundColor: '#EBF4FF' }]}>
                        <Ionicons name="school" size={20} color="#0066FF" />
                    </View>
                    <View style={styles.eventInfo}>
                        <Text style={styles.eventTitle}>CS101: Intro to Programming</Text>
                        <Text style={styles.eventSub}>Lecture Hall A • 09:00 - 10:30 AM</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
                </View>

                {/* Event 2 */}
                <View style={styles.eventCard}>
                    <View style={[styles.eventIconBox, { backgroundColor: '#E5F6EB' }]}>
                        <Ionicons name="people" size={20} color="#00B050" />
                    </View>
                    <View style={styles.eventInfo}>
                        <Text style={styles.eventTitle}>Faculty Board Meeting</Text>
                        <Text style={styles.eventSub}>Room 302 • 11:30 - 12:30 PM</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
                </View>

                {/* Event 3 */}
                <View style={styles.eventCard}>
                    <View style={[styles.eventIconBox, { backgroundColor: '#FFF5EB' }]}>
                        <Ionicons name="chatbubble-ellipses" size={20} color="#F5A623" />
                    </View>
                    <View style={styles.eventInfo}>
                        <Text style={styles.eventTitle}>Thesis Discussion</Text>
                        <Text style={styles.eventSub}>Google Meet • 02:00 - 02:30 PM</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#A0AEC0" />
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.fab}>
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
    headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A202C' },
    headerIcons: { flexDirection: 'row', alignItems: 'center' },
    iconBtn: { padding: 4 },
    container: { padding: 24, paddingBottom: 80 },
    calendarCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        elevation: 1,
    },
    monthHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    monthTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A202C' },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    dayColText: {
        width: 36,
        textAlign: 'center',
        fontSize: 10,
        fontWeight: 'bold',
        color: '#A0AEC0',
        letterSpacing: 0.5,
    },
    datesGrid: {},
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    dateCell: {
        width: 36,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
        color: '#1A202C',
    },
    dateCellMuted: { color: '#CBD5E0' },
    dateCellSelectedBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#0066FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateCellSelectedText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
    },
    itineraryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    itineraryTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A202C' },
    itineraryCount: { fontSize: 13, fontWeight: '600', color: '#0066FF' },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        elevation: 1,
    },
    eventIconBox: {
        width: 44,
        height: 44,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    eventInfo: { flex: 1 },
    eventTitle: { fontSize: 15, fontWeight: 'bold', color: '#1A202C', marginBottom: 4 },
    eventSub: { fontSize: 13, color: '#718096' },
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

export default CalendarScreen;
