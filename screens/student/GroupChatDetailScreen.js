import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { mockMessages, mockGroupChats } from '../../data/mockGroupChatData';

const GroupChatDetailScreen = ({ route, navigation }) => {
  const { chat } = route.params;
  const [messages, setMessages] = useState(mockMessages[chat.id] || []);
  const [inputText, setInputText] = useState('');
  const [editingPriority, setEditingPriority] = useState(chat.priority);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Auto scroll to bottom when messages change
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim().length === 0) return;

    const newMessage = {
      id: String(messages.length + 1),
      user: 'You',
      avatar: '',
      message: inputText.trim(),
      timestamp: new Date(),
      isYou: true,
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const handlePriorityChange = (newPriority) => {
    setEditingPriority(newPriority);
    Alert.alert('Success', `Priority changed to ${['Low', 'Medium', 'High'][newPriority - 1]}`);
  };

  const formatMessageTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  const renderMessageItem = ({ item }) => (
    <View style={[styles.messageContainer, item.isYou && styles.messageContainerYou]}>
      {!item.isYou && <Text style={styles.messageAvatar}>{item.avatar}</Text>}

      <View style={[styles.messageBubble, item.isYou && styles.messageBubbleYou]}>
        <Text style={styles.messageUser}>{item.user}</Text>
        <Text style={[styles.messageText, item.isYou && styles.messageTextYou]}>
          {item.message}
        </Text>
        <Text style={styles.messageTime}>{formatMessageTime(item.timestamp)}</Text>
      </View>

      {item.isYou && <Text style={styles.messageAvatar}>{item.avatar}</Text>}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}> Back</Text>
      </TouchableOpacity>

      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{chat.avatar} {chat.name}</Text>
        <Text style={styles.headerSubtitle}>{chat.members} members  {chat.category}</Text>
      </View>

      <TouchableOpacity
        style={[styles.priorityButton, { borderColor: getPriorityColor(editingPriority) }]}
        onPress={() => Alert.alert(
          'Set Priority',
          'Choose chat priority:',
          [
            { text: 'Low', onPress: () => handlePriorityChange(1) },
            { text: 'Medium', onPress: () => handlePriorityChange(2) },
            { text: 'High', onPress: () => handlePriorityChange(3) },
            { text: 'Cancel', style: 'cancel' },
          ]
        )}
      >
        <Text style={[styles.priorityButtonText, { color: getPriorityColor(editingPriority) }]}>
          {getPriorityLabel(editingPriority)}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      {renderHeader()}

      <View style={styles.description}>
        <Text style={styles.descriptionText}>{chat.description}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxHeight={100}
        />
        <TouchableOpacity
          style={[styles.sendButton, inputText.trim().length === 0 && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={inputText.trim().length === 0}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  priorityButton: {
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priorityButtonText: {
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  descriptionText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  messagesContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-end',
  },
  messageContainerYou: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    fontSize: 24,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderBottomLeftRadius: 2,
  },
  messageBubbleYou: {
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 2,
  },
  messageUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  messageTextYou: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 14,
    maxHeight: 100,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default GroupChatDetailScreen;

