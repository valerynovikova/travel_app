// src/api/auth.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API = 'http://192.168.1.8:5000/api';

export const signup = async (user) => {
    try {
        const response = await axios.post(`${API}/signup`, user, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;

    } catch (err) {
        console.error('Signup error:', err);
        throw err;
    }
};

export const signin = async (user) => {
    try {
        const response = await axios.post(`${API}/signin`, user, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (err) {
        console.error('Signin error:', err);
        throw err;
    }
};

export const authenticate = async (data) => {
    try {
        await SecureStore.setItemAsync('jwt', JSON.stringify(data));
    } catch (err) {
        console.error('Error storing JWT:', err);
    }
};

export const signout = async () => {
    try {
        await SecureStore.deleteItemAsync('jwt');
        await axios.get(`${API}/signout`);
        console.log('User signed out successfully');
    } catch (err) {
        console.error('Signout error:', err);
    }
};

export const isAuthenticated = async () => {
    try {
        const jwt = await SecureStore.getItemAsync('jwt');
        return jwt ? JSON.parse(jwt) : null;
    } catch (err) {
        console.error('Error retrieving JWT:', err);
        return null;
    }
};
