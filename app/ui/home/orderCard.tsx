import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { colors } from "../../constants/colors";
import { OrderInterface } from "@/app/interface/order.interface";

interface OrderItemProps {
  order: OrderInterface;
  onActionPress: (id: string) => void;
}

const formatTime = (date: Date): string => {

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};


const OrderItem: React.FC<OrderItemProps> = ({ order, onActionPress }) => {
  const defaultIcon = require("../../../assets/images/LogoAkucuciin2.png");

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Image source={defaultIcon} style={styles.icon} resizeMode="contain" />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.orderName}>
            {order.customer.name} <Text style={styles.orderTime}>- {formatTime(new Date(order.created_at))}</Text>
          </Text>
          <Text style={styles.orderDetails}>
            {order.package.name} - {order.package.price_text}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.statusContainer} onPress={() => onActionPress(order.id)}>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={[styles.statusText, { color: getTextColor(order.status) }]}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "selesai":
      return colors.selesai;
    case "pencucian":
      return colors.pencucian;
    case "penjemputan":
      return colors.penjemputan;
    case "pengantaran":
      return colors.primary;
    case "batal":
      return colors.batal;
    case "pending":
      return colors.pending;
    default:
      return colors.kesalahan;
  }
};

const getTextColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "pending":
      return colors.white;
    case "kesalahan":
      return colors.black_60;
    default:
      return colors.white;
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 10    ,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    backgroundColor: "#ffffff",
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    width: 30,
    height: 30,
  },
  detailsContainer: {
    flex: 1,
  },
  orderName: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 4,
    fontFamily: "Montserrat",
    fontWeight: '700'
  },
  orderTime: {
    fontSize: 10,
    color: colors.black_40,
    marginBottom: 4,
    fontFamily: "Montserrat"
  },
  orderDetails: {
    fontSize: 10,
    color: colors.black_60,
    marginBottom: 4,
    fontFamily: "Montserrat"
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    paddingHorizontal: 8,
    minWidth: 100,
    borderRadius: 7,
  },
  statusText: {
    fontSize: 10,
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 0.1, height: 0.1 },
    textShadowRadius: 1,
    fontFamily: "Montserrat"
  },
});

export default OrderItem;
