// app/login/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    // Tambahkan autentikasi jika diperlukan
    router.replace("/"); // Ganti ke halaman home
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Logo */}
      <Image source={require("../../assets/images/LogoAkucuciin.png")} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>LOGIN</Text>
      <Text style={styles.subtitle}>Silahkan masukan Username dan Password anda</Text>

      {/* Username Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputIcon}>👤</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#444"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputIcon}>🔒</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#444"
        />
      </View>

      {/* Tombol Login */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Tombol Daftar */}
      <TouchableOpacity style={styles.registerButton} onPress={() => router.push("/register")}>
        <Text style={styles.registerText}>Daftar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 80,
  },
  logo: {
    width: 200,
    height: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    color: "#555",
    marginBottom: 30,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#f3f0ff",
    borderRadius: 20,
    width: "85%",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  loginButton: {
    backgroundColor: "#5f7cfb",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginTop: 30,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleText: {
    fontSize: 14,
    color: "#333",
  },
  registerButton: {
    marginTop: 10,
    backgroundColor: "#ddd",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  registerText: {
    fontWeight: "bold",
    color: "#444",
  },
});
  