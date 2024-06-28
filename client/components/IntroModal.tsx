import React, { useState } from 'react';
import {Modal, Text, View, StyleSheet, TouchableOpacity} from 'react-native';

const IntroModal = () => {
    const [modalVisible, setModalVisible] = useState(true);
    const [currentScreen, setCurrentScreen] = useState(1);

    const handleNext = () => {
        if (currentScreen < 3) {
            setCurrentScreen(currentScreen + 1);
        } else {
            setModalVisible(false);
        }
    };

    const renderScreenContent = () => {
        switch (currentScreen) {
            case 1:
                return "Welcome to our app!";
            case 2:
                return "Here you can find the best language partner for you.";
            case 3:
                return "Enjoy exploring our app!";
            default:
                return "";
        }
    };

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{renderScreenContent()}</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleNext}
                        >
                            <Text style={styles.buttonText}>{currentScreen < 3 ? "Next" : "Got it!"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(34, 34, 34, 0.5)', // Set the background color to match your app's theme with 50% opacity
    },
    modalView: {
        margin: 20,
        backgroundColor: "#1a1a1a", // Set the modal background color to a slightly lighter shade
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        fontSize: 20,
        textAlign: "center",
        color: '#FFF', // Set the text color to white to contrast with the dark background
    },
    button: {
        backgroundColor: '#e60041', // Use your app's highlight color for the button
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 20,
    },
    buttonText: {
        color: '#FFF', // Set the button text color to white
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default IntroModal;