import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        // Simulate loading/syncing
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 2500);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <View style={styles.iconPlaceholder}>
                    <Text style={styles.iconText}>🎓</Text>
                </View>
                <Text style={styles.title}>IntelliMeet</Text>
                <Text style={styles.subtitle}>University Scheduling Reimagined</Text>
            </View>

            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Syncing schedules...</Text>
                <Text style={styles.percentText}>75%</Text>
                <View style={styles.progressBarBg}>
                    <View style={styles.progressBarFill} />
                </View>
                <Text style={styles.versionText}>VERSION 1.0.4</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F0FA',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 60,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    iconPlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: '#0066FF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconText: {
        fontSize: 40,
        color: '#FFF',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    loadingContainer: {
        width: '80%',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 14,
        color: '#666',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    percentText: {
        fontSize: 14,
        color: '#0066FF',
        fontWeight: 'bold',
        position: 'absolute',
        right: 0,
        top: 0,
    },
    progressBarBg: {
        width: '100%',
        height: 6,
        backgroundColor: '#D1E3F8',
        borderRadius: 3,
        marginBottom: 20,
    },
    progressBarFill: {
        width: '75%',
        height: '100%',
        backgroundColor: '#0066FF',
        borderRadius: 3,
    },
    versionText: {
        fontSize: 12,
        color: '#999',
    },
});

export default SplashScreen;
