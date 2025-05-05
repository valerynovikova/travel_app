import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { isAuthenticated, signout } from '../api/auth';

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const authData = await isAuthenticated();
            if (authData && authData.user) {
                setUser(authData.user);
            } else {
                navigation.replace('SignIn');
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleSignOut = async () => {
        await signout();
        navigation.replace('SignIn');
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Профиль</Text>
            <Text style={styles.label}>Имя: {user.name}</Text>
            <Text style={styles.label}>Email: {user.email}</Text>
            <Text style={styles.label}>Роль: {user.role === 1 ? 'Администратор' : 'Пользователь'}</Text>
            <Button title="Выйти" onPress={handleSignOut} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
});

export default ProfileScreen;
