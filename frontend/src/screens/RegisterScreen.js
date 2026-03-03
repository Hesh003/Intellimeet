import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import api from '../services/api';

const RegisterScreen = ({ navigation }) => {
    const [role, setRole] = useState('Student'); // 'Student' or 'Lecturer'
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!fullName || !email || !idNumber || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/register', {
                fullName,
                email,
                password,
                role,
                idNumber
            });
            if (res.data.success) {
                alert('Registration Successful! Please login.');
                navigation.navigate('Login');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
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
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>{'< Back'}</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Join IntelliMeet</Text>
                <Text style={styles.subtitle}>Enter your details to register for university scheduling.</Text>

                <View style={styles.roleToggle}>
                    <TouchableOpacity
                        style={[styles.roleBtn, role === 'Student' && styles.roleBtnActive]}
                        onPress={() => setRole('Student')}
                    >
                        <Text style={[styles.roleText, role === 'Student' && styles.roleTextActive]}>Student</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.roleBtn, role === 'Lecturer' && styles.roleBtnActive]}
                        onPress={() => setRole('Lecturer')}
                    >
                        <Text style={[styles.roleText, role === 'Lecturer' && styles.roleTextActive]}>Lecturer</Text>
                    </TouchableOpacity>
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChangeText={setFullName}
                />

                <Text style={styles.label}>University Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="student@university.edu"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.label}>Student/Lecturer ID</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ID Number"
                    value={idNumber}
                    onChangeText={setIdNumber}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="********"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
                    <Text style={styles.registerBtnText}>{loading ? 'Creating...' : 'Create Account'}</Text>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
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
        paddingHorizontal: 25,
        paddingTop: 50,
    },
    backBtn: {
        marginBottom: 20,
    },
    backText: {
        color: '#0066FF',
        fontSize: 16,
        fontWeight: '600',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
    },
    roleToggle: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        marginBottom: 25,
        padding: 4,
    },
    roleBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 6,
    },
    roleBtnActive: {
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    roleText: {
        color: '#666',
        fontWeight: '600',
    },
    roleTextActive: {
        color: '#0066FF',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#FAFAFA',
    },
    registerBtn: {
        backgroundColor: '#0066FF',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    registerBtnText: {
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

export default RegisterScreen;
