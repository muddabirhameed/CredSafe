import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import Colors from '../constants/colors';

const LoginScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');

  useEffect(() => {
    const tryBiometricLogin = async () => {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (!userDataStr) return;

      const userData = JSON.parse(userDataStr);
      if (userData.useBiometric) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Login with Biometric',
        });

        if (result.success) {
          navigation.replace('Home');
        }
      }
    };

    tryBiometricLogin();
  }, []);

  const handleLogin = async () => {
    const userDataStr = await AsyncStorage.getItem('userData');
    if (!userDataStr) return Alert.alert('No user data found');

    const userData = JSON.parse(userDataStr);
    if (password === userData.password) {
      navigation.replace('Home');
    } else {
      Alert.alert('Incorrect Password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to CredSafe</Text>
      <TextInput
        placeholder="Enter your password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, color: Colors.text, marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#fff', marginBottom: 15, padding: 12, borderRadius: 8,
  },
  button: { backgroundColor: Colors.primary, padding: 15, borderRadius: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default LoginScreen;
