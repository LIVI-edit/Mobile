import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export function AssistantPlaceholderScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>AISA Assistant</Text>
        <Text style={styles.body}>Assistant connection will be added in the next controlled integration stage.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 14,
    backgroundColor: theme.colors.surface,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(49, 188, 235, 0.24)',
    borderRadius: 19,
    backgroundColor: '#061724',
  },
  title: {
    color: '#f3fbff',
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },
  body: {
    maxWidth: 310,
    marginTop: 9,
    color: '#89a8b8',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
