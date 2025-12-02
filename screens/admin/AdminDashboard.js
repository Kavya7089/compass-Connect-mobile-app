import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const COLLEGE_NAME = 'Shri Vaishnav Vidhyapeeth Vishwavidhyale';

export default function AdminDashboard({ navigation }) {

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.collegeName}>{COLLEGE_NAME}</Text>
          <Text style={styles.greeting}>Admin Portal 👑</Text>
        </View>
        <View style={styles.headerDecoration} />
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Admin Controls</Text>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ApproveUsers')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>👥</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Approve Users</Text>
              <Text style={styles.menuSubtext}>Manage user approvals</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('LibraryManagement')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>📚</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Library Management</Text>
              <Text style={styles.menuSubtext}>Manage books & requests</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('FinesManagement')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>💰</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Manage Fines</Text>
              <Text style={styles.menuSubtext}>Handle overdue charges</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('EventManagement')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>📅</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Event Management</Text>
              <Text style={styles.menuSubtext}>Create and manage events</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Announcements')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>📢</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Announcements</Text>
              <Text style={styles.menuSubtext}>Post notices and announcements</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.replace('RoleSelector')}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Change Role</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9fab45ff',
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
    backgroundColor: '#ff9500',
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
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 8,
    textAlign: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  menuContainer: {
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginLeft: 5,
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9500',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  logoutButton: {
    margin: 20,
    marginTop: 10,
    padding: 16,
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#ff3b30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

