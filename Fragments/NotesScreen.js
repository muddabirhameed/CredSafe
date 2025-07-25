import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const NOTES_KEY = 'CRED_SAFE_NOTES';

const NotesScreen = () => {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load notes on mount
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(NOTES_KEY);
      if (jsonValue != null) {
        setNotes(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load notes', e);
    } finally {
      setLoading(false);
    }
  };

  const saveNotes = async (notesArray) => {
    try {
      const jsonValue = JSON.stringify(notesArray);
      await AsyncStorage.setItem(NOTES_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save notes', e);
    }
  };

  const addNote = () => {
    if (!title.trim() || !description.trim()) {
      alert('Title and description are required.');
      return;
    }
    const newNote = {
      id: Date.now().toString(),
      title: title.trim(),
      tag: tag.trim(),
      description: description.trim(),
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    // Clear inputs
    setTitle('');
    setTag('');
    setDescription('');
  };
  const renderNoteItem = ({ item }) => (
    <TouchableOpacity style={styles.noteCard}>
      <Text style={styles.noteTitle}>{item.title}</Text>
      {item.tag ? <Text style={styles.noteTag}>{item.tag}</Text> : null}
      <Text style={styles.noteDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading Notes...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.heading}>Add a New Note</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Tag (optional)"
          value={tag}
          onChangeText={setTag}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        <Button title="Add Note" onPress={addNote} />
      </ScrollView>

      <View style={styles.listContainer}>
        <Text style={styles.heading}>Your Notes</Text>
        {notes.length === 0 ? (
          <Text style={styles.noNotesText}>No notes yet. Add one above!</Text>
        ) : (
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            renderItem={renderNoteItem}
            contentContainerStyle={styles.flatListContent}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  formContainer: {
    padding: 16,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  heading: {
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  noteTag: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 4,
  },
  noteDescription: {
    fontSize: 14,
    color: '#333',
  },
  noNotesText: {
    fontStyle: 'italic',
    color: '#666',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatListContent: {
    paddingBottom: 100,
  },
});
export default NotesScreen;
