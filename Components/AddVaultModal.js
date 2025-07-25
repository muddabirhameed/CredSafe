import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const AddVaultModal = ({ visible, onClose, onAdd }) => {
  const [type, setType] = useState('onlineAccounts');
  const [onlineInputs, setOnlineInputs] = useState({ username: '', email: '', password: '' });
const [passwordInputs, setPasswordInputs] = useState({ title: '', password: '' });
const [input, setInput] = useState(''); // legacy, for cryptoSeeds only
  const [seedArray, setSeedArray] = useState(Array(12).fill(''));

  const handleSeedPaste = (text) => {
    const words = text.trim().split(/\s+/).slice(0, 12);
    setSeedArray(seedArray.map((_, i) => words[i] || ''));
  };

  const handleSubmit = () => {
    if (type === 'cryptoSeeds') {
      const cleaned = seedArray.map((w) => w.trim());
      const valid = cleaned.every((word) => word.length > 0);
      if (!valid) {
        alert('Please fill all 12 seed words.');
        return;
      }
      onAdd('cryptoSeeds', cleaned);
      setSeedArray(Array(12).fill(''));
    } else if (type === 'onlineAccounts') {
      const { username, email, password } = onlineInputs;
      if (!username.trim() || !email.trim() || !password.trim()) {
        alert('Please fill all fields (username, email, password).');
        return;
      }
      onAdd('onlineAccounts', { username: username.trim(), email: email.trim(), password: password.trim() });
      setOnlineInputs({ username: '', email: '', password: '' });
    } else if (type === 'passwords') {
      const { title, password } = passwordInputs;
      if (!title.trim() || !password.trim()) {
        alert('Please fill both title and password.');
        return;
      }
      onAdd('passwords', { title: title.trim(), password: password.trim() });
      setPasswordInputs({ title: '', password: '' });
    }
    setType('onlineAccounts');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Vault Entry</Text>

          <View style={styles.types}>
            {['onlineAccounts', 'passwords', 'cryptoSeeds'].map((t) => (
              <TouchableOpacity
                key={t}
                style={type === t ? styles.active : styles.inactive}
                onPress={() => setType(t)}
              >
                <Text style={styles.typeText}>
                  {t === 'onlineAccounts'
                    ? 'Online'
                    : t === 'passwords'
                    ? 'Password'
                    : 'Seed'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView>
            {type === 'cryptoSeeds' ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Paste full seed phrase"
                  onChangeText={handleSeedPaste}
                />
                <View style={styles.seedGrid}>
                  {seedArray.map((val, i) => (
                    <TextInput
                      key={i}
                      style={styles.seedInput}
                      value={val}
                      onChangeText={(text) => {
                        const newArr = [...seedArray];
                        newArr[i] = text;
                        setSeedArray(newArr);
                      }}
                    />
                  ))}
                </View>
              </>
            ) : type === 'onlineAccounts' ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={onlineInputs.username}
                  onChangeText={text => setOnlineInputs({ ...onlineInputs, username: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={onlineInputs.email}
                  onChangeText={text => setOnlineInputs({ ...onlineInputs, email: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  value={onlineInputs.password}
                  onChangeText={text => setOnlineInputs({ ...onlineInputs, password: text })}
                />
              </>
            ) : type === 'passwords' ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  value={passwordInputs.title}
                  onChangeText={text => setPasswordInputs({ ...passwordInputs, title: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  value={passwordInputs.password}
                  onChangeText={text => setPasswordInputs({ ...passwordInputs, password: text })}
                />
              </>
            ) : null}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.add}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modal: {
    margin: 20,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 18,
    maxHeight: '90%',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
    alignSelf: 'center',
  },
  types: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  active: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginHorizontal: 4,
    elevation: 2,
  },
  inactive: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  typeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#b0bec5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f5f8fd',
  },
  seedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  seedInput: {
    width: '30%',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#b0bec5',
    padding: 8,
    borderRadius: 7,
    textAlign: 'center',
    backgroundColor: '#f5f8fd',
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingHorizontal: 8,
  },
  cancel: {
    color: '#fff',
    backgroundColor: '#bbb',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    fontWeight: 'bold',
    fontSize: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  add: {
    color: '#fff',
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    fontWeight: 'bold',
    fontSize: 16,
    overflow: 'hidden',
    elevation: 2,
  },
});

export default AddVaultModal;
