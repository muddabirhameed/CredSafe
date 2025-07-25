/**
 * VaultScreen.js
 *
 * Main screen for managing user's vault entries (online accounts, passwords, crypto seeds).
 * Features:
 *   - Add, view, and delete vault entries
 *   - Modular, extensible, and highly commented for maintainability
 *   - Navigation to detail screens for each entry type
 *   - Placeholder hooks for search, filtering, and future features
 *
 * @author CredSafe Team
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddVaultModal from '../Components/AddVaultModal';
import ViewVaultData from '../Components/ViewVaultData';
import PasswordDetailScreen from '../Components/PasswordDetailScreen';
import { useNavigation } from '@react-navigation/native';

/**
 * @typedef {Object} VaultEntry
 * @property {Array<Object>} onlineAccounts
 * @property {Array<Object>} passwords
 * @property {Array<string|Array<string>>} cryptoSeeds
 */

/**
 * Main Vault Screen Component
 * @returns {JSX.Element}
 */
const VaultScreen = () => {
  const navigation = useNavigation();

  // --- State Management ---
  const [modalVisible, setModalVisible] = useState(false);
  /** @type {[VaultEntry, Function]} */
  const [vaultData, setVaultData] = useState({
    onlineAccounts: [],
    passwords: [],
    cryptoSeeds: [],
  });
  const [loading, setLoading] = useState(true); // For AsyncStorage loading
  const [error, setError] = useState(null); // For error handling
  const [searchQuery, setSearchQuery] = useState(''); // For search/filter feature
  const [filteredVault, setFilteredVault] = useState(null); // For filtered results

  // --- Effects ---
  useEffect(() => {
    /**
     * Loads vault data from AsyncStorage
     */
    const loadVault = async () => {
      setLoading(true);
      try {
        const data = await AsyncStorage.getItem('vaultData');
        if (data) {
          setVaultData(JSON.parse(data));
        }
      } catch (e) {
        setError('Failed to load vault data');
        console.error('Failed to load vault data:', e);
      } finally {
        setLoading(false);
      }
    };
    loadVault();
  }, []);

  // --- Helper: Save Vault ---
  /**
   * Save vault data to AsyncStorage
   * @param {VaultEntry} data
   */
  const saveVault = async (data) => {
    try {
      await AsyncStorage.setItem('vaultData', JSON.stringify(data));
    } catch (e) {
      setError('Error saving data');
      Alert.alert('Error saving data');
    }
  };

  // --- Add Entry Handler ---
  /**
   * Handles adding a new entry to the vault
   * @param {string} type
   * @param {Object} entry
   */
  const handleAdd = useCallback((type, entry) => {
    const updated = {
      ...vaultData,
      [type]: [...vaultData[type], entry],
    };
    setVaultData(updated);
    saveVault(updated);
    setModalVisible(false); // close modal after add
  }, [vaultData]);

  // --- Delete Entry Handler ---
  /**
   * Handles deleting an entry from the vault
   * @param {string} type
   * @param {number} index
   */
  const handleDelete = useCallback((type, index) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updated = {
            ...vaultData,
            [type]: vaultData[type].filter((_, i) => i !== index),
          };
          setVaultData(updated);
          saveVault(updated);
        },
      },
    ]);
  }, [vaultData]);

  // --- Navigation Handlers ---
  /**
   * Navigates to Password Detail Screen
   * @param {number} index
   */
  const handlePasswordPress = useCallback((index) => {
    const item = vaultData.passwords[index];
    navigation.navigate('PasswordDetail', { passwordItem: item });
  }, [vaultData, navigation]);

  /**
   * Navigates to Online Account Detail Screen
   * @param {number} index
   */
  const handleOnlineAccountPress = useCallback((index) => {
    const item = vaultData.onlineAccounts[index];
    navigation.navigate('OnlineAccountDetail', { account: item });
  }, [vaultData, navigation]);

  /**
   * Navigates to Crypto Seed Detail Screen
   * @param {number} index
   */
  const handleCryptoSeedPress = useCallback((index) => {
    const item = vaultData.cryptoSeeds[index];
    navigation.navigate('CryptoSeedDetail', { seed: item });
  }, [vaultData, navigation]);

  // --- Search & Filtering (Placeholder) ---
  /**
   * Handles search/filtering of vault entries (future feature)
   * @param {string} query
   */
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    // Placeholder: Implement actual filtering logic
    // setFilteredVault(...)
  }, []);

  // --- Renderers ---
  /**
   * Renders the header section
   */
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Vault</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addButton}
        accessibilityLabel="Add new vault entry"
      >
        <Text style={styles.addButtonText}>+ Add</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Renders the search bar (future feature)
   */
  const renderSearchBar = () => (
    <View style={styles.searchBarContainer}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search vault... (coming soon)"
        value={searchQuery}
        onChangeText={handleSearch}
        editable={false} // Not implemented yet
      />
    </View>
  );

  /**
   * Renders the vault data section
   */
  const renderVaultData = () => (
    <View style={styles.vaultSection}>
      <ViewVaultData
        vaultData={filteredVault || vaultData}
        onDelete={handleDelete}
        onPasswordPress={handlePasswordPress}
        onOnlineAccountPress={handleOnlineAccountPress}
        onCryptoSeedPress={handleCryptoSeedPress}
      />
    </View>
  );

  /**
   * Renders loading or error state
   */
  const renderStatus = () => {
    if (loading) return <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 40 }} />;
    if (error) return <Text style={styles.errorText}>{error}</Text>;
    return null;
  };

  /**
   * Renders the add modal
   */
  const renderAddModal = () => (
    <AddVaultModal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      onAdd={handleAdd}
    />
  );

  // --- Main Render ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderHeader()}
        {renderSearchBar()}
        {renderStatus()}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {renderVaultData()}
        </ScrollView>
        {renderAddModal()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: '#2196F3',
    borderRadius: 16,
    padding: 18,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  addButtonText: {
    color: '#2196F3',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
  searchBarContainer: {
    marginBottom: 18,
    marginTop: 2,
  },
  searchBar: {
    backgroundColor: '#e8eaf6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#b0bec5',
  },
  vaultSection: {
    marginBottom: 24,
    flex: 1,
  },
  errorText: {
    color: '#e53935',
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 16,
    textAlign: 'center',
  },
});

export default VaultScreen;
