import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { notificationService } from '../../services/notificationService';
import { UserHeader } from '../../components/UserHeader';
import { authService } from '../../services/authService';
import { useUser } from '../../context/UserContext';

export default function AnnouncementsScreen({ navigation }) {
  const { setUser } = useUser();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'notice',
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const { data, error } = await notificationService.getNotifications();
      if (!error && data) {
        const notices = data.filter(
          (n) => n.type === 'notice' || n.type === 'announcement'
        );
        setAnnouncements(notices);
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const { data, error } = await notificationService.createAnnouncement({
        title: formData.title,
        message: formData.message,
        type: formData.type,
      });

      if (!error) {
        Alert.alert('Success', 'Announcement posted successfully!');
        setFormData({
          title: '',
          message: '',
          type: 'notice',
        });
        setShowForm(false);
        loadAnnouncements();
      } else {
        Alert.alert('Error', error);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    Alert.alert('Delete', 'Delete this announcement?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          const { error } = await notificationService.deleteNotification(announcementId);
          if (!error) {
            Alert.alert('Success', 'Announcement deleted');
            loadAnnouncements();
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    setUser(null);
    await authService.signOut();
    navigation.replace('Login');
  };

  const getTypeColor = (type) => {
    return type === 'announcement' ? '#ff9800' : '#2196F3';
  };

  const getTypeIcon = (type) => {
    return type === 'announcement' ? '📣' : '📋';
  };

  const renderAnnouncementTile = ({ item }) => {
    const color = getTypeColor(item.type);
    const icon = getTypeIcon(item.type);
    const createdDate = new Date(item.createdAt).toLocaleDateString();

    return (
      <View style={[styles.announcementTile, { borderLeftColor: color }]}>
        <View style={styles.tileHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.icon}>{icon}</Text>
            <View style={styles.headerContent}>
              <Text style={styles.announcementTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.type}>{item.type.toUpperCase()}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleDeleteAnnouncement(item._id)}
            style={styles.deleteIcon}
          >
            <Text>🗑️</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.message} numberOfLines={3}>
          {item.message}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.date}>{createdDate}</Text>
          {item.priority === 'high' && (
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>⚠️ Urgent</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserHeader title="Announcements" onLogout={handleLogout} />

      {/* Create Button */}
      {!showForm && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.createButtonText}>+ Post Announcement</Text>
        </TouchableOpacity>
      )}

      {/* Form */}
      {showForm && (
        <ScrollView style={styles.formContainer}>
          <View style={styles.formContent}>
            <Text style={styles.formTitle}>Post Announcement</Text>

            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Announcement title"
              value={formData.title}
              onChangeText={(text) =>
                setFormData({ ...formData, title: text })
              }
            />

            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your message"
              value={formData.message}
              onChangeText={(text) =>
                setFormData({ ...formData, message: text })
              }
              multiline
              numberOfLines={5}
            />

            <Text style={styles.label}>Type</Text>
            <View style={styles.typeButtons}>
              {['notice', 'announcement'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    formData.type === type && styles.typeButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, type })}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      formData.type === type && styles.typeButtonTextActive,
                    ]}
                  >
                    {type === 'notice' ? '📋' : '📣'} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCreateAnnouncement}
              >
                <Text style={styles.submitButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Announcements List */}
      {!showForm && (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item._id}
          renderItem={renderAnnouncementTile}
          contentContainerStyle={styles.announcementsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No announcements yet</Text>
              <Text style={styles.emptySubtext}>
                Create your first announcement to share with everyone
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6c96aeff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    margin: 12,
    backgroundColor: '#ff9800',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  formContainer: {
    flex: 1,
    padding: 12,
  },
  formContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ddd',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#ff9800',
    backgroundColor: '#fff3e0',
  },
  typeButtonText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 13,
  },
  typeButtonTextActive: {
    color: '#ff9800',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ddd',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  announcementsList: {
    padding: 12,
    paddingBottom: 20,
  },
  announcementTile: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderLeftWidth: 4,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
    marginTop: 2,
  },
  headerContent: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  type: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  deleteIcon: {
    padding: 4,
  },
  message: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 11,
    color: '#999',
  },
  priorityBadge: {
    backgroundColor: '#ffcdd2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 11,
    color: '#d32f2f',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
