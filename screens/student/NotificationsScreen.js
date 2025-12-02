import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { notificationService } from '../../services/notificationService';
import { UserHeader } from '../../components/UserHeader';
import { authService } from '../../services/authService';
import { useUser } from '../../context/UserContext';

export default function NotificationsScreen({ navigation }) {
  const { setUser } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
    // Refresh notifications every 10 seconds
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const { data: notifs, error: notifError } = await notificationService.getNotifications();
      const { data: count, error: countError } = await notificationService.getUnreadCount();

      if (!notifError && notifs) {
        setNotifications(notifs);
      }
      if (!countError && count) {
        setUnreadCount(count.unreadCount);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleMarkAsRead = async (notificationId) => {
    const { error } = await notificationService.markAsRead(notificationId);
    if (!error) {
      loadNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    const { error } = await notificationService.markAllAsRead();
    if (!error) {
      loadNotifications();
    }
  };

  const handleDelete = async (notificationId) => {
    Alert.alert('Delete', 'Delete this notification?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          await notificationService.deleteNotification(notificationId);
          loadNotifications();
        },
      },
    ]);
  };

  const handleLogout = async () => {
    setUser(null);
    await authService.signOut();
    navigation.replace('Login');
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return '#ff4757';
    if (type === 'event_alert' || type === 'event_reminder') return '#007AFF';
    if (type === 'notice' || type === 'announcement') return '#ff9800';
    return '#4CAF50';
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event_alert':
        return '📢';
      case 'event_reminder':
        return '🔔';
      case 'notice':
        return '📋';
      case 'announcement':
        return '📣';
      default:
        return 'ℹ️';
    }
  };

  const renderNotificationTile = ({ item }) => {
    const color = getNotificationColor(item.type, item.priority);
    const icon = getNotificationIcon(item.type);
    const createdTime = new Date(item.createdAt);
    const timeAgo = getTimeAgo(createdTime);

    return (
      <TouchableOpacity
        style={[styles.notificationTile, !item.read && styles.notificationUnread]}
        onPress={() => handleMarkAsRead(item._id)}
      >
        {/* Color indicator */}
        <View style={[styles.colorIndicator, { backgroundColor: color }]} />

        {/* Content */}
        <View style={styles.tileContent}>
          <View style={styles.titleRow}>
            <View style={styles.titleContent}>
              <Text style={styles.notificationIcon}>{icon}</Text>
              <Text style={styles.notificationTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
          </View>

          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.message}
          </Text>

          <View style={styles.footerRow}>
            <Text style={styles.timeAgo}>{timeAgo}</Text>
            <TouchableOpacity
              onPress={() => handleDelete(item._id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
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
      <UserHeader title="Notifications" onLogout={handleLogout} />

      {/* Header with unread count and mark all read */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.headerText}>
            {unreadCount > 0 ? `${unreadCount} New Notifications` : 'All caught up!'}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.markAllButton}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderNotificationTile}
        contentContainerStyle={styles.notificationsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>
              You'll get notified about events and announcements
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
  headerBar: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  markAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
  },
  markAllText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  notificationsList: {
    padding: 12,
    paddingBottom: 20,
  },
  notificationTile: {
    backgroundColor: '#ffffff94',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#e3ddddb9dddff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationUnread: {
    backgroundColor: '#f9f9f9a4',
    borderLeftWidth: 3,
    borderLeftColor: '#0d4220ff',
  },
  colorIndicator: {
    width: 4,
    height: '100%',
  },
  tileContent: {
    flex: 1,
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  titleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeAgo: {
    fontSize: 11,
    color: '#999',
  },
  deleteButton: {
    padding: 4,
  },
  deleteIcon: {
    fontSize: 14,
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
