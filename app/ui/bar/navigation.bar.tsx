import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import {useRouter, usePathname} from "expo-router";


const NavigationBar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const icons = {
        home: {
          white: require('../../../assets/images/home.white.png'),
          blue: require('../../../assets/images/home.blue.png'),
        },
        history: {
          white: require('../../../assets/images/history.white.png'),
          blue: require('../../../assets/images/history.blue.png'),
        },
        profile: {
          white: require('../../../assets/images/profile.white.png'),
          blue: require('../../../assets/images/profile.blue.png'),
        },
      } as const;

      type TabKey = keyof typeof icons; 

      const tabs: {
        name: string;
        icon: TabKey;
        href: '/dashboard/home' | '/dashboard/order' | '/dashboard/profile';
      }[] = [
        { name: 'Home', icon: 'home', href: '/dashboard/home' },
        { name: 'Order', icon: 'history', href: '/dashboard/order' },
        { name: 'Profile', icon: 'profile', href: '/dashboard/profile' },
      ];


    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                const imageSource = isActive
                ? icons[tab.icon].blue
                : icons[tab.icon].white;

                return (
                    <TouchableOpacity key={tab.name} onPress={() => router.push(tab.href)}>
                            <Image source={imageSource} style={styles.icon} />
                    </TouchableOpacity>
                );
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#3674B5',
        opacity: 0.9,
        paddingVertical: 7,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    icon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    button: {
        alignItems: 'center',
    },
})

export default NavigationBar;