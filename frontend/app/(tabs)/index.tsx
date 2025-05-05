import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { signin, authenticate, isAuthenticated } from "@/src/api/auth";

const App = () => {
    useEffect(() => {
        const login = async () => {
            try {
                const user = { email: 'user@example.com', password: 'password123' };
                const data = await signin(user);
                await authenticate(data);
                const authData = await isAuthenticated();
                console.log('Authenticated user:', authData);
            } catch (err) {
                console.error('Authentication error:', err);
            }
        };

        login();
    }, []);

    return (
        <View>
            <Text>Добро пожаловать в приложение!</Text>
        </View>
    );
};

export default App;
