import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, PanResponder } from 'react-native';
import Swiper from 'react-native-deck-swiper';

export interface Profile {
  id: number
  name: string;
  city: string;
  image: string;
  knownLanguages: string[];
  wantToKnowLanguages: string[];
}

export type ProfileCardProps = {
  profile: Profile;
  me: Profile;
};

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, me }) => {

  const pan = useRef(new Animated.ValueXY()).current;
  const backgroundColor = pan.x.interpolate({
    inputRange: [-80, 0, 80],
    outputRange: ['rgb(255, 59, 48)', 'rgb(255, 255, 255)', 'rgb(52, 199, 89)'],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const mylanguages = me.knownLanguages.concat(me.wantToKnowLanguages);

  return (
    <Animated.View
      style={[styles.card, { backgroundColor }, pan.getLayout()]}
      {...panResponder.panHandlers}
    >
      <Image source={{ uri: `https://i.imgur.com/${profile.image}.jpg` }} style={styles.image} resizeMode="contain" />
      <Text selectable={false} style={styles.name}>{profile.name} from {profile.city}</Text>
      <Text style={styles.interests} selectable={false}>
        Speaks{' '}
        {profile.knownLanguages.map((language: string, index: number) => (
          <Text
            key={index}
            style={mylanguages.includes(language) ? styles.incommon : null}
            selectable={false}
          >
            {language}{index < profile.knownLanguages.length - 1 ? ', ' : ''}
          </Text>
        ))}.
      </Text>
      <Text style={styles.interests} selectable={false}>
        Wants to learn{' '}
        {profile.wantToKnowLanguages.map((language: string, index: number) => (
          <Text
            key={index}
            style={mylanguages.includes(language) ? styles.incommon : null}
            selectable={false}
          >
          {language}{index < profile.wantToKnowLanguages.length - 1 ? ', ' : ''}
        </Text>
        ))}.
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
    height: '80%',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    minHeight: 300,
    maxHeight: '100%',
    borderRadius: 10,
    minWidth: '100%',
  },
  name: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  interests: {
    fontSize: 20,
    color: '#888',
    marginTop: 5,
  },
  incommon: {
    color: 'yellow',
    fontWeight: 'bold',
  },
});