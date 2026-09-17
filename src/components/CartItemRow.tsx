import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Product } from '../retailers/types';
import { theme } from '../theme';

type CartItemData = {
  product: Product;
  quantity: number;
  lineTotal: number;
};

type Props = {
  item: CartItemData;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
};

function formatUsd(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function CartItemRow({ item, onDecrease, onIncrease, onRemove }: Props) {
  const { product, quantity, lineTotal } = item;
  const packageLabel = product.packageSize || product.unit;

  return (
    <View style={styles.row}>
      <View style={styles.imagePlaceholder} accessibilityElementsHidden>
        <Text style={styles.imageGlyph}>▦</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.meta}>{product.category} · {packageLabel}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.unitPrice}>{formatUsd(product.price)} each</Text>
          <Text style={styles.lineTotal}>{formatUsd(lineTotal)}</Text>
        </View>

        <View style={styles.actions}>
          <View style={styles.quantityControl}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Decrease ${product.name} quantity`}
              onPress={onDecrease}
              style={({ pressed }: { pressed: boolean }) => [styles.quantityButton, pressed && styles.pressed]}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </Pressable>
            <Text style={styles.quantity}>{quantity}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Increase ${product.name} quantity`}
              onPress={onIncrease}
              style={({ pressed }: { pressed: boolean }) => [styles.quantityButton, pressed && styles.pressed]}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onRemove}
            style={({ pressed }: { pressed: boolean }) => [styles.removeButton, pressed && styles.pressed]}
          >
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 11,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(72, 181, 217, 0.16)',
    borderRadius: theme.radius.md,
    backgroundColor: '#062234',
  },
  imagePlaceholder: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(73, 196, 239, 0.20)',
    borderRadius: 13,
    backgroundColor: '#082b3e',
  },
  imageGlyph: {
    color: theme.colors.cyanMuted,
    fontSize: 18,
    fontWeight: '800',
  },
  details: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: theme.colors.text,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
  },
  meta: {
    marginTop: 3,
    color: theme.colors.textMuted,
    fontSize: 10,
    lineHeight: 14,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  unitPrice: {
    color: theme.colors.textSoft,
    fontSize: 10,
  },
  lineTotal: {
    color: theme.colors.gold,
    fontSize: 12,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(83, 195, 232, 0.20)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  quantityButton: {
    width: 31,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#08334a',
  },
  quantityButtonText: {
    color: theme.colors.cyan,
    fontSize: 17,
    lineHeight: 19,
    fontWeight: '800',
  },
  quantity: {
    minWidth: 32,
    color: theme.colors.text,
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '800',
  },
  removeButton: {
    minHeight: 30,
    justifyContent: 'center',
    paddingHorizontal: 9,
    borderRadius: 9,
  },
  removeText: {
    color: '#92b4c3',
    fontSize: 10,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});
