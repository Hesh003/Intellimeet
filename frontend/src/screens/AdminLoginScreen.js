import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const AdminLoginScreen = ({ navigation }) => {
    const { login } = useContext(AuthContext);
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Quick bypass for testing UI without real admin user DB
    const { adminLogin } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!adminId || !password) {
            Alert.alert('Error', 'Please enter your Admin Credentials');
            return;
        }

        setLoading(true);
        // Simulate network delay or run real auth check
        setTimeout(() => {
            setLoading(false);
            // Bypass logic for now so UI is testable
            adminLogin();
            navigation.replace('Dashboard'); // Goes to admin tabs due to context 
        }, 1000);
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.headerArea}>
                    <View style={styles.shieldIcon}>
                        <Ionicons name="shield-checkmark" size={48} color="#FFF" />
                    </View>
                    <Text style={styles.title}>System Administrator</Text>
                    <Text style={styles.subtitle}>Secured Access Portal</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>Admin ID</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. ADM-1029"
                        placeholderTextColor="#718096"
                        autoCapitalize="characters"
                        value={adminId}
                        onChangeText={setAdminId}
                    />

                    <Text style={styles.label}>Security Key / Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor="#718096"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
                        <Ionicons name="lock-closed" size={18} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.loginBtnText}>{loading ? 'VERIFYING...' : 'SECURE LOGIN'}</Text>
                    </TouchableOpacity>

                    <Text style={styles.footerWarning}>
                        Unauthorized access to this portal is strictly prohibited and monitored.
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A202C' },
    scrollContent: { flexGrow: 1, justifyContent: 'center' },
    backBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
    headerArea: { alignItems: 'center', marginBottom: 40, marginTop: 40 },
    shieldIcon: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#2D3748', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#A0AEC0', letterSpacing: 2, textTransform: 'uppercase' },

    formContainer: { backgroundColor: '#2D3748', marginHorizontal: 24, borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, elevation: 8 },
    label: { fontSize: 12, fontWeight: 'bold', color: '#CBD5E0', marginBottom: 8, textTransform: 'uppercase' },
    input: { height: 50, backgroundColor: '#1A202C', borderWidth: 1, borderColor: '#4A5568', borderRadius: 8, paddingHorizontal: 16, color: '#FFF', marginBottom: 20, fontSize: 16 },

    loginBtn: { flexDirection: 'row', backgroundColor: '#3182CE', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#3182CE', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, elevation: 6 },
    loginBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },

    footerWarning: { marginTop: 30, fontSize: 11, color: '#718096', textAlign: 'center', lineHeight: 18, paddingHorizontal: 10 },
});

export default AdminLoginScreen;
