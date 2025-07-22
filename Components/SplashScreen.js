// File: screens/SplashScreen.js

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage'; // at the top


const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Parallel animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
    ]).start();


// Inside useEffect, replace your current timer with:
const timer = setTimeout(async () => {
  try {
    const isSetup = await AsyncStorage.getItem('isAccountSetup');
    if (isSetup === 'true') {
      navigation.replace('Login'); // Go to Login if setup is done
    } else {
      navigation.replace('SetupAccount'); // Else go to setup
    }
  } catch (e) {
    console.error('Setup check failed:', e);
    navigation.replace('SetupAccount');
  }
}, 4000);

    return () => clearTimeout(timer);
  }, []);

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Animated.View
        style={[
          styles.glowCircle,
          {
            transform: [{ rotate: rotateInterpolation }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require('../assets/weekgram-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>CredSafe</Text>
        <Text style={styles.subtitle}>Your Trusted Vault</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  logo: {
    width: 130,
    height: 130,
    tintColor: Colors.primary,
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: Colors.text,
    textShadowColor: Colors.accent,
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.subtitle,
    marginTop: 10,
    letterSpacing: 1,
  },
  glowCircle: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: Colors.glow,
    opacity: 0.2,
  },
});

export default SplashScreen;
