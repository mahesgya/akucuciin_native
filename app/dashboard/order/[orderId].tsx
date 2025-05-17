import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Linking } from "react-native";
import OrderApi from "../../api/order.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OrderInterface } from "@/app/interface/order.interface";
import AlertService from "@/app/hooks/alert";
import { AxiosError } from "axios";
import FormatUtils from "@/app/hooks/format";
import { useLocalSearchParams, useRouter } from "expo-router";
import colors from "@/app/constants/colors";

import StatusUtils from "@/app/hooks/color";
import useOrderUpdate from "@/app/hooks/use.order.update";

const OrderDetail = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderInterface>();
  const [status, setStatus] = useState<string>("");
  const [weightInput, setWeightInput] = useState<string>("");
  const [weight, setWeight] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [accessToken, setAccessToken] = useState<string>("");

  const [statusModalVisible, setStatusModalVisible] = useState<boolean>(false);
  const [priceModalVisible, setPriceModalVisible] = useState<boolean>(false);

  const { handleStatusUpdate, handlePriceUpdate, loading } = useOrderUpdate(accessToken, orderId);

  const statusOptions = ["penjemputan", "pencucian", "pengantaran", "selesai"];

  const handleUpdateStatus = async () => {
    await handleStatusUpdate(status, weight, order, setOrder, setStatusModalVisible);
  };

  const handleUpdatePrice = async () => {
    await handlePriceUpdate(price, order, setOrder, setPriceModalVisible);
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          setAccessToken(token);

          const orderData: OrderInterface = await OrderApi.getOrderById(orderId, token);

          setOrder(orderData);
          setStatus(orderData.status);
          setWeight(Number(orderData.weight));
          setPrice(Number(orderData.price));
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

  const handleEditStatusAndWeight = () => {
    setStatusModalVisible(true);
  };

  const handleEditPrice = () => {
    setPriceModalVisible(true);
  };

  if (!order) {
    return (
      <View>
        <Text>Order Tidak Ditemukan</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      {order && (
        <View>
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={require("../../../assets/images/back.png")} />
          </TouchableOpacity>
          <Text style={styles.header}>{order.customer.name}</Text>
          <Text style={styles.headerDate}>{FormatUtils.formatDate(new Date(order.created_at))}</Text>
          <Text style={styles.headerPackage}>{order.package.name}</Text>
          <Text style={styles.headerPrice}>{price !== 0 ? FormatUtils.formatPrice(Number(price)) : "Belum Ada Harga"}</Text>
          <View style={[styles.statusContainer, { backgroundColor: StatusUtils.getStatusColor(order.status) }]}>
            <Text style={[styles.headerStatus, { color: StatusUtils.getTextColor(order.status) }]}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Text>
          </View>

          <View style={styles.detailContainer}>
            <View style={styles.sectionContainer}>
              <View style={styles.row}>
                <Text style={styles.label}>Order ID:</Text>
                <Text style={styles.value}>{order.id}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{order.customer.email}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Tanggal:</Text>
                <Text style={styles.value}>{FormatUtils.formatDate(new Date(order.created_at))}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Telephone:</Text>
                <Text style={styles.value}>{order.customer.telephone}</Text>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.row}>
                <Text style={styles.label}>Maps:</Text>
                <TouchableOpacity onPress={() => Linking.openURL(order.maps_pinpoint)} style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.value,
                      {
                        color: colors.primary,
                        flexWrap: "wrap",
                        flexShrink: 1,
                      },
                    ]}
                    numberOfLines={3}
                  >
                    {order.maps_pinpoint}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Kode Promo:</Text>
                <Text style={styles.value}>{order.coupon_code !== "" ? order.coupon_code : "Tidak Ada Kode Promo"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Paket:</Text>
                <Text style={styles.value}>{order.package.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Note:</Text>
                <Text style={styles.value}>{order.note !== null && order.note !== "" ? order.note : "Tidak Ada Notes"}</Text>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.row}>
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>{order.status}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Pembayaran:</Text>
                <Text style={styles.value}>{order.status_payment}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Total Harga:</Text>
                <Text style={styles.value}>{order.price !== null && order.price !== 0 ? FormatUtils.formatPrice(Number(order.price)) : <Text style={styles.warning}>Belum ada harga</Text>}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Total Berat:</Text>
                <Text style={styles.value}>{order.weight !== null && order.weight !== 0 ? `${order.weight} kg` : <Text style={styles.warning}>Belum ada berat</Text>}</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleEditStatusAndWeight} style={styles.button}>
                <Text style={styles.buttonText}>Edit Status dan Berat</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleEditPrice} style={[styles.button, styles.priceButton]}>
                <Text style={styles.buttonText}>Edit Harga</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Modal animationType="fade" transparent={true} visible={statusModalVisible} onRequestClose={() => setStatusModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Status dan Berat</Text>

                <Text style={styles.inputLabel}>Status:</Text>
                <View style={styles.statusOptions}>
                  {statusOptions.map((option) => (
                    <TouchableOpacity key={option} style={[styles.statusOption, status === option && styles.selectedStatus]} onPress={() => setStatus(option)}>
                      <Text style={[styles.statusText, status === option && styles.selectedStatusText]}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Berat (Kg):</Text>
                <TextInput
                  style={styles.input}
                  value={weightInput}
                  onChangeText={(text) => {
                    if (/^[0-9]*\.?[0-9]*$/.test(text)) {
                      setWeightInput(text); 

                      const parsed = parseFloat(text);
                      if (!isNaN(parsed)) {
                        setWeight(parsed); 
                      } else {
                        setWeight(0);
                      }
                    }
                  }}
                  keyboardType={"numeric"}
                  placeholder="Input berat (Kg)"
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setStatusModalVisible(false)} disabled={loading}>
                    <Text style={styles.buttonText}>Batal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleUpdateStatus} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? "Menyimpan..." : "Simpan"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal animationType="fade" transparent={true} visible={priceModalVisible} onRequestClose={() => setPriceModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Harga</Text>
                <Text style={styles.modalNotes}>Notes: Harga Akan Langsung Terkirim Ke Customer Harap Jangan Melakukan Kesalahan</Text>

                <Text style={styles.inputLabel}>Harga (Rp):</Text>
                <TextInput
                  style={styles.input}
                  value={price !== null ? price.toString() : ""}
                  onChangeText={(text) => {
                    const parsed = parseInt(text, 10);
                    setPrice(isNaN(parsed) ? 0 : parsed);
                  }}
                  keyboardType="numeric"
                  placeholder="Input harga"
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setPriceModalVisible(false)} disabled={loading}>
                    <Text style={styles.buttonText}>Batal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleUpdatePrice} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? "Menyimpan..." : "Simpan"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 70,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: "Montserrat",
    marginBottom: 15,
  },
  headerDate: {
    fontSize: 16,
    color: colors.black_70,
    marginBottom: 4,
    fontFamily: "Montserrat",
  },
  headerPackage: {
    fontSize: 16,
    color: colors.black_70,
    marginBottom: 4,
    fontFamily: "Montserrat",
  },
  headerPrice: {
    fontSize: 16,
    color: colors.selesai,
    position: "absolute",
    right: 8,
    top: 100,
    marginBottom: 4,
    fontFamily: "Montserrat",
  },
  statusContainer: {
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 7,
    maxWidth: 140,
    marginTop: 8,
  },
  headerStatus: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 0.1, height: 0.1 },
    textShadowRadius: 1,
    fontFamily: "Montserrat",
  },
  detailContainer: {
    marginTop: 20,
  },
  sectionContainer: {
    gap: 10,
    backgroundColor: colors.background,
    shadowColor: "#000",
    borderRadius: 10,
    padding: 10,
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    textAlign: "left",
    color: colors.black_60,
    fontFamily: "Montserrat",
    fontSize: 14,
  },
  value: {
    textAlign: "right",
    color: colors.black_70,
    fontFamily: "Montserrat",
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    fontFamily: "Montserrat",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    marginTop: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  priceButton: {
    backgroundColor: colors.selesai,
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "Montserrat",
    fontWeight: "semibold",
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    fontFamily: "Montserrat",
    color: colors.primary,
  },
  modalNotes: {
    fontSize: 12,
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Montserrat",
    color: colors.batal,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: "Montserrat",
    color: colors.black_70,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: colors.batal,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  statusOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  statusOption: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    width: "48%",
    alignItems: "center",
  },
  selectedStatus: {
    borderColor: colors.primary,
    backgroundColor: "rgba(87, 143, 202, 0.1)",
  },
  statusText: {
    fontFamily: "Montserrat",
    color: colors.black_70,
  },
  selectedStatusText: {
    color: colors.primary,
    fontWeight: "bold",
  },
  warning: {
    color: "#FFA500",
    fontStyle: "italic",
    fontWeight: "500",
    fontSize: 12,
  },
});

export default OrderDetail;
