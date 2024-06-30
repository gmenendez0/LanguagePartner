import React, {useEffect, useState} from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import FormData from 'form-data';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

interface ImageUploaderProps {
    profilePicHash: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ profilePicHash }) => {
    const [imageHash, setImageHash] = useState<string | null>(profilePicHash);
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        const setImageHashAsync = async () => {
            if (profilePicHash) {
        setImageHash(profilePicHash);
        await AsyncStorage.setItem('profile_pic', profilePicHash);
        }
        };

        setImageHashAsync();
    }, [profilePicHash]);

    // useEffect(() => {
    //     const setImageHashAsync = async () => {
    //         const profilePic = profilePicHash ? profilePicHash : "tmHPMYL";
    //         setImageHash(profilePic);
    //         await AsyncStorage.setItem('profile_pic', profilePic);
    //     };
    //
    //     setImageHashAsync();
    // }, []);

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
            await AsyncStorage.setItem('profile_pic', response.data.profilePicHash);
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
            <Image source={{ uri: image ? image : (imageHash ? `https://i.imgur.com/${imageHash}.jpg` : "") }} style={styles.image} />
            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Update Profile Picture</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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