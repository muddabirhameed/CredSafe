import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';

const CryptoSeedDetailScreen = ({ route }) => {
  const { seed } = route.params;
  const [hidden, setHidden] = useState(true);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(Array.isArray(seed) ? seed.join(' ') : seed);
    Alert.alert('Copied', 'Seed phrase copied to clipboard.');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.label}>Seed Phrase</Text>
        <View style={styles.seedRow}>
          <Text style={styles.value}>
            {hidden ? '••••••••••••••••••••••••••••••••' : (Array.isArray(seed) ? seed.join(' ') : seed)}
          </Text>
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setHidden((v) => !v)}>
            <Ionicons name={hidden ? 'eye' : 'eye-off'} size={22} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
            <Ionicons name="copy" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F5', padding: 18, justifyContent: 'center' },
  card: {
    backgroundColor: '#2196F3',
    borderRadius: 18,
    padding: 28,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    marginTop: 12,
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  value: {
    fontSize: 17,
    color: '#fff',
    marginTop: 2,
    marginBottom: 6,
    marginRight: 12,
    fontWeight: '500',
    flex: 1,
  },
  seedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  eyeBtn: {
    marginLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    elevation: 2,
  },
  copyBtn: {
    marginLeft: 12,
    backgroundColor: '#607D8B',
    borderRadius: 16,
    padding: 6,
    elevation: 2,
  },
});

export default CryptoSeedDetailScreen;
