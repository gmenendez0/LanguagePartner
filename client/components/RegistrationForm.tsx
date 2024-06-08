import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';

interface Errors {
    username?: string;
    email?: string;
    password?: string;
}

const RegistrationForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<Errors>({});

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
        switch (field) {
            case 'username':
                setUsername(value);
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
        setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    };

    const handleRegistration = () => {
        const newErrors: Errors = {
            username: validateField('username', username),
            email: validateField('email', email),
            password: validateField('password', password),
        };

        console.log('Validation Errors:', newErrors);

        if (!newErrors.username && !newErrors.email && !newErrors.password) {
            console.log('Form is valid. Showing alert.');
            // TODO add registration com to server
        } else {
            setErrors(newErrors);
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

            <Button title="Register" onPress={handleRegistration} />
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

export default RegistrationForm;
