import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import Swiper from 'react-native-deck-swiper';
import { ProfileCard, Profile, ProfileCardProps } from '@/components/ProfileCard';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function MatchngScreen() {

  const defaultprofiles: Profile[] = [
    {
      id: 1,
      name: 'John Doe',
      age: 30,
      city: 'New York',
      description: 'Loves hiking and outdoor adventures.',
      image: 'https://i.imgur.com/IM82bWA.jpeg',
      knownLanguages: ['English', 'Spanish'],
      wantToKnowLanguages: ['French'],
    },
    { 
      id: 2,
      name: 'Jane Smith',
      age: 25,
      city: 'San Francisco',
      description: 'Enjoys reading and quiet evenings at home.',
      image: 'https://i.imgur.com/tfUxQbf.jpeg',
      knownLanguages: ['English', 'French'],
      wantToKnowLanguages: ['Spanish'],
    },
    { 
      id: 3,
      name: 'Alice Johnson',
      age: 35,
      city: 'Los Angeles',
      description: 'Passionate about food and cooking.',
      image: 'https://i.imgur.com/eiwJg1P.jpeg',
      knownLanguages: ['English', 'Italian'],
      wantToKnowLanguages: ['Japanese'],
    },
    {
      id: 4,
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
    return defaultprofiles[Math.floor(Math.random() * defaultprofiles.length)];
    //LLAMADA A API
  };


  const [profiles, setProfiles] = useState<Profile[]>([getNewProfile(), getNewProfile()]);


  useEffect(() => {
    setProfiles([getNewProfile(), getNewProfile()]);
  }, []);

  const handleSwiped = () => {
    setProfiles(prevProfiles => {
      const newProfile = getNewProfile();
      return [...prevProfiles, newProfile];
    });
  };

  const handleSwipedLeft = () => {
    console.log('Swiped left');
    handleSwiped();
    //LLAMADA A API
  };

  const handleSwipedRight = () => {
    console.log('Swiped right');
    handleSwiped();
    //LLAMADA A API
  };

  return (
    <View style={styles.container}>
      {profiles.length > 0 && (
        <Swiper
        cards={profiles}
        renderCard={(profile: Profile) => <ProfileCard profile={profile} />}
        onSwipedLeft={handleSwipedLeft}
        onSwipedRight={handleSwipedRight}
        backgroundColor={'#f0f0f0'}
        stackSize={2}
        cardIndex={0}
        verticalSwipe={false}
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
