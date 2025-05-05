// src/screens/SignInScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { signin, authenticate } from '../api/auth';

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        try {
            const data = await signin({ email, password });
            await authenticate(data);
            Alert.alert('Успешный вход', 'Вы вошли в систему');
            navigation.replace('Profile');
        } catch (err) {
            Alert.alert('Ошибка входа', 'Неверный email или пароль');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Вход</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Пароль"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Войти" onPress={handleSignIn} />
            <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
                Нет аккаунта? Зарегистрируйтесь
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    link: {
        marginTop: 15,
        color: 'blue',
        textAlign: 'center',
    },
});

export default SignInScreen;
