import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import VaultScreen from '../Fragments/VaultScreen';
import CardsScreen from '../Fragments/CardsScreen';
import NotesScreen from '../Fragments/NotesScreen';
import SettingsScreen from '../Fragments/SettingsScreen';

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState('Vault');

  const renderContent = () => {
    switch (activeTab) {
      case 'Vault':
        return <VaultScreen />;
      case 'Cards':
        return <CardsScreen />;
      case 'Settings':
        return <SettingsScreen />;
      case 'Notes':
        return <NotesScreen />;
      default:
        return <VaultScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderContent()}
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Vault')}
        >
          <Ionicons
            name="lock-closed"
            size={24}
            color={activeTab === 'Vault' ? '#2196F3' : '#999'}
          />
          <Text style={activeTab === 'Vault' ? styles.activeLabel : styles.label}>
            Vault
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Cards')}
        >
          <MaterialIcons
            name="credit-card-outline"
            size={24}
            color={activeTab === 'Cards' ? '#2196F3' : '#999'}
          />
          <Text style={activeTab === 'Cards' ? styles.activeLabel : styles.label}>
            Cards
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Notes')}
        >
          <MaterialIcons
            name="note-outline"
            size={24}
            color={activeTab === 'Notes' ? '#2196F3' : '#999'}
          />
          <Text style={activeTab === 'Notes' ? styles.activeLabel : styles.label}>
            Notes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Settings')}
        >
          <FontAwesome5
            name="cogs"
            size={22}
            color={activeTab === 'Settings' ? '#2196F3' : '#999'}
          />
          <Text style={activeTab === 'Settings' ? styles.activeLabel : styles.label}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    justifyContent: 'space-around',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  activeLabel: {
    fontSize: 12,
    color: '#2196F3',
    marginTop: 4,
    fontWeight: 'bold',
  },
});

export default HomeScreen;