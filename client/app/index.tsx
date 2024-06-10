import React from 'react';
import { ImageBackground, SafeAreaView, TouchableOpacity, Text, View, StyleSheet, Dimensions } from 'react-native';
import { Link } from 'expo-router';

const HomeScreen: React.FC = () => {
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
                    <Link href="/login" asChild>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </Link>
                    <Link href="/register" asChild>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                    </Link>
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
    button: {
        backgroundColor: '#e60041',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default HomeScreen;
