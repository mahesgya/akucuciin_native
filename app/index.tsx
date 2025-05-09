import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logo.panjang.png")} style={styles.imageLogo} />

      <Text style={styles.title}>Ga Sempet Nyuci?</Text>
      <Text style={styles.subtitle}>sini Akucuciin</Text>

      <Image source={require("../assets/images/mesin.cuci.png")} style={styles.image} />

      <TouchableOpacity style={styles.buttonPrimary} onPress={() => router.push("/login")}>
        <Text style={styles.buttonPrimaryText}>LOGIN</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>HIGHLY PROFESSIONAL CLEANING</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6ff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6D83F2",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Montserrat",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6D83F2",
    marginBottom: 30,
    fontFamily: "Montserrat",
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: "contain",
  },
  imageLogo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
  },
  buttonPrimaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
  buttonPrimary: {
    backgroundColor: "#6D83F2",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    fontFamily: "Montserrat",
  },
  buttonSecondaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
  footer: {
    marginTop: 30,
    fontSize: 12,
    color: "#888",
    fontFamily: "Montserrat",
  },
});

export default Index;
