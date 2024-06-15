import React, { useState, useCallback } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Link, useRouter} from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const router = useRouter();
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
        router.push('/'); // navigate to home screen
    };

    // TODO add personalized message when user is logged in, like "Hi username"
    return (
        <View style={styles.header}>
            <Link href="/" asChild>
                <Text style={styles.title}>LanguagePartner</Text>
            </Link>
            <View style={styles.buttonsContainer}>
                {isLoggedIn && <Link href="/update_profile" asChild>
                    <TouchableOpacity >
                        <Text style={styles.profile}>Profile</Text>
                    </TouchableOpacity>
                </Link>}
                {isLoggedIn && (
                    <TouchableOpacity onPress={handleLogout}>
                        <Text style={styles.logout}>Logout</Text>
                    </TouchableOpacity>
                )}
            </View>
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
    buttonsContainer: {
        flexDirection: 'row',
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    logout: {
        color: '#FFF',
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: '#FFF',
        borderRadius: 5,
    },
    profile: {
        color: '#FFF',
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: '#FFF',
        borderRadius: 5,
        marginRight: 10,
    },
});

export default Header;