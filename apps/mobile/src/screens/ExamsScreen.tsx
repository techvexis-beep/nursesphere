import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { exams } from '../services/api';

export default function ExamsScreen() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await exams.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
    setLoading(false);
  };

  const examTypes = [
    { id: 'nclex', name: 'NCLEX-RN', icon: '📝', questions: 265, time: 360 },
    { id: 'ielts', name: 'IELTS', icon: '📖', questions: 40, time: 180 },
    { id: 'oet', name: 'OET', icon: '🩺', questions: 42, time: 180 },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Practice Exams</Text>
        <Text style={styles.subtitle}>Prepare for your certifications</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#5568FE" style={styles.loader} />
      ) : stats ? (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total || 0}</Text>
            <Text style={styles.statLabel}>Attempts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.averageScore || 0}%</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.passRate || 0}%</Text>
            <Text style={styles.statLabel}>Pass Rate</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Exam Type</Text>
        
        {examTypes.map((exam) => (
          <TouchableOpacity key={exam.id} style={styles.examCard}>
            <Text style={styles.examIcon}>{exam.icon}</Text>
            <View style={styles.examInfo}>
              <Text style={styles.examName}>{exam.name}</Text>
              <Text style={styles.examDetails}>{exam.questions} questions • {exam.time} min</Text>
            </View>
            <TouchableOpacity style={styles.startBtn}>
              <Text style={styles.startBtnText}>Start</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.practiceBtn}>
          <Text style={styles.practiceBtnText}>Take Diagnostic Test</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Attempts</Text>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No exam attempts yet</Text>
          <Text style={styles.emptySubtext}>Start practicing to see your history</Text>
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
    backgroundColor: '#5568FE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  loader: {
    marginTop: 40,
  },
  statsRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5568FE',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  examCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  examIcon: {
    fontSize: 32,
  },
  examInfo: {
    flex: 1,
  },
  examName: {
    fontSize: 16,
    fontWeight: '600',
  },
  examDetails: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  startBtn: {
    backgroundColor: '#5568FE',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  startBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  practiceBtn: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5568FE',
    marginTop: 8,
  },
  practiceBtnText: {
    color: '#5568FE',
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
});
