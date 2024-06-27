import React, { useState } from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import FormData from 'form-data';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const ImageUploader = () => {
    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log("result");
        console.log(result);

        if (!result.canceled) {
            let uri = (result.assets[0] as any).uri;
            setImage(uri);
            if (uri) {
                uploadImage(uri);
            } else {
                console.log('No image uri');
            }
        } else {
            console.log('Error selecting image');
        }
    };

    const uploadImage = async (uri: string) => {
        const authToken = await AsyncStorage.getItem('session_token');

        // If the session token is empty, return early without sending the request
        if (!authToken) {
            console.log('User is not logged in');
            return;
        }

        try {
            let formData = new FormData();
            const res = await fetch(uri);
            const blob = await res.blob();
            formData.append('photo', blob);

            const response = await axios.post('http://localhost:3000/v1/image', formData, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
        } catch (error: any) {
            if (error.response && error.response.status === 429) {
                console.error("You have hit the rate limit. Please try again later.");
            } else {
                console.error(error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Upload picture</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginTop: 20,
        borderWidth: 3,
        borderColor: '#e60041',
    },
    button: {
        backgroundColor: '#e60041',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 20,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    preview: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ImageUploader;