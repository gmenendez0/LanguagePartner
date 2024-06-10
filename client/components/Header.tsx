import React, { useState, useCallback } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useFocusEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('session_token');
            setIsLoggedIn(!!token);
        };

        checkLoginStatus();
    });

    const handleLogout = async () => {
        await AsyncStorage.removeItem('session_token');
        setIsLoggedIn(false);
    };

    return (
        <View style={styles.header}>
            <Link href="/" asChild>
                <Text style={styles.title}>LanguagePartner</Text>
            </Link>
            {isLoggedIn && (
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logout}>Logout</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        padding: 25,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    logout: {
        color: '#FFF',
        fontSize: 16,
    },
});

export default Header;