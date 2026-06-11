import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { migration, exams } from '../services/api';

const quickActions = [
  { id: 'migration', title: 'Migration', icon: '🌍', route: 'Migration' },
  { id: 'exams', title: 'Exams', icon: '📝', route: 'Exams' },
  { id: 'jobs', title: 'Jobs', icon: '💼', route: 'Jobs' },
  { id: 'profile', title: 'Profile', icon: '👤', route: 'Profile' },
];

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    readiness: 45,
    exams: 12,
    hours: 320,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const [migrationData, examData] = await Promise.all([
        migration.getProgress().catch(() => null),
        exams.getStats().catch(() => null),
      ]);
      
      if (migrationData) {
        setStats(prev => ({ ...prev, readiness: migrationData.readinessScore || 45 }));
      }
      if (examData) {
        setStats(prev => ({ ...prev, exams: examData.total || 12 }));
      }
    } catch (error) {
      console.error('Failed to refresh:', error);
    }
    setRefreshing(false);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back!</Text>
        <Text style={styles.subtitle}>Track your nursing journey</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.readiness}%</Text>
          <Text style={styles.statLabel}>Readiness</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.exams}</Text>
          <Text style={styles.statLabel}>Exams Taken</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.hours}</Text>
          <Text style={styles.statLabel}>Clinical Hours</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => navigation.navigate(action.route as never)}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityIcon}>✓</Text>
          <View>
            <Text style={styles.activityTitle}>NCLEX Status Updated</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.activityIcon}>📝</Text>
          <View>
            <Text style={styles.activityTitle}>Clinical Log Submitted</Text>
            <Text style={styles.activityTime}>Yesterday</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#5568FE',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5568FE',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '47%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  activityIcon: {
    fontSize: 24,
    width: 40,
    height: 40,
    backgroundColor: '#d1fae5',
    borderRadius: 20,
    textAlign: 'center',
    lineHeight: 40,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
});
