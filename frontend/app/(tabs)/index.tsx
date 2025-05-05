import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../../src/screens/SignInScreen';
import SignUpScreen from '../../src/screens/SignUpScreen';
import ProfileScreen from '../../src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
            <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Вход' }} />
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Регистрация' }} />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профиль' }} />
            </Stack.Navigator>
    );
}
