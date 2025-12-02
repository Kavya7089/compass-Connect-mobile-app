import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { testService } from '../../services/testService';

// Toggle this to `true` to always show mock data on this screen
const USE_MOCK = true;

const mockResults = [
  {
    id: 'r1',
    score_obtained: 42,
    created_at: new Date().toISOString(),
    tests: {
      title: 'Introduction to React Native',
      subject: 'Mobile Development',
      total_marks: 50,
    },
  },
  {
    id: 'r2',
    score_obtained: 78,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    tests: {
      title: 'Data Structures - Basics',
      subject: 'Computer Science',
      total_marks: 100,
    },
  },
  {
    id: 'r3',
    score_obtained: 88,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    tests: {
      title: 'Database Systems',
      subject: 'Databases',
      total_marks: 90,
    },
  },
  {
    id: 'r4',
    score_obtained: 30,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    tests: {
      title: 'Discrete Mathematics',
      subject: 'Mathematics',
      total_marks: 40,
    },
  },
];

export default function TestResultsScreen() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    if (USE_MOCK) {
      // Simulate small loading delay for nicer UX
      setTimeout(() => {
        setResults(mockResults);
        setLoading(false);
      }, 350);
      return;
    }

    try {
      const { data, error } = await testService.getAllTestResults();
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setResults(data || []);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load test results');
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (obtained, total) => {
    return ((obtained / total) * 100).toFixed(1);
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
      <Text style={styles.header}>My Test Results</Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.resultCard}>
            <Text style={styles.testTitle}>{item.tests?.title || 'Test'}</Text>
            <Text style={styles.testSubject}>Subject: {item.tests?.subject || 'N/A'}</Text>
            <View style={styles.scoreContainer}>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>Your Score</Text>
                <Text style={styles.scoreValue}>{item.score_obtained}</Text>
              </View>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>Total Marks</Text>
                <Text style={styles.scoreValue}>{item.tests?.total_marks || 0}</Text>
              </View>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>Percentage</Text>
                <Text style={styles.scoreValue}>{calculatePercentage(item.score_obtained, item.tests?.total_marks || 1)}%</Text>
              </View>
            </View>
            <Text style={styles.date}>Date: {new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No test results yet</Text>
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
  resultCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  testSubject: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  date: {
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
