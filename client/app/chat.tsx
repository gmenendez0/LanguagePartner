import { Composer, ComposerProps } from 'react-native-gifted-chat';
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import {
    GiftedChat,
    IMessage,
    Bubble,
    SystemMessage,
    InputToolbar,
    SystemMessageProps,
    InputToolbarProps, BubbleProps
} from "react-native-gifted-chat";
import { matchedUser } from "./chat_view";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChatProps {
    me: number;
    chatter: matchedUser;
}

const Chat: React.FC<ChatProps> = ({ me, chatter }) => {
    const [messages, setMessages] = useState<IMessage[]>([
        {
            _id: 1,
            text: `My name is ${me} and I am chatting with ${me}.`,
            createdAt: new Date(),
            user: {
                _id: 2,
                name: "React Native",
                avatar: "https://placeimg.com/140/140/any",
            },
        }
    ]);

    let currentId = 0

    const generateId = () => {
        currentId += 1
        return currentId
    }

    useEffect(() => {

        const handlerMessages = async () => {
            try {
                const token = await AsyncStorage.getItem('session_token').then(async (authToken) => {
                    const response = await fetch(`http://localhost:3000/v1/chat/${chatter.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`,
                        },
                    });
                    const data = await response.json();
                    console.log(data);
                    data.messages.reverse()
                    data.messages.forEach((message: any) => {
                        message.createdAt = new Date(message.timestamp);
                        message._id = generateId();
                        message.text = message.message;
                        message.user = {
                            _id: message.from,
                            name: message.from === me ? me.toString() : chatter.name,
                            //avatar: "https://placeimg.com/140/140/any",
                        };
                    });
                    setMessages(data.messages);
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        console.log(chatter);
        handlerMessages();
        
    }, [chatter]);

    

    if (!chatter) {
        return (
            <View style={styles.container}/>
        );
    }

    const onSend = (newMessages: IMessage[] = []) => {
        setMessages((previousMessages: IMessage[]) => GiftedChat.append(previousMessages, newMessages));
        handleSendMessage(newMessages[0].text);
    };

    const handleSendMessage = async (message: string) => {
        try {
            const token = await AsyncStorage.getItem('session_token').then(async (authToken) => {
                const response = await fetch(`http://localhost:3000/v1/chat/${chatter.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        message: message
                    })
                });
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const renderBubble = (props: BubbleProps<IMessage>) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#007BFF' // Darker shade of blue
                    },
                    left: {
                        backgroundColor: '#F0F0F0' // Lighter shade of gray
                    }
                }}
                textStyle={{
                    right: {
                        color: '#fff'
                    },
                    left: {
                        color: '#333'
                    }
                }}
            />
        );
    };

    const renderSystemMessage = (props: SystemMessageProps<IMessage>) => {
        return (
            <SystemMessage
                {...props}
                textStyle={{
                    color: '#333',
                    fontWeight: 'bold'
                }}
            />
        );
    };
    const renderComposer = (props: ComposerProps) => {
        return (
            <Composer
                {...props}
                textInputStyle={{ color: '#fff' }} // Change this to your preferred color
            />
        );
    };
    const renderInputToolbar = (props: InputToolbarProps<IMessage>) => {
        return (
            <InputToolbar
                {...props}
                containerStyle={{
                    backgroundColor: '#333',
                    borderTopColor: '#777',
                    borderTopWidth: 3,
                }}
            />
        );
    };

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={newMessages => onSend(newMessages)}
                user={{ _id: me }}
                renderBubble={renderBubble}
                renderSystemMessage={renderSystemMessage}
                renderInputToolbar={renderInputToolbar}
                renderComposer={renderComposer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333'
    }
});

export default Chat;