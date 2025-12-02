import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { notesService } from '../../services/notesService';

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const { data, error } = await notesService.getAllNotes();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setNotes(data || []);
    }
    setLoading(false);
  };

  const handleOpenNote = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Cannot open this file');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Study Notes</Text>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.noteCard}
            onPress={() => handleOpenNote(item.file_url)}
          >
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text style={styles.noteSubject}>Subject: {item.subject}</Text>
            <Text style={styles.noteDate}>
              Uploaded: {new Date(item.created_at).toLocaleDateString()}
            </Text>
            <Text style={styles.downloadText}>Tap to download/view</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notes available</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9ec1a7ff',
    padding: 20,
    marginTop: 25,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  noteCard: {
    backgroundColor: '#ffffff94',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#c0b5b595',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  noteSubject: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  downloadText: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

