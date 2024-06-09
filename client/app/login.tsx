import React, { useState } from 'react';
import { SafeAreaView, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

interface Errors {
    username?: string;
    password?: string;
}

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<Errors>({});

    const validateField = (field: string, value: string): string | undefined => {
        if (!value) {
            return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        }
        return undefined;
    };

    const handleChange = (field: string, value: string) => {
        switch (field) {
            case 'username':
                setUsername(value);
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
            username: validateField('username', username),
            password: validateField('password', password),
        };

        console.log('Validation Errors:', newErrors);

        if (!newErrors.username && !newErrors.password) {
            console.log('Form is valid. Showing alert.');
            Alert.alert('Login Successful', `Welcome back, ${username}!`);
            // Add your login logic here
        } else {
            setErrors(newErrors);
            console.log('Form has errors. Not showing alert.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={(text) => handleChange('username', text)}
                value={username}
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

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
        backgroundColor: '#9c7dff',
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

export default LoginForm;
