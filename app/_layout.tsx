import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AlertProvider } from "./hooks/alert";
export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </AlertProvider>
  );
}
