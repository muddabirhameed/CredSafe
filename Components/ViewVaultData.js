import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ViewVaultData = ({ vaultData, onDelete, onPasswordPress, onOnlineAccountPress, onCryptoSeedPress }) => {
  const renderSection = (title, data, keyName) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {data.length === 0 ? (
        <Text style={styles.empty}>No {title.toLowerCase()} yet</Text>
      ) : (
        data.map((item, index) => {
          if (keyName === 'passwords') {
            // item: { title, password }
            return (
              <TouchableOpacity
                key={index}
                style={styles.itemContainer}
                onPress={() => onPasswordPress && onPasswordPress(index)}
              >
                <Text style={styles.itemText}>{item.title || 'Untitled'}</Text>
                <TouchableOpacity onPress={() => onDelete(keyName, index)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          } else if (keyName === 'onlineAccounts') {
            // item: { username, email, password }
            return (
              <TouchableOpacity
                key={index}
                style={styles.itemContainer}
                onPress={() => onOnlineAccountPress && onOnlineAccountPress(index)}
              >
                <Text style={styles.itemText}>
                  {item.username ? `Username: ${item.username}\n` : ''}
                  {item.email ? `Email: ${item.email}\n` : ''}
                  {item.password ? `Password: ••••••••` : ''}
                </Text>
                <TouchableOpacity onPress={() => onDelete(keyName, index)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          } else {
            // cryptoSeeds: array or string
            return (
              <TouchableOpacity
                key={index}
                style={styles.itemContainer}
                onPress={() => onCryptoSeedPress && onCryptoSeedPress(index)}
              >
                <Text style={styles.itemText}>
                  {Array.isArray(item) ? item.join(' ') : String(item)}
                </Text>
                <TouchableOpacity onPress={() => onDelete(keyName, index)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }
        })
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderSection('Online Accounts', vaultData.onlineAccounts, 'onlineAccounts')}
      {renderSection('Passwords', vaultData.passwords, 'passwords')}
      {renderSection('Crypto Seed Phrases', vaultData.cryptoSeeds, 'cryptoSeeds')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  empty: {
    fontStyle: 'italic',
    color: '#999',
  },
  itemContainer: {
    backgroundColor: '#2196F3',
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    marginHorizontal: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
  },
  itemText: {
    flex: 1,
    marginRight: 10,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: '#e53935',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    overflow: 'hidden',
    fontSize: 14,
    marginLeft: 8,
    elevation: 2,
  },
});

export default ViewVaultData;
