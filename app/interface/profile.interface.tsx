import React from 'react';
import { View, Text } from 'react-native';

export interface LaundryProfile {
  id: string;
  name: string;
  email: string;
  description: string;
  telephone: string;
  address: string;
  maps_pinpoint: string;
  city: string;
  area: string;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
}

const LaundryInterfaceScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Laundry Interface Screen</Text>
      <Text>This is a placeholder component to satisfy router requirements.</Text>
    </View>
  );
};

export default LaundryInterfaceScreen;