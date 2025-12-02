import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { eventService } from '../../services/eventService';
import { UserHeader } from '../../components/UserHeader';
import { authService } from '../../services/authService';
import { useUser } from '../../context/UserContext';

export default function EventsScreen({ navigation }) {
  const { setUser } = useUser();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [registeredEventIds, setRegisteredEventIds] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await eventService.getEvents();
      if (!error && data) {
        setEvents(data);
        filterEvents(data, 'all');
        const registered = data
          .filter((e) => e.isRegistered)
          .map((e) => e._id);
        setRegisteredEventIds(registered);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = (eventList, filter) => {
    const now = new Date();
    let filtered = eventList;

    if (filter === 'upcoming') {
      filtered = eventList.filter((e) => new Date(e.eventDate) > now);
    } else if (filter === 'past') {
      filtered = eventList.filter((e) => new Date(e.eventDate) <= now);
    } else if (filter === 'registered') {
      filtered = eventList.filter((e) => e.isRegistered);
    }

    setFilteredEvents(filtered);
    setActiveFilter(filter);
  };

  const handleRegister = async (eventId) => {
    try {
      const { data, error } = await eventService.registerEvent(eventId);
      if (!error) {
        Alert.alert('Success', 'You have registered for this event!');
        setRegisteredEventIds([...registeredEventIds, eventId]);
        loadEvents();
      } else {
        Alert.alert('Error', error);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleUnregister = async (eventId) => {
    Alert.alert('Confirm', 'Do you want to unregister from this event?', [
      {
        text: 'Cancel',
        onPress: () => {},
      },
      {
        text: 'Unregister',
        onPress: async () => {
          try {
            const { data, error } = await eventService.unregisterEvent(eventId);
            if (!error) {
              Alert.alert('Success', 'You have unregistered from this event');
              setRegisteredEventIds(registeredEventIds.filter((id) => id !== eventId));
              loadEvents();
            }
          } catch (error) {
            Alert.alert('Error', error.message);
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
    const isRegistered = registeredEventIds.includes(item._id);
    const eventDate = new Date(item.eventDate);
    const daysUntil = Math.ceil((eventDate - new Date()) / (1000 * 60 * 60 * 24));
    const spotsLeft = item.capacity - item.registeredStudents.length;

    return (
      <TouchableOpacity
        style={styles.eventTile}
        onPress={() => navigation.navigate('EventDetails', { eventId: item._id })}
      >
        {/* Tile Header */}
        <View style={styles.tileHeader}>
          <View style={styles.tileTypeIndicator}>
            <Text style={styles.typeIcon}>📅</Text>
          </View>
          <View style={styles.registrationStatus}>
            {isRegistered && (
              <View style={styles.registeredBadge}>
                <Text style={styles.registeredText}>✓ Registered</Text>
              </View>
            )}
          </View>
        </View>

        {/* Tile Content */}
        <View style={styles.tileContent}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.eventDescription} numberOfLines={2}>
            {item.description}
          </Text>

          {/* Event Details Row */}
          <View style={styles.detailsRow}>
            <View style={styles.detail}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.detailText} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          </View>

          {/* Date and Time */}
          <View style={styles.detailsRow}>
            <View style={styles.detail}>
              <Text style={styles.detailIcon}>🕐</Text>
              <Text style={styles.detailText}>
                {eventDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>

          {/* Capacity */}
          <View style={styles.capacityRow}>
            <View style={styles.capacityInfo}>
              <Text style={styles.capacityLabel}>
                👥 {item.registeredStudents.length}/{item.capacity}
              </Text>
              <Text style={styles.spotsText}>
                {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
              </Text>
            </View>
            <View
              style={[
                styles.capacityBar,
                {
                  width: `${(item.registeredStudents.length / item.capacity) * 100}%`,
                },
              ]}
            />
          </View>

          {/* Action Button */}
          {isRegistered ? (
            <TouchableOpacity
              style={styles.unregisterButton}
              onPress={() => handleUnregister(item._id)}
            >
              <Text style={styles.unregisterButtonText}>Unregister</Text>
            </TouchableOpacity>
          ) : spotsLeft > 0 ? (
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => handleRegister(item._id)}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.fullButton} disabled>
              <Text style={styles.fullButtonText}>Event Full</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
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
      <UserHeader title="Events" onLogout={handleLogout} />

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {['all', 'upcoming', 'registered', 'past'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => filterEvents(events, filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Events Grid */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item._id}
        renderItem={renderEventTile}
        numColumns={1}
        contentContainerStyle={styles.eventsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyText}>No events found</Text>
            <Text style={styles.emptySubtext}>
              Check back later for upcoming events
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9ec1a7ff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    backgroundColor: '#ffffff99',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#1e512bff',
    borderColor: '#1e512bff',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  eventsList: {
    padding: 12,
    paddingBottom: 20,
  },
  eventTile: {
    backgroundColor: '#ffffff83',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: 'rgba(234, 227, 227, 0.43)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  tileTypeIndicator: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 20,
  },
  registrationStatus: {
    flexDirection: 'row',
  },
  registeredBadge: {
    backgroundColor: '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  registeredText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  tileContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  capacityRow: {
    marginBottom: 12,
  },
  capacityInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  capacityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  spotsText: {
    fontSize: 11,
    color: '#999',
  },
  capacityBar: {
    height: 4,
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  registerButton: {
    backgroundColor: '#0d4220ff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  unregisterButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  unregisterButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  fullButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  fullButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
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
