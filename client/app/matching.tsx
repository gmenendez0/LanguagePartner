import { StyleSheet, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import Swiper from 'react-native-deck-swiper';
import { ProfileCard, Profile, ProfileCardProps } from '@/components/ProfileCard';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import MatchAnimation from '@/components/MatchingAnimation';
import LoadingIcon from "@/components/LoadingIcon";

export default function MatchngScreen() {

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [isMatched, setIsMatched] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('You have a new match!');

  const handleMatch = (name: string) => {
    setMessage(`You have a new match with ${name}!`);
    setIsMatched(true);
  };

  const handleAnimationEnd = () => {
    setIsMatched(false);
  };

  const getNewProfile = async (this_token: string): Promise<Profile | null> => {
    try {
      const response = await axios.get(`http://localhost:3000/v1/matching`, {
        headers: {
          Authorization: `Bearer ${this_token}`
        }
      });
      const data = response.data;
      const newProfile: Profile = {
        id: data.id,
        name: data.name,
        image: data.profilePicHash,
        city: data.city,
        knownLanguages: data.knownLanguages.map((lang: any) => lang.name),
        wantToKnowLanguages: data.wantToKnowLanguages.map((lang: any) => lang.name),
      };
      return newProfile;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error; // Re-throw the error if it's not a 404
    }
  };

  useEffect(() => {

    if (!user) {
      return;
    }

    const ws = new WebSocket(`ws://localhost:3002`);

    ws.onopen = () => {
      console.log(user)
      ws.send(user.id.toString());
      console.log('WebSocket match connection opened');
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      handleMatch(event.data.toString());
    };

    ws.onclose = () => {
      console.log('WebSocket match connection closed');
    }

    return () => {
      ws.close();
    };

  }, [user]);

  useEffect(() => {
    const fetchProfiles = async (token: string) => {
      // Assuming getNewProfile now accepts a token parameter
      const newProfiles = await Promise.all([getNewProfile(token), getNewProfile(token)]);
      setProfiles(newProfiles.filter(profile => profile !== null) as Profile[]);
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

  useEffect(() => {
    // Fetch the auth token and then fetch the chat data
    AsyncStorage.getItem('session_token')
        .then((authToken) => {
            if (authToken) {
                return fetch('http://localhost:3000/v1/user/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });
            } else {
                throw new Error('No auth token found');
            }
        })
        .then((response) => response.json())
        .then((data) => {
            AsyncStorage.setItem('profile_pic', data.profilePicHash);
            AsyncStorage.setItem('name', data.name);
            const newProfile: Profile = {
              id: data.id,
              name: data.name,
              image: data.profilePicHash,
              city: data.city,
              knownLanguages: data.knownLanguages.map((lang: any) => lang.name),
              wantToKnowLanguages: data.wantToKnowLanguages.map((lang: any) => lang.name),
            };
            setUser(newProfile);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}, []);

  const handleSwiped = async () => {
    const newProfile = await getNewProfile(token!);
    if (newProfile) {
      setProfiles(prevProfiles => [...prevProfiles, newProfile]);
    }
  };

  const handleSwipedLeft = (index: number) => {
    handleSwiped();
    handleRejectApi(profiles[index].id);
  };

  const handleSwipedRight = (index: number) => {
    handleSwiped();
    handleAcceptApi(profiles[index].id);
  };

  const handleRejectApi = async (id: number) => {
    await axios.post(`http://localhost:3000/v1/matching/reject/${id}`, {}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const handleAcceptApi = async (id: number) => {
    await axios.post(`http://localhost:3000/v1/matching/approve/${id}`, {}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  };

  if (profiles.length === 0 || !token || !user) {
    return (
      <View style={styles.container}>
        <LoadingIcon />
      </View>
    );
  }


  return (
    <View>
      <Button title="MATCH" onPress={() => handleMatch('Bruno')} />
      <View style={styles.container}>
        
        <MatchAnimation visible={isMatched} onAnimationEnd={handleAnimationEnd} message={message}/>
        {profiles.length > 0 && (
          <Swiper
          cards={profiles}
          renderCard={(profile: Profile) => <ProfileCard profile={profile} me={user} />}
          onSwipedLeft={(index) => handleSwipedLeft(index)}
          onSwipedRight={(index) => handleSwipedRight(index)}
          backgroundColor={'#f0f0f0'}
          stackSize={2}
          cardIndex={0}
          verticalSwipe={false}
          />
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
  },
  outerContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
