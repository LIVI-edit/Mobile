declare const require: (path: string) => number;

import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

type Props = {
  onMenuPress: () => void;
  onNotificationsPress: () => void;
  onProfilePress: () => void;
};

function MenuGlyph() {
  return (
    <View style={styles.menuGlyph}>
      <View style={styles.menuLine} />
      <View style={styles.menuLine} />
      <View style={styles.menuLine} />
    </View>
  );
}

function BellGlyph() {
  return (
    <View style={styles.bellGlyph}>
      <View style={styles.bellBody} />
      <View style={styles.bellBase} />
      <View style={styles.bellClapper} />
    </View>
  );
}

function ProfileGlyph() {
  return (
    <View style={styles.profileGlyph}>
      <View style={styles.profileHead} />
      <View style={styles.profileShoulders} />
    </View>
  );
}

export function AisaTopBar({ onMenuPress, onNotificationsPress, onProfilePress }: Props) {
  return (
    <View style={styles.bar}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open app menu"
        onPress={onMenuPress}
        style={({ pressed }: { pressed: boolean }) => [styles.iconButton, pressed && styles.pressed]}
      >
        <MenuGlyph />
      </Pressable>

      <View style={styles.brand}>
        <Image source={require('../../assets/aisa-logo.png')} resizeMode="contain" style={styles.logo} />
        <Text numberOfLines={1} style={styles.brandCaption}>
          <Text style={styles.brandAi}>AI</Text> Shopping Assistant
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open notifications"
          onPress={onNotificationsPress}
          style={({ pressed }: { pressed: boolean }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <BellGlyph />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={onProfilePress}
          style={({ pressed }: { pressed: boolean }) => [styles.avatarButton, pressed && styles.pressed]}
        >
          <ProfileGlyph />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(79, 196, 237, 0.20)',
    backgroundColor: '#041522',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(71, 191, 235, 0.34)',
    borderRadius: 14,
    backgroundColor: '#08283b',
  },
  avatarButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(249, 205, 91, 0.56)',
    borderRadius: 22,
    backgroundColor: '#0c354d',
  },
  pressed: {
    opacity: 0.72,
  },
  brand: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 126,
    height: 48,
    borderRadius: 8,
  },
  brandCaption: {
    marginTop: -4,
    color: theme.colors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.35,
  },
  brandAi: {
    color: theme.colors.cyan,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  menuGlyph: {
    width: 19,
    gap: 4,
  },
  menuLine: {
    height: 2,
    borderRadius: 999,
    backgroundColor: '#dff6ff',
  },
  bellGlyph: {
    width: 20,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBody: {
    width: 13,
    height: 13,
    borderWidth: 1.6,
    borderColor: '#dff6ff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  bellBase: {
    width: 17,
    height: 1.6,
    marginTop: -2,
    borderRadius: 999,
    backgroundColor: '#dff6ff',
  },
  bellClapper: {
    width: 4,
    height: 2,
    marginTop: 2,
    borderRadius: 999,
    backgroundColor: '#dff6ff',
  },
  profileGlyph: {
    width: 24,
    height: 24,
    alignItems: 'center',
  },
  profileHead: {
    width: 7,
    height: 7,
    marginTop: 3,
    borderWidth: 1.5,
    borderColor: '#dff8ff',
    borderRadius: 4,
  },
  profileShoulders: {
    width: 15,
    height: 8,
    marginTop: 3,
    borderWidth: 1.5,
    borderColor: '#dff8ff',
    borderBottomWidth: 0,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
});
