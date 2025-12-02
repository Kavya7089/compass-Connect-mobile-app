import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { communityService } from '../../services/communityService';

export default function TeacherCommunityScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState('general');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'feed') {
        const { data, error } = await communityService.getPosts();
        if (!error && data) {
          setPosts(data);
        }
      } else if (activeTab === 'profile') {
        const { data, error } = await communityService.getProfile();
        if (!error && data) {
          setProfile(data);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) {
      Alert.alert('Error', 'Please enter some content');
      return;
    }

    const { error } = await communityService.createPost(newPost, postType);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Post created!');
      setNewPost('');
      loadData();
    }
  };

  const handleLike = async (postId) => {
    await communityService.likePost(postId);
    loadData();
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community Connect</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'feed' && styles.tabActive]}
          onPress={() => setActiveTab('feed')}
        >
          <Text style={[styles.tabText, activeTab === 'feed' && styles.tabTextActive]}>
            Feed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.tabActive]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'feed' && (
        <ScrollView style={styles.content}>
          <View style={styles.createPostContainer}>
            <TextInput
              style={styles.postInput}
              placeholder="Share your experience or achievement..."
              value={newPost}
              onChangeText={setNewPost}
              multiline
            />
            <View style={styles.postTypeContainer}>
              <TouchableOpacity
                style={[styles.postTypeButton, postType === 'experience' && styles.postTypeActive]}
                onPress={() => setPostType('experience')}
              >
                <Text style={styles.postTypeText}>Experience</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.postTypeButton, postType === 'achievement' && styles.postTypeActive]}
                onPress={() => setPostType('achievement')}
              >
                <Text style={styles.postTypeText}>Achievement</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.postButton} onPress={handleCreatePost}>
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={posts}
            keyExtractor={(item) => item._id || item.id}
            renderItem={({ item }) => (
              <View style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Text style={styles.postAuthor}>
                    {item.author?.name || item.userId?.name || 'Unknown'}
                  </Text>
                  <Text style={styles.postType}>{item.type}</Text>
                </View>
                <Text style={styles.postContent}>{item.content}</Text>
                <View style={styles.postFooter}>
                  <TouchableOpacity
                    style={styles.likeButton}
                    onPress={() => handleLike(item._id || item.id)}
                  >
                    <Text style={styles.likeText}>
                      👍 {item.likes?.length || 0}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.postDate}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No posts yet. Be the first to share!</Text>
            }
          />
        </ScrollView>
      )}

      {activeTab === 'profile' && profile && (
        <ScrollView style={styles.content}>
          <View style={styles.profileCard}>
            <Text style={styles.profileName}>
              {profile.userId?.name || 'Your Profile'}
            </Text>
            <Text style={styles.profileDepartment}>
              {profile.userId?.department || 'No department'}
            </Text>
            {profile.bio && <Text style={styles.profileBio}>{profile.bio}</Text>}
          </View>
        </ScrollView>
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
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#125eafff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffffb0',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  createPostContainer: {
    backgroundColor: '#ffffffae',
    padding: 15,
    marginBottom: 10,
  },
  postInput: {
    backgroundColor: '#8fa7b5ff',
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  postTypeContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10,
  },
  postTypeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  postTypeActive: {
    backgroundColor: '#007AFF',
  },
  postTypeText: {
    fontSize: 12,
    color: '#666',
  },
  postButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postCard: {
    backgroundColor: '#ffffffa2',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  postType: {
    fontSize: 12,
    color: '#007AFF',
    textTransform: 'capitalize',
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeButton: {
    padding: 5,
  },
  likeText: {
    fontSize: 14,
    color: '#666',
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    borderRadius: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileDepartment: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  profileBio: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
  },
});

