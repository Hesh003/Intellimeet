import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const RequestDetailsScreen = ({ navigation, route }) => {
    // Usually fetch from route parameters. Mocked for UI.
    const mockRequest = {
        studentName: 'Alice Johnson',
        studentId: 'BSc CompSci - Year 3',
        topic: 'Thesis Proposal Discussion',
        proposedDate: 'Mon, Oct 22',
        proposedTime: '10:00 AM - 10:30 AM',
        location: 'Google Meet',
        message: 'Dear Professor, I would like to discuss the initial findings of my literature review and propose a methodology for the experimental phase. I have attached my drafted proposal.'
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="chevron-back" size={24} color="#1A202C" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Review Request</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.studentProfileCard}>
                    <View style={styles.avatarLarge}>
                        <Text style={styles.avatarLargeText}>A</Text>
                    </View>
                    <Text style={styles.profileName}>{mockRequest.studentName}</Text>
                    <Text style={styles.profileSub}>{mockRequest.studentId}</Text>
                    <TouchableOpacity style={styles.viewProfileBtn}>
                        <Text style={styles.viewProfileText}>View Full Academic Profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <View style={styles.iconBoxBlue}>
                            <Feather name="bookmark" size={18} color="#0066FF" />
                        </View>
                        <View style={styles.detailInfo}>
                            <Text style={styles.detailLabel}>Topic</Text>
                            <Text style={styles.detailValue}>{mockRequest.topic}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <View style={styles.iconBoxGreen}>
                            <Feather name="calendar" size={18} color="#00B050" />
                        </View>
                        <View style={styles.detailInfo}>
                            <Text style={styles.detailLabel}>Proposed Time</Text>
                            <Text style={styles.detailValue}>{mockRequest.proposedDate}</Text>
                            <Text style={styles.detailValueSub}>{mockRequest.proposedTime}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <View style={styles.iconBoxOrange}>
                            <Feather name="video" size={18} color="#ED8936" />
                        </View>
                        <View style={styles.detailInfo}>
                            <Text style={styles.detailLabel}>Location</Text>
                            <Text style={styles.detailValue}>{mockRequest.location}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.messageBox}>
                    <Text style={styles.messageBoxTitle}>Message from Student</Text>
                    <Text style={styles.messageBody}>{mockRequest.message}</Text>

                    <View style={styles.attachmentPill}>
                        <Feather name="paperclip" size={16} color="#718096" />
                        <Text style={styles.attachmentText}>Proposal_Draft_v1.pdf</Text>
                    </View>
                </View>

                <View style={styles.addNoteBox}>
                    <Text style={styles.addNoteTitle}>Add a note (Optional)</Text>
                    <TextInput
                        style={styles.noteInput}
                        placeholder="E.g. Please read chapter 4 beforehand."
                        multiline
                    />
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.declineBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.declineBtnText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.approveBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.approveBtnText}>Approve Request</Text>
                </TouchableOpacity>
            </View>
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
    container: { padding: 24, paddingBottom: 100 },
    studentProfileCard: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4A5568',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarLargeText: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
    profileName: { fontSize: 22, fontWeight: 'bold', color: '#1A202C', marginBottom: 4 },
    profileSub: { fontSize: 14, color: '#718096', marginBottom: 16 },
    viewProfileBtn: {
        backgroundColor: '#EBF4FF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    viewProfileText: { color: '#0066FF', fontSize: 13, fontWeight: 'bold' },
    detailsCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 24,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconBoxBlue: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EBF4FF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    iconBoxGreen: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E5F6EB', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    iconBoxOrange: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFF5EB', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    detailInfo: { flex: 1 },
    detailLabel: { fontSize: 12, color: '#A0AEC0', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
    detailValue: { fontSize: 15, fontWeight: 'bold', color: '#1A202C' },
    detailValueSub: { fontSize: 13, color: '#718096', marginTop: 2 },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 16 },
    messageBox: {
        backgroundColor: '#F7FAFC',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderLeftWidth: 3,
        borderLeftColor: '#CBD5E0',
    },
    messageBoxTitle: { fontSize: 13, fontWeight: 'bold', color: '#4A5568', marginBottom: 8 },
    messageBody: { fontSize: 14, color: '#2D3748', lineHeight: 22, marginBottom: 16 },
    attachmentPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    attachmentText: { marginLeft: 8, fontSize: 13, color: '#4A5568', fontWeight: '500' },
    addNoteBox: { marginBottom: 20 },
    addNoteTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A202C', marginBottom: 10 },
    noteInput: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        color: '#2D3748',
        minHeight: 100,
        textAlignVertical: 'top',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        padding: 20,
        paddingBottom: 30, // Safe area
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    declineBtn: {
        flex: 1,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    declineBtnText: { color: '#E02020', fontSize: 16, fontWeight: 'bold' },
    approveBtn: {
        flex: 2,
        backgroundColor: '#0066FF',
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    approveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default RequestDetailsScreen;
