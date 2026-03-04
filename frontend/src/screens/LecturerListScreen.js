import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const LecturerListScreen = ({ navigation }) => {
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchLecturers();
    }, []);

    const fetchLecturers = async () => {
        try {
            const res = await api.get('/users/lecturers');
            if (res.data.success) {
                setLecturers(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch lecturers:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => {
        // Mock data logic for missing fields in the DB for now to match UI design
        const isAvailable = Math.random() > 0.3; // Randomly assign available/busy for UI demo
        const rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
        const reviews = Math.floor(Math.random() * 200) + 10;
        const department = "Computer Science Dept.";

        return (
            <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{item.fullName.charAt(0)}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.name}>{item.fullName}</Text>
                        <Text style={styles.department}>{department}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={14} color="#F5A623" />
                            <Text style={styles.ratingText}>{rating} <Text style={styles.reviewsText}>({reviews} reviews)</Text></Text>
                        </View>
                    </View>
                    <View style={[styles.badgeContainer, { backgroundColor: isAvailable ? '#E5F6EB' : '#F2F2F2' }]}>
                        <Text style={[styles.badgeText, { color: isAvailable ? '#00B050' : '#A0AEC0' }]}>
                            {isAvailable ? 'AVAILABLE' : 'BUSY'}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardActionRow}>
                    <TouchableOpacity
                        style={styles.viewProfileBtn}
                        onPress={() => navigation.navigate('LecturerProfile', { lecturerId: item._id })}
                    >
                        <Text style={styles.viewProfileText}>View Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.calendarBtn}
                        onPress={() => navigation.navigate('BookMeeting', { lecturerId: item._id, lecturerName: item.fullName })}
                    >
                        <Ionicons name="calendar-outline" size={20} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0066FF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#0066FF" />
                </TouchableOpacity>
                <Text style={styles.title}>Lecturers</Text>
                <TouchableOpacity style={styles.backBtn}>
                    <Ionicons name="notifications-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search lecturers by name"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.chipsRow}>
                    <TouchableOpacity style={styles.chipSelected}>
                        <Text style={styles.chipTextSelected}>Department</Text>
                        <Ionicons name="chevron-down" size={12} color="#0066FF" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chip}>
                        <Text style={styles.chipText}>Availability</Text>
                        <Ionicons name="chevron-down" size={12} color="#666" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chip}>
                        <Text style={styles.chipText}>Rating</Text>
                        <Ionicons name="chevron-down" size={12} color="#666" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={lecturers.filter(l => l.fullName.toLowerCase().includes(searchQuery.toLowerCase()))}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No lecturers found.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FCFCFD',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FCFCFD',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: '#FCFCFD',
    },
    backBtn: {
        padding: 5,
        marginLeft: -5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A202C',
    },
    searchSection: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#2D3748',
    },
    chipsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    chipSelected: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EBF4FF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#BEE3F8',
    },
    chipText: {
        fontSize: 13,
        color: '#4A5568',
        fontWeight: '500',
    },
    chipTextSelected: {
        fontSize: 13,
        color: '#0066FF',
        fontWeight: '600',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 1,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    avatarPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#2D3748',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 4,
    },
    department: {
        fontSize: 13,
        color: '#718096',
        marginBottom: 6,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4A5568',
        marginLeft: 4,
    },
    reviewsText: {
        color: '#A0AEC0',
        fontWeight: '400',
    },
    badgeContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    cardActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewProfileBtn: {
        flex: 1,
        backgroundColor: '#0066FF',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 10,
    },
    viewProfileText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    calendarBtn: {
        width: 44,
        height: 44,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#A0AEC0',
        fontSize: 15,
    },
});

export default LecturerListScreen;
