import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios";
import { router } from 'expo-router';

import AuthApi from "../api/auth.api";
import ProfileApi from "../api/profile.api";
import AlertService from "../hooks/alert";

import { colors } from "../constants/colors";
import { LaundryProfile } from "../interface/profile.interface";

const DashboardProfile: React.FC = () => {
  const [profile, setProfile] = useState<LaundryProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("accessToken");

        if (token) {
          const profileData = await ProfileApi.getProfile(token);
          setProfile(profileData);
        } else {
          AlertService.error("Tidak ada token", "Token tidak ditemukan.");
        }

      } catch (error) {
        const err = error as AxiosError<any>;
        const message = err.response?.data?.errors || "Terjadi kesalahan, coba lagi.";
        AlertService.error("Gagal Mendapatkan data order", message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("refreshToken");

      if (token) {
        await AuthApi.Logout(token);
      } else {
        AlertService.error("Tidak ada token", "Token tidak ditemukan.");
      }
      router.replace('/');
      
    } catch (error) {
      const err = error as AxiosError<any>;
      const message = err.response?.data?.errors || "Terjadi kesalahan, coba lagi.";
      AlertService.error("Gagal Mendapatkan data order", message);
    }
  };

  const handleOpenMaps = () => {
    Alert.alert("Opening Maps", "Akan Membuka Maps Lokasi Google");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Profile not available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.imageContainer}>
          <View style={styles.placeholderLogo}>
            <Text style={styles.placeholderText}>{profile.name.charAt(0) || "V"}</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>{profile.name.toUpperCase()}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
        </View>
        <View style={styles.infoValueRow}>
          <Image source={require("../../assets/images/email.png")}></Image>
          <Text style={styles.infoValue}>{profile.email}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Alamat</Text>
        </View>
        <View style={styles.infoValueRow}>
          <Image source={require("../../assets/images/address.png")}></Image>
          <Text style={styles.infoValue}>{profile.address}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>No Telpon</Text>
        </View>
        <View style={styles.infoValueRow}>
          <Image source={require("../../assets/images/phone.png")}></Image>
          <Text style={styles.infoValue}>{profile.telephone}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Link Maps</Text>
        </View>

        <TouchableOpacity style={styles.infoValueRow} onPress={handleOpenMaps}>
          <Image source={require("../../assets/images/gmaps.png")}></Image>
          <Text style={styles.linkText}>Lihat Di Google Maps</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Deskripsi</Text>
        </View>
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{profile.description}</Text>
        </View>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_thin,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginBottom: 20,
    fontFamily: "Montserrat",
  },
  headerContainer: {
    backgroundColor: colors.primary_90,
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  imageContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  placeholderLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#3674B5",
    fontFamily: "Montserrat",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Montserrat",
  },
  infoContainer: {
    padding: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  infoLabel: {
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 12,
    color: colors.primary_65,
    fontFamily: "Montserrat",
  },
  infoValue: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: "Montserrat",
  },
  linkText: {
    fontSize: 14,
    color: "#3674B5",
    fontFamily: "Montserrat",
  },
  divider: {
    height: 1,
    backgroundColor: colors.primary_65,
    marginHorizontal: 14,
  },
  descriptionBox: {
    marginTop: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    minHeight: 100,
    backgroundColor: "#F9F9F9",
  },
  descriptionText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: "Montserrat",
  },
  logoutContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  logoutButton: {
    backgroundColor: colors.batal,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    width: 100,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "Montserrat",
  },
  infoValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
    marginLeft: 10,
    marginTop: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default DashboardProfile;
