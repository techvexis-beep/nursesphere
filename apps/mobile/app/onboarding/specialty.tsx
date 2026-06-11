import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { colors, spacing, borderRadius, typography } from '../../src/constants/theme';

const specialties = [
  { id: 'icu', title: 'ICU', icon: '💓', color: '#EF4444' },
  { id: 'pediatrics', title: 'Pediatrics', icon: '👶', color: '#F59E0B' },
  { id: 'emergency', title: 'Emergency', icon: '🚨', color: '#EF4444' },
  { id: 'med-surg', title: 'Medical-Surgical', icon: '🏥', color: '#3B82F6' },
  { id: 'psychiatry', title: 'Psychiatry', icon: '🧠', color: '#8B5CF6' },
  { id: 'community', title: 'Community Health', icon: '🏘️', color: '#10B981' },
  { id: 'gerontology', title: 'Gerontology', icon: '👴', color: '#6366F1' },
  { id: 'labor', title: 'Labor & Delivery', icon: '👶', color: '#EC4899' },
  { id: 'oncology', title: 'Oncology', icon: '🎗️', color: '#14B8A6' },
  { id: 'cardiology', title: 'Cardiology', icon: '❤️', color: '#EF4444' },
  { id: 'neurology', title: 'Neurology', icon: '🧠', color: '#8B5CF6' },
  { id: 'other', title: 'Other', icon: '📋', color: colors.textMuted },
];

export default function SpecialtyScreen() {
  const [selected, setSelected] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.stepText}>Step 3 of 4</Text>
        <Text style={styles.title}>What's your specialty?</Text>
        <Text style={styles.subtitle}>Select your primary nursing specialty</Text>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.specialtiesList}>
          <View style={styles.grid}>
            {specialties.map((specialty) => (
              <TouchableOpacity
                key={specialty.id}
                style={[
                  styles.specialtyCard,
                  selected === specialty.id && { borderColor: specialty.color },
                  selected === specialty.id && { backgroundColor: specialty.color + '15' }
                ]}
                onPress={() => setSelected(specialty.id)}
              >
                <View style={[
                  styles.specialtyIcon,
                  { backgroundColor: specialty.color + '20' }
                ]}>
                  <Text style={styles.specialtyEmoji}>{specialty.icon}</Text>
                </View>
                <Text style={[
                  styles.specialtyTitle,
                  selected === specialty.id && { color: specialty.color }
                ]}>
                  {specialty.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={() => router.push('/onboarding/ai-loader')}
          disabled={!selected}
        >
          <LinearGradient
            colors={selected ? colors.gradient.primary as [string, string] : [colors.border, colors.border]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 20,
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  stepText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  specialtiesList: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  specialtyCard: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  specialtyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  specialtyEmoji: {
    fontSize: 22,
  },
  specialtyTitle: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
  },
  buttonText: {
    ...typography.body,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  buttonArrow: {
    ...typography.body,
    color: '#FFFFFF',
    marginLeft: spacing.sm,
  },
});
