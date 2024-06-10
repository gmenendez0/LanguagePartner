import { ImageBackground, SafeAreaView, TouchableOpacity, Text, View, StyleSheet, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

const HomeScreen: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('session_token');
            setIsLoggedIn(!!token);
        };

        checkLoginStatus();
    });
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <ImageBackground
                        source={require('@/assets/images/Untitled.svg')}
                        style={styles.backgroundImage}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.buttonContainer}>
                    {!isLoggedIn && <Link href="/login" asChild>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </Link>}
                    {!isLoggedIn && <Link href="/register" asChild>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                    </Link>}
                    {isLoggedIn && <Link href="/matching" asChild>
                        <TouchableOpacity style={styles.matchingButton}>
                            <Text style={styles.buttonText}>Start Matching</Text>
                        </TouchableOpacity>
                    </Link>}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#333',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        position: 'absolute',
        right: 0,
    },
    backgroundImage: {
        width: Dimensions.get('window').width / 1.5, // Half of the screen width
        height: Dimensions.get('window').height,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.75,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    matchingButton: {
        backgroundColor: '#e60041',
        paddingVertical: 20, // Increase vertical padding
        paddingHorizontal: 40, // Increase horizontal padding
        borderRadius: 40, // Increase border radius
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, // Increase shadow offset
        shadowOpacity: 1, // Increase shadow opacity
        shadowRadius: 4, // Increase shadow radius
        elevation: 10, // Increase elevation
    },
    button: {
        backgroundColor: '#e60041',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default HomeScreen;
