import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import Colors from '../constants/colors';

const SetupAccount = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [useBiometric, setUseBiometric] = useState(false);

  const handleSave = async () => {
    if (!name || !email || !dob || !password) {
      Alert.alert('Missing Info', 'Please fill all fields.');
      return;
    }

    if (useBiometric) {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!compatible || !enrolled) {
        Alert.alert('Biometric not available', 'Device does not support or is not enrolled.');
        return;
      }
    }

    const userData = {
      name,
      email,
      dob,
      password,
      useBiometric,
    };

    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('isAccountSetup', 'true');
      navigation.replace('Login');
    } catch (e) {
      Alert.alert('Error', 'Failed to save account setup.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setup Your Account</Text>
      <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Date of Birth (YYYY-MM-DD)" style={styles.input} value={dob} onChangeText={setDob} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Use Biometric Authentication</Text>
        <Switch value={useBiometric} onValueChange={setUseBiometric} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save & Continue</Text>
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
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
  },
  label: { color: Colors.text },
  button: { backgroundColor: Colors.primary, padding: 15, borderRadius: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default SetupAccount;
