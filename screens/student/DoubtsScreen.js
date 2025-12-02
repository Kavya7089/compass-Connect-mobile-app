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
import { doubtService } from '../../services/doubtService';

export default function DoubtsScreen() {
  const [doubts, setDoubts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDoubts();
  }, []);

  const loadDoubts = async () => {
    const { data, error } = await doubtService.getMyDoubts();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setDoubts(data || []);
    }
    setLoading(false);
  };

  const handleSubmitDoubt = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your doubt');
      return;
    }

    setSubmitting(true);
    const { error } = await doubtService.submitDoubt(message);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Doubt submitted! Teacher will reply soon.');
      setMessage('');
      loadDoubts();
    }
    setSubmitting(false);
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
      <Text style={styles.header}>Ask a Doubt</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your doubt here..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitDoubt}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>My Doubts</Text>
      <FlatList
        data={doubts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.doubtCard}>
            <Text style={styles.doubtMessage}>{item.message}</Text>
            <Text style={styles.doubtDate}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
            {item.reply ? (
              <View style={styles.replyContainer}>
                <Text style={styles.replyLabel}>Teacher's Reply:</Text>
                <Text style={styles.replyText}>{item.reply}</Text>
                <Text style={styles.replyDate}>
                  {new Date(item.replied_at).toLocaleString()}
                </Text>
              </View>
            ) : (
              <Text style={styles.pendingText}>Pending reply...</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No doubts submitted yet</Text>
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
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffffaf',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#0d4425ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
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
  doubtCard: {
    backgroundColor: '#ffffff98',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#c0b5b595',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doubtMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  doubtDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  replyContainer: {
    backgroundColor: '#f0f8ffa7',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  replyLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  replyText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  replyDate: {
    fontSize: 12,
    color: '#666',
  },
  pendingText: {
    fontSize: 14,
    color: '#ff9500',
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

