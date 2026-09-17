import { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AisaTopBar } from './src/components/AisaTopBar';
import { BottomNavigation, type AppScreen } from './src/components/BottomNavigation';
import { OverlaySheet, type OverlayKind } from './src/components/OverlaySheet';
import { CartProvider, useCart } from './src/context/CartContext';
import { AssistantPlaceholderScreen } from './src/screens/AssistantPlaceholderScreen';
import { CartScreen } from './src/screens/CartScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { theme } from './src/theme';

function AisaMobileShell() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [overlay, setOverlay] = useState<OverlayKind>(null);
  const { cartCount } = useCart();

  function navigate(nextScreen: AppScreen) {
    setScreen(nextScreen);
    setOverlay(null);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.page}>
        <View style={styles.appShell}>
          <AisaTopBar
            onMenuPress={() => setOverlay('menu')}
            onNotificationsPress={() => setOverlay('notifications')}
            onProfilePress={() => navigate('profile')}
          />

          <View style={styles.workspace}>
            {screen === 'home' ? (
              <HomeScreen
                onAskAisa={() => navigate('assistant')}
                cartCount={cartCount}
                onCartOpen={() => navigate('cart')}
              />
            ) : null}
            {screen === 'assistant' ? <AssistantPlaceholderScreen /> : null}
            {screen === 'cart' ? <CartScreen /> : null}
            {screen === 'profile' ? <ProfileScreen /> : null}
          </View>

          <BottomNavigation activeScreen={screen} onSelect={navigate} cartCount={cartCount} />
        </View>
      </View>

      <OverlaySheet
        visible={overlay !== null}
        kind={overlay}
        onClose={() => setOverlay(null)}
        onNavigate={navigate}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AisaMobileShell />
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.page,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.page,
  },
  appShell: {
    flex: 1,
    width: '100%',
    maxWidth: theme.maxWidth,
    overflow: 'hidden',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.borderSoft,
    backgroundColor: theme.colors.surface,
  },
  workspace: {
    flex: 1,
    minHeight: 0,
    backgroundColor: theme.colors.surface,
  },
});
