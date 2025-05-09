import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from "react-native";
import OrderApi from "../../api/order.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OrderInterface } from "@/app/interface/order.interface";
import AlertService from "@/app/hooks/alert";
import { AxiosError } from "axios";
import { formatDate } from "@/app/hooks/format";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors } from "@/app/constants/colors";

const OrderDetail = () => {
  const router = useRouter();

  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const [order, setOrder] = useState<OrderInterface>();
  const [status, setStatus] = useState<string>("");
  const [weight, setWeight] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [statusModalVisible, setStatusModalVisible] = useState<boolean>(false);
  const [priceModalVisible, setPriceModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const statusOptions = ["penjemputan", "pencucian", "pengantaran", "selesai"];

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        setAccessToken(token);
        if (token) {
          const orderData: OrderInterface[] = await OrderApi.getOrderById(orderId, token);
          const currentOrder = orderData[0];

          setOrder(currentOrder);
          setStatus(currentOrder.status);
          setWeight(Number(currentOrder.weight));
          setPrice(Number(currentOrder.price));
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

  const handleEditStatusAndBerat = () => {
    setStatusModalVisible(true);
  };

  const handleEditHarga = () => {
    setPriceModalVisible(true);
  };

  const handleStatusUpdate = async () => {
    if (!accessToken || !orderId) {
      AlertService.error("Error", "Token atau Order ID tidak ditemukan");
      return;
    }

    setLoading(true);

    try {
      const formData = {
        status: status,
        weight: weight,
      };

      await OrderApi.updateStatusOrder(formData, orderId, accessToken);

      if (order) {
        setOrder({
          ...order,
          status: status,
          weight: weight,
        });
      }

      setStatusModalVisible(false);
      AlertService.success("Success", "Berhasil Memperbarui Status dan Berat");
    } catch (error) {
      console.log(error);
      const err = error as AxiosError<any>;
      const message = err.response?.data?.errors || "Gagal Memperbarui Status dan Berat";
      AlertService.error("Failed", message);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceUpdate = async () => {
    if (!accessToken || !orderId) {
      AlertService.error("Error", "Token atau Order ID tidak ditemukan");
      return;
    }

    setLoading(true);
    try {
      const formData = {
        price: price,
      };

      console.log(formData);
      await OrderApi.updatePriceOrder(formData, orderId, accessToken);

      if (order) {
        setOrder({
          ...order,
          price: price,
        });
      }

      setPriceModalVisible(false);
      AlertService.success("Success", "Harga Berhasil di Perbarui");
    } catch (error) {
      const err = error as AxiosError<any>;
      const message = err.response?.data?.errors || "Gagal Memperbarui Harga";
      AlertService.error("Failed", message);
    } finally {
      setLoading(false);
    }
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
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {order && (
        <View>
          <Text style={styles.header}>{order.customer.name}</Text>
          <Text style={styles.headerDate}>{formatDate(new Date(order.created_at))}</Text>
          <Text style={styles.headerPackage}>{order.package.name}</Text>
          <Text style={styles.headerPrice}>{order.price ? `Rp${order.price}` : "Belum Input Harga"}</Text>

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
                <Text style={styles.value}>{formatDate(new Date(order.created_at))}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Telephone:</Text>
                <Text style={styles.value}>{order.customer.telephone}</Text>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.row}>
                <Text style={styles.label}>Maps:</Text>
                <Text style={styles.value}>{order.maps_pinpoint}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Kode Promo:</Text>
                <Text style={styles.value}>{order.coupon_code}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Paket:</Text>
                <Text style={styles.value}>{order.package.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Note:</Text>
                <Text style={styles.value}>{order.note}</Text>
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
                <Text style={styles.value}>Rp{order.price}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Total Berat:</Text>
                <Text style={styles.value}>{order.weight} Kg</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleEditStatusAndBerat} style={styles.button}>
                <Text style={styles.buttonText}>Edit Status dan Berat</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleEditHarga} style={[styles.button, styles.priceButton]}>
                <Text style={styles.buttonText}>Edit Harga</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Modal animationType="slide" transparent={true} visible={statusModalVisible} onRequestClose={() => setStatusModalVisible(false)}>
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
                  value={weight !== null ? weight.toString() : ""}
                  onChangeText={(text) => {
                    const parsed = parseInt(text, 10);
                    setWeight(isNaN(parsed) ? null : parsed);
                  }}
                  keyboardType="numeric"
                  placeholder="Input berat (Kg)"
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setStatusModalVisible(false)} disabled={loading}>
                    <Text style={styles.buttonText}>Batal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleStatusUpdate} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? "Menyimpan..." : "Simpan"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal animationType="slide" transparent={true} visible={priceModalVisible} onRequestClose={() => setPriceModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Harga</Text>

                <Text style={styles.inputLabel}>Harga (Rp):</Text>
                <TextInput
                  style={styles.input}
                  value={price !== null ? price.toString() : ""}
                  onChangeText={(text) => {
                    const parsed = parseInt(text, 10);
                    setPrice(isNaN(parsed) ? null : parsed);
                  }}
                  keyboardType="numeric"
                  placeholder="Input harga"
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setPriceModalVisible(false)} disabled={loading}>
                    <Text style={styles.buttonText}>Batal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handlePriceUpdate} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? "Menyimpan..." : "Simpan"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
    fontSize: 20,
    color: colors.selesai,
    position: "absolute",
    right: 20,
    top: 50,
    marginBottom: 4,
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
    fontSize: 10,
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
    color: "#fff",
    fontFamily: "Montserrat",
    fontWeight: "bold",
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
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Montserrat",
    color: colors.primary,
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
    backgroundColor: "#ccc",
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
});

export default OrderDetail;
