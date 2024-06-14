import { ImageBackground, SafeAreaView, TouchableOpacity, Text, View, StyleSheet, Dimensions } from 'react-native';
import {Link, router} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {useRoute} from "@react-navigation/core";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Menu: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const route = useRoute();

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('session_token');
            setIsLoggedIn(!!token);
        };

        checkLoginStatus();
        // @ts-ignore
        const message = route.params?.message;
        if (message) {
            console.log('Message from params:', message);
            setMessage(message);
        }
    }, [route]); // Add route to the dependency array
    return (
        <SafeAreaView style={styles.safeArea}>
            {message && (
                <View style={styles.successMessageContainer}>
                    <Text style={styles.successMessage}>{message}</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={() => {
                        console.log("Closed notification");
                        setMessage(null);
                    }}>
                        <Text style={styles.closeButtonText}>x</Text>
                    </TouchableOpacity>
                </View>
            )}
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
                    {/*{isLoggedIn && <Link href="/matching" asChild>*/}
                    {/*    <TouchableOpacity style={styles.matchingButton}>*/}
                    {/*        <Text style={styles.buttonText}>Start Matching</Text>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*</Link>}*/}
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
        width: Dimensions.get('window').width / 2, // Half of the screen width
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
    successMessageContainer: {
        zIndex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E8F5E9', // Light green background
        borderRadius: 5, // Slight rounding of corners
        padding: 10, // Add some padding
        margin: 20, // Add some margin around the message
        shadowColor: '#000', // Add shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    successMessage: {
        color: '#4CAF50', // A more pleasing shade of green
        fontSize: 18, // Slightly smaller font size
        fontWeight: '500', // Medium boldness
        flex: 1, // Add this line
    },
    closeButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50', // Same color as the text
        borderRadius: 15, // Make the button circular
        width: 30, // Fixed width
        height: 30, // Fixed height
        marginLeft: 10, // Add some margin to the left of the close button
        shadowColor: '#000', // Add shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        cursor: 'pointer', // Change the cursor to a pointer when hovering over the button
    },
    closeButtonText: {
        color: '#FFFFFF', // White color for the close button text
        fontSize: 18, // Same font size as the message
        fontWeight: '700', // Make the close button text bold
        padding: 10, // Add padding
    },
});

export default Menu;
