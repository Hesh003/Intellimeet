import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DeactivateLecturerModal = ({ navigation }) => {
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => navigation.goBack()} />

            <View style={styles.modalContent}>
                <View style={styles.dragHandle} />

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="person-remove-outline" size={24} color="#E53E3E" />
                    </View>

                    <Text style={styles.title}>Deactivate Lecturer</Text>
                    <Text style={styles.description}>
                        This action will suspend Dr. Sarah Jenkins's access to the university scheduling system and remove them from active courses.
                    </Text>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Reason for deactivation</Text>
                        <TouchableOpacity style={styles.pickerBox}>
                            <Text style={styles.pickerText}>Select a reason</Text>
                            <Ionicons name="chevron-down" size={20} color="#0066FF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Internal Admin Note</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Provide additional details for the audit log..."
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.confirmBtn}
                        onPress={() => navigation.goBack()} // Mock action goes back for now
                    >
                        <Text style={styles.confirmBtnText}>Confirm Deactivation</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
    backdrop: { ...StyleSheet.absoluteFillObject },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '80%', // Taking up bottom 80% mirroring the design
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 40, alignItems: 'center' },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1A202C', marginBottom: 12, textAlign: 'center' },
    description: { fontSize: 14, color: '#4A5568', textAlign: 'center', lineHeight: 22, marginBottom: 32 },

    formGroup: { width: '100%', marginBottom: 20 },
    label: { fontSize: 13, fontWeight: 'bold', color: '#4A5568', marginBottom: 8 },
    pickerBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    pickerText: { fontSize: 15, color: '#A0AEC0' },

    textArea: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        minHeight: 120,
        fontSize: 15,
        color: '#1A202C'
    },

    confirmBtn: {
        width: '100%',
        backgroundColor: '#E53E3E',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 16,
    },
    confirmBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    cancelBtn: { width: '100%', paddingVertical: 12, alignItems: 'center' },
    cancelBtnText: { color: '#4A5568', fontSize: 16, fontWeight: 'bold' },
});

export default DeactivateLecturerModal;
