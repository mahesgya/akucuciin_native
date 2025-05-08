import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import OrderApi from "../../api/order.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OrderInterface } from "@/app/interface/order.interface";
import AlertService from "@/app/hooks/alert";
import { AxiosError } from "axios";
import { formatDate } from "@/app/hooks/format.date";
import { useLocalSearchParams, useRouter } from "expo-router";

const OrderDetail = () => {
  const router = useRouter();

  const { orderId } = useLocalSearchParams<{orderId : string}>()

  const [order, setOrder] = useState<OrderInterface>();
  const [status, setStatus] = useState<string>("");
  const [weight, setWeight] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        setAccessToken(token);
        if (token) {
          const orderData: OrderInterface[] = await OrderApi.getOrderById(orderId, token);

          setOrder(orderData[0]);
          setStatus(orderData[0].status);
          setWeight(orderData[0].weight);
          setPrice(orderData[0].price);
        } else {
          AlertService.error("Tidak ada token", "Token tidak ditemukan.");
        }
      } catch (error) {
        const err = error as AxiosError<any>;
        const message = err.response?.data?.errors || "Terjadi kesalahan, coba lagi.";
        AlertService.error("Gagal Mendapatkan data order detail", message);
      }
    };

    fetchOrderDetail();
  }, [orderId, accessToken]);

  const handleEditStatusAndBerat = () => {};

  const handleEditHarga = () => {};

  if (!order) {
    <View>
      <Text>Order Tidak Ditemukan</Text>
    </View>;
  }

  return (
    <View style={styles.container}>
      {order && (
        <View>
          <Text style={styles.header}>{order.customer.name}</Text>
          <Text>{formatDate(new Date(order.created_at))}</Text>
          <Text>{order.package.name}</Text>
          <Text>{order.note}</Text>

          <View style={styles.detailContainer}>
            <Text>Order ID: {order.id}</Text>
            <Text>Email: {order.customer.email}</Text>
            <Text>Telephone: {order.customer.email}</Text>

            <TouchableOpacity onPress={handleEditStatusAndBerat} style={styles.button}>
              <Text>Edit Status dan Berat</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleEditHarga} style={styles.button}>
              <Text>Edit Harga</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  detailContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    padding: 5,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    marginTop: 10,
    alignItems: "center",
  },
});

export default OrderDetail;
