import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const ChatList = () => {
    // Sample data
    const chats = ['Chat 1', 'Chat 2', 'Chat 3', 'Chat 4', 'Chat 5'];

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