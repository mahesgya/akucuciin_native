import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import NavigationBar from "../ui/bar/navigation.bar";

export default function DashboardLayout() {
  return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Slot />
        </View>
        <NavigationBar />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
