import React, { useState } from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import FormData from 'form-data';
import * as ImagePicker from 'expo-image-picker';

const ImageUploader = () => {
    const [image, setImage] = useState<string | null>(null);
    const [uploadResponse, setUploadResponse] = useState<any | null>(null);

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
        let formData = new FormData();
        let name = uri.split("/").pop();
        let match = /\.(\w+)$/.exec(name as string);
        let type = match ? `image/${match[1]}` : `image`;

        formData.append('image', { uri, name, type });

        try {
            const response = await axios.post('http://localhost:3000/v1/image', formData, {
                headers: {
                    Authorization: `Client-ID ${process.env.CLIENT_ID}`,
                },
            });

            console.log("response.data");
            console.log(response.data);
            setUploadResponse(response.data);
        } catch (error: any) {
            if (error.response && error.response.status === 429) {
                console.error("You have hit the rate limit for the Imgur API. Please try again later.");
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
            {uploadResponse && (
                <View>
                    <Text>{uploadResponse.data.link}</Text>
                    <Text>{uploadResponse.data.name}</Text>
                    <Text>{uploadResponse.data.id}</Text>
                </View>
            )}
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