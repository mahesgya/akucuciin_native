import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/app/constants/colors";

type HeaderHomeProps = {
    title : string;
    totalAmount?: number;
}

const HeaderHome: React.FC<HeaderHomeProps> = ( {title, totalAmount} ) => {
    return(
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.title}> {title} </Text>
            </View>

            {totalAmount && (
            <View style={styles.amountContainer}>
                <Text style={styles.amountText}>Rp{totalAmount}</Text>
            </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    topContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.primary,
    },
    amountContainer: {
        marginTop: 5,
    },
    amountText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.selesai,
    },
})

export default HeaderHome;
