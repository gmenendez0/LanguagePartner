import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface MatchAnimationProps {
  visible: boolean;
  onAnimationEnd: () => void;
  message: string;
}

const MatchAnimation: React.FC<MatchAnimationProps> = ({ visible, onAnimationEnd, message }) => {
  const [animation, setAnimation] = useState('zoomIn');

  if (!visible) return null;

  const handleAnimationEnd = () => {
    if (animation === 'zoomIn') {
      setAnimation('fadeOut');
    } else if (animation === 'fadeOut') {
      onAnimationEnd();
      setAnimation('zoomIn');
    }
  };

  return (
    <Animatable.View
      animation={animation}
      duration={2000}
      style={styles.container}
      onAnimationEnd={handleAnimationEnd}
    >
      <View style={styles.content}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 35,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1,
  },
  content: {
    padding: 20,
    backgroundColor: 'rgba(230, 0, 65, 1)',
    borderRadius: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default MatchAnimation;
