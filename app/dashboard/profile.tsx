import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Switch, Animated, Easing } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios";
import { router } from "expo-router";

import AuthApi from "../api/auth.api";
import ProfileApi from "../api/profile.api";
import AlertService from "../hooks/alert";

import colors from "../constants/colors";
import { LaundryProfile } from "../interface/profile.interface";
import { Ionicons } from "@expo/vector-icons";

const CustomToggle: React.FC<{ isOpen: boolean; onToggle: () => void; isLoading: boolean;}> = ({ isOpen, onToggle, isLoading }) => {
  const animatedValue = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 44], 
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#DCE9F5', '#40A578'], 
  });

  return (
    <TouchableOpacity onPress={onToggle} disabled={isLoading} activeOpacity={0.9}>
      <Animated.View style={[styles.toggleBase, { backgroundColor }]}>
        <Animated.View style={[styles.toggleThumb, { transform: [{ translateX }] }]}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#3674B5" />
          ) : (
            <Ionicons 
              name={isOpen ? "sunny" : "moon"} 
              size={18} 
              color={isOpen ? '#FFD700' : '#DCE9F5'} 
            />
          )}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};


const DashboardProfile: React.FC = () => {
  const [profile, setProfile] = useState<LaundryProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    setIsOpen(profile?.is_open === 1)
  }, [profile?.is_open])

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
        AlertService.error("Gagal Mendapatkan data profile", message);
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
      router.replace("/");
    } catch (error) {
      const err = error as AxiosError<any>;
      const message = err.response?.data?.errors || "Terjadi kesalahan, coba lagi.";
      AlertService.error("Gagal Logout", message);
    }
  };

  const handleOpenMaps = () => {
    Alert.alert("Opening Maps", "Akan Membuka Maps Lokasi Google");
  };

  const handleOpenClose = async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("accessToken");

      if (token) {
        const response = await ProfileApi.openCloseToggle(token);
        setIsOpen(response.is_open)
      } else {
        AlertService.error("Tidak ada token", "Token tidak ditemukan.");
      }
    } catch (error) {
      const err = error as AxiosError<any>;
      const message = err.response?.data?.errors || "Terjadi kesalahan, coba lagi.";
      AlertService.error("Gagal update status", message);
    }finally {
      setLoading(false);
    }
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
               <View style={styles.toggleWrapper}>
              <CustomToggle 
                isOpen={isOpen}
                isLoading={loading}
                onToggle={handleOpenClose}
              />
              <View style={[styles.statusBadge, { backgroundColor: isOpen ? '#28a745' : '#dc3545' }]}>
                <Ionicons 
                  name={isOpen ? "lock-open-outline" : "lock-closed-outline"} 
                  size={14} 
                  color="white"
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.statusBadgeText}>
                  {isOpen ? 'Buka' : 'Tutup'}
                </Text>
              </View>
            </View>
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
    backgroundColor: colors.primary,
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  toggleLabel: {
    marginRight: 10,
    fontSize: 16,
    color: '#ffffff',
  },
  toggleBase: {
    width: 80,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  toggleWrapper: {
    marginTop:4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 12,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold', 
    fontWeight: '600',
  },
});

export default DashboardProfile;
