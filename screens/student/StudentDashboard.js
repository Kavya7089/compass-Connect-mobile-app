import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { testService } from '../../services/testService';
import { authService } from '../../services/authService';
import { useUser } from '../../context/UserContext';
import { UserHeader } from '../../components/UserHeader';

const COLLEGE_NAME = 'Shri Vaishnav Vidhyapeeth Vishwavidhyale';

export default function StudentDashboard({ navigation }) {
  const { setUser } = useUser();
  const [averageScore, setAverageScore] = useState(0);
  const [pendingTests, setPendingTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load test results for average score
      const { data: results, error: resultsError } = await testService.getAllTestResults();
      if (!resultsError && results && results.length > 0) {
        const avg = results.reduce((sum, result) => sum + (result.percentage || 0), 0) / results.length;
        setAverageScore(avg);
      } else {
        setAverageScore(0);
      }

      // Load pending tests
      const { data: tests, error: testsError } = await testService.getAllTests();
      if (!testsError && tests) {
        // Filter active tests and format with dates
        const pending = tests
          .filter(test => test.isActive)
          .map(test => ({
            ...test,
            formattedDate: new Date(test.startDate || test.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
          }));
        setPendingTests(pending);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setAverageScore(0);
    } finally {
      setLoading(false);
    }
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <UserHeader 
        title="Student Dashboard" 
        onLogout={handleLogout}
        showNotifications={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>📊</Text>
          </View>
          <Text style={styles.statValue}>{averageScore.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Average Score</Text>
          <View style={styles.statProgressBar}>
            <View
              style={[
                styles.statProgressFill,
                { width: `${Math.min(averageScore || 0, 100)}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Pending Tests Section */}
      {pendingTests.length > 0 && (
        <View style={styles.pendingTestsContainer}>
          <Text style={styles.sectionTitle}>Tests Pending</Text>
          {pendingTests.slice(0, 3).map((test) => (
            <TouchableOpacity
              key={test._id}
              style={styles.pendingTestCard}
              onPress={() => navigation.navigate('Tests')}
            >
              <View style={styles.pendingTestContent}>
                <Text style={styles.pendingTestTitle}>{test.title}</Text>
                <Text style={styles.pendingTestSubject}>{test.subject}</Text>
                <View style={styles.pendingTestFooter}>
                  <Text style={styles.pendingTestDate}>📅 {test.formattedDate}</Text>
                  <Text style={styles.pendingTestMarks}>{test.totalMarks} marks</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          {pendingTests.length > 3 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Tests')}
            >
              <Text style={styles.viewAllText}>View All Tests ({pendingTests.length})</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemPrimary]}
          onPress={() => navigation.navigate('Tests')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>📝</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Take Tests</Text>
              <Text style={styles.menuSubtext}>Practice with mock tests</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemSuccess]}
          onPress={() => navigation.navigate('TestResults')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>📊</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>My Results</Text>
              <Text style={styles.menuSubtext}>View your performance</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemWarning]}
          onPress={() => navigation.navigate('Doubts')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>❓</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Ask Doubts</Text>
              <Text style={styles.menuSubtext}>Get help from teachers</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemInfo]}
          onPress={() => navigation.navigate('Library')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>📚</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Library</Text>
              <Text style={styles.menuSubtext}>Request books</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemSecondary]}
          onPress={() => navigation.navigate('Notes')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>📄</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Study Notes</Text>
              <Text style={styles.menuSubtext}>Access study materials</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemCommunity]}
          onPress={() => navigation.navigate('Community')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>🌐</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Community Connect</Text>
              <Text style={styles.menuSubtext}>Connect with peers</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemEvents]}
          onPress={() => navigation.navigate('Events')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>📅</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Events</Text>
              <Text style={styles.menuSubtext}>Register for events</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemGroupChat]}
          onPress={() => navigation.navigate('GroupChatList')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>🗣️</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Group Chats</Text>
              <Text style={styles.menuSubtext}>Chat with interest groups</Text>
            </View>
            <Text style={styles.menuArrow}></Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemNotifications]}
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>🔔</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Notifications</Text>
              <Text style={styles.menuSubtext}>View alerts & notices</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={[styles.footerButton, styles.logoutButton]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    zIndex: 1,
  },
  headerDecoration: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  collegeName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.57)',
    marginBottom: 8,
    textAlign: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statsContainer: {
    padding: 20,
    marginTop: -15,
  },
  statCard: {
    backgroundColor: '#ffffffa8',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#007bff81',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e3f2fd',
  },
  statIconContainer: {
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 40,
  },
  statValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
  },
  statProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e3f2fd8b',
    borderRadius: 4,
    marginTop: 15,
    overflow: 'hidden',
  },
  statProgressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  pendingTestsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginLeft: 5,
  },
  pendingTestCard: {
    backgroundColor: '#ffffff8a',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#cac1c184',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9500',
  },
  pendingTestContent: {
    flex: 1,
  },
  pendingTestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  pendingTestSubject: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  pendingTestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pendingTestDate: {
    fontSize: 12,
    color: '#ff9500',
    fontWeight: '600',
  },
  pendingTestMarks: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  viewAllButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAllText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  menuContainer: {
    padding: 20,
    paddingTop: 10,
  },
  menuItem: {
    backgroundColor: '#ffffff9d',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#c0b5b595',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  menuItemPrimary: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  menuItemSuccess: {
    borderLeftWidth: 4,
    borderLeftColor: '#34c759',
  },
  menuItemWarning: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff9500',
  },
  menuItemInfo: {
    borderLeftWidth: 4,
    borderLeftColor: '#5ac8fa',
  },
  menuItemSecondary: {
    borderLeftWidth: 4,
    borderLeftColor: '#af52de',
  },
  menuItemCommunity: {
    borderLeftWidth: 4,
    borderLeftColor: '#34c759',
  },
  menuItemEvents: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff9500',
  },
  menuItemNotifications: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff3b30',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  menuIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  menuSubtext: {
    fontSize: 13,
    color: '#666',
  },
  menuArrow: {
    fontSize: 24,
    color: '#999',
    fontWeight: '300',
  },
  footerButtons: {
    flexDirection: 'row',
    margin: 20,
    marginTop: 10,
    gap: 10,
  },
  footerButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButton: {
    backgroundColor: '#223e18ff',
    shadowColor: '#223e18ff',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

