import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useState, useRef } from 'react';
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

    const selectedChatRef = useRef<number | null>(selectedChat);

    useEffect(() => {
      selectedChatRef.current = selectedChat;
  }, [selectedChat]);

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

    const handleSelectChat = (chatId: number) => {
        setSelectedChat(chatId);
        console.log('Selected chat:', chatId);
        const chat = chats?.find((chat) => chat.id === chatId);
        if (chat) {
            chat.unreadCount = 0;
        }
        setChats([...chats!]);
    };

    const handleNewChat = (from: number) => {
      const chat = chats?.find((chat) => chat.id === from);
      if (chat && selectedChatRef.current !== from) {
          chat.unreadCount += 1;
      }
      const newChat = chats?.filter((chat) => chat.id !== from);
      setChats([chat!, ...newChat!]);
    };

    const handleNewMatch = (chatview: matchedUserChat) => {
        setChats([...chats!, chatview]);
    }

    useEffect(() => {

        if (!user) {
          return;
        }

        const ws = new WebSocket(`ws://localhost:3003`);
    
        ws.onopen = () => {
          console.log('Connected to the ChatList WebSocket');
          ws.send(user.id.toString());
        };
    
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case 'chat':
              console.log('New chat message:', data);
              handleNewChat(data.from)
              break;
            case 'match':
              console.log('New match:', data);
              handleNewMatch(data.chatview)
              break;
            default:
              console.log('Unknown message type:', data.type);
          }
        };
    
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
    
        ws.onclose = () => {
          console.log('Disconnected from the WebSocket server');
        };
    
        return () => {
          ws.close();
        };
      }, [user]);

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
                <ScrollView contentContainerStyle={styles.container} >
                    {chats ? (
                        chats.map((chat: matchedUserChat, index: number) => (
                            <TouchableOpacity
                                key={index}
                                style={index % 2 === 0 ? styles.chatItemEven : styles.chatItemOdd}
                                onPress={() => handleSelectChat(chat.id)}
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