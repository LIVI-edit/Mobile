import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

type Props = {
  onAskAisa: () => void;
  cartCount: number;
  onCartOpen: () => void;
};

const scenarios = [
  { icon: '⌂', title: 'Set up a home office', copy: 'Desk, chair, monitor, lighting and accessories.' },
  { icon: '◇', title: 'Renovate a room', copy: 'Materials, tools, lighting and finishing items.' },
  { icon: '⌁', title: 'Upgrade home tech', copy: 'Devices, compatible accessories and better-value alternatives.' },
  { icon: '▦', title: 'Plan weekly groceries', copy: 'Food, household essentials and budget-aware substitutions.' },
  { icon: '✈', title: 'Prepare for a trip', copy: 'Travel essentials, luggage, adapters and useful extras.' },
  { icon: '✦', title: 'Find the right gift', copy: 'Ideas matched to the person, occasion and budget.' },
  { icon: '○', title: 'Get ready for a new baby', copy: 'Everyday essentials, nursery items and practical gear.' },
  { icon: '△', title: 'Build a fitness setup', copy: 'Equipment, accessories and products matched to the goal.' },
];

const projects = [
  { name: 'Home office setup', meta: '8 items', status: 'In progress' },
  { name: 'Kitchen upgrade', meta: '5 items', status: 'Comparing options' },
  { name: 'Weekly shopping', meta: '12 items', status: 'Ready to review' },
  { name: 'Bathroom renovation', meta: '7 items', status: 'Planning' },
];

export function HomeScreen({ onAskAisa, cartCount, onCartOpen }: Props) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.visionHead}>
        <View style={styles.visionCopy}>
          <Text style={styles.kicker}>Good morning</Text>
          <Text style={styles.heading}>What do you need today?</Text>
          <Text style={styles.description}>
            Tell AISA what you want to get done — we’ll help plan the purchase, compare options and build the right basket.
          </Text>
        </View>
        <View style={styles.sparkBox}>
          <Text style={styles.spark}>✦</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onAskAisa}
        style={({ pressed }: { pressed: boolean }) => [styles.askCard, pressed && styles.pressed]}
      >
        <View style={styles.askIcon}>
          <Text style={styles.askSpark}>✦</Text>
        </View>
        <View style={styles.askCopy}>
          <Text style={styles.askTitle}>Ask AISA anything you want to buy</Text>
          <Text style={styles.askBody}>One assistant for products, projects, comparisons and complete baskets.</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>What can AISA help with?</Text>
          <Text style={styles.sectionMeta}>Explore</Text>
        </View>
        <View style={styles.scenarioGrid}>
          {scenarios.map((scenario) => (
            <Pressable
              key={scenario.title}
              accessibilityRole="button"
              onPress={onAskAisa}
              style={({ pressed }: { pressed: boolean }) => [styles.scenarioCard, pressed && styles.pressed]}
            >
              <View style={styles.scenarioIcon}>
                <Text style={styles.scenarioGlyph}>{scenario.icon}</Text>
              </View>
              <View style={styles.scenarioCopy}>
                <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                <Text style={styles.scenarioBody}>{scenario.copy}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Your shopping projects</Text>
          <Text style={styles.sectionMeta}>Demo</Text>
        </View>
        <View style={styles.projectList}>
          {projects.map((project) => (
            <View key={project.name} style={styles.projectCard}>
              <View style={styles.projectMark} />
              <View style={styles.projectCopy}>
                <Text numberOfLines={1} style={styles.projectTitle}>{project.name}</Text>
                <Text numberOfLines={1} style={styles.projectMeta}>{project.meta} · {project.status}</Text>
              </View>
              <View style={styles.projectStatus}>
                <Text numberOfLines={1} style={styles.projectStatusText}>{project.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.nextCard}>
        <View style={styles.nextCopy}>
          <Text style={styles.nextKicker}>{cartCount > 0 ? 'Basket status' : 'Ready when you are'}</Text>
          <Text style={styles.nextTitle}>{cartCount > 0 ? 'Your cart is ready' : 'Start with AISA'}</Text>
          <Text style={styles.nextBody}>
            {cartCount > 0 ? `${cartCount} item(s) selected` : 'Describe what you need and AISA will help build the right basket.'}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={cartCount > 0 ? onCartOpen : onAskAisa}
          style={({ pressed }: { pressed: boolean }) => [styles.nextButton, pressed && styles.pressed]}
        >
          <Text style={styles.nextButtonText}>{cartCount > 0 ? 'Open Cart' : 'Ask AISA'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    padding: 14,
    paddingBottom: 20,
  },
  visionHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  visionCopy: {
    flex: 1,
    minWidth: 0,
  },
  kicker: {
    marginBottom: 3,
    color: '#86a9bb',
    fontSize: 11,
    fontWeight: '700',
  },
  heading: {
    color: '#f6fbff',
    fontSize: 22,
    lineHeight: 25,
    fontWeight: '800',
    letterSpacing: -0.45,
  },
  description: {
    marginTop: 7,
    color: '#89a5b5',
    fontSize: 12,
    lineHeight: 17,
  },
  sparkBox: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(73, 196, 239, 0.32)',
    borderRadius: 14,
    backgroundColor: 'rgba(9, 42, 64, 0.72)',
  },
  spark: {
    color: theme.colors.cyan,
    fontSize: 20,
  },
  askCard: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 17,
    padding: 13,
    borderWidth: 1,
    borderColor: 'rgba(63, 202, 249, 0.38)',
    borderRadius: 19,
    backgroundColor: '#06263a',
  },
  askIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(246, 199, 76, 0.28)',
    borderRadius: 13,
    backgroundColor: '#0a354d',
  },
  askSpark: {
    color: theme.colors.gold,
    fontSize: 20,
  },
  askCopy: {
    flex: 1,
    minWidth: 0,
  },
  askTitle: {
    color: '#effaff',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
  },
  askBody: {
    marginTop: 4,
    color: '#84a3b2',
    fontSize: 11,
    lineHeight: 15,
  },
  chevron: {
    color: '#82b6c9',
    fontSize: 26,
    lineHeight: 28,
  },
  section: {
    marginBottom: 17,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 9,
  },
  sectionTitle: {
    color: '#e9f7fc',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionMeta: {
    color: '#78cce7',
    fontSize: 9,
    fontWeight: '700',
  },
  scenarioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  scenarioCard: {
    width: '48.8%',
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(70, 186, 225, 0.17)',
    borderRadius: 14,
    backgroundColor: '#062234',
  },
  scenarioIcon: {
    width: 29,
    height: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 200, 95, 0.25)',
    borderRadius: 10,
    backgroundColor: 'rgba(31, 40, 41, 0.58)',
  },
  scenarioGlyph: {
    color: theme.colors.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  scenarioCopy: {
    flex: 1,
    minWidth: 0,
  },
  scenarioTitle: {
    color: '#eaf7fc',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
  },
  scenarioBody: {
    marginTop: 4,
    color: '#7898a8',
    fontSize: 9,
    lineHeight: 12,
  },
  projectList: {
    gap: 7,
  },
  projectCard: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: 'rgba(72, 181, 217, 0.14)',
    borderRadius: 13,
    backgroundColor: 'rgba(5, 28, 43, 0.75)',
  },
  projectMark: {
    width: 5,
    height: 30,
    borderRadius: 999,
    backgroundColor: theme.colors.cyan,
    borderBottomWidth: 9,
    borderBottomColor: theme.colors.gold,
  },
  projectCopy: {
    flex: 1,
    minWidth: 0,
  },
  projectTitle: {
    color: '#e6f5fb',
    fontSize: 11,
    fontWeight: '800',
  },
  projectMeta: {
    marginTop: 2,
    color: '#7898a8',
    fontSize: 9,
  },
  projectStatus: {
    maxWidth: 92,
    paddingVertical: 4,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: 'rgba(74, 195, 235, 0.17)',
    borderRadius: 999,
    backgroundColor: 'rgba(8, 44, 63, 0.60)',
  },
  projectStatusText: {
    color: '#8ddcf2',
    fontSize: 8,
    fontWeight: '800',
  },
  nextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(83, 195, 232, 0.20)',
    borderRadius: 16,
    backgroundColor: '#062438',
  },
  nextCopy: {
    flex: 1,
    minWidth: 0,
  },
  nextKicker: {
    marginBottom: 2,
    color: '#79d2ee',
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.45,
  },
  nextTitle: {
    color: '#eefaff',
    fontSize: 12,
    fontWeight: '800',
  },
  nextBody: {
    marginTop: 3,
    color: '#7d9baa',
    fontSize: 9,
    lineHeight: 12,
  },
  nextButton: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: 'rgba(73, 203, 243, 0.35)',
    borderRadius: 11,
    backgroundColor: '#07425d',
  },
  nextButtonText: {
    color: '#dff8ff',
    fontSize: 10,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.74,
  },
});
