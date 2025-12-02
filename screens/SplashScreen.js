import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text, ActivityIndicator, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen({ onComplete }) {
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the rotation continuously
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Show splash screen for 2 seconds then proceed
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#005F73', '#0A9396', '#94D2BD']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* CLG Logo with Circular Loader */}
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.circularLoader, { transform: [{ rotate: rotation }] }]}>
            <View style={styles.loaderCircle} />
          </Animated.View>
          <Image
            source={require('../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* App Title */}
        <Text style={styles.title}>Campus Connect</Text>
        <Text style={styles.subtitle}>Campus Learning Gateway</Text>

        {/* Loading Indicator */}
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Initializing...</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Empowering Education</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a237e',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circularLoader: {
    position: 'absolute',
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderRightColor: '#90caf9',
  },
  logo: {
    width: 120,
    height: 120,
    zIndex: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#e3f2fd',
    marginBottom: 40,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  loaderContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#e3f2fd',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    fontSize: 12,
    color: '#90caf9',
    fontWeight: '300',
    letterSpacing: 1,
  },
});
