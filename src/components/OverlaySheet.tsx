import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { AppScreen } from './BottomNavigation';
import { theme } from '../theme';

export type OverlayKind = 'menu' | 'notifications' | null;

type Props = {
  visible: boolean;
  kind: OverlayKind;
  onClose: () => void;
  onNavigate: (screen: AppScreen) => void;
};

const menuItems: Array<{ key: AppScreen; label: string; glyph: string }> = [
  { key: 'home', label: 'Home', glyph: '⌂' },
  { key: 'assistant', label: 'Assistant', glyph: '✦' },
  { key: 'cart', label: 'Cart', glyph: '▱' },
  { key: 'profile', label: 'Profile', glyph: '○' },
];

const notifications = [
  { tag: 'Ready', text: 'Your smart shopping space is ready' },
  { tag: 'Tip', text: 'Ask AISA to build your next shopping list' },
  { tag: 'Welcome', text: 'Welcome to AISA Mobile' },
];

export function OverlaySheet({ visible, kind, onClose, onNavigate }: Props) {
  if (!kind) return null;

  const isMenu = kind === 'menu';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <View style={styles.centerColumn}>
          <Pressable accessibilityRole="button" accessibilityLabel="Close open panel" onPress={onClose} style={styles.backdrop} />
          <View accessibilityViewIsModal style={styles.sheet}>
            <View style={styles.head}>
              <View style={styles.headCopy}>
                <Text style={styles.eyebrow}>{isMenu ? 'Navigation' : 'Demo updates'}</Text>
                <Text style={styles.title}>{isMenu ? 'AISA Menu' : 'Notifications'}</Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Close panel" onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            {isMenu ? (
              <View style={styles.menuList}>
                {menuItems.map((item) => (
                  <Pressable
                    key={item.key}
                    accessibilityRole="button"
                    onPress={() => onNavigate(item.key)}
                    style={({ pressed }: { pressed: boolean }) => [styles.menuItem, pressed && styles.pressed]}
                  >
                    <View style={styles.menuGlyphWrap}>
                      <Text style={styles.menuGlyph}>{item.glyph}</Text>
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <Text style={styles.chevron}>›</Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              <ScrollView contentContainerStyle={styles.notificationList}>
                {notifications.map((notification) => (
                  <View key={notification.tag} style={styles.notificationItem}>
                    <Text style={styles.notificationTag}>{notification.tag}</Text>
                    <Text style={styles.notificationText}>{notification.text}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  centerColumn: {
    flex: 1,
    width: '100%',
    maxWidth: theme.maxWidth,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.backdrop,
  },
  sheet: {
    alignSelf: 'flex-end',
    width: '88%',
    maxWidth: 332,
    maxHeight: '82%',
    marginTop: 86,
    marginRight: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(77, 201, 240, 0.30)',
    borderRadius: 20,
    backgroundColor: '#06283b',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  headCopy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    marginBottom: 2,
    color: '#77cce8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f5fbff',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '800',
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(76, 191, 228, 0.25)',
    borderRadius: 11,
    backgroundColor: 'rgba(7, 35, 52, 0.86)',
  },
  closeText: {
    marginTop: -2,
    color: '#dff5fb',
    fontSize: 24,
    lineHeight: 26,
  },
  menuList: {
    gap: 7,
  },
  menuItem: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(67, 182, 220, 0.16)',
    borderRadius: 12,
    backgroundColor: 'rgba(4, 27, 42, 0.72)',
  },
  menuGlyphWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(75, 194, 232, 0.18)',
    borderRadius: 9,
    backgroundColor: 'rgba(10, 50, 71, 0.70)',
  },
  menuGlyph: {
    color: theme.colors.gold,
    fontSize: 15,
    fontWeight: '800',
  },
  menuLabel: {
    flex: 1,
    color: '#e2f3f9',
    fontSize: 13,
    fontWeight: '700',
  },
  chevron: {
    color: '#6f96a8',
    fontSize: 22,
    lineHeight: 24,
  },
  notificationList: {
    gap: 8,
  },
  notificationItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(68, 184, 223, 0.16)',
    borderRadius: 13,
    backgroundColor: 'rgba(4, 27, 42, 0.76)',
  },
  notificationTag: {
    marginBottom: 3,
    color: '#78d2ed',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationText: {
    color: '#e6f5fb',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.72,
  },
});
