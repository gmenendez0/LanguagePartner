import React, { useState, useCallback, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Link, useRouter} from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

interface UserForHeader {
    name: string;
    profilePicHash: string;
}

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const router = useRouter();
    const [user, setUser] = useState<UserForHeader | null>(null);

    useFocusEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('session_token');
            setIsLoggedIn(!!token);
        };

        checkLoginStatus();
    });

    const handleLogout = async () => {
        await AsyncStorage.removeItem('session_token');
        await AsyncStorage.removeItem('hasConfiguredProfile'); //TODO remove this line, placeholder for the behaviour
        setIsLoggedIn(false);
        router.push('/'); // navigate to home screen
    };

    useEffect(() => {
        // Fetch the auth token and then fetch the chat data
        AsyncStorage.getItem('session_token')
            .then((authToken) => {
                if (authToken) {
                    return fetch('http://localhost:3000/v1/user/me', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`,
                        },
                    });
                } else {
                    throw new Error('No auth token found');
                }
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                console.log("USUARIO HEADER: ", data)
                setUser(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <View style={styles.header}>
            <Link href="/" asChild>
                <Text style={styles.title}>LanguagePartner</Text>
            </Link>
            <View style={styles.buttonsContainer}>
                {user && 
                    <View>
                        <Image source={{ uri: `https://i.imgur.com/${user.profilePicHash}.jpg` }} style={styles.image} />
                    </View>
                }
                {user && 
                    <View>
                        <Text style={styles.salute}>Hi, {user.name.split(' ')[0]}</Text>
                    </View>
                }
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
    salute: {
        color: '#FFF',
        fontSize: 16,
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    }
});

export default Header;