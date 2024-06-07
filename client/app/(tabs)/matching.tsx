import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import Swiper from 'react-native-deck-swiper';
import { ProfileCard, Profile, ProfileCardProps } from '@/components/ProfileCard';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function MatchngScreen() {

  const profiles: Profile[] = [
    {
      name: 'John Doe',
      age: 30,
      city: 'New York',
      description: 'Loves hiking and outdoor adventures.',
      image: 'https://i.imgur.com/IM82bWA.jpeg',
      knownLanguages: ['English', 'Spanish'],
      wantToKnowLanguages: ['French'],
    },
    {
      name: 'Jane Smith',
      age: 25,
      city: 'San Francisco',
      description: 'Enjoys reading and quiet evenings at home.',
      image: 'https://i.imgur.com/tfUxQbf.jpeg',
      knownLanguages: ['English', 'French'],
      wantToKnowLanguages: ['Spanish'],
    },
    {
      name: 'Alice Johnson',
      age: 35,
      city: 'Los Angeles',
      description: 'Passionate about food and cooking.',
      image: 'https://i.imgur.com/eiwJg1P.jpeg',
      knownLanguages: ['English', 'Italian'],
      wantToKnowLanguages: ['Japanese'],
    },
    {
      name: 'Bob Brown',
      age: 28,
      city: 'Chicago',
      description: 'Loves playing sports and staying active.',
      image: 'https://i.imgur.com/38g0nji.jpeg',
      knownLanguages: ['English', 'German'],
      wantToKnowLanguages: ['Chinese'],
    }
  ];
  
  const getNewProfile = (): Profile => {
    return profiles[Math.floor(Math.random() * profiles.length)];
    //LLAMADA A API
  };


  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setCurrentProfile(getNewProfile());
  }, []);

  const handleSwiped = () => {
    setCurrentProfile(getNewProfile());
  };

  const handleSwipedLeft = () => {
    console.log('Swiped left');
    handleSwiped();
  };

  const handleSwipedRight = () => {
    console.log('Swiped right');
    handleSwiped();
  };

  return (
    <View style={styles.container}>
      {currentProfile && (
        <Swiper
        cards={[currentProfile]}
        renderCard={(profile: Profile) => <ProfileCard profile={profile} />}
        onSwipedLeft={handleSwipedLeft}
        onSwipedRight={handleSwipedRight}
        backgroundColor={'#f0f0f0'}
        stackSize={1}
      />
      )}
    </View>
  );
};

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
