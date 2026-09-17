import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

const preferences = [
  { label: 'Budget', value: 'Smart value' },
  { label: 'Diet', value: 'Flexible' },
  { label: 'Stores', value: 'Favourites' },
  { label: 'Delivery', value: 'Convenient' },
];

const rows = [
  { label: 'Shopping preferences', glyph: '✦' },
  { label: 'Favourite stores', glyph: '♡' },
  { label: 'Delivery preferences', glyph: '⌁' },
];

export function ProfileScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.profileCard}>
        <View style={styles.profileOrb}>
          <View style={styles.profileHead} />
          <View style={styles.profileShoulders} />
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.profileKicker}>Demo profile</Text>
          <Text style={styles.profileTitle}>AISA Shopper</Text>
          <Text style={styles.profileBody}>Personal shopping preferences in one private place.</Text>
        </View>
      </View>

      <View style={styles.preferenceBlock}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Text style={styles.sectionMeta}>Personalized</Text>
        </View>
        <View style={styles.preferenceGrid}>
          {preferences.map((preference) => (
            <View key={preference.label} style={styles.preferenceChip}>
              <Text style={styles.preferenceLabel}>{preference.label}</Text>
              <Text style={styles.preferenceValue}>{preference.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.settingsCard}>
        {rows.map((row, index) => (
          <View key={row.label} style={[styles.settingsRow, index === rows.length - 1 && styles.settingsRowLast]}>
            <View style={styles.settingsGlyphWrap}>
              <Text style={styles.settingsGlyph}>{row.glyph}</Text>
            </View>
            <Text style={styles.settingsLabel}>{row.label}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        ))}
      </View>

      <Text style={styles.note}>More account tools are planned for the mobile app.</Text>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginBottom: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(64, 204, 249, 0.32)',
    borderRadius: 20,
    backgroundColor: '#07253a',
  },
  profileOrb: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(249, 205, 91, 0.43)',
    borderRadius: 35,
    backgroundColor: '#0c4564',
  },
  profileHead: {
    width: 13,
    height: 13,
    borderWidth: 1.7,
    borderColor: '#dff7ff',
    borderRadius: 7,
  },
  profileShoulders: {
    width: 28,
    height: 14,
    marginTop: 5,
    borderWidth: 1.7,
    borderColor: '#dff7ff',
    borderBottomWidth: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  profileCopy: {
    flex: 1,
    minWidth: 0,
  },
  profileKicker: {
    marginBottom: 3,
    color: '#6fcbeb',
    fontSize: 10,
    fontWeight: '800',
  },
  profileTitle: {
    color: '#f6fbff',
    fontSize: 20,
    lineHeight: 23,
    fontWeight: '800',
    letterSpacing: -0.35,
  },
  profileBody: {
    marginTop: 5,
    color: '#89a5b5',
    fontSize: 11,
    lineHeight: 16,
  },
  preferenceBlock: {
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
  preferenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  preferenceChip: {
    width: '48.8%',
    minHeight: 58,
    justifyContent: 'center',
    gap: 2,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(62, 180, 219, 0.17)',
    borderRadius: 14,
    backgroundColor: '#062234',
  },
  preferenceLabel: {
    color: '#7093a5',
    fontSize: 9,
  },
  preferenceValue: {
    color: '#dff3fa',
    fontSize: 11,
    fontWeight: '800',
  },
  settingsCard: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(68, 181, 219, 0.17)',
    borderRadius: 16,
    backgroundColor: 'rgba(5, 28, 44, 0.79)',
  },
  settingsRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(69, 178, 215, 0.11)',
  },
  settingsRowLast: {
    borderBottomWidth: 0,
  },
  settingsGlyphWrap: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 190, 229, 0.18)',
    borderRadius: 9,
    backgroundColor: 'rgba(11, 50, 72, 0.70)',
  },
  settingsGlyph: {
    color: theme.colors.gold,
    fontSize: 13,
    fontWeight: '700',
  },
  settingsLabel: {
    flex: 1,
    color: '#dceef5',
    fontSize: 12,
    fontWeight: '700',
  },
  chevron: {
    color: '#64899b',
    fontSize: 22,
    lineHeight: 24,
  },
  note: {
    marginTop: 12,
    marginHorizontal: 5,
    color: '#68899a',
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
  },
});
