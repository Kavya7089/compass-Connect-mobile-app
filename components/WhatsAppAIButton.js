import React from 'react';
import { TouchableOpacity, StyleSheet, Linking, Alert, Text } from 'react-native';

export default function WhatsAppAIButton() {
  const handleWhatsAppPress = async () => {
    const url = 'https://wa.me/15551572631';
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Linking.openURL(url).catch(() => {
          Alert.alert('Error', 'Could not open WhatsApp link');
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open WhatsApp');
    }
  };

  return (
    <TouchableOpacity
      style={styles.whatsappButton}
      onPress={handleWhatsAppPress}
      activeOpacity={0.8}
    >
      <Text style={styles.whatsappIcon}>
        📞
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  whatsappButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 999,
  },
  whatsappIcon: {
    fontSize: 32,
  },
});

