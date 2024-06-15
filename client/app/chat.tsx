import { Composer, ComposerProps } from 'react-native-gifted-chat';
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
    GiftedChat,
    IMessage,
    Bubble,
    SystemMessage,
    InputToolbar,
    SystemMessageProps,
    InputToolbarProps, BubbleProps
} from "react-native-gifted-chat";

const Chat = () => {
    const [messages, setMessages] = useState<IMessage[]>([
        {
            _id: 1,
            text: "Hello developer",
            createdAt: new Date(),
            user: {
                _id: 2,
                name: "React Native",
                avatar: "https://placeimg.com/140/140/any",
            },
        }
    ]);

    const onSend = (newMessages: IMessage[] = []) => {
        setMessages((previousMessages: IMessage[]) => GiftedChat.append(previousMessages, newMessages));
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
                user={{ _id: 1 }}
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