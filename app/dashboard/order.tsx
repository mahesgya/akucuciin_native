import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, Platform, StatusBar } from "react-native";
import { colors } from "../constants/colors";
import { Feather } from "@expo/vector-icons";

import OrderApi from "../api/order.api";
import OrderCardHistory from "../ui/card/order.card.history";
import AlertService from "../hooks/alert";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { OrderInterface } from "../interface/order.interface";
import { AxiosError } from "axios";
import MonthFilter from "../ui/filter/month.filter";
import YearFilter from "../ui/filter/year.filter";

const DashboardOrder = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [orders, setOrders] = useState<OrderInterface[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

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

  const formatMonthYear = (): string => {
    if (selectedMonth === null) {
      return `Semua Bulan ${selectedYear}`;
    }
    return `${months[selectedMonth]} ${selectedYear}`;
  };

  const handleMonthSelect = (month: number | null) => {
    setSelectedMonth(month);
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
  };

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at);
    const matchesSearch = searchText === "" || order.customer.name.toLowerCase().includes(searchText.toLowerCase()) || order.package.name.toLowerCase().includes(searchText.toLowerCase());

    let matchesDate = true;
    if (selectedMonth === null) {
      matchesDate = orderDate.getFullYear() === selectedYear;
    } else {
      matchesDate = orderDate.getMonth() === selectedMonth && orderDate.getFullYear() === selectedYear;
    }

    return matchesSearch && matchesDate;
  });

  const handleDetailOrder = async (orderId: string) => {
    // Implementasi navigasi ke detail order
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerTitle}>RIWAYAT PESANAN</Text>
          <Text style={styles.headerDate}>{formatMonthYear()}</Text>
        </View>
        <View style={styles.yearFilter}>
          <YearFilter selectedYear={selectedYear} onSelectYear={handleYearSelect} startYear={2020} endYear={new Date().getFullYear()} />
        </View>
      </View>
      <>
        <View style={styles.filterBarContainer}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color={colors.black_40} style={styles.searchIcon} />
            <TextInput style={styles.searchInput} placeholder="Search" value={searchText} onChangeText={setSearchText} placeholderTextColor={colors.black_40} />
          </View>

          <View style={styles.filtersRow}>
            <MonthFilter options={monthOptions} selectedMonth={selectedMonth} onSelectMonth={handleMonthSelect} />
          </View>
        </View>

        {filteredOrders.length > 0 ? (
          <View style={styles.ordersContainer}>
            <FlatList
              data={filteredOrders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <OrderCardHistory order={item} onActionPress={() => handleDetailOrder(item.id)} />}
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
  yearFilter: {
    position: "absolute",
    right: 16,
    top: 20,
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
  filtersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
