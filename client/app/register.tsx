import React, {useState, useEffect, useContext} from 'react';
import {
    SafeAreaView,
    TextInput,
    Button,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Modal,
    View,
    ActivityIndicator
} from 'react-native';
import {useRouter} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Errors {
    username?: string;
    email?: string;
    password?: string;
}

//TODO move this to a helper or utils file
interface RegisterUserData {
    city: string,
    name: string,
    email: string,
    password: string
}

interface RegisterResponse {
    success: boolean;
    message: string;
    error: string;
}

interface LoginResponse {
    success: boolean;
    token: string;
    error: string;
}

const RegistrationForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');

    useEffect(() => {
        if (isSubmitting) {
            setIsLoading(true); // Show loading modal
            setLoadingMessage('Registering...');
            const postData: RegisterUserData = {
                "city": city,
                "name": username,
                "email": email,
                "password": password
            };

            // TODO hold the sv url somewhere safe
            fetch('http://localhost:3000/v1/session/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            })
                .then(response => response.json())
                .then(async (data: RegisterResponse) => {
                    if (!data.error) {
                        console.log('Registration successful');
                        setLoadingMessage('Registration successful');
                        await new Promise(resolve => setTimeout(resolve, 2000)); // Inline delay
                        setUsername('');
                        setCity('');
                        setEmail('');
                        setPassword('');
                        setLoadingMessage('Logging in...');
                        // Make login request after successful registration
                        fetch('http://localhost:3000/v1/session/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email, password }),
                        })
                            .then(response => response.json())
                            .then((data: LoginResponse) => {
                                if (data.success) {
                                    setLoadingMessage('Logged in! Redirecting...');
                                    const token = data.token;
                                    AsyncStorage.setItem('session_token', token)
                                        .then(() => {
                                            console.log('Session token saved');
                                            setTimeout(() => {
                                                router.push('/'); // navigate to home screen
                                                setIsLoading(false); // Hide loading modal
                                            }, 2000); // Wait for 2 seconds before redirecting
                                        })
                                        .catch(error => {
                                            console.error('Error saving session token:', error);
                                        });
                                } else {
                                    console.log("Login Failed");
                                    setIsLoading(false);
                                    setErrorMessage(data.error);
                                }
                            })
                            .catch(error => {
                                console.error('Error sending data:', error);
                                setIsLoading(false);
                                setErrorMessage("An error occurred while trying to log in.");
                            });
                    } else {
                        console.log("Registration Failed");
                        setIsLoading(false);
                        setErrorMessage(data.error);
                    }
                })
                .catch(error => {
                    console.error('Error sending data:', error);
                    setIsLoading(false);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    }, [isSubmitting]);

    const validateField = (field: string, value: string): string | undefined => {
        switch (field) {
            case 'username':
                if (value.length < 2) return 'Username is too short';
                break;
            case 'email':
                if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
                break;
            case 'password':
                if (value.length < 8) return 'Password is too short';
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
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }

        const error = validateField(field, value);
        setErrors((prevErrors) => ({...prevErrors, [field]: error}));
    };

    const handleRegistration = () => {
        const newErrors: Errors = {
            username: validateField('username', username),
            email: validateField('email', email),
            password: validateField('password', password),
        };

        console.log('Validation Errors:', newErrors);

        if (!newErrors.username && !newErrors.email && !newErrors.password) {
            setIsSubmitting(true);
        } else {
            setErrors(newErrors);
        }
    };

    return (

        <SafeAreaView style={styles.container}>
            <Modal visible={isLoading} transparent>
                <View style={styles.modalContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.modalText}>{loadingMessage}</Text>
                </View>
            </Modal>
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={(text) => handleChange('username', text)}
                value={username}
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

            <TextInput
                style={styles.input}
                placeholder="City"
                onChangeText={(text) => handleChange('city', text)}
                value={city}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => handleChange('email', text)}
                value={email}
                keyboardType="email-address"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={(text) => handleChange('password', text)}
                value={password}
                secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TouchableOpacity style={styles.button} onPress={() => {
                console.log('Register button pressed');
                handleRegistration();
            }}>
                <Text style={styles.buttonText}>Register</Text>
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
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalText: {
        marginTop: 16,
        fontSize: 18,
        color: '#FFF',
    },
});

export default RegistrationForm;
