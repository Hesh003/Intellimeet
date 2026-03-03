import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import api from '../services/api';

const ResetPasswordScreen = ({ route, navigation }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // We mocked the token flow in backend; we're passing email via route parameters for demo
    const email = route.params?.email || '';

    const isValidPassword = password.length >= 8 && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);

    const handleUpdate = async () => {
        if (!password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!isValidPassword) {
            setError('Password does not meet the requirements');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Dummy token is used in the URL per the backend placeholder
            const res = await api.put('/auth/resetpassword/dummy_token_123', { email, password });
            if (res.data.success) {
                alert('Password Updated Successfully!');
                navigation.navigate('Login');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
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
                </View>

                <Text style={styles.title}>New password</Text>
                <Text style={styles.subtitle}>Set your new password for your IntelliMeet university account.</Text>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Text style={styles.label}>New Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="••••••••••••"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <Text style={styles.label}>Confirm New Password</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.inputField}
                        placeholder="••••••••••••"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    {password === confirmPassword && confirmPassword.length > 0 && <Text style={styles.validCheck}>✅</Text>}
                </View>

                <View style={styles.requirementsBox}>
                    <Text style={styles.reqText}>{password.length >= 8 ? '✅' : '•'} At least 8 characters</Text>
                    <Text style={styles.reqText}>{/\d/.test(password) ? '✅' : '•'} Include at least one number</Text>
                    <Text style={styles.reqText}>{/[^A-Za-z0-9]/.test(password) ? '✅' : '•'} Include a special character (!@#$)</Text>
                </View>

                <TouchableOpacity style={[styles.updateBtn, !isValidPassword && { opacity: 0.5 }]} onPress={handleUpdate} disabled={loading || !isValidPassword}>
                    <Text style={styles.updateBtnText}>{loading ? 'Updating...' : 'Update Password ➔'}</Text>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Wait, I remember now. </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Sign in</Text>
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
        marginBottom: 20,
        marginHorizontal: 25,
        backgroundColor: '#FAFAFA',
    },
    inputWrapper: {
        height: 50,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        marginHorizontal: 25,
        marginBottom: 30,
        backgroundColor: '#FAFAFA',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputField: {
        flex: 1,
        paddingHorizontal: 15,
        height: '100%',
    },
    validCheck: {
        marginRight: 15,
    },
    requirementsBox: {
        backgroundColor: '#F0F5FF',
        borderRadius: 8,
        padding: 15,
        marginHorizontal: 25,
        marginBottom: 30,
    },
    reqText: {
        color: '#333',
        fontSize: 12,
        marginBottom: 5,
    },
    updateBtn: {
        backgroundColor: '#0066FF',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 25,
        marginBottom: 30,
    },
    updateBtnText: {
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

export default ResetPasswordScreen;
