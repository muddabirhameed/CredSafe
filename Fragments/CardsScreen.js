import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

//Got this Dummy Data From DeepSeek (So AI Used here)
const CARD_COMPANIES = ['Visa', 'MasterCard', 'American Express', 'Discover', 'Rupay'];
const CARD_TYPES = ['Credit', 'Debit', 'Prepaid', 'Other'];

const CARD_ICONS = {
  Visa: 'cc-visa',
  'MasterCard': 'cc-mastercard',
  'American Express': 'cc-amex',
  Discover: 'cc-discover',
  Rupay: 'credit-card', 
};

const Card = ({ card, onPress }) => (
  <TouchableOpacity style={[styles.card, { backgroundColor: card.color }]} onPress={() => onPress(card)}>
    <View style={styles.cardRow}>
      <FontAwesome5
        name={CARD_ICONS[card.company] || 'credit-card'}
        size={32}
        color="#fff"
        solid
      />
      <Text style={styles.cardType}>{card.type}</Text>
    </View>
    <Text style={styles.cardNumber}>{card.number}</Text>
    <View style={styles.cardRow}>
      <Text style={styles.cardName}>{card.name}</Text>
      <Text style={styles.cardExpiry}>{card.expiry}</Text>
    </View>
    <Text style={styles.cardCompany}>{card.company}</Text>
  </TouchableOpacity>
);

const CardDetailModal = ({ visible, card, onClose, onSave }) => {
  const [number, setNumber] = useState(card?.number || '');
  const [name, setName] = useState(card?.name || '');
  const [expiry, setExpiry] = useState(card?.expiry || '');
  const [company, setCompany] = useState(card?.company || CARD_COMPANIES[0]);
  const [type, setType] = useState(card?.type || CARD_TYPES[0]);

  React.useEffect(() => {
    setNumber(card?.number || '');
    setName(card?.name || '');
    setExpiry(card?.expiry || '');
    setCompany(card?.company || CARD_COMPANIES[0]);
    setType(card?.type || CARD_TYPES[0]);
  }, [card]);

  const handleSave = () => {
    onSave({ ...card, number, name, expiry, company, type });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Card Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            value={number}
            onChangeText={setNumber}
            keyboardType="number-pad"
            maxLength={19}
          />
          <TextInput
            style={styles.input}
            placeholder="Cardholder Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Expiry (MM/YY)"
            value={expiry}
            onChangeText={setExpiry}
            maxLength={5}
          />
          <View style={styles.pickerRow}>
            <Text style={styles.pickerLabel}>Company:</Text>
            <Picker
              selectedValue={company}
              style={styles.picker}
              onValueChange={setCompany}
            >
              {CARD_COMPANIES.map(c => <Picker.Item key={c} label={c} value={c} />)}
            </Picker>
          </View>
          <View style={styles.pickerRow}>
            <Text style={styles.pickerLabel}>Type:</Text>
            <Picker
              selectedValue={type}
              style={styles.picker}
              onValueChange={setType}
            >
              {CARD_TYPES.map(t => <Picker.Item key={t} label={t} value={t} />)}
            </Picker>
          </View>
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const CardsScreen = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  const handleCardPress = (card) => {
    setSelectedCard(card);
    setIsAddMode(false);
    setModalVisible(true);
  };

  const handleAddPress = () => {
    setSelectedCard({
      id: (Date.now()).toString(),
      number: '',
      name: '',
      expiry: '',
      company: CARD_COMPANIES[0],
      type: CARD_TYPES[0],
      color: randomCardColor(),
    });
    setIsAddMode(true);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedCard(null);
    setIsAddMode(false);
  };

  const handleCardSave = (cardData) => {
    if (isAddMode) {
      setCards([...cards, cardData]);
    } else {
      setCards(cards.map(c => (c.id === cardData.id ? cardData : c)));
    }
    handleModalClose();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.header}>Your Cards</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
        <FontAwesome5 name="plus" size={22} color="#fff" />
        <Text style={styles.addButtonText}>Add Card</Text>
      </TouchableOpacity>
      <FlatList
        data={cards}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Card card={item} onPress={handleCardPress} />}
        contentContainerStyle={styles.cardList}
        ListEmptyComponent={<Text style={styles.emptyText}>No cards yet. Tap "Add Card" to get started.</Text>}
      />
      <CardDetailModal
        visible={modalVisible}
        card={selectedCard}
        onClose={handleModalClose}
        onSave={handleCardSave}
      />
    </SafeAreaView>
  );
};

function randomCardColor() {
  const palette = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#FF5252', '#607D8B'];
  return palette[Math.floor(Math.random() * palette.length)];
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
    alignSelf: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 18,
    marginHorizontal: 8,
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
  cardList: {
    paddingBottom: 24,
    paddingHorizontal: 6,
  },
  card: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    marginHorizontal: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 22,
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 8,
  },
  cardName: {
    fontSize: 16,
    color: '#fff',
  },
  cardExpiry: {
    fontSize: 16,
    color: '#fff',
  },
  cardCompany: {
    fontSize: 14,
    color: '#fff',
    alignSelf: 'flex-end',
    marginTop: 6,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  cardType: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 16,
    marginRight: 10,
    width: 80,
  },
  picker: {
    flex: 1,
    height: Platform.OS === 'ios' ? 120 : 44,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  saveBtn: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  cancelBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CardsScreen;
