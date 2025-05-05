// src/screens/SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { signup, authenticate } from '../api/auth';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const data = await signup({ name, email, password });
      await authenticate(data);
      Alert.alert('Регистрация успешна', 'Вы зарегистрированы');
    } catch (err) {
      Alert.alert('Ошибка регистрации', 'Проверьте введенные данные');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
      <TextInput
        style={styles.input}
        placeholder="Имя"
        value={name}
        onChangeText={setName}
      />
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
      <Button title="Зарегистрироваться" onPress={handleSignUp} />
      <Text style={styles.link} onPress={() => navigation.navigate('SignIn')}>
        Уже есть аккаунт? Войдите
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

export default SignUpScreen;
