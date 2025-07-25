import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OnlineAccountDetailScreen = ({ route }) => {
  const { account } = route.params;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>{account.username}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{account.email}</Text>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordRow}>
          <Text style={styles.value}>
            {showPassword ? account.password : '••••••••'}
          </Text>
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#2196F3" />
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
  },
  passwordRow: {
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
});

export default OnlineAccountDetailScreen;
