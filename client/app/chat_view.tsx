import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';

const ChatList = () => {

    const [chats, setChats] = useState<string[] | null>(null);

    useEffect(() => {
        // Fetch the auth token and then fetch the chat data
        AsyncStorage.getItem('session_token')
            .then((authToken) => {
                if (authToken) {
                    return fetch('http://localhost:3000/v1/user/me', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`,
                        },
                    });
                } else {
                    throw new Error('No auth token found');
                }
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setChats(data.matchedUsers.map((user: any) => user.name));
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    if (!chats) {
        return (
            <View style={styles.container}>
                <Text style={styles.chatText}>No chats found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {chats.map((chat, index) => (
                <View key={index} style={index % 2 === 0 ? styles.chatItemEven : styles.chatItemOdd}>
                    <Text style={styles.chatText}>{chat}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#333',
    },
    chatItemEven: {
        backgroundColor: '#555',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    chatItemOdd: {
        backgroundColor: '#777',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    chatText: {
        color: '#fff',
    },
});

export default ChatList;