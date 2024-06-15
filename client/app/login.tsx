import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    Alert,
    Modal,
    View,
    ActivityIndicator
} from 'react-native';

interface Errors {
    email?: string;
    password?: string;
}


//TODO move this to a helper or utils file
interface LoginUserData {
    email: string,
    password: string
}

interface PostResponse {
    success: boolean;
    token: string;
    error: string;
}

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const router = useRouter();
    useEffect(() => {
        if (isSubmitting) {
            setIsLoading(true); // Show loading modal
            setLoadingMessage('Logging in...');
            const postData: LoginUserData = {
                "email": email,
                "password": password
            };

            // TODO hold the sv url somewhere safe
            fetch('http://localhost:3000/v1/session/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            })
                .then(response => response.json())
                .then((data: PostResponse) => {
                    console.log(data);
                    // Handle the response data
                    if (data.success) {
                        setLoadingMessage('Logged in! Redirecting...');
                        const token = data.token;
                        AsyncStorage.setItem('session_token', token)
                            .then(() => {
                                console.log('Session token saved');
                                setEmail('');
                                setPassword('');
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
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    }, [isSubmitting]);

    const validateField = (field: string, value: string): string | undefined => {
        switch (field) {
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
        setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    };

    const handleLogin = () => {
        const newErrors: Errors = {
            email: validateField('email', email),
            password: validateField('password', password),
        };

        console.log('Validation Errors:', newErrors);

        if (!newErrors.email && !newErrors.password) {
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
                placeholder="Email"
                onChangeText={(text) => handleChange('email', text)}
                value={email}
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
                console.log('Login button pressed');
                handleLogin();
            }}>
                <Text style={styles.buttonText}>Login</Text>
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

export default LoginForm;
