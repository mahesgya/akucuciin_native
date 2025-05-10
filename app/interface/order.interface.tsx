import React from 'react';
import { View, Text } from 'react-native';

export interface Customer {
    id: string;
    name: string;
    email: string;
    address: string;
    telephone: string;
}

export interface LaundryPartner {
    id: string;
    name: string;
    email: string;
    address: string;
    city: string;
    area: string;
    telephone: string;
    maps_pinpoint: string;
}

export interface Package {
    id: string;
    name: string;
    price_text: string;
    description: string;
}

export interface Driver {
    id: string | null;
    name: string | null;
    email: string | null;
    telephone: string | null;
}

export interface OrderInterface {
    id: string;
    content: string;
    status: string;
    status_payment: string;
    maps_pinpoint: string;
    weight: number | null;
    price: number | null;
    coupon_code: string;
    referral_code: string | null;
    created_at: string;
    note: string | null;
    rating: number;
    review: string;
    pickup_date: string | null;
    customer: Customer;
    laundry_partner: LaundryPartner;
    package: Package;
    driver: Driver;
}

const OrderInterfaceScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Order Interface Screen</Text>
      <Text>This is a placeholder component to satisfy router requirements.</Text>
    </View>
  );
};

export default OrderInterfaceScreen;