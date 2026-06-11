import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography } from '../../src/constants/theme';

const roadmapSteps = [
  { id: '1', title: 'Document Verification', status: 'completed', duration: '2 weeks' },
  { id: '2', title: 'English Language Test', status: 'pending', duration: '4 weeks' },
  { id: '3', title: 'Competency Assessment', status: 'pending', duration: '6 weeks' },
  { id: '4', title: 'Visa Application', status: 'pending', duration: '8 weeks' },
  { id: '5', title: 'Final Registration', status: 'pending', duration: '2 weeks' },
];

export default function RoadmapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.celebration}>
          <Text style={styles.celebrationIcon}>🎉</Text>
          <Text style={styles.celebrationTitle}>Your Roadmap is Ready!</Text>
          <Text style={styles.celebrationSubtitle}>
            Based on your profile, we've created a personalized pathway to UK NMC Registration
          </Text>
        </View>

        <View style={styles.roadmapContainer}>
          <Text style={styles.roadmapTitle}>Your Journey</Text>
          
          {roadmapSteps.map((step, index) => (
            <View key={step.id} style={styles.stepItem}>
              <View style={styles.stepLeft}>
                <View style={[
                  styles.stepIndicator,
                  step.status === 'completed' && styles.stepCompleted
                ]}>
                  {step.status === 'completed' ? (
                    <Text style={styles.checkmark}>✓</Text>
                  ) : (
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                  )}
                </View>
                {index < roadmapSteps.length - 1 && (
                  <View style={[
                    styles.stepLine,
                    step.status === 'completed' && styles.stepLineCompleted
                  ]} />
                )}
              </View>
              <View style={styles.stepContent}>
                <Text style={[
                  styles.stepTitle,
                  step.status === 'completed' && styles.stepTitleCompleted
                ]}>
                  {step.title}
                </Text>
                <View style={[
                  styles.stepBadge,
                  step.status === 'completed' && styles.stepBadgeCompleted
                ]}>
                  <Text style={[
                    styles.stepBadgeText,
                    step.status === 'completed' && styles.stepBadgeTextCompleted
                  ]}>
                    {step.status === 'completed' ? 'Completed' : step.duration}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>18-24</Text>
            <Text style={styles.statLabel}>Months Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Key Steps</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>78%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
          <LinearGradient
            colors={colors.gradient.primary as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Start Your Journey</Text>
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  celebration: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  celebrationIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  celebrationTitle: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  celebrationSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  roadmapContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  roadmapTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  stepItem: {
    flexDirection: 'row',
  },
  stepLeft: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCompleted: {
    backgroundColor: colors.success,
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stepNumber: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  stepLine: {
    width: 2,
    height: 40,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
  },
  stepLineCompleted: {
    backgroundColor: colors.success,
  },
  stepContent: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  stepTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  stepTitleCompleted: {
    color: colors.textSecondary,
  },
  stepBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  stepBadgeCompleted: {
    backgroundColor: colors.success + '20',
  },
  stepBadgeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  stepBadgeTextCompleted: {
    color: colors.success,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h3,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  button: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.body,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
