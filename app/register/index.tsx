// app/register/index.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function Register() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ini Halaman Register</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
});
