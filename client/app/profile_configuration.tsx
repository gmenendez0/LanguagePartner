import React, {useState, useEffect} from 'react';
import {SafeAreaView, TextInput, Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import TagPicker from "@/components/tag_picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageUploader from "@/components/ImageUploader";
import {useRouter} from "expo-router";
import IntroModal from "@/components/IntroModal";

interface UpdateUserData {
    knownLanguages: string[],
    wantToKnowLanguages: string[]
}

interface PostResponse {
    name: string;
    success: boolean;
    message: string;
    error: string;
    profilePicHash: string;
}

const ProfileConfig: React.FC = () => {
    const router = useRouter();
    const [profilePicHash, setProfilePicHash] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [knownLanguages, setKnownLanguages] = useState<string[]>([]);
    const [wantToKnowLanguages, setWantToKnowLanguages] = useState<string[]>([]);

    const handleUpdate = () => {
        setIsSubmitting(true);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = await AsyncStorage.getItem('session_token');
            fetch('http://localhost:3000/v1/user/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(response => response.json())
                .then(data => {
                    setKnownLanguages(data.knownLanguages.map((lang: any) => lang.name));
                    setWantToKnowLanguages(data.wantToKnowLanguages.map((lang: any) => lang.name));
                    setProfilePicHash(data.profilePicHash);
                })
                .catch(error => console.error('Error:', error));
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const updateUserData = async () => {
            if (isSubmitting) {
                const postData: UpdateUserData = {
                    "knownLanguages": knownLanguages,
                    "wantToKnowLanguages": wantToKnowLanguages
                };

                const token = await AsyncStorage.getItem('session_token');
                fetch('http://localhost:3000/v1/user/me/config', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(postData),
                }).then(response => {
                    console.log(response);
                    return response.json();
                })
                    .then((data: PostResponse) => {
                        if (!data.error) {
                            console.log('Profile configured successfully');
                            console.log(data);
                            AsyncStorage.setItem('hasConfiguredProfile', 'true');
                            AsyncStorage.setItem('name', data.name);
                            router.push("/");
                        } else {
                            console.log("Update Failed");
                            setIsSubmitting(false);
                            setErrorMessage(data.error);
                        }
                    })
                    .catch(error => {
                        setIsSubmitting(false);
                        console.error('Error sending data:', error);
                    })
                    .finally(() => {
                        setIsSubmitting(false);
                    });
            }
        };

        updateUserData();
    }, [isSubmitting]);

    return (
        <SafeAreaView style={styles.container}>
            <IntroModal />
            <View style={styles.imageContainer}>
                <ImageUploader profilePicHash={profilePicHash} />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Known languages</Text>
                <View style={styles.tagPickerContainer}>
                    <TagPicker input_text="Enter known language..." setTags={setKnownLanguages} tags={knownLanguages} />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Want to know languages</Text>
                <View style={styles.tagPickerContainer}>
                    <TagPicker input_text="Enter want to know language..." setTags={setWantToKnowLanguages} tags={wantToKnowLanguages} />
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#222',
        paddingBottom: 100,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
        color: '#FFF',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 8,
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
    tagPickerContainer: {
        width: '100%', // Adjust this value to make the TagPicker fields less wide
        marginVertical: 1, // Add vertical margin
        padding: 5, // Add padding
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },inputContainer: {
        width: '40%',
        marginBottom: 12,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20, // Adjust this value as needed
    },
    label: {
        width: '40%',
        fontSize: 16,
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default ProfileConfig;