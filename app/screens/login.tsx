import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {};

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <Image source={require("../../assets/images/LogoAkucuciin.png")} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>LOGIN</Text>
      <Text style={styles.subtitle}>Silahkan masukan Email dan Password anda</Text>

      <View style={styles.inputContainer}>
        <Image source={require("../../assets/images/email.png")} style={styles.inputIcon}></Image>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" placeholderTextColor="#525252" />
      </View>

      <View style={styles.inputContainer}>
        <Image source={require("../../assets/images/passwordReg.png")} style={styles.inputIcon}></Image>
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#525252 " />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}> 
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6ff",
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 70,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#ffff",
    borderRadius: 8,
    width: "85%",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
    elevation: 2,
    borderColor: "#00000",
  },
  inputIcon: {
    fontSize: 18,
    width: 25,
    height: 25,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16, 
    color: "#525252",
  },
  loginButton: {
    backgroundColor: "#5f7cfb",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 20,
    width: "85%",
    elevation: 4,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default LoginScreen;
