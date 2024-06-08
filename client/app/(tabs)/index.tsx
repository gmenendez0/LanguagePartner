import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native';
import RegistrationForm from '../../components/RegistrationForm';
import LoginForm from '../../components/LoginForm';

export default function TabOneScreen() {
  return (
      <SafeAreaView style={styles.container}>
        <RegistrationForm />
        <LoginForm />
      </SafeAreaView>
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
