import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator } from 'react-native';
import api from '../services/api';

const CalendarScreen = ({ route, navigation }) => {
    const { lecturerId, lecturerName } = route.params;

    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [topic, setTopic] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            const res = await api.get(`/availability/${lecturerId}`);
            if (res.data.success) {
                setSlots(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch availability:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSlotPress = (slot) => {
        if (slot.isBooked) return;
        setSelectedSlot(slot);
        setTopic('');
        setModalVisible(true);
    };

    const handleBookMeeting = async () => {
        if (!topic.trim()) {
            alert('Please enter a topic for the meeting');
            return;
        }

        setBookingLoading(true);

        try {
            const res = await api.post('/meetings', {
                lecturerId: lecturerId,
                availabilityId: selectedSlot._id,
                topic: topic
            });

            if (res.data.success) {
                alert('Meeting requested successfully!');
                setModalVisible(false);
                navigation.navigate('Dashboard');
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to book meeting');
        } finally {
            setBookingLoading(false);
        }
    };

    // Helper to group slots by date
    const groupSlotsByDate = () => {
        const grouped = {};
        slots.forEach(slot => {
            const dateKey = new Date(slot.date).toLocaleDateString();
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(slot);
        });
        return grouped;
    };

    const groupedSlots = groupSlotsByDate();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>{'< Back'}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{lecturerName}'s Schedule</Text>
                <View style={{ width: 60 }} />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#0066FF" />
                </View>
            ) : Object.keys(groupedSlots).length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No available slots found for this lecturer.</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.listContainer}>
                    {Object.keys(groupedSlots).map(date => (
                        <View key={date} style={styles.dateBlock}>
                            <Text style={styles.dateHeader}>{date}</Text>
                            <View style={styles.slotsGrid}>
                                {groupedSlots[date].map(slot => (
                                    <TouchableOpacity
                                        key={slot._id}
                                        style={[
                                            styles.slotCard,
                                            slot.isBooked ? styles.slotCardBooked : styles.slotCardAvailable
                                        ]}
                                        onPress={() => handleSlotPress(slot)}
                                        activeOpacity={slot.isBooked ? 1 : 0.7}
                                    >
                                        <Text style={[
                                            styles.slotTime,
                                            slot.isBooked ? styles.slotTextBooked : styles.slotTextAvailable
                                        ]}>
                                            {slot.startTime}
                                        </Text>
                                        <Text style={[
                                            styles.slotStatus,
                                            slot.isBooked ? styles.slotTextBooked : styles.slotTextAvailable
                                        ]}>
                                            {slot.isBooked ? 'Booked' : 'Available'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Booking Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Book Meeting</Text>
                        {selectedSlot && (
                            <Text style={styles.modalSub}>
                                {new Date(selectedSlot.date).toLocaleDateString()} at {selectedSlot.startTime}
                            </Text>
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="What topic would you like to discuss?"
                            value={topic}
                            onChangeText={setTopic}
                            multiline
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalBtnCancel]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalBtnCancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalBtnConfirm]}
                                onPress={handleBookMeeting}
                                disabled={bookingLoading}
                            >
                                <Text style={styles.modalBtnConfirmText}>
                                    {bookingLoading ? 'Booking...' : 'Confirm'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    backBtn: {
        padding: 10,
        marginLeft: -10,
    },
    backText: {
        color: '#0066FF',
        fontSize: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    listContainer: {
        padding: 15,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    emptyText: {
        color: '#999',
        textAlign: 'center',
    },
    dateBlock: {
        marginBottom: 20,
    },
    dateHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        marginLeft: 5,
    },
    slotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    slotCard: {
        width: '46%',
        padding: 15,
        borderRadius: 8,
        margin: '2%',
        borderWidth: 1,
    },
    slotCardAvailable: {
        backgroundColor: '#FFF',
        borderColor: '#0066FF',
    },
    slotCardBooked: {
        backgroundColor: '#F0F0F0',
        borderColor: '#E0E0E0',
    },
    slotTime: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    slotStatus: {
        fontSize: 12,
    },
    slotTextAvailable: {
        color: '#0066FF',
    },
    slotTextBooked: {
        color: '#999',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    modalSub: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    input: {
        height: 100,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        backgroundColor: '#FAFAFA',
        textAlignVertical: 'top',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalBtnCancel: {
        backgroundColor: '#F0F0F0',
        marginRight: 10,
    },
    modalBtnConfirm: {
        backgroundColor: '#0066FF',
        marginLeft: 10,
    },
    modalBtnCancelText: {
        color: '#666',
        fontWeight: 'bold',
    },
    modalBtnConfirmText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default CalendarScreen;
