import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export type AppScreen = 'home' | 'assistant' | 'cart' | 'profile';

type Props = {
  activeScreen: AppScreen;
  onSelect: (screen: AppScreen) => void;
  cartCount: number;
};

const items: Array<{ key: AppScreen; label: string; glyph: string }> = [
  { key: 'home', label: 'Home', glyph: '⌂' },
  { key: 'assistant', label: 'Assistant', glyph: '✦' },
  { key: 'cart', label: 'Cart', glyph: '▱' },
  { key: 'profile', label: 'Profile', glyph: '○' },
];

export function BottomNavigation({ activeScreen, onSelect, cartCount }: Props) {
  return (
    <View accessibilityRole="tablist" style={styles.bar}>
      {items.map((item) => {
        const active = activeScreen === item.key;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(item.key)}
            style={({ pressed }: { pressed: boolean }) => [styles.item, active && styles.itemActive, pressed && styles.pressed]}
          >
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              <Text style={[styles.glyph, active && styles.glyphActive]}>{item.glyph}</Text>
              {item.key === 'cart' && cartCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: 8,
    paddingTop: 7,
    paddingBottom: 7,
    borderTopWidth: 1,
    borderTopColor: 'rgba(79, 196, 237, 0.18)',
    backgroundColor: '#041522',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    borderRadius: 13,
  },
  itemActive: {
    backgroundColor: 'rgba(10, 58, 79, 0.72)',
  },
  pressed: {
    opacity: 0.72,
  },
  iconWrap: {
    width: 30,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconWrapActive: {
    borderWidth: 1,
    borderColor: 'rgba(88, 209, 246, 0.24)',
    backgroundColor: 'rgba(22, 93, 119, 0.40)',
  },
  glyph: {
    color: '#7898a8',
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '700',
  },
  glyphActive: {
    color: theme.colors.cyan,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#041522',
    borderRadius: 999,
    backgroundColor: theme.colors.gold,
  },
  badgeText: {
    color: '#17212a',
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '900',
  },
  label: {
    color: '#7898a8',
    fontSize: 10,
    fontWeight: '700',
  },
  labelActive: {
    color: '#eaf8fd',
  },
});
