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

export default function ViewDoubtsScreen() {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    loadDoubts();
  }, []);

  const loadDoubts = async () => {
    const { data, error } = await doubtService.getAllDoubts();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setDoubts(data || []);
    }
    setLoading(false);
  };

  const handleReply = async (doubtId) => {
    if (!reply.trim()) {
      Alert.alert('Error', 'Please enter a reply');
      return;
    }

    const { error } = await doubtService.replyToDoubt(doubtId, reply);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Reply submitted!');
      setSelectedDoubt(null);
      setReply('');
      loadDoubts();
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (selectedDoubt) {
    return (
      <View style={styles.container}>
        <View style={styles.doubtDetail}>
          <Text style={styles.doubtTitle}>Student's Doubt</Text>
          <Text style={styles.doubtMessage}>{selectedDoubt.message}</Text>
          <Text style={styles.doubtDate}>
            {new Date(selectedDoubt.created_at).toLocaleString()}
          </Text>

          <Text style={styles.replyLabel}>Your Reply:</Text>
          <TextInput
            style={styles.replyInput}
            placeholder="Type your reply here..."
            value={reply}
            onChangeText={setReply}
            multiline
            numberOfLines={4}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setSelectedDoubt(null);
                setReply('');
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={() => handleReply(selectedDoubt.id)}
            >
              <Text style={styles.buttonText}>Submit Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Student Doubts</Text>
      <FlatList
        data={doubts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.doubtCard}
            onPress={() => setSelectedDoubt(item)}
          >
            <Text style={styles.doubtText}>{item.message}</Text>
            <Text style={styles.doubtDate}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
            {item.reply ? (
              <View style={styles.repliedBadge}>
                <Text style={styles.repliedText}>Replied</Text>
              </View>
            ) : (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>Pending</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No doubts to answer</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6c96aeff',
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
  doubtCard: {
    backgroundColor: '#ffffffa2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#e8e2e23e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doubtText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  doubtDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  repliedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#34c759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  repliedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pendingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ff9500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  pendingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  doubtDetail: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doubtTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  doubtMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  replyLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  replyInput: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#34c759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

