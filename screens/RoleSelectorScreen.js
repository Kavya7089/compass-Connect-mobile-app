import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

const COLLEGE_NAME = 'SHRI VAISHNAV VIDHYAPEETH VISHWAVIDHYALE';

export default function RoleSelectorScreen({ navigation }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Navigate to appropriate dashboard
    if (role === 'student') {
      navigation.replace('StudentDashboard');
    } else if (role === 'teacher') {
      navigation.replace('TeacherDashboard');
    } else if (role === 'admin') {
      navigation.replace('AdminDashboard');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.collegeName}>{COLLEGE_NAME}</Text>
        <Text style={styles.subtitle}>Campus Connect</Text>
        <Text style={styles.tagline}>Choose your role to continue</Text>
      </View>

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleCard, selectedRole === 'student' && styles.roleCardSelected]}
          onPress={() => handleRoleSelect('student')}
          activeOpacity={0.7}
        >
          <Text style={styles.roleIcon}>👨‍🎓</Text>
          <Text style={styles.roleTitle}>Student</Text>
          <Text style={styles.roleDescription}>
            Take tests, view results, ask doubts, access library and notes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleCard, selectedRole === 'teacher' && styles.roleCardSelected]}
          onPress={() => handleRoleSelect('teacher')}
          activeOpacity={0.7}
        >
          <Text style={styles.roleIcon}>👨‍🏫</Text>
          <Text style={styles.roleTitle}>Teacher</Text>
          <Text style={styles.roleDescription}>
            Create tests, upload notes, answer student doubts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleCard, selectedRole === 'admin' && styles.roleCardSelected]}
          onPress={() => handleRoleSelect('admin')}
          activeOpacity={0.7}
        >
          <Text style={styles.roleIcon}>👑</Text>
          <Text style={styles.roleTitle}>Admin</Text>
          <Text style={styles.roleDescription}>
            Manage users, library, fines and system settings
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {COLLEGE_NAME}
        </Text>
        <Text style={styles.footerSubtext}>
          Empowering Education Through Technology
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#94D2BD',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#005F73',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  collegeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#49b2c2ff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  roleContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    
  },
  roleCard: {
    backgroundColor: '#ffffffa6',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#0000005f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#e3f2fd',
  },
  roleCardSelected: {
    borderColor: '#1a237e',
    backgroundColor: '#e3f2fd',
  },
  roleIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005F73',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e3f2fd',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#005F73',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#666',
  },
});

