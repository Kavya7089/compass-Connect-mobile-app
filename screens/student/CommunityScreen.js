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
  Image,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { communityService } from '../../services/communityService';
import { authService } from '../../services/authService';
import { useUser } from '../../context/UserContext';
import { UserHeader } from '../../components/UserHeader';

export default function CommunityScreen({ navigation }) {
  const { setUser } = useUser();
  const [activeTab, setActiveTab] = useState('feed'); // feed, profile, connections
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState('general');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

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

    const { error } = await communityService.createPost(newPost, postType, {
      image: selectedImage,
      certificate: selectedCertificate,
    });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Post created!');
      setNewPost('');
      setSelectedImage(null);
      setSelectedCertificate(null);
      loadData();
    }
  };

  const pickImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
      });
      if (result.type === 'success') {
        setSelectedImage(result);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const pickCertificate = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
      });
      if (result.type === 'success') {
        setSelectedCertificate(result);
      }
    } catch (error) {
      console.error('Error picking certificate:', error);
    }
  };

  const handleLike = async (postId) => {
    await communityService.likePost(postId);
    loadData();
  };

  const handleLogout = async () => {
    setUser(null);
    await authService.signOut();
    navigation.replace('Login');
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
      <UserHeader 
        title="Community Connect" 
        onLogout={handleLogout}
      />

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
              placeholder="Share your achievement, experience, or reward..."
              value={newPost}
              onChangeText={setNewPost}
              multiline
            />

            {/* Selected Image Preview */}
            {selectedImage && (
              <View style={styles.previewContainer}>
                <Text style={styles.previewLabel}>📸 Image Selected</Text>
                <Text style={styles.previewText}>{selectedImage.name}</Text>
                <TouchableOpacity
                  onPress={() => setSelectedImage(null)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Selected Certificate Preview */}
            {selectedCertificate && (
              <View style={styles.previewContainer}>
                <Text style={styles.previewLabel}>🏆 Certificate Selected</Text>
                <Text style={styles.previewText}>{selectedCertificate.name}</Text>
                <TouchableOpacity
                  onPress={() => setSelectedCertificate(null)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* File Upload Buttons */}
            <View style={styles.uploadButtonsRow}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickImage}
              >
                <Text style={styles.uploadButtonText}>📷 Add Image</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickCertificate}
              >
                <Text style={styles.uploadButtonText}>📄 Add Certificate</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.postTypeContainer}>
              <TouchableOpacity
                style={[styles.postTypeButton, postType === 'achievement' && styles.postTypeActive]}
                onPress={() => setPostType('achievement')}
              >
                <Text style={styles.postTypeText}>Achievement</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.postTypeButton, postType === 'experience' && styles.postTypeActive]}
                onPress={() => setPostType('experience')}
              >
                <Text style={styles.postTypeText}>Experience</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.postTypeButton, postType === 'reward' && styles.postTypeActive]}
                onPress={() => setPostType('reward')}
              >
                <Text style={styles.postTypeText}>Reward</Text>
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
          {/* Profile Header Card */}
          <View style={styles.profileHeaderCard}>
            {/* Profile Photo */}
            <View style={styles.photoContainer}>
              <Image
                source={{
                  uri: profile.userId?.profilePhoto || 'https://via.placeholder.com/120',
                }}
                style={styles.profilePhoto}
              />
              <TouchableOpacity style={styles.editPhotoButton}>
                <Text style={styles.editPhotoText}>📷</Text>
              </TouchableOpacity>
            </View>

            {/* Profile Basic Info */}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {profile.userId?.name || 'Your Profile'}
              </Text>
              <Text style={styles.profileRole}>
                {profile.userId?.role === 'student' ? '👨‍🎓 Student' : profile.userId?.role}
              </Text>
              <Text style={styles.profileDepartment}>
                📚 {profile.userId?.department || 'Department Not Set'}
              </Text>
            </View>
          </View>

          {/* Contact & Social Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Contact & Links</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📧 Email</Text>
              <Text style={styles.infoValue}>{profile.userId?.email || 'N/A'}</Text>
            </View>

            {profile.userId?.linkedIn && (
              <TouchableOpacity style={styles.infoRow}>
                <Text style={styles.infoLabel}>💼 LinkedIn</Text>
                <Text style={styles.infoValue}>{profile.userId?.linkedIn}</Text>
              </TouchableOpacity>
            )}

            {profile.userId?.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📱 Phone</Text>
                <Text style={styles.infoValue}>{profile.userId?.phone}</Text>
              </View>
            )}

            {profile.bio && (
              <View style={styles.bioSection}>
                <Text style={styles.bioLabel}>Bio</Text>
                <Text style={styles.bioText}>{profile.bio}</Text>
              </View>
            )}
          </View>

          {/* Achievements Card */}
          {profile.achievements && profile.achievements.length > 0 && (
            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Achievements</Text>
              {profile.achievements.map((ach, idx) => (
                <View key={idx} style={styles.achievementCard}>
                  <View style={styles.achievementBadge}>
                    <Text style={styles.achievementIcon}>🏆</Text>
                  </View>
                  <View style={styles.achievementDetails}>
                    <Text style={styles.achievementTitle}>{ach.title}</Text>
                    {ach.description && (
                      <Text style={styles.achievementDesc}>{ach.description}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Stats Card */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.achievements?.length || 0}</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.totalPosts || 0}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.connections || 0}</Text>
              <Text style={styles.statLabel}>Connections</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9ec1a7ff',
    marginTop: 25,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff84fff4a',
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
    borderBottomColor: '#0b7736ff',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  tabTextActive: {
    color: '#187f4aff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  createPostContainer: {
    backgroundColor: '#ffffff81',
    padding: 15,
    marginBottom: 10,
  },
  postInput: {
    backgroundColor: '#f5f5f57f',
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  previewContainer: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 5,
  },
  previewText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: '#ff4757',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  uploadButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
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
    backgroundColor: '#1e512bff',
  },
  postTypeText: {
    fontSize: 12,
    color: '#cdc5c5ff',
  },
  postButton: {
    backgroundColor: '#096c2cff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postCard: {
    backgroundColor: '#ffffff9a',
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
  profileHeaderCard: {
    backgroundColor: '#ffffff85',
    padding: 20,
    margin: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#c0b5b595',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#0e4c24ff',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  editPhotoText: {
    fontSize: 20,
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  profileRole: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  profileDepartment: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#ffffffa6',
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#ebe9e97b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    paddingBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  bioSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  achievementBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff3e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementIcon: {
    fontSize: 24,
  },
  achievementDetails: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 13,
    color: '#666',
  },
  statsCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 30,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    borderRadius: 10,
  },
  profileBio: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

