import { useState } from "react";
import { AxiosError } from "axios";
import AlertService from "./alert";
import OrderApi from "../api/order.api";

export const useOrderUpdate = (accessToken: string, orderId: string) => {
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (status: string, weight: number, order: any, setOrder: React.Dispatch<React.SetStateAction<any>>, setStatusModalVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
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
      const err = error as AxiosError<any>;
      const message = err.response?.data?.errors || "Gagal Memperbarui Status dan Berat";
      AlertService.error("Failed", message);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceUpdate = async (price: number, order: any, setOrder: React.Dispatch<React.SetStateAction<any>>, setPriceModalVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!accessToken || !orderId) {
      AlertService.error("Error", "Token atau Order ID tidak ditemukan");
      return;
    }

    setLoading(true);

    try {
      const formData = {
        price: price,
      };

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

  return {
    handleStatusUpdate,
    handlePriceUpdate,
    loading,
  };
};
