import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { migration } from '../services/api';

const countries = ['USA', 'UK', 'Canada', 'Australia'];

export default function MigrationScreen() {
  const [selectedCountry, setSelectedCountry] = useState('USA');
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState<any>(null);

  useEffect(() => {
    fetchGuidance();
  }, [selectedCountry]);

  const fetchGuidance = async () => {
    setLoading(true);
    try {
      const data = await migration.getGuidance(selectedCountry);
      setGuidance(data);
    } catch (error) {
      console.error('Failed to fetch guidance:', error);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Migration Pathway</Text>
        <Text style={styles.subtitle}>AI-powered guidance for your journey</Text>
      </View>

      <View style={styles.countrySelector}>
        {countries.map((country) => (
          <TouchableOpacity
            key={country}
            style={[styles.countryBtn, selectedCountry === country && styles.countryBtnActive]}
            onPress={() => setSelectedCountry(country)}
          >
            <Text style={[styles.countryText, selectedCountry === country && styles.countryTextActive]}>
              {country}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#5568FE" style={styles.loader} />
      ) : guidance ? (
        <View style={styles.content}>
          <View style={styles.readinessCard}>
            <Text style={styles.readinessLabel}>Readiness Score</Text>
            <Text style={styles.readinessValue}>{guidance.readiness?.score || 0}%</Text>
          </View>

          <Text style={styles.sectionTitle}>Migration Steps</Text>
          {guidance.pathways?.[0]?.steps.map((step: any, index: number) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.order}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.name}</Text>
                <Text style={styles.stepDuration}>Duration: {step.duration}</Text>
                <Text style={styles.stepCost}>Est. Cost: ${step.cost}</Text>
              </View>
            </View>
          ))}

          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Estimated Cost</Text>
            <Text style={styles.totalValue}>${guidance.pathways?.[0]?.totalCost || 0}</Text>
            <Text style={styles.totalDuration}>
              Total Duration: {guidance.pathways?.[0]?.totalDuration || 'N/A'}
            </Text>
          </View>

          {guidance.recommendations?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              {guidance.recommendations.map((rec: string, index: number) => (
                <View key={index} style={styles.recCard}>
                  <Text style={styles.recText}>{rec}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Select a country to view migration pathway</Text>
        </View>
      )}
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
  countrySelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  countryBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  countryBtnActive: {
    backgroundColor: '#5568FE',
    borderColor: '#5568FE',
  },
  countryText: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  countryTextActive: {
    color: '#fff',
  },
  loader: {
    marginTop: 40,
  },
  content: {
    padding: 16,
  },
  readinessCard: {
    backgroundColor: '#5568FE',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  readinessLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  readinessValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#5568FE',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDuration: {
    fontSize: 14,
    color: '#64748b',
  },
  stepCost: {
    fontSize: 14,
    color: '#5568FE',
    fontWeight: '500',
  },
  totalCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5568FE',
    marginTop: 8,
  },
  totalDuration: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  recCard: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  recText: {
    color: '#856404',
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
  },
});
