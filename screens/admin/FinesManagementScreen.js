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

export default function FinesManagementScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFineModal, setShowFineModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [fineAmount, setFineAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const { data, error } = await libraryService.getAllRequests();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      // Filter only issued books
      const issuedBooks = (data || []).filter((req) => req.status === 'issued');
      setRequests(issuedBooks);
    }
    setLoading(false);
  };

  const handleAddFine = async () => {
    if (!fineAmount || !dueDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const amount = parseFloat(fineAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid fine amount');
      return;
    }

    const { error } = await libraryService.addFine(
      selectedRequest.id,
      amount,
      dueDate
    );

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Fine added!');
      setShowFineModal(false);
      setSelectedRequest(null);
      setFineAmount('');
      setDueDate('');
      loadRequests();
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
      <Text style={styles.header}>Fines Management</Text>
      <Text style={styles.subtitle}>Manage fines for overdue books</Text>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestCard}>
            <Text style={styles.bookName}>{item.book_name}</Text>
            <Text style={styles.requestInfo}>
              Student ID: {item.student_id?.substring(0, 8)}...
            </Text>
            <Text style={styles.requestDate}>
              Issued: {new Date(item.created_at).toLocaleDateString()}
            </Text>
            <TouchableOpacity
              style={styles.fineButton}
              onPress={() => {
                setSelectedRequest(item);
                setShowFineModal(true);
              }}
            >
              <Text style={styles.fineButtonText}>Add Fine</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No issued books to manage</Text>
        }
      />

      <Modal visible={showFineModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Fine</Text>
            <Text style={styles.modalSubtitle}>
              Book: {selectedRequest?.book_name}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Fine Amount"
              value={fineAmount}
              onChangeText={setFineAmount}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Due Date (YYYY-MM-DD)"
              value={dueDate}
              onChangeText={setDueDate}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowFineModal(false);
                  setSelectedRequest(null);
                  setFineAmount('');
                  setDueDate('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addFineButton]}
                onPress={handleAddFine}
              >
                <Text style={styles.modalButtonText}>Add Fine</Text>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
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
  requestDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 15,
  },
  fineButton: {
    backgroundColor: '#ff9500',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  fineButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
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
    marginBottom: 10,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
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
  addFineButton: {
    backgroundColor: '#ff9500',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

