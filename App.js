import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { authService } from './services/authService';
import { UserProvider, useUser } from './context/UserContext';

// Splash Screen
import SplashScreen from './screens/SplashScreen';

// Auth screens
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';

// Role Selector Screen
import RoleSelectorScreen from './screens/RoleSelectorScreen';

// Student screens
import StudentDashboard from './screens/student/StudentDashboard';
import TestsScreen from './screens/student/TestsScreen';
import TestResultsScreen from './screens/student/TestResultsScreen';
import DoubtsScreen from './screens/student/DoubtsScreen';
import LibraryScreen from './screens/student/LibraryScreen';
import NotesScreen from './screens/student/NotesScreen';
import CommunityScreen from './screens/student/CommunityScreen';
import EventsScreen from './screens/student/EventsScreen';
import NotificationsScreen from './screens/student/NotificationsScreen';
import GroupChatListScreen from './screens/student/GroupChatListScreen';
import GroupChatDetailScreen from './screens/student/GroupChatDetailScreen';

// Teacher screens
import TeacherDashboard from './screens/teacher/TeacherDashboard';
import CreateTestScreen from './screens/teacher/CreateTestScreen';
import UploadNotesScreen from './screens/teacher/UploadNotesScreen';
import ViewDoubtsScreen from './screens/teacher/ViewDoubtsScreen';
import TeacherCommunityScreen from './screens/teacher/TeacherCommunityScreen';
import EventManagementScreen from './screens/teacher/EventManagementScreen';
import AnnouncementsScreen from './screens/teacher/AnnouncementsScreen';
import TeacherGroupChatScreen from './screens/teacher/TeacherGroupChatScreen';

// Admin screens
import AdminDashboard from './screens/admin/AdminDashboard';
import ApproveUsersScreen from './screens/admin/ApproveUsersScreen';
import LibraryManagementScreen from './screens/admin/LibraryManagementScreen';
import FinesManagementScreen from './screens/admin/FinesManagementScreen';

import WhatsAppAIButton from './components/WhatsAppAIButton';
const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        // Route based on role
        if (currentUser.role === 'student') {
          setInitialRoute('StudentDashboard');
        } else if (currentUser.role === 'teacher') {
          setInitialRoute('TeacherDashboard');
        } else if (currentUser.role === 'admin') {
          setInitialRoute('AdminDashboard');
        } else {
          setInitialRoute('RoleSelector');
        }
      } else {
        setInitialRoute('Login');
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
      setInitialRoute('Login');
    } finally {
      setLoading(false);
    }
  };

  // Show splash screen while loading
  if (showSplash) {
    return (
      <SafeAreaProvider>
        <SplashScreen onComplete={() => setShowSplash(false)} />
      </SafeAreaProvider>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

      return (
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          {/* Auth Screens */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />

          {/* Role Selector */}
          <Stack.Screen name="RoleSelector" component={RoleSelectorScreen} />

          {/* Student Stack */}
          <Stack.Screen
            name="StudentDashboard"
            component={StudentDashboard}
            options={{ title: 'Dashboard' }}
          />
          <Stack.Screen
            name="Tests"
            component={TestsScreen}
            options={{ title: 'Tests' }}
          />
          <Stack.Screen
            name="TestResults"
            component={TestResultsScreen}
            options={{ title: 'Test Results' }}
          />
          <Stack.Screen
            name="Doubts"
            component={DoubtsScreen}
            options={{ title: 'Doubts' }}
          />
          <Stack.Screen
            name="Library"
            component={LibraryScreen}
            options={{ title: 'Library' }}
          />
          <Stack.Screen
            name="Notes"
            component={NotesScreen}
            options={{ title: 'Notes' }}
          />
          <Stack.Screen
            name="Community"
            component={CommunityScreen}
            options={{ title: 'Community Connect' }}
          />
          <Stack.Screen
            name="Events"
            component={EventsScreen}
            options={{ title: 'Events' }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{ title: 'Notifications' }}
          />
          <Stack.Screen
            name="GroupChatList"
            component={GroupChatListScreen}
            options={{ title: 'Group Chats' }}
          />
          <Stack.Screen
            name="GroupChatDetail"
            component={GroupChatDetailScreen}
            options={{ title: 'Chat' }}
          />

          {/* Teacher Stack */}
          <Stack.Screen
            name="TeacherDashboard"
            component={TeacherDashboard}
            options={{ title: 'Dashboard' }}
          />
          <Stack.Screen
            name="CreateTest"
            component={CreateTestScreen}
            options={{ title: 'Create Test' }}
          />
          <Stack.Screen
            name="UploadNotes"
            component={UploadNotesScreen}
            options={{ title: 'Upload Notes' }}
          />
          <Stack.Screen
            name="ViewDoubts"
            component={ViewDoubtsScreen}
            options={{ title: 'View Doubts' }}
          />
          <Stack.Screen
            name="TeacherCommunity"
            component={TeacherCommunityScreen}
            options={{ title: 'Community Connect' }}
          />
          <Stack.Screen
            name="EventManagement"
            component={EventManagementScreen}
            options={{ title: 'Event Management' }}
          />
          <Stack.Screen
            name="Announcements"
            component={AnnouncementsScreen}
            options={{ title: 'Announcements' }}
          />
          <Stack.Screen
            name="TeacherGroupChat"
            component={TeacherGroupChatScreen}
            options={{ title: 'Group Chats' }}
          />

          {/* Admin Stack */}
          <Stack.Screen
            name="AdminDashboard"
            component={AdminDashboard}
            options={{ title: 'Dashboard' }}
          />
          <Stack.Screen
            name="ApproveUsers"
            component={ApproveUsersScreen}
            options={{ title: 'Approve Users' }}
          />
          <Stack.Screen
            name="LibraryManagement"
            component={LibraryManagementScreen}
            options={{ title: 'Library Management' }}
          />
          <Stack.Screen
            name="FinesManagement"
            component={FinesManagementScreen}
            options={{ title: 'Fines Management' }}
          />
        </Stack.Navigator>
              </NavigationContainer>
          <WhatsAppAIButton />
        </View>
      </SafeAreaProvider>
    );
}

export default function App() {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});


