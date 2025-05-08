import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, Platform, StatusBar } from "react-native";
import { colors } from "../constants/colors";
import { Feather } from "@expo/vector-icons";

import OrderApi from "../api/order.api";
import OrderItem from "../ui/card/order.card";
import AlertService from "../hooks/alert";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { OrderInterface } from "../interface/order.interface";
import { AxiosError } from "axios";
import MonthFilter from "../ui/filter/month.filter";

const DashboardOrder = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [orders, setOrders] = useState<OrderInterface[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const months = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];

  const monthOptions = months.map((month, index) => ({
    label: month,
    value: index,
  }));

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

  const handleMonthSelect = (month: number | null) => {
    setSelectedMonth(month);
  };

  const formatMonths = (): string => {
    if (selectedMonth === null) {
      return "SEMUA BULAN " + currentYear;
    }
    return `${months[selectedMonth]} ${currentYear}`;
  };

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at);

    const matchesSearch = searchText === "" || order.customer.name.toLowerCase().includes(searchText.toLowerCase()) || order.package.name.toLowerCase().includes(searchText.toLowerCase());

    let matchesDate = true;
    if (selectedMonth !== null) {
      matchesDate = orderDate.getMonth() === selectedMonth && orderDate.getFullYear() === currentYear;
    }

    return matchesSearch && matchesDate;
  });

  const handleDetailOrder = async (orderId: string) => {};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>RIWAYAT PESANAN</Text>
        <Text style={styles.headerDate}>{formatMonths()}</Text>
      </View>
      <>
        <View style={styles.filterBarContainer}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color={colors.black_40} style={styles.searchIcon} />
            <TextInput style={styles.searchInput} placeholder="Search" value={searchText} onChangeText={setSearchText} placeholderTextColor={colors.black_40} />
          </View>

          <MonthFilter options={monthOptions} selectedMonth={selectedMonth} onSelectMonth={handleMonthSelect} />
        </View>
        {filteredOrders.length > 0 ? (
          <View style={styles.ordersContainer}>
            <FlatList
              data={filteredOrders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <OrderItem order={item} onActionPress={() => handleDetailOrder(item.id)} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.ordersList}
            />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak Ada Order yang Tersedia</Text>
          </View>
        )}
      </>
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
    fontFamily: "Montserrat",
  },
  headerDate: {
    fontSize: 14,
    color: colors.black_60,
    marginTop: 5,
    fontFamily: "Montserrat",
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
  ordersContainer: {
    flex: 1,
  },
  ordersList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderRadius: 16,
    margin: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "Montserrat",
  },
});

export default DashboardOrder;
