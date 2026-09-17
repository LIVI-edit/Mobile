import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CartItemRow } from '../components/CartItemRow';
import { useCart } from '../context/CartContext';
import { theme } from '../theme';

function formatUsd(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function CartScreen() {
  const {
    cartItems,
    cartTotal,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  const isEmpty = cartItems.length === 0;

  function loadTestBasket() {
    addToCart('veg-001', 2);
    addToCart('veg-002', 1);
    addToCart('bakery-001', 1);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Shopping basket</Text>
        <Text style={styles.title}>Cart</Text>
      </View>

      {isEmpty ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyBody}>Products selected by AISA will appear here.</Text>
        </View>
      ) : (
        <>
          <View style={styles.itemList}>
            {cartItems.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                onDecrease={() => decreaseQuantity(item.product.id)}
                onIncrease={() => increaseQuantity(item.product.id)}
                onRemove={() => removeFromCart(item.product.id)}
              />
            ))}
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatUsd(cartTotal)}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={clearCart}
              style={({ pressed }: { pressed: boolean }) => [styles.clearButton, pressed && styles.pressed]}
            >
              <Text style={styles.clearButtonText}>Clear cart</Text>
            </Pressable>
          </View>
        </>
      )}

      {__DEV__ && isEmpty ? (
        <View style={styles.devCard}>
          <Text style={styles.devLabel}>Task 02 development check</Text>
          <Pressable
            accessibilityRole="button"
            onPress={loadTestBasket}
            style={({ pressed }: { pressed: boolean }) => [styles.devButton, pressed && styles.pressed]}
          >
            <Text style={styles.devButtonText}>Load test basket</Text>
          </Pressable>
        </View>
      ) : null}
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
    paddingBottom: 22,
  },
  header: {
    marginBottom: 14,
  },
  kicker: {
    marginBottom: 3,
    color: '#86a9bb',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: theme.colors.text,
    fontSize: 22,
    lineHeight: 25,
    fontWeight: '800',
    letterSpacing: -0.45,
  },
  emptyCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(72, 181, 217, 0.16)',
    borderRadius: theme.radius.lg,
    backgroundColor: '#062234',
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  emptyBody: {
    marginTop: 6,
    color: theme.colors.textSoft,
    fontSize: 11,
    lineHeight: 16,
  },
  itemList: {
    gap: 9,
  },
  summaryCard: {
    marginTop: 12,
    padding: 13,
    borderWidth: 1,
    borderColor: 'rgba(83, 195, 232, 0.20)',
    borderRadius: theme.radius.lg,
    backgroundColor: '#062438',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  totalLabel: {
    color: theme.colors.textSoft,
    fontSize: 12,
    fontWeight: '700',
  },
  totalValue: {
    color: theme.colors.gold,
    fontSize: 17,
    fontWeight: '800',
  },
  clearButton: {
    alignSelf: 'flex-start',
    minHeight: 34,
    justifyContent: 'center',
    marginTop: 11,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(73, 203, 243, 0.24)',
    borderRadius: 10,
    backgroundColor: '#073149',
  },
  clearButtonText: {
    color: '#c9effa',
    fontSize: 10,
    fontWeight: '800',
  },
  devCard: {
    marginTop: 14,
    padding: 11,
    borderWidth: 1,
    borderColor: 'rgba(240, 199, 94, 0.20)',
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(31, 40, 41, 0.42)',
  },
  devLabel: {
    color: '#bea95f',
    fontSize: 9,
    fontWeight: '800',
  },
  devButton: {
    alignSelf: 'flex-start',
    minHeight: 33,
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(240, 199, 94, 0.26)',
    borderRadius: 9,
    backgroundColor: '#2a2b24',
  },
  devButtonText: {
    color: '#f3d77e',
    fontSize: 10,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.72,
  },
});
