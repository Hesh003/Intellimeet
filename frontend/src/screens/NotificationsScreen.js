import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../services/api';

const NotificationsScreen = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            if (res.data.success) {
                setNotifications(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRead = async (id) => {
        try {
            const res = await api.put(`/notifications/${id}/read`);
            if (res.data.success) {
                setNotifications(notifications.map(n =>
                    n._id === id ? { ...n, isRead: true } : n
                ));
            }
        } catch (err) {
            console.error('Failed to mark read:', err);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, !item.isRead && styles.cardUnread]}
            onPress={() => handleRead(item._id)}
        >
            <View style={styles.iconContainer}>
                <Text style={styles.bellIcon}>🔔</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.message, !item.isRead && styles.messageUnread]}>
                    {item.message}
                </Text>
                <Text style={styles.timeText}>
                    {new Date(item.createdAt).toLocaleString()}
                </Text>
            </View>
            {!item.isRead && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>{'< Back'}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Notifications</Text>
                <View style={{ width: 50 }} />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#0066FF" />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>You're all caught up!</Text>
                        </View>
                    }
                />
            )}
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    listContainer: {
        padding: 15,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    cardUnread: {
        backgroundColor: '#F0F5FF',
        borderLeftWidth: 3,
        borderLeftColor: '#0066FF',
    },
    iconContainer: {
        marginRight: 15,
    },
    bellIcon: {
        fontSize: 20,
    },
    textContainer: {
        flex: 1,
    },
    message: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    messageUnread: {
        color: '#1A1A1A',
        fontWeight: '600',
    },
    timeText: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#0066FF',
        marginLeft: 10,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
    },
});

export default NotificationsScreen;
