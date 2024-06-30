import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, StyleSheet, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const LoadingIcon = () => {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(
                spinValue,
                {
                    toValue: 1,
                    duration: 3000, // Reduced duration to make the animation faster
                    easing: Easing.linear,
                    useNativeDriver: true
                }
            )
        ).start();
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '359deg'] // Adjusted output range to reduce jitter
    });

    return (
        <View style={styles.container}>
            <Animated.View style={{ transform: [{rotate: spin}] }}>
                <AntDesign name="loading1" size={50} color="white" />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoadingIcon;