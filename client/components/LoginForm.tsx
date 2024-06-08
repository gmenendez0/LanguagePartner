import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';

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
        <View style={styles.container}>
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

            <Button title="Login" onPress={() => {
                console.log('Login button pressed');
                handleLogin();
            }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 8,
    },
});

export default LoginForm;
