import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { useUser } from '../../context/UserContext';
import { mockGroupChats } from '../../data/mockGroupChatData';

const TeacherGroupChatScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const [chats, setChats] = useState(mockGroupChats.filter(chat => chat.isTeacher));
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [filteredChats, setFilteredChats] = useState(mockGroupChats.filter(chat => chat.isTeacher));

  const filterChats = (query) => {
    let filtered = chats;

    if (query.trim()) {
      filtered = filtered.filter(chat =>
        chat.name.toLowerCase().includes(query.toLowerCase()) ||
        chat.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (sortBy === 'priority') {
      filtered.sort((a, b) => a.priority - b.priority);
    } else if (sortBy === 'unread') {
      filtered.sort((a, b) => b.unreadCount - a.unreadCount);
    } else if (sortBy === 'recent') {
      filtered.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    }

    setFilteredChats(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterChats(query);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setShowSortMenu(false);
    filterChats(searchQuery);
  };

  const handlePriorityChange = (chatId, newPriority) => {
    const updated = chats.map(chat =>
      chat.id === chatId ? { ...chat, priority: newPriority } : chat
    );
    setChats(updated);
    filterChats(searchQuery);
    Alert.alert('Success', 'Chat priority updated');
  };

  const handleOpenChat = (chat) => {
    navigation.navigate('GroupChatDetail', { chat });
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1: return '#4CAF50';
      case 2: return '#FF9800';
      case 3: return '#F44336';
      default: return '#999';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      default: return 'N/A';
    }
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatCard}
      onPress={() => handleOpenChat(item)}
      onLongPress={() => Alert.alert(
        'Chat Options',
        `${item.name}`,
        [
          { text: 'Priority: Low', onPress: () => handlePriorityChange(item.id, 1) },
          { text: 'Priority: Medium', onPress: () => handlePriorityChange(item.id, 2) },
          { text: 'Priority: High', onPress: () => handlePriorityChange(item.id, 3) },
          { text: 'Cancel', style: 'cancel' },
        ]
      )}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unreadCount > 9 ? '9+' : item.unreadCount}</Text>
          </View>
        )}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.headerRow}>
          <Text style={styles.chatName}>{item.name}</Text>
          <View style={[styles.priorityTag, { borderColor: getPriorityColor(item.priority) }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
              {getPriorityLabel(item.priority)}
            </Text>
          </View>
        </View>

        <Text style={styles.category}>{item.category}  {item.members} members</Text>
        <Text numberOfLines={1} style={styles.lastMessage}>{item.lastMessage}</Text>
        <Text style={styles.timestamp}>{formatTime(item.lastMessageTime)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Group Chats</Text>
        <Text style={styles.headerSubtitle}>{filteredChats.length} available</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.sortContainer}>
        <TouchableOpacity style={styles.sortButton} onPress={() => setShowSortMenu(!showSortMenu)}>
          <Text style={styles.sortButtonText}>Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</Text>
          <Text style={styles.sortIcon}>{showSortMenu ? '' : ''}</Text>
        </TouchableOpacity>

        {showSortMenu && (
          <View style={styles.sortMenu}>
            <TouchableOpacity style={[styles.sortOption, sortBy === 'priority' && styles.sortOptionActive]} onPress={() => handleSortChange('priority')}>
              <Text style={styles.sortOptionText}>By Priority</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sortOption, sortBy === 'unread' && styles.sortOptionActive]} onPress={() => handleSortChange('unread')}>
              <Text style={styles.sortOptionText}>By Unread</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sortOption, sortBy === 'recent' && styles.sortOptionActive]} onPress={() => handleSortChange('recent')}>
              <Text style={styles.sortOptionText}>By Recent</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList data={filteredChats} renderItem={renderChatItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#007AFF', paddingHorizontal: 16, paddingVertical: 16, paddingTop: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  searchInput: { backgroundColor: '#f0f0f0', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, fontSize: 14, color: '#333' },
  sortContainer: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fff' },
  sortButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#f0f0f0', borderRadius: 6 },
  sortButtonText: { fontSize: 13, color: '#333', fontWeight: '500' },
  sortIcon: { fontSize: 12, color: '#666' },
  sortMenu: { marginTop: 8, backgroundColor: '#fff', borderRadius: 6, borderWidth: 1, borderColor: '#e0e0e0', overflow: 'hidden' },
  sortOption: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  sortOptionActive: { backgroundColor: '#f0f0f0' },
  sortOptionText: { fontSize: 13, color: '#333', fontWeight: '500' },
  listContent: { paddingHorizontal: 12, paddingVertical: 8, flexGrow: 1 },
  chatCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginVertical: 6, paddingHorizontal: 12, paddingVertical: 12, alignItems: 'flex-start', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  avatarContainer: { position: 'relative', marginRight: 12 },
  avatarText: { fontSize: 32, width: 56, height: 56, textAlign: 'center', lineHeight: 56, backgroundColor: '#f0f0f0', borderRadius: 28 },
  unreadBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#F44336', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  unreadCount: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  chatContent: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chatName: { fontSize: 16, fontWeight: '600', color: '#333', flex: 1 },
  priorityTag: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8 },
  priorityText: { fontSize: 10, fontWeight: '600' },
  category: { fontSize: 12, color: '#999', marginBottom: 4 },
  lastMessage: { fontSize: 13, color: '#666', marginBottom: 4 },
  timestamp: { fontSize: 11, color: '#bbb' },
});

export default TeacherGroupChatScreen;

