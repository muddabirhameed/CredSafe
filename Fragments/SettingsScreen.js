import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PASSWORD_KEY = 'CRED_SAFE_PASSWORD';
const NOTES_KEY = 'CRED_SAFE_NOTES';
const SettingsScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPassword();
  }, []);

  const loadPassword = async () => {
    try {
      const pass = await AsyncStorage.getItem(PASSWORD_KEY);
      if (pass !== null) {
        setStoredPassword(pass);
      }
    } catch (e) {
      console.error('Failed to load password', e);
    } finally {
      setLoading(false);
    }
  };
  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    if (storedPassword && oldPassword !== storedPassword) {
      Alert.alert('Error', 'Old password is incorrect.');
      return;
    }
    try {
      await AsyncStorage.setItem(PASSWORD_KEY, newPassword);
      setStoredPassword(newPassword);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Success', 'Password changed successfully.');
    } catch (e) {
      console.error('Failed to change password', e);
      Alert.alert('Error', 'Failed to change password.');
    }
  };
  const clearData = async () => {
    Alert.alert('Confirm', 'Are you sure you want to clear all data?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove([PASSWORD_KEY, NOTES_KEY]);
            setStoredPassword('');
            Alert.alert('Success', 'Data cleared successfully.');
          } catch (e) {
            console.error('Failed to clear data', e);
            Alert.alert('Error', 'Failed to clear data.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading Settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionHeader}>Change Password</Text>
      {storedPassword ? (
        <TextInput
          style={styles.input}
          placeholder="Old Password"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />
      ) : (
        <Text style={styles.infoText}>No password set. Create one below.</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Change Password" onPress={changePassword} />

      <Text style={styles.sectionHeader}>Clear Data</Text>
      <Text style={styles.infoText}>
        This will remove all notes and reset your password. This action cannot be
        undone.
      </Text>
      <Button color="red" title="Clear All Data" onPress={clearData} />

      <Text style={styles.sectionHeader}>About CredSafe</Text>
      <Text style={styles.aboutText}>
        CredSafe is your secure vault for notes and credentials. Designed with
        privacy at its core, CredSafe ensures your data is encrypted and stored
        only on your device. Quickly jot down important notes, tag them for easy
        retrieval, and manage your sensitive information with confidence.
        Version 1.0.0 brings a sleek interface and robust security features.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoText: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});
export default SettingsScreen;
