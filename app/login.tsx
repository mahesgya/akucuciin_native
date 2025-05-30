import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import AuthApi from "./api/auth.api";
import AlertService from "./hooks/alert";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true)
      await AuthApi.Login(email, password);
      router.push("/dashboard/home");
    } catch (error) {
      const err = error as AxiosError<any>;
      const message = err.response?.data?.errors || "Terjadi kesalahan, coba lagi.";
      AlertService.error("Gagal Melakukan Login", message);
    }finally{
      setLoading(false)
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logo.panjang.png")} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>LOGIN</Text>
      <Text style={styles.subtitle}>Silahkan masukan Email dan Password anda</Text>

      <View style={styles.inputContainer}>
        <Image source={require("../assets/images/email.login.png")} style={styles.inputIcon}></Image>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" placeholderTextColor="#525252" underlineColorAndroid="transparent" />
      </View>

      <View style={styles.inputContainer}>
        <Image source={require("../assets/images/Password.png")} style={styles.inputIcon}></Image>
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#525252" underlineColorAndroid="transparent" />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    fontFamily: "Montserrat",
  },
  subtitle: {
    color: "#555",
    marginBottom: 40,
    fontSize: 14,
    fontFamily: "Montserrat",
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
    fontFamily: "Montserrat",
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
    borderWidth: 0,
    fontFamily: "Montserrat",
  },
  loginButton: {
    backgroundColor: "#5f7cfb",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 40,
    width: "85%",
    elevation: 4,
    fontFamily: "Montserrat",
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Montserrat",
  },
});

export default Login;
