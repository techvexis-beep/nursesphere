import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography } from '../../src/constants/theme';

const chats = [
  {
    id: '1',
    name: 'Dr. Emily Chen',
    role: 'Recruiter - NHS',
    lastMessage: 'Your application looks great! Can we schedule a call?',
    timestamp: '2m ago',
    unread: 2,
    avatar: null,
    type: 'recruiter',
  },
  {
    id: '2',
    name: 'UK NMC Applicants',
    role: 'Study Group',
    lastMessage: 'Sarah: Has anyone received their decision yet?',
    timestamp: '15m ago',
    unread: 5,
    avatar: null,
    type: 'group',
  },
  {
    id: '3',
    name: 'Michael Thompson',
    role: 'Senior Nurse - Australia',
    lastMessage: 'The AHPRA process is straightforward once you...',
    timestamp: '1h ago',
    unread: 0,
    avatar: null,
    type: 'direct',
  },
  {
    id: '4',
    name: 'NCLEX Study Buddy',
    role: 'Study Partner',
    lastMessage: 'Ready for tomorrow\'s session?',
    timestamp: '3h ago',
    unread: 0,
    avatar: null,
    type: 'direct',
  },
  {
    id: '5',
    name: 'Canada NNAS Support',
    role: 'Official',
    lastMessage: 'Your document verification is complete.',
    timestamp: '1d ago',
    unread: 0,
    avatar: null,
    type: 'official',
  },
];

const recruiters = [
  { id: '1', name: 'NHS Recruitment', role: 'UK Hospital Network', opportunities: 24 },
  { id: '2', name: 'UCLA Health', role: 'USA Hospital', opportunities: 12 },
  { id: '3', name: 'Sunshine Health', role: 'Australia', opportunities: 8 },
];

export default function ChatScreen() {
  const renderChatItem = ({ item }: { item: typeof chats[0] }) => (
    <TouchableOpacity style={styles.chatItem}>
      <View style={styles.avatarContainer}>
        <View style={[
          styles.avatar, 
          item.type === 'recruiter' && styles.recruiterAvatar,
          item.type === 'group' && styles.groupAvatar,
          item.type === 'official' && styles.officialAvatar
        ]}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0)}
          </Text>
        </View>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.timestamp}</Text>
        </View>
        <Text style={styles.chatRole}>{item.role}</Text>
        <Text style={styles.chatMessage} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Text>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text>✏️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.recruitersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Recruiters</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recruiters.map((recruiter) => (
              <TouchableOpacity key={recruiter.id} style={styles.recruiterCard}>
                <View style={styles.recruiterAvatar}>
                  <Text style={styles.recruiterAvatarText}>{recruiter.name.charAt(0)}</Text>
                </View>
                <Text style={styles.recruiterName} numberOfLines={1}>{recruiter.name}</Text>
                <Text style={styles.recruiterRole} numberOfLines={1}>{recruiter.role}</Text>
                <View style={styles.opportunityBadge}>
                  <Text style={styles.opportunityText}>{recruiter.opportunities} jobs</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.chatsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Messages</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Mark all read</Text>
            </TouchableOpacity>
          </View>
          
          {chats.map((chat) => renderChatItem({ item: chat }))}
        </View>

        <View style={styles.studyGroupsSection}>
          <Text style={styles.sectionTitle}>Your Study Groups</Text>
          <TouchableOpacity style={styles.studyGroupItem}>
            <View style={styles.studyGroupIcon}>
              <Text style={styles.studyGroupIconText}>📚</Text>
            </View>
            <View style={styles.studyGroupContent}>
              <Text style={styles.studyGroupName}>NCLEX Prep - March 2024</Text>
              <Text style={styles.studyGroupMeta}>12 members • Next session: Tomorrow</Text>
            </View>
            <Text style={styles.studyGroupArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.studyGroupItem}>
            <View style={styles.studyGroupIcon}>
              <Text style={styles.studyGroupIconText}>🇬🇧</Text>
            </View>
            <View style={styles.studyGroupContent}>
              <Text style={styles.studyGroupName}>UK NMC Application Support</Text>
              <Text style={styles.studyGroupMeta}>28 members • Next session: Friday</Text>
            </View>
            <Text style={styles.studyGroupArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recruitersSection: {
    paddingVertical: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  seeAll: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  recruiterCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginLeft: spacing.lg,
    marginRight: spacing.sm,
    width: 140,
    alignItems: 'center',
  },
  recruiterAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  recruiterAvatarText: {
    ...typography.h3,
    color: '#FFFFFF',
  },
  recruiterName: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  recruiterRole: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  opportunityBadge: {
    backgroundColor: colors.secondary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  opportunityText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '600',
  },
  chatsSection: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recruiterAvatar: {
    backgroundColor: colors.primary,
  },
  groupAvatar: {
    backgroundColor: colors.secondary,
  },
  officialAvatar: {
    backgroundColor: colors.accent,
  },
  avatarText: {
    ...typography.h3,
    color: colors.text,
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 10,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  chatName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  chatTime: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  chatRole: {
    ...typography.caption,
    color: colors.primary,
    marginBottom: 2,
  },
  chatMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  studyGroupsSection: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  studyGroupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  studyGroupIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  studyGroupIconText: {
    fontSize: 20,
  },
  studyGroupContent: {
    flex: 1,
  },
  studyGroupName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  studyGroupMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  studyGroupArrow: {
    ...typography.h2,
    color: colors.textMuted,
  },
});
