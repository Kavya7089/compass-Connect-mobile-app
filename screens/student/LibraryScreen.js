import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { libraryService } from '../../services/libraryService';

export default function LibraryScreen() {
  const [requests, setRequests] = useState([]);
  const [bookName, setBookName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const { data, error } = await libraryService.getMyRequests();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  const handleRequestBook = async () => {
    if (!bookName.trim()) {
      Alert.alert('Error', 'Please enter a book name');
      return;
    }

    setSubmitting(true);
    const { error } = await libraryService.requestBook(null, bookName);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Book request submitted!');
      setBookName('');
      loadRequests();
    }
    setSubmitting(false);
  };

  const getStatusColor = (status) => {
    return status === 'issued' ? '#34c759' : '#ff9500';
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
      <Text style={styles.header}>Library</Text>

      <View style={styles.requestContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter book name..."
          value={bookName}
          onChangeText={setBookName}
        />
        <TouchableOpacity
          style={styles.requestButton}
          onPress={handleRequestBook}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.requestButtonText}>Request Book</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>My Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestCard}>
            <Text style={styles.bookName}>{item.book_name}</Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.requestDate}>
              Requested: {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No book requests yet</Text>
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
  requestContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffffa1',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  requestButton: {
    backgroundColor: '#0d4425ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  requestCard: {
    backgroundColor: '#ffffff99',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#c0b5b595',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statusContainer: {
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  requestDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

