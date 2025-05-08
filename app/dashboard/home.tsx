import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, Platform, StatusBar } from "react-native";
import { colors } from "../constants/colors";
import { Feather } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

import OrderApi from "../api/order.api";
import OrderItem from "../ui/home/orderCard";
import StatusFilter from "../ui/home/statusFilter";
import AlertService from "../hooks/alert";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { OrderInterface } from "../interface/order.interface";
import { AxiosError } from "axios";

const statusOptions = [
  { label: "Penjemputan", value: "penjemputan", color: colors.penjemputan },
  { label: "Pencucian", value: "pencucian", color: colors.pencucian },
  { label: "Pengantaran", value: "pengantaran", color: colors.pencucian },
  { label: "Selesai", value: "selesai", color: colors.selesai },
  { label: "Kesalahan", value: "kesalahan", color: colors.kesalahan },
];

const DashboardHome = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderInterface[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        setAccessToken(token);

        if (token) {
          const response: OrderInterface[] = await OrderApi.getOrderByLaundry(token); 
          setOrders(response);
        } else {
          AlertService.error("Tidak ada token", "Token tidak ditemukan.");
        }
      } catch (error) {
        const err = error as AxiosError<any>;
        const message = err.response?.data?.errors || "Terjadi kesalahan, coba lagi.";
        AlertService.error("Gagal Mendapatkan data order", message);
      }
    };

    fetchOrders();
  }, [accessToken]);

  const formatDate = (date: Date): string => {
    const days = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
    const months = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];

    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = searchText === "" || order.customer.name.toLowerCase().includes(searchText.toLowerCase()) || order.package.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = selectedStatus === null || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>PESANAN</Text>
        <Text style={styles.headerDate}>{formatDate(selectedDate).toUpperCase()}</Text>
      </View>

      {showCalendar ? (
        <View style={{ flex: 1 }}>
          <Calendar
            onDayPress={(day: any) => {
              const selected = new Date(day.dateString);
              handleDateSelect(selected);
            }}
            markedDates={{
              [selectedDate ? selectedDate.toISOString().split("T")[0] : ""]: {
                selected: true,
                selectedColor: "blue",
              },
            }}
            current={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
          />
        </View>
      ) : (
        <>
          <View style={styles.filterBarContainer}>
            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color={colors.black_40} style={styles.searchIcon} />
              <TextInput style={styles.searchInput} placeholder="Search" value={searchText} onChangeText={setSearchText} placeholderTextColor={colors.black_40} />
            </View>

            <StatusFilter options={statusOptions} selectedStatus={selectedStatus} onSelectStatus={setSelectedStatus} />
          </View>

          <View style={styles.ordersContainer}>
            <FlatList data={filteredOrders} keyExtractor={(item) => item.id} renderItem={({ item }) => <OrderItem order={item} />} showsVerticalScrollIndicator={false} contentContainerStyle={styles.ordersList} />
          </View>
        </>
      )}

      <TouchableOpacity style={styles.calendarButton} onPress={() => setShowCalendar(!showCalendar)}>
        <Feather name={showCalendar ? "x" : "calendar"} size={24} color={colors.primary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: "Montserrat"
  },
  headerDate: {
    fontSize: 14,
    color: colors.black_60,
    marginTop: 5,
    fontFamily: "Montserrat"
  },
  weekDaysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  weekDayItem: {
    alignItems: "center",
    width: 35,
  },
  weekDayText: {
    fontSize: 10,
    color: colors.black_60,
    marginBottom: 5,
  },
  weekDayNumber: {
    width: 25,
    height: 25,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedWeekDay: {
    backgroundColor: colors.primary,
  },
  weekDayNumberText: {
    fontSize: 12,
    color: colors.black_70,
  },
  selectedWeekDayText: {
    color: "#fff",
    fontWeight: "bold",
  },
  filterBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: colors.black,
  },
  calendarContainer: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 10,
    elevation: 5,
    borderRadius: 10,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calendarButton: {
    position: "absolute",
    right: 16,
    bottom: 20,
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ordersContainer: {
    flex: 1,
  },
  ordersList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: 80,
  },
});

export default DashboardHome;
