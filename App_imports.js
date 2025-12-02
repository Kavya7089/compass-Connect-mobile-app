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

const Stack = createNativeStackNavigator();

