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
import { eventService } from '../../services/eventService';
import { UserHeader } from '../../components/UserHeader';
import { authService } from '../../services/authService';
import { useUser } from '../../context/UserContext';

export default function EventManagementScreen({ navigation }) {
  const { setUser } = useUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
    eventTime: '10:00', // Format: HH:MM
    location: '',
    capacity: '100',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await eventService.getEvents();
      if (!error && data) {
        const myEvents = data.filter((e) => e.createdBy._id);
        setEvents(myEvents);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.location.trim() ||
      !formData.eventDate ||
      !formData.eventTime
    ) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      // Combine date and time
      const dateTimeString = `${formData.eventDate}T${formData.eventTime}:00`;
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        eventDate: new Date(dateTimeString),
        location: formData.location,
        capacity: parseInt(formData.capacity),
      };

      const { data, error } = await eventService.createEvent(eventData);

      if (!error) {
        Alert.alert('Success', 'Event created successfully!');
        setFormData({
          title: '',
          description: '',
          eventDate: new Date().toISOString().split('T')[0],
          eventTime: '10:00',
          location: '',
          capacity: '100',
        });
        setShowForm(false);
        loadEvents();
      } else {
        Alert.alert('Error', error);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          const { error } = await eventService.deleteEvent(eventId);
          if (!error) {
            Alert.alert('Success', 'Event deleted');
            loadEvents();
          } else {
            Alert.alert('Error', error);
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

  const renderEventTile = ({ item }) => {
    const eventDate = new Date(item.eventDate);
    const registrationCount = item.registeredStudents.length;

    return (
      <View style={styles.eventTile}>
        <View style={styles.tileHeader}>
          <View style={styles.tileInfo}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventLocation}>📍 {item.location}</Text>
          </View>
          <View style={styles.eventMeta}>
            <Text style={styles.eventDate}>
              {eventDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.eventDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>👥 Registered</Text>
            <Text style={styles.statValue}>
              {registrationCount}/{item.capacity}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>💺 Available</Text>
            <Text style={styles.statValue}>
              {item.capacity - registrationCount}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>📊 Capacity</Text>
            <Text style={styles.statValue}>{item.capacity}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteEvent(item._id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
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
      <UserHeader title="Event Management" onLogout={handleLogout} />

      {/* Create Event Button */}
      {!showForm && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.createButtonText}>+ Create New Event</Text>
        </TouchableOpacity>
      )}

      {/* Event Form */}
      {showForm && (
        <ScrollView style={styles.formContainer}>
          <View style={styles.formContent}>
            <Text style={styles.formTitle}>Create Event</Text>

            <Text style={styles.label}>Event Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter event title"
              value={formData.title}
              onChangeText={(text) =>
                setFormData({ ...formData, title: text })
              }
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter event description"
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter event location"
              value={formData.location}
              onChangeText={(text) =>
                setFormData({ ...formData, location: text })
              }
            />

            <Text style={styles.label}>Capacity</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter capacity"
              value={formData.capacity}
              onChangeText={(text) =>
                setFormData({ ...formData, capacity: text })
              }
              keyboardType="number-pad"
            />

            <Text style={styles.label}>Event Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="2024-12-15"
              value={formData.eventDate}
              onChangeText={(text) =>
                setFormData({ ...formData, eventDate: text })
              }
            />

            <Text style={styles.label}>Event Time (HH:MM)</Text>
            <TextInput
              style={styles.input}
              placeholder="10:00"
              value={formData.eventTime}
              onChangeText={(text) =>
                setFormData({ ...formData, eventTime: text })
              }
            />

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCreateEvent}
              >
                <Text style={styles.submitButtonText}>Create Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Events List */}
      {!showForm && (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={renderEventTile}
          contentContainerStyle={styles.eventsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyText}>No events created yet</Text>
              <Text style={styles.emptySubtext}>
                Create your first event to get started
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
    backgroundColor: '#007AFF',
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
    minHeight: 80,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
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
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  eventsList: {
    padding: 12,
    paddingBottom: 20,
  },
  eventTile: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tileInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 13,
    color: '#666',
  },
  eventMeta: {
    alignItems: 'flex-end',
  },
  eventDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  eventDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ddd',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 13,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ffebee',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ff4757',
    fontWeight: '600',
    fontSize: 13,
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
  },
});
