import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography } from '../../src/constants/theme';

const { width } = Dimensions.get('window');

const stories = [
  { id: '1', username: 'nurse_jane', avatar: null, hasStory: true, viewed: false },
  { id: '2', username: 'uk_nurse', avatar: null, hasStory: true, viewed: true },
  { id: '3', username: 'icu_pro', avatar: null, hasStory: true, viewed: false },
  { id: '4', username: 'nclex_master', avatar: null, hasStory: false, viewed: false },
  { id: '5', username: 'travel_nurse', avatar: null, hasStory: true, viewed: false },
];

const threads = [
  {
    id: '1',
    author: 'Sarah RN',
    avatar: null,
    title: 'UK NMC Application Timeline 2024',
    content: 'Just received my decision letter after 4 months of waiting! Here is my complete timeline...',
    upvotes: 234,
    replies: 45,
    tag: 'UK NMC',
  },
  {
    id: '2',
    author: 'Mike ICU',
    avatar: null,
    title: 'Best NCLEX Prep Resources',
    content: 'After passing on my first try, here are the resources that helped me the most...',
    upvotes: 189,
    replies: 67,
    tag: 'NCLEX',
  },
];

const communities = [
  { id: '1', name: 'UK NMC', members: '12.5k', color: colors.primary },
  { id: '2', name: 'USA NCLEX', members: '28.3k', color: colors.secondary },
  { id: '3', name: 'Canada NNAS', members: '8.2k', color: colors.accent },
  { id: '4', name: 'Australia AHPRA', members: '5.7k', color: '#FFB347' },
];

export default function CommunityScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContainer}
        >
          <TouchableOpacity style={styles.addStory}>
            <View style={styles.addStoryIcon}>
              <Text style={styles.addStoryPlus}>+</Text>
            </View>
            <Text style={styles.addStoryText}>Add Story</Text>
          </TouchableOpacity>
          
          {stories.map((story) => (
            <TouchableOpacity key={story.id} style={styles.storyItem}>
              <View style={[
                styles.storyRing, 
                story.viewed && styles.storyRingViewed
              ]}>
                <View style={styles.storyAvatar} />
              </View>
              <Text style={styles.storyUsername} numberOfLines={1}>
                {story.username}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.communitiesSection}>
          <Text style={styles.sectionTitle}>Communities</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {communities.map((community) => (
              <TouchableOpacity 
                key={community.id} 
                style={[styles.communityCard, { borderColor: community.color }]}
              >
                <View style={[styles.communityIndicator, { backgroundColor: community.color }]} />
                <Text style={styles.communityName}>{community.name}</Text>
                <Text style={styles.communityMembers}>{community.members} members</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.threadsSection}>
          <Text style={styles.sectionTitle}>Trending Threads</Text>
          
          {threads.map((thread) => (
            <TouchableOpacity key={thread.id} style={styles.threadCard}>
              <View style={styles.threadHeader}>
                <View style={styles.threadAvatar} />
                <View style={styles.threadMeta}>
                  <Text style={styles.threadAuthor}>{thread.author}</Text>
                  <Text style={styles.threadTag}>{thread.tag}</Text>
                </View>
              </View>
              <Text style={styles.threadTitle}>{thread.title}</Text>
              <Text style={styles.threadContent} numberOfLines={2}>{thread.content}</Text>
              <View style={styles.threadStats}>
                <View style={styles.threadStat}>
                  <Text style={styles.threadStatIcon}>👍</Text>
                  <Text style={styles.threadStatText}>{thread.upvotes}</Text>
                </View>
                <View style={styles.threadStat}>
                  <Text style={styles.threadStatIcon}>💬</Text>
                  <Text style={styles.threadStatText}>{thread.replies} replies</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  storiesContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  addStory: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  addStoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addStoryPlus: {
    fontSize: 28,
    color: colors.textMuted,
  },
  addStoryText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 64,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 3,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  storyRingViewed: {
    borderColor: colors.border,
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: colors.surface,
  },
  storyUsername: {
    ...typography.caption,
    color: colors.text,
    marginTop: spacing.xs,
    maxWidth: 64,
  },
  communitiesSection: {
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  communityCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginRight: spacing.sm,
    width: 140,
    borderLeftWidth: 4,
  },
  communityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  communityName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  communityMembers: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  threadsSection: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  threadCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  threadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  threadAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  threadMeta: {
    flex: 1,
  },
  threadAuthor: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
  },
  threadTag: {
    ...typography.caption,
    color: colors.primary,
  },
  threadTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  threadContent: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  threadStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  threadStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  threadStatIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  threadStatText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
