import { Tabs } from 'expo-router';
import { View, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../src/constants/theme';

const { width } = Dimensions.get('window');

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'AI Home',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconFocused]}>
              <View style={styles.homeIcon} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconFocused]}>
              <View style={styles.communityIcon} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconFocused]}>
              <View style={styles.chatIcon} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: width * 0.1,
    right: width * 0.1,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  iconFocused: {
    backgroundColor: colors.primary + '20',
  },
  homeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  communityIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: colors.secondary,
  },
  chatIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
  },
});
