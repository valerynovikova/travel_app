// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../../src/screens/SignInScreen';
import SignUpScreen from '../../src/screens/SignUpScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
            <Stack.Navigator initialRouteName="SignIn">
                <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Вход' }} />
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Регистрация' }} />
                {/* Добавьте другие экраны, например, Home */}
            </Stack.Navigator>
    );
}
