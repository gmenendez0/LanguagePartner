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
    const [name, setName] = useState<string | null>(null);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [user, setUser] = useState<UserForHeader | null>(null);
    const router = useRouter();

    useFocusEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('session_token');
            setIsLoggedIn(!!token);
        };
        const checkProfileInfoStatus = async () => {
            const newProfilePic = await AsyncStorage.getItem('profile_pic');
            const newName = await AsyncStorage.getItem('name');
            if (newName && name != newName)  {
                setName(newName);
            }
            if (newProfilePic && profilePic != newProfilePic)  {
                setProfilePic(newProfilePic);
            }
        };

        checkLoginStatus();
        checkProfileInfoStatus();
    });

    const handleLogout = async () => {
        setUser(null);
        //await AsyncStorage.removeItem('session_token');
        //await AsyncStorage.removeItem('hasConfiguredProfile');
        //await AsyncStorage.removeItem('profile_pic');
        //await AsyncStorage.removeItem('name');
        setIsLoggedIn(false);
        setProfilePic(null);
        setName(null);
        await AsyncStorage.clear();
        router.push('/'); // navigate to home screen
    };

    useEffect(() => {
        const fetchUserData = async () => {
            let token = await AsyncStorage.getItem('session_token');

            // If the session token is not available, return early
            if (!token) {
                console.log('User is not logged in');
                return;
            } else {

                //let profile_pic = await AsyncStorage.getItem('profile_pic');
                //let username = await AsyncStorage.getItem('name');
                fetch('http://localhost:3000/v1/user/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                })
                .then((response) => response.json())
                .then((data) => {
                    setUser({name: data.name, profilePicHash: data.profilePicHash});
                })
            }
        };

        fetchUserData();
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