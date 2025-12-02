import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const COLLEGE_NAME = 'Shri Vaishnav Vidhyapeeth Vishwavidhyale';

export default function TeacherDashboard({ navigation }) {

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.collegeName}>{COLLEGE_NAME}</Text>
          <Text style={styles.greeting}>Teacher Portal </Text>
        </View>
        <View style={styles.headerDecoration} />
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Teacher Tools</Text>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('CreateTest')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            
              <Text style={styles.menuIcon}>📝</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Create Test</Text>
              <Text style={styles.menuSubtext}>Create new mock tests</Text>
            </View>
            <Text style={styles.menuArrow}></Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('UploadNotes')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>📋</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Upload Notes</Text>
              <Text style={styles.menuSubtext}>Share study materials</Text>
            </View>
            <Text style={styles.menuArrow}></Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ViewDoubts')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
             <Text style={styles.menuIcon}>🤷</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>View Doubts</Text>
              <Text style={styles.menuSubtext}>Answer student questions</Text>
            </View>
            <Text style={styles.menuArrow}></Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('TeacherCommunity')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>🌐</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Community Connect</Text>
              <Text style={styles.menuSubtext}>Connect with colleagues</Text>
            </View>
            <Text style={styles.menuArrow}></Text>
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
            <Text style={styles.menuArrow}></Text>
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
            <Text style={styles.menuArrow}></Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('TeacherGroupChat')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>🗣️</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Group Chats</Text>
              <Text style={styles.menuSubtext}>Connect with interest groups</Text>
            </View>
            <Text style={styles.menuArrow}></Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          const { authService } = require('../../services/authService');
          await authService.signOut();
          navigation.replace('Login');
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
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
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: '#0a679cff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  collegeName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#f5f5f5',
    marginBottom: 5,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerDecoration: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    right: -30,
    top: -20,
  },
  menuContainer: {
    paddingHorizontal: 15,
    paddingTop: 25,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a679cff',
    marginBottom: 15,
    paddingLeft: 5,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 28,
    marginRight: 15,
    width: 40,
    textAlign: 'center',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0a679cff',
    marginBottom: 3,
  },
  menuSubtext: {
    fontSize: 12,
    color: '#666',
  },
  menuArrow: {
    fontSize: 18,
    color: '#0a679cff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    marginHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
