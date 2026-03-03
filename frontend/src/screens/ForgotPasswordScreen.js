import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import api from '../services/api';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSendLink = async () => {
        if (!email) {
            setError('Please provide your email');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await api.post('/auth/forgotpassword', { email });
            if (res.data.success) {
                setSuccess('Reset link sent to your email!');
                // In a complete app, we would wait for them to click the email link.
                // Here we provide a shortcut to the Reset screen for demo testing.
                setTimeout(() => {
                    navigation.navigate('ResetPassword', { email }); // Passing email for the mocked reset flow
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerArea}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backText}>{'< Back'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Reset Password</Text>
                    <View style={{ width: 50 }} />
                </View>

                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <Text style={styles.iconLock}>🔄</Text>
                    </View>
                </View>

                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>No worries, it happens to the best of us. Enter your university email below and we'll send you a recovery link instantly.</Text>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                {success ? <Text style={styles.successText}>{success}</Text> : null}

                <Text style={styles.label}>University Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. name@university.edu"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <TouchableOpacity style={styles.sendBtn} onPress={handleSendLink} disabled={loading}>
                    <Text style={styles.sendBtnText}>{loading ? 'Sending...' : 'Send Reset Link ➔'}</Text>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Remembered your password? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Log in</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingTop: 50,
    },
    headerArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    backBtn: {
        padding: 10,
        marginLeft: -10,
    },
    backText: {
        fontSize: 16,
        color: '#333',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 25,
        backgroundColor: '#0066FF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0066FF',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 15,
    },
    iconLock: {
        fontSize: 40,
        color: '#FFF',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 10,
        paddingHorizontal: 25,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
        paddingHorizontal: 25,
        lineHeight: 22,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        paddingHorizontal: 25,
    },
    successText: {
        color: 'green',
        marginBottom: 10,
        paddingHorizontal: 25,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
        paddingHorizontal: 25,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 30,
        marginHorizontal: 25,
        backgroundColor: '#FAFAFA',
    },
    sendBtn: {
        backgroundColor: '#0066FF',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 25,
        marginBottom: 30,
        shadowColor: '#0066FF',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 3,
    },
    sendBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    loginText: {
        color: '#666',
    },
    loginLink: {
        color: '#0066FF',
        fontWeight: 'bold',
    },
});

export default ForgotPasswordScreen;
