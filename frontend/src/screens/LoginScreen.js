import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const success = await login(email, password);
            if (success) {
                navigation.replace('Dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred during login');
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
                <View style={styles.headerImagePlaceholder}>
                    <Text style={styles.headerImageText}>IntelliMeet</Text>
                    <View style={styles.iconOverlay}>
                        <Text style={styles.iconText}>🎓</Text>
                    </View>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to access your university meetings</Text>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <Text style={styles.label}>University Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="student.name@university.edu"
                        placeholderTextColor="#94A3B8"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity style={styles.forgotBtn} onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={styles.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
                        <Text style={styles.loginBtnText}>{loading ? 'Signing In...' : 'Sign In ➔'}</Text>
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>ACADEMIC PORTAL</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity style={styles.ssoBtn}>
                        <Text style={styles.ssoBtnText}>🏛️ Sign in with University SSO</Text>
                    </TouchableOpacity>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>New to IntelliMeet? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.registerLink}>Register Here</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Stealth Admin Portal Entrance */}
                    <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')} style={styles.adminFooterLink}>
                        <Text style={styles.adminLinkText}>System Administration Access</Text>
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
    },
    headerImagePlaceholder: {
        height: 240,
        backgroundColor: '#EEF2FF', // Indigo 50
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        marginBottom: 20,
    },
    headerImageText: {
        fontSize: 32,
        fontWeight: '900',
        color: '#C7D2FE', // Indigo 200
        letterSpacing: -1,
    },
    iconOverlay: {
        position: 'absolute',
        bottom: -35,
        backgroundColor: '#FFF',
        width: 76,
        height: 76,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4F46E5', // Indigo 600
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#F1F5F9', // Slate 100
    },
    iconText: {
        fontSize: 35,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: 40,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0F172A', // Slate 900
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: '#64748B', // Slate 500
        textAlign: 'center',
        marginBottom: 36,
        fontWeight: '500',
    },
    errorText: {
        color: '#DC2626', // Red 600
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: '600',
        backgroundColor: '#FEF2F2',
        paddingVertical: 10,
        borderRadius: 12,
        overflow: 'hidden',
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B', // Slate 800
        marginBottom: 8,
    },
    input: {
        height: 56,
        borderWidth: 1,
        borderColor: '#E2E8F0', // Slate 200
        borderRadius: 16,
        paddingHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#F8FAFC', // Slate 50
        fontSize: 15,
        color: '#0F172A',
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: 28,
    },
    forgotText: {
        color: '#4F46E5', // Indigo 600
        fontSize: 14,
        fontWeight: '700',
    },
    loginBtn: {
        backgroundColor: '#4F46E5', // Indigo 600
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 36,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    loginBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0', // Slate 200
    },
    dividerText: {
        marginHorizontal: 12,
        color: '#94A3B8', // Slate 400
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },
    ssoBtn: {
        height: 56,
        borderWidth: 1,
        borderColor: '#E2E8F0', // Slate 200
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 36,
        backgroundColor: '#FFF',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    ssoBtnText: {
        color: '#0F172A', // Slate 900
        fontSize: 15,
        fontWeight: '700',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    registerText: {
        color: '#64748B', // Slate 500
        fontSize: 15,
        fontWeight: '500',
    },
    registerLink: {
        color: '#4F46E5', // Indigo 600
        fontWeight: '800',
        fontSize: 15,
    },
    adminFooterLink: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    adminLinkText: {
        color: '#CBD5E1', // Slate 300
        fontSize: 12,
        fontWeight: '600',
        textDecorationLine: 'underline',
    }
});

export default LoginScreen;
