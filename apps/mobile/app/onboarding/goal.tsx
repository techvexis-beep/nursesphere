import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { colors, spacing, borderRadius, typography } from '../../src/constants/theme';

const countries = [
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', desc: 'NMC Registration', time: '3-6 months' },
  { id: 'usa', name: 'United States', flag: '🇺🇸', desc: 'NCLEX & Visa Screen', time: '6-12 months' },
  { id: 'canada', name: 'Canada', flag: '🇨🇦', desc: 'NCLEX & NNAS', time: '6-12 months' },
  { id: 'australia', name: 'Australia', flag: '🇦🇺', desc: 'AHPRA Registration', time: '3-6 months' },
  { id: 'ireland', name: 'Ireland', flag: '🇮🇪', desc: 'NMBI Registration', time: '3-6 months' },
  { id: 'uae', name: 'UAE', flag: '🇦🇪', desc: 'DHA License', time: '2-4 months' },
];

export default function GoalScreen() {
  const [selected, setSelected] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.stepText}>Step 1 of 4</Text>
        <Text style={styles.title}>Where do you want to work?</Text>
        <Text style={styles.subtitle}>Select your target country for nursing registration</Text>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.countriesList}>
          {countries.map((country) => (
            <TouchableOpacity
              key={country.id}
              style={[
                styles.countryCard,
                selected === country.id && styles.countryCardSelected
              ]}
              onPress={() => setSelected(country.id)}
            >
              <Text style={styles.countryFlag}>{country.flag}</Text>
              <View style={styles.countryInfo}>
                <Text style={[
                  styles.countryName,
                  selected === country.id && styles.countryNameSelected
                ]}>
                  {country.name}
                </Text>
                <Text style={styles.countryDesc}>{country.desc}</Text>
              </View>
              <View style={[
                styles.countryMeta,
                selected === country.id && styles.countryMetaSelected
              ]}>
                <Text style={[
                  styles.countryTime,
                  selected === country.id && styles.countryTimeSelected
                ]}>
                  {country.time}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={() => router.push('/onboarding/experience')}
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
  countriesList: {
    flex: 1,
  },
  countryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  countryCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  countryFlag: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  countryNameSelected: {
    color: colors.primary,
  },
  countryDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  countryMeta: {
    backgroundColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  countryMetaSelected: {
    backgroundColor: colors.primary + '20',
  },
  countryTime: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  countryTimeSelected: {
    color: colors.primary,
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
