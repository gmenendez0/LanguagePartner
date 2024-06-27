import FontAwesome from '@expo/vector-icons/FontAwesome';
import {DarkTheme, DefaultTheme, ThemeProvider, useFocusEffect} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { createStackNavigator } from '@react-navigation/stack';
import {Stack, useRouter} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, {useEffect, useState} from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import Header from '@/components/Header';
import HomeScreen from "@/app/index";
import Matching from "@/app/matching";
import TabBarIcon from "@/app/helper_functions/helpers";
import ChatList from "@/app/chat_view";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import RegistrationForm from "@/app/register";
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginForm from "@/app/login";
import UpdateProfile from "@/app/update_profile";
import Menu from "@/app/index";
import Chat from "@/app/chat";
import ProfileConfig from "@/app/profile_configuration";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function TabNavigator() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [hasConfiguredProfile, setHasConfiguredProfile] = useState<boolean>(false);
    useFocusEffect(
        React.useCallback(() => {
            const checkHasConfiguredProfile = async () => {
                const token = await AsyncStorage.getItem('hasConfiguredProfile');
                setHasConfiguredProfile(!!token);
            };
            const checkLoginStatus = async () => {
                const token = await AsyncStorage.getItem('session_token');
                setIsLoggedIn(!!token);
                checkHasConfiguredProfile();
            };

            checkLoginStatus();

            if (isLoggedIn && !hasConfiguredProfile) {
                router.push('/profile_configuration');
            }
        }, [isLoggedIn, hasConfiguredProfile, router])
    );

    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveBackgroundColor: '#333',
                tabBarInactiveBackgroundColor: '#555',
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#aaa',
                tabBarStyle: {
                    borderTopWidth: 0,
                },
            }}
        >
            <Tab.Screen name="menu"
                        component={isLoggedIn && hasConfiguredProfile ? Matching : Menu}
                        options={{
                            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                            tabBarLabel: () => null,
                            headerShown: false,
                        }}
            />
            {isLoggedIn && hasConfiguredProfile && (
                <Tab.Screen name="chat_view" component={ChatList}
                            options={{
                                tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />,
                                tabBarLabel: () => null,
                                headerShown: false,
                            }}
                />
            )}
        </Tab.Navigator>
    );
}

function RootLayoutNav() {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator screenOptions={{
            headerShown: true,
            header: () => <Header /> // Use your custom header
        }}>
            <Stack.Screen name="index" component={TabNavigator} />
            <Stack.Screen name="register" component={RegistrationForm} />
            <Stack.Screen name="matching" component={Matching} />
            <Stack.Screen name="login" component={LoginForm} />
            <Stack.Screen name="update_profile" component={UpdateProfile} />
            <Stack.Screen name="chat" component={ChatList} />
            <Stack.Screen name="profile_configuration" component={ProfileConfig} />
        </Stack.Navigator>
    );
}
