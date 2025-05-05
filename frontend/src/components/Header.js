import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = () => {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>TravelSphere</Text>
            <View style={styles.menu}>
                <Text style={styles.menuItem}>Популярные места</Text>
                <Text style={styles.menuItem}>Галерея</Text>
                <Text style={styles.menuItem}>Добавленное место</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#2c3e50',
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    title: {
        color: '#ecf0f1',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    menu: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
    },
    menuItem: {
        color: '#ecf0f1',
        fontSize: 16,
        marginHorizontal: 10,
    },
});

export default Header;
