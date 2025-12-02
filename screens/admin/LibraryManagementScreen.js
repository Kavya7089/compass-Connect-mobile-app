import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { libraryService } from '../../services/libraryService';
import { adminService } from '../../services/adminService';

export default function LibraryManagementScreen() {
  const [requests, setRequests] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddBook, setShowAddBook] = useState(false);
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [copies, setCopies] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [requestsData, booksData] = await Promise.all([
      libraryService.getAllRequests(),
      adminService.getAllBooks(),
    ]);

    if (requestsData.error) {
      Alert.alert('Error', requestsData.error.message);
    } else {
      setRequests(requestsData.data || []);
    }

    if (booksData.error) {
      // Books table might not exist yet, that's okay
      setBooks([]);
    } else {
      setBooks(booksData.data || []);
    }

    setLoading(false);
  };

  const handleUpdateStatus = async (requestId, status) => {
    const { error } = await libraryService.updateRequestStatus(requestId, status);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Request status updated!');
      loadData();
    }
  };

  const handleAddBook = async () => {
    if (!bookName || !author || !isbn || !copies) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const totalCopies = parseInt(copies);
    if (isNaN(totalCopies) || totalCopies <= 0) {
      Alert.alert('Error', 'Please enter a valid number of copies');
      return;
    }

    const { error } = await adminService.addBook(bookName, author, isbn, totalCopies);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Book added!');
      setShowAddBook(false);
      setBookName('');
      setAuthor('');
      setIsbn('');
      setCopies('');
      loadData();
    }
  };

  const handleToggleAvailability = async (bookId, isAvailable) => {
    const { error } = await adminService.updateBook(bookId, { isAvailable: !isAvailable });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      loadData();
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
      <View style={styles.headerRow}>
        <Text style={styles.header}>Library Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddBook(true)}
        >
          <Text style={styles.addButtonText}>+ Add Book</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Book Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <View style={styles.requestCard}>
            <Text style={styles.bookName}>{item.bookName || item.book_name}</Text>
            <Text style={styles.requestInfo}>
              Student: {item.studentId?.name || item.student_id?.name || (item.studentId?._id || item.student_id)?.substring(0, 8) || 'Unknown'}
            </Text>
            <Text style={styles.requestStatus}>
              Status: {(item.status || 'requested').toUpperCase()}
            </Text>
            {item.status === 'requested' && (
              <TouchableOpacity
                style={styles.issueButton}
                onPress={() => handleUpdateStatus(item._id || item.id, 'issued')}
              >
                <Text style={styles.issueButtonText}>Issue Book</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No book requests</Text>
        }
      />

      <Text style={styles.sectionTitle}>Books</Text>
      <FlatList
        data={books}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <View style={styles.bookCard}>
            <Text style={styles.bookTitle}>{item.bookName || item.book_name}</Text>
            <Text style={styles.bookAuthor}>By: {item.author}</Text>
            <Text style={styles.bookInfo}>ISBN: {item.isbn}</Text>
            <Text style={styles.bookInfo}>
              Copies: {item.availableCopies || item.available_copies}/{item.totalCopies || item.total_copies}
            </Text>
            <TouchableOpacity
              style={[
                styles.availabilityButton,
                (item.isAvailable !== undefined ? item.isAvailable : item.is_available)
                  ? styles.availableButton
                  : styles.unavailableButton,
              ]}
              onPress={() => handleToggleAvailability(item._id || item.id, item.isAvailable !== undefined ? item.isAvailable : item.is_available)}
            >
              <Text style={styles.availabilityText}>
                {(item.isAvailable !== undefined ? item.isAvailable : item.is_available) ? 'Available' : 'Unavailable'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No books added yet</Text>
        }
      />

      <Modal visible={showAddBook} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Book</Text>
            <TextInput
              style={styles.input}
              placeholder="Book Name"
              value={bookName}
              onChangeText={setBookName}
            />
            <TextInput
              style={styles.input}
              placeholder="Author"
              value={author}
              onChangeText={setAuthor}
            />
            <TextInput
              style={styles.input}
              placeholder="ISBN"
              value={isbn}
              onChangeText={setIsbn}
            />
            <TextInput
              style={styles.input}
              placeholder="Total Copies"
              value={copies}
              onChangeText={setCopies}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddBook(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addBookButton]}
                onPress={handleAddBook}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
  },
  requestCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  requestInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  requestStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  issueButton: {
    backgroundColor: '#34c759',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  issueButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bookCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  bookInfo: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  availabilityButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  availableButton: {
    backgroundColor: '#34c759',
  },
  unavailableButton: {
    backgroundColor: '#ff3b30',
  },
  availabilityText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  addBookButton: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

