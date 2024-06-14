import { SafeAreaView, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Menu from "@/app/menu";
import Matching from "@/app/matching";
import TabBarIcon from "@/app/helper_functions/helpers";
import ChatList from "@/app/chat_view";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRoute} from "@react-navigation/core";

const HomeScreen: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const Tab = createBottomTabNavigator();
    const route = useRoute();

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('session_token');
            setIsLoggedIn(!!token);
        };

        checkLoginStatus();
    }, [route]); // Add route to the dependency array

    return (
        <SafeAreaView style={styles.safeArea}>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveBackgroundColor: '#333', // Dark background color for the active tab
                    tabBarInactiveBackgroundColor: '#555', // Dark background color for the inactive tabs
                    tabBarActiveTintColor: '#fff', // Light text color for the active tab
                    tabBarInactiveTintColor: '#aaa', // Light text color for the inactive tabs
                    tabBarStyle: {
                        borderTopWidth: 0, // This line removes the top border
                    },
                }}
            >
                <Tab.Screen name="menu"
                            component={isLoggedIn ? Matching : Menu}
                            options={{
                                tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                                tabBarLabel: () => null,
                                headerShown: false,
                            }}
                />
                <Tab.Screen name="chats" component={ChatList}
                            options={{
                                tabBarIcon: ({ color }) => <TabBarIcon name="newspaper-o" color={color} />,
                                tabBarLabel: () => null,
                                headerShown: false,
                            }}
                />
            </Tab.Navigator>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#333',
    },
});

export default HomeScreen;
