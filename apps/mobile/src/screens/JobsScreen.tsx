import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { jobs } from '../services/api';

export default function JobsScreen() {
  const [loading, setLoading] = useState(false);
  const [jobsList, setJobsList] = useState<any[]>([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await jobs.getAll();
      setJobsList(data.jobs || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
    setLoading(false);
  };

  const mockJobs = [
    { id: '1', title: 'Registered Nurse - ICU', company: 'Mount Sinai Hospital', location: 'New York, NY', salary: '$85,000 - $120,000', type: 'Full-time' },
    { id: '2', title: 'Staff Nurse - Emergency', company: 'Johns Hopkins', location: 'Baltimore, MD', salary: '$75,000 - $100,000', type: 'Full-time' },
    { id: '3', title: 'Travel Nurse - OR', company: 'Cross Country Nurses', location: 'Remote', salary: '$2,500/week', type: 'Contract' },
    { id: '4', title: 'RN - Labor & Delivery', company: 'Mayo Clinic', location: 'Rochester, MN', salary: '$70,000 - $95,000', type: 'Full-time' },
  ];

  const displayJobs = jobsList.length > 0 ? jobsList : mockJobs;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Job Board</Text>
        <Text style={styles.subtitle}>Find nursing opportunities</Text>
      </View>

      <View style={styles.filters}>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Specialty</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Type</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#5568FE" style={styles.loader} />
      ) : (
        <View style={styles.jobsList}>
          {displayJobs.map((job) => (
            <TouchableOpacity key={job.id} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={styles.jobTag}>
                  <Text style={styles.jobTagText}>{job.type}</Text>
                </View>
              </View>
              <Text style={styles.jobCompany}>{job.company}</Text>
              <View style={styles.jobDetails}>
                <Text style={styles.jobLocation}>📍 {job.location}</Text>
                <Text style={styles.jobSalary}>💰 {job.salary}</Text>
              </View>
              <TouchableOpacity style={styles.applyBtn}>
                <Text style={styles.applyBtnText}>Apply Now</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
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
  filters: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  filterBtn: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterText: {
    color: '#64748b',
    fontWeight: '500',
  },
  loader: {
    marginTop: 40,
  },
  jobsList: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  jobTag: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  jobTagText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '500',
  },
  jobCompany: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  jobDetails: {
    marginBottom: 12,
  },
  jobLocation: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  jobSalary: {
    fontSize: 14,
    color: '#5568FE',
    fontWeight: '600',
  },
  applyBtn: {
    backgroundColor: '#5568FE',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
