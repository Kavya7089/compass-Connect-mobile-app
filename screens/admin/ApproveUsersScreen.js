import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { adminService } from '../../services/adminService';

export default function ApproveUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data, error } = await adminService.getAllUsers();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      // Filter to show unapproved users or all users
      setUsers(data || []);
    }
    setLoading(false);
  };

  const handleApprove = async (userId) => {
    const { error } = await adminService.approveUser(userId, true);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'User approved!');
      loadUsers();
    }
  };

  const handleReject = async (userId) => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to reject this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            const { error } = await adminService.approveUser(userId, false);
            if (error) {
              Alert.alert('Error', error.message);
            } else {
              Alert.alert('Success', 'User rejected');
              loadUsers();
            }
          },
        },
      ]
    );
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
      <Text style={styles.header}>Pending User Approvals</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userName}>{item.name || item.email}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <Text style={styles.userRole}>Role: {(item.role || 'student').toUpperCase()}</Text>
            {item.department && <Text style={styles.userDept}>Department: {item.department}</Text>}
            <Text style={styles.userDate}>
              Joined: {new Date(item.createdAt || item.created_at).toLocaleDateString()}
            </Text>
            <Text style={styles.userStatus}>
              Status: {item.isApproved !== undefined ? (item.isApproved ? 'Approved' : 'Pending') : 'Unknown'}
            </Text>
            <View style={styles.buttonRow}>
              {(!item.isApproved || item.isApproved === false) && (
                <TouchableOpacity
                  style={[styles.button, styles.approveButton]}
                  onPress={() => handleApprove(item._id || item.id)}
                >
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.rejectButton]}
                onPress={() => handleReject(item._id || item.id)}
              >
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No pending approvals</Text>
        }
      />
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
    marginBottom: 20,
    color: '#333',
  },
  userCard: {
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
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 5,
  },
  userDept: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  userStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34c759',
    marginBottom: 10,
  },
  userDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#34c759',
  },
  rejectButton: {
    backgroundColor: '#ff3b30',
  },
  buttonText: {
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
});

