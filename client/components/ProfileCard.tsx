import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
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
};

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: profile.image }} style={styles.image} />
      <Text selectable={false} style={styles.interests}>
        Speaks {profile.knownLanguages.join(', ')} and wants to learn {profile.wantToKnowLanguages.join(', ')}.
      </Text>
    </View>
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
  },
  image: {
    width: '100%',
    minHeight: 300,
    maxHeight: '100%',
    borderRadius: 10,
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
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});