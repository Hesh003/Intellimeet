import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ManageAvailabilityScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    // New slot form state
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Simple YYYY-MM-DD
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            const res = await api.get(`/availability/${user.id}`);
            if (res.data.success) {
                setSlots(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch availability:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlot = async () => {
        if (!date || !startTime || !endTime) {
            Alert.alert('Error', 'Please fill in date, start time, and end time.');
            return;
        }

        setAdding(true);
        try {
            const res = await api.post('/availability', {
                date,
                startTime,
                endTime
            });
            if (res.data.success) {
                setSlots([...slots, res.data.data]);
                setStartTime('');
                setEndTime('');
            }
        } catch (err) {
            Alert.alert('Error', err.response?.data?.error || 'Failed to add slot');
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteSlot = async (id) => {
        try {
            const res = await api.delete(`/availability/${id}`);
            if (res.data.success) {
                setSlots(slots.filter(slot => slot._id !== id));
            }
        } catch (err) {
            Alert.alert('Error', err.response?.data?.error || 'Failed to delete slot');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>{'< Back'}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Manage Availability</Text>
                <View style={{ width: 50 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollArea}>
                {/* Add New Slot Section */}
                <View style={styles.formCard}>
                    <Text style={styles.sectionTitle}>Add New Slot</Text>

                    <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
                    <TextInput
                        style={styles.input}
                        value={date}
                        onChangeText={setDate}
                        placeholder="2026-10-31"
                    />

                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Start Time</Text>
                            <TextInput
                                style={styles.input}
                                value={startTime}
                                onChangeText={setStartTime}
                                placeholder="09:00 AM"
                            />
                        </View>
                        <View style={{ width: 15 }} />
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>End Time</Text>
                            <TextInput
                                style={styles.input}
                                value={endTime}
                                onChangeText={setEndTime}
                                placeholder="10:00 AM"
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.addBtn} onPress={handleAddSlot} disabled={adding}>
                        <Text style={styles.addBtnText}>{adding ? 'Adding...' : 'Add Time Slot'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Existing Slots Section */}
                <Text style={styles.sectionTitleMargin}>Your Current Slots</Text>
                {loading ? (
                    <ActivityIndicator size="small" color="#0066FF" />
                ) : slots.length === 0 ? (
                    <Text style={styles.emptyText}>You haven't added any availability yet.</Text>
                ) : (
                    slots.map(slot => (
                        <View key={slot._id} style={styles.slotRow}>
                            <View style={styles.slotInfo}>
                                <Text style={styles.slotDate}>{new Date(slot.date).toLocaleDateString()}</Text>
                                <Text style={styles.slotTime}>{slot.startTime} - {slot.endTime}</Text>
                                {slot.isBooked && <Text style={styles.bookedBadge}>Booked</Text>}
                            </View>

                            <TouchableOpacity
                                style={[styles.deleteBtn, slot.isBooked && styles.deleteBtnDisabled]}
                                onPress={() => handleDeleteSlot(slot._id)}
                                disabled={slot.isBooked}
                            >
                                <Text style={styles.deleteBtnText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    scrollArea: {
        padding: 20,
    },
    formCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 15,
    },
    sectionTitleMargin: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 15,
        marginLeft: 5,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    input: {
        height: 45,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#FAFAFA',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        flex: 1,
    },
    addBtn: {
        backgroundColor: '#0066FF',
        height: 45,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    addBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyText: {
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
    slotRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#0066FF',
    },
    slotInfo: {
        flex: 1,
    },
    slotDate: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    slotTime: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    bookedBadge: {
        marginTop: 5,
        color: '#E02020',
        fontSize: 12,
        fontWeight: 'bold',
    },
    deleteBtn: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: '#FFE5E5',
        borderRadius: 6,
    },
    deleteBtnDisabled: {
        backgroundColor: '#F0F0F0',
    },
    deleteBtnText: {
        color: '#E02020',
        fontWeight: '600',
    },
});

export default ManageAvailabilityScreen;
