import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const features = [
  { id: 'migration', title: 'Migration', icon: '🌍', desc: 'Track your journey abroad' },
  { id: 'exams', title: 'Exams', icon: '📝', desc: 'NCLEX, IELTS, OET prep' },
  { id: 'jobs', title: 'Jobs', icon: '💼', desc: 'Find nursing opportunities' },
  { id: 'marketplace', title: 'Marketplace', icon: '🛒', desc: 'Services & resources' },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>NurseSphere</Text>
        <Text style={styles.tagline}>Your Global Nursing Career Platform</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Start Your Nursing Journey</Text>
        <Text style={styles.heroSubtitle}>AI-powered guidance for nurses worldwide</Text>
        
        <View style={styles.authButtons}>
          <TouchableOpacity 
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Login' as never)}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.registerBtn}
            onPress={() => navigation.navigate('Register' as never)}
          >
            <Text style={styles.registerBtnText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.features}>
        <Text style={styles.sectionTitle}>Explore</Text>
        <View style={styles.featureGrid}>
          {features.map((feature) => (
            <TouchableOpacity 
              key={feature.id}
              style={styles.featureCard}
              onPress={() => {
                if (feature.id === 'migration') navigation.navigate('Migration' as never);
                else if (feature.id === 'exams') navigation.navigate('Exams' as never);
                else if (feature.id === 'jobs') navigation.navigate('Jobs' as never);
                else if (feature.id === 'marketplace') navigation.navigate('Marketplace' as never);
              }}
            >
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>10K+</Text>
          <Text style={styles.statLabel}>Nurses</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>50+</Text>
          <Text style={styles.statLabel}>Countries</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>500+</Text>
          <Text style={styles.statLabel}>Jobs</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#5568FE',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  hero: {
    padding: 20,
    backgroundColor: '#5568FE',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
  },
  authButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  loginBtn: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#5568FE',
    fontWeight: '600',
    fontSize: 16,
  },
  registerBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  features: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '47%',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: '#64748b',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#f1f5f9',
    margin: 20,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5568FE',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
});
