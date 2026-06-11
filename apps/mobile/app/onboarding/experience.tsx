import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { colors, spacing, borderRadius, typography } from '../../src/constants/theme';

const experienceLevels = [
  { 
    id: 'student', 
    title: 'Nursing Student', 
    icon: '📚',
    desc: 'Currently studying nursing'
  },
  { 
    id: 'new-graduate', 
    title: 'New Graduate', 
    icon: '🎓',
    desc: '0-2 years of experience',
    tag: 'Most Popular'
  },
  { 
    id: 'experienced', 
    title: 'Experienced Nurse', 
    icon: '👩‍⚕️',
    desc: '2-5 years of experience'
  },
  { 
    id: 'senior', 
    title: 'Senior Nurse', 
    icon: '⭐',
    desc: '5+ years of experience'
  },
];

export default function ExperienceScreen() {
  const [selected, setSelected] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.stepText}>Step 2 of 4</Text>
        <Text style={styles.title}>What's your experience level?</Text>
        <Text style={styles.subtitle}>This helps us customize your learning path</Text>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.levelsList}>
          {experienceLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelCard,
                selected === level.id && styles.levelCardSelected
              ]}
              onPress={() => setSelected(level.id)}
            >
              <View style={[
                styles.levelIcon,
                selected === level.id && styles.levelIconSelected
              ]}>
                <Text style={styles.levelEmoji}>{level.icon}</Text>
              </View>
              <View style={styles.levelInfo}>
                <View style={styles.levelHeader}>
                  <Text style={[
                    styles.levelTitle,
                    selected === level.id && styles.levelTitleSelected
                  ]}>
                    {level.title}
                  </Text>
                  {level.tag && (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>{level.tag}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.levelDesc}>{level.desc}</Text>
              </View>
              <View style={[
                styles.radio,
                selected === level.id && styles.radioSelected
              ]}>
                {selected === level.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={() => router.push('/onboarding/specialty')}
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
  levelsList: {
    flex: 1,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  levelIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  levelIconSelected: {
    backgroundColor: colors.primary + '30',
  },
  levelEmoji: {
    fontSize: 24,
  },
  levelInfo: {
    flex: 1,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  levelTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  levelTitleSelected: {
    color: colors.primary,
  },
  tag: {
    backgroundColor: colors.secondary + '30',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  tagText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '600',
  },
  levelDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
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
