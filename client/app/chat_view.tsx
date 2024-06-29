import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Chat from './chat';

export interface matchedUserChat {
    id: number;
    name: string;
    profilePicHash: string;
    unreadCount: number;
}

const ChatList = () => {

    const [chats, setChats] = useState<matchedUserChat[] | null>(null);
    const [selectedChat, setSelectedChat] = useState<number | null>(null)
    const [user, setUser] = useState<any | null>(null);

    const fetchData = () => {
        AsyncStorage.getItem('session_token')
            .then((authToken) => {
                if (authToken) {
                    return fetch('http://localhost:3000/v1/chat/', {
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
                setChats(data.chatlist);
                setUser(data.user);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const loadChatDetails = (chatId: number) => {
        // Function to load chat details based on chatId
        setSelectedChat(chatId);
    };

    if (!chats) {
        return (
            <View style={styles.container}>
                <Text style={styles.chatText}>No chats found</Text>
            </View>
        );
    }

    return (
        <View style={styles.outerContainer}>
            <View style={styles.chatContainer}>
                <ScrollView contentContainerStyle={styles.container}>
                    {chats ? (
                        chats.map((chat: matchedUserChat, index: number) => (
                            <TouchableOpacity
                                key={index}
                                style={index % 2 === 0 ? styles.chatItemEven : styles.chatItemOdd}
                                onPress={() => loadChatDetails(chat.id)}
                            >
                                <Text style={styles.chatText}>{chat.name}</Text>
                                {chat.unreadCount > 0 && (
                                    <View style={styles.unreadCircle}>
                                        <Text style={styles.unreadText}>{chat.unreadCount}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.chatText}>No chats found</Text>
                    )}
                </ScrollView>
            </View>
            <View style={styles.blankContainer}>
                {selectedChat ? (
                    <Chat me={user.id} chatter={chats?.find((chat) => chat.id === selectedChat) || chats[0]} />
                ) : (
                    <View>
                        <Text>Select a chat to view details</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    chatContainer: {
        flex: 0.2,
        backgroundColor: '#333',
    },
    blankContainer: {
        flex: 0.8,
    },
    container: {
        padding: 10,
    },
    chatItemEven: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#555',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    chatItemOdd: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#777',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    chatText: {
        color: '#fff',
    },
    unreadCircle: {
        minWidth: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    unreadText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default ChatList;