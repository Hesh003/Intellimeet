import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const BookMeetingScreen = ({ route, navigation }) => {
    const { lecturerId, lecturerName = "Professor" } = route.params || {};

    const [title, setTitle] = useState('');
    const [type, setType] = useState('Online');
    const [purpose, setPurpose] = useState('');

    const handleBooking = async () => {
        if (!title || !purpose) {
            Alert.alert("Input Required", "Please fill in the meeting title and purpose.");
            return;
        }

        try {
            // Mock API call to create meeting based on existing logic.
            // Normally requires an availabilityId, we will pass a placeholder or the first available one.
            const payload = {
                lecturerId: lecturerId || 'mock_id',
                availabilityId: 'mock_availability_id', // Would come from selected slot
                topic: title,
                type: type, // Custom field based on UI
                purpose: purpose // Custom field based on UI
            };

            // Assume success for UI prototype
            // await api.post('/meetings', payload);

            Alert.alert("Success", "Booking request sent successfully!", [
                { text: "OK", onPress: () => navigation.navigate('Dashboard') }
            ]);
        } catch (error) {
            Alert.alert("Error", "Could not send booking request.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="close" size={28} color="#1A202C" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Book Meeting</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="information-circle-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.pageTitle}>Finalize Request</Text>
                <Text style={styles.pageSub}>Fill in the details for your session with {lecturerName}.</Text>

                <Text style={styles.label}>Selected Date and Time</Text>
                <View style={styles.dateTimeCard}>
                    <View style={styles.dateTimeInfo}>
                        <Ionicons name="calendar-outline" size={20} color="#0066FF" style={{ marginRight: 10 }} />
                        <Text style={styles.dateTimeText}>Monday, Oct 24 • 10:30 AM</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.changeBtnText}>CHANGE</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Meeting Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Thesis Progress Review"
                    placeholderTextColor="#A0AEC0"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Meeting Type</Text>
                <View style={styles.typeSelectorRow}>
                    <TouchableOpacity
                        style={[styles.typeBtn, type === 'Online' && styles.typeBtnSelected]}
                        onPress={() => setType('Online')}
                    >
                        <Ionicons name="videocam-outline" size={20} color={type === 'Online' ? '#0066FF' : '#718096'} style={{ marginRight: 8 }} />
                        <Text style={[styles.typeBtnText, type === 'Online' && styles.typeBtnTextSelected]}>Online</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeBtn, type === 'Physical' && styles.typeBtnSelected]}
                        onPress={() => setType('Physical')}
                    >
                        <Ionicons name="location-outline" size={20} color={type === 'Physical' ? '#0066FF' : '#718096'} style={{ marginRight: 8 }} />
                        <Text style={[styles.typeBtnText, type === 'Physical' && styles.typeBtnTextSelected]}>Physical</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Purpose</Text>
                <TextInput
                    style={styles.textArea}
                    placeholder="Briefly describe what you'd like to discuss..."
                    placeholderTextColor="#A0AEC0"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={purpose}
                    onChangeText={setPurpose}
                />

                <Text style={styles.label}>Attachments (Optional)</Text>
                <TouchableOpacity style={styles.uploadArea}>
                    <Ionicons name="cloud-upload-outline" size={24} color="#0066FF" />
                    <Text style={styles.uploadText}>Tap to add files</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitBtn} onPress={handleBooking}>
                    <Text style={styles.submitBtnText}>Send Booking Request</Text>
                    <Ionicons name="send" size={16} color="#FFF" style={{ marginLeft: 8 }} />
                </TouchableOpacity>

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
    container: { padding: 24, paddingBottom: 60 },
    pageTitle: { fontSize: 24, fontWeight: '800', color: '#1A202C', marginBottom: 6 },
    pageSub: { fontSize: 14, color: '#718096', marginBottom: 30 },
    label: { fontSize: 14, fontWeight: '700', color: '#1A202C', marginBottom: 10, marginTop: 10 },
    dateTimeCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EBF4FF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#BEE3F8',
    },
    dateTimeInfo: { flexDirection: 'row', alignItems: 'center' },
    dateTimeText: { fontSize: 15, fontWeight: '600', color: '#2B6CB0' },
    changeBtnText: { fontSize: 12, fontWeight: 'bold', color: '#0066FF', letterSpacing: 0.5 },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#2D3748',
        marginBottom: 20,
    },
    typeSelectorRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    typeBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingVertical: 14,
        borderRadius: 12,
        marginHorizontal: 4,
    },
    typeBtnSelected: {
        backgroundColor: '#EBF4FF',
        borderColor: '#0066FF',
    },
    typeBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#718096',
    },
    typeBtnTextSelected: {
        color: '#0066FF',
    },
    textArea: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#2D3748',
        marginBottom: 20,
        minHeight: 120,
    },
    uploadArea: {
        backgroundColor: '#F7FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        flexDirection: 'row',
    },
    uploadText: {
        color: '#718096',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 10,
    },
    submitBtn: {
        flexDirection: 'row',
        backgroundColor: '#0066FF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0066FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        elevation: 4,
    },
    submitBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BookMeetingScreen;
