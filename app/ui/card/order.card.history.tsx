import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { colors } from "../../constants/colors";
import { OrderInterface } from "@/app/interface/order.interface";
import { formatDate } from "@/app/hooks/format";
import { getStatusColor, getTextColor } from "@/app/hooks/color";

interface OrderItemProps {
  order: OrderInterface;
  onActionPress: (id: string) => void;
}

const OrderCardHome: React.FC<OrderItemProps> = ({ order, onActionPress }) => {
  const defaultIcon = require("../../../assets/images/LogoAkucuciin2.png");

  return (
    <TouchableOpacity style={styles.container} onPress={() => onActionPress(order.id)}>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Image source={defaultIcon} style={styles.icon} resizeMode="contain" />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.orderName}>{order.customer.name}</Text>
          <Text style={styles.orderDetails}>
            {order.package.name} - {order.package.price_text}
          </Text>
          <Text style={styles.orderDate}>{formatDate(new Date(order.created_at))}</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={[styles.statusText, { color: getTextColor(order.status) }]}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
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
    fontWeight: "700",
  },
  orderDate: {
    fontSize: 10,
    color: colors.black_40,
    marginBottom: 4,
    fontFamily: "Montserrat",
  },
  orderDetails: {
    fontSize: 10,
    color: colors.black_60,
    marginBottom: 4,
    fontFamily: "Montserrat",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    paddingHorizontal: 8,
    minWidth: 90,
    borderRadius: 7,
  },
  statusText: {
    fontSize: 10,
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 0.1, height: 0.1 },
    textShadowRadius: 1,
    fontFamily: "Montserrat",
  },
});

export default OrderCardHome;
