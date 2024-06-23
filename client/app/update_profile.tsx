import React, {useState, useEffect} from 'react';
import {SafeAreaView, TextInput, Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import TagPicker from "@/components/tag_picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageUploader from "@/components/ImageUploader";

interface Errors {
    username?: string;
    city?: string;
}

interface UpdateUserData {
    name: string,
    city: string,
    profilePicHash: string,
    knownLanguages: string[],
    wantToKnowLanguages: string[]
}

interface PostResponse {
    success: boolean;
    message: string;
    error: string;
}

const UpdateProfile: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [knownLanguages, setKnownLanguages] = useState<string[]>([]);
    const [wantToKnowLanguages, setWantToKnowLanguages] = useState<string[]>([]);

    // TODO: Fetch the current user's details and populate the state variables

    const validateField = (field: string, value: string): string | undefined => {
        switch (field) {
            case 'username':
                if (value.length < 2) return 'Username is too short';
                break;
            case 'city':
                if (value.length < 2) return 'City is too short';
                break;
            default:
                break;
        }
        return undefined;
    };

    const handleChange = (field: string, value: string) => {
        if (errorMessage) {
            setErrorMessage(null);
        }
        switch (field) {
            case 'username':
                setUsername(value);
                break;
            case 'city':
                setCity(value);
                break;
            default:
                break;
        }

        const error = validateField(field, value);
        setErrors((prevErrors) => ({...prevErrors, [field]: error}));
    };

    const handleUpdate = () => {
        const newErrors: Errors = {
            username: validateField('username', username),
            city: validateField('city', city),
        };

        if (!newErrors.username && !newErrors.city) {
            setIsSubmitting(true);
        } else {
            setErrors(newErrors);
        }
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
                    setUsername(data.name);
                    setCity(data.city);
                    setKnownLanguages(data.knownLanguages);
                    setWantToKnowLanguages(data.wantToKnowLanguages);
                })
                .catch(error => console.error('Error:', error));
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const updateUserData = async () => {
            if (isSubmitting) {
                const postData: UpdateUserData = {
                    "name": username,
                    "city": city,
                    "profilePicHash": "asd",
                    "knownLanguages": knownLanguages,
                    "wantToKnowLanguages": wantToKnowLanguages
                };

                // TODO: Replace with your API endpoint
                const token = await AsyncStorage.getItem('session_token');
                fetch('http://localhost:3000/v1/user/me', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(postData),
                })
                    .then(response => response.json())
                    .then((data: PostResponse) => {
                        if (!data.error) {
                            console.log('Update successful');
                            // TODO: Update the user's details in the app
                            console.log(data);
                        } else {
                            console.log("Update Failed");
                            setErrorMessage(data.error);
                        }
                    })
                    .catch(error => {
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
            <ImageUploader />
        <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={(text) => handleChange('username', text)}
                value={username}
            />
        </View>
        {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

        <View style={styles.inputContainer}>
            <Text style={styles.label}>City</Text>
            <TextInput
                style={styles.input}
                placeholder="City"
                onChangeText={(text) => handleChange('city', text)}
                value={city}
            />
        </View>
        {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

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
    label: {
        width: '40%',
        fontSize: 16,
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default UpdateProfile;