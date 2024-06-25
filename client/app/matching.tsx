import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import Swiper from 'react-native-deck-swiper';
import { ProfileCard, Profile, ProfileCardProps } from '@/components/ProfileCard';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function MatchngScreen() {

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const getNewProfile = async (this_token: string): Promise<Profile> => {
    const response = await axios.get(`http://localhost:3000/v1/matching`, {
      headers: {
        Authorization: `Bearer ${this_token}`
      }
    });
    const data = response.data;
    console.log(data);
    const newProfile: Profile = {
      id: data.id,
      name: data.name,
      image: data.profilePicHash,
      city: data.city,
      knownLanguages: data.knownLanguages.map((lang: any) => lang.name),
      wantToKnowLanguages: data.wantToKnowLanguages.map((lang: any) => lang.name),
    };
    return newProfile;
  };

  useEffect(() => {
    const fetchProfiles = async (token: string) => {
      // Assuming getNewProfile now accepts a token parameter
      const newProfiles = await Promise.all([getNewProfile(token), getNewProfile(token)]);
      setProfiles(newProfiles);
    };
  
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem('session_token');
      setToken(token);
      return token; // Return the token for use in the next step
    };
  
    fetchToken().then(token => {
      if (token) {
        fetchProfiles(token);
      }
    });
  }, []);

  const handleSwiped = async () => {
    const newProfile = await getNewProfile(token!);
    setProfiles(prevProfiles => [...prevProfiles, newProfile]);
  };

  const handleSwipedLeft = () => {
    handleSwiped();
    handleRejectApi(profiles[0].id);
  };

  const handleSwipedRight = () => {
    handleSwiped();
    handleAcceptApi(profiles[0].id);
  };

  const handleRejectApi = async (id: number) => {
    console.log('Rejecting profile with id', id);
    await axios.post(`http://localhost:3000/v1/matching/reject/${id}`, {}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  };
  
  const handleAcceptApi = async (id: number) => {
    console.log('Accepting profile with id', id);
    await axios.post(`http://localhost:3000/v1/matching/approve/${id}`, {}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  };

  if (profiles.length === 0 || !token) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No profiles found</Text>
      </View>
    );
  }

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
