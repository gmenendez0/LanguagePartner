import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Swiper from 'react-native-deck-swiper';
import { ProfileCard, Profile, ProfileCardProps } from '@/components/ProfileCard';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

const profiles: Profile[] = [
  {
    name: 'John Doe',
    age: 30,
    city: 'New York',
    description: 'Loves hiking and outdoor adventures.',
    image: 'https://example.com/john.jpg',
    knownLanguages: ['English', 'Spanish'],
    wantToKnowLanguages: ['French'],
  },
  {
    name: 'Jane Smith',
    age: 25,
    city: 'San Francisco',
    description: 'Enjoys reading and quiet evenings at home.',
    image: 'https://example.com/jane.jpg',
    knownLanguages: ['English', 'French'],
    wantToKnowLanguages: ['Spanish'],
  },
  {
    name: 'Alice Johnson',
    age: 35,
    city: 'Los Angeles',
    description: 'Passionate about food and cooking.',
    image: 'https://example.com/alice.jpg',
    knownLanguages: ['English', 'Italian'],
    wantToKnowLanguages: ['Japanese'],
  },
  {
    name: 'Bob Brown',
    age: 28,
    city: 'Chicago',
    description: 'Loves playing sports and staying active.',
    image: 'https://example.com/bob.jpg',
    knownLanguages: ['English', 'German'],
    wantToKnowLanguages: ['Chinese'],
  }
];

export default function MatchngScreen() {
  const [profileIndex, setProfileIndex] = useState(0);

  return (
    <View style={styles.container}>
      <Swiper
        cards={profiles}
        renderCard={(profile: Profile) => <ProfileCard profile={profile} />}
        onSwiped={(cardIndex: number) => {
          console.log('Card swiped at index:', cardIndex);
          setProfileIndex(cardIndex + 1);
        }}
        onSwipedAll={() => {
          console.log('All cards swiped');
        }}
        cardIndex={profileIndex}
        backgroundColor={'#f0f0f0'}
        stackSize={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
