import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, StatusBar } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Header() {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const navigation = useNavigation();

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: () => navigation.navigate("Login") }
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.headerCtn}>
            <Text style={styles.logo}>WhatsApp</Text>
            <View style={styles.iconCtn}>
                <Feather name="camera" size={24} color="white" />
                <TouchableOpacity onPress={() => setIsMenuVisible(!isMenuVisible)}>
                    <Feather name="more-vertical" size={24} color="white" />
                </TouchableOpacity>
            </View>
            {isMenuVisible && (
                <View style={styles.menu}>
                    <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
                        <MaterialIcons name="logout" size={20} color="#333" />
                        <Text style={styles.menuItemText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        color: "white",
        fontSize: 40,
        fontWeight: "bold",
    },
    headerCtn: {
        paddingTop: 40,
        marginTop: StatusBar.currentHeight,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    iconCtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
    },
    menu: {
        position: "absolute",
        top: 80,
        right: 20,
        backgroundColor: "white",
        borderRadius: 8,
        paddingVertical: 10,
        width: 150,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 999,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    menuItemText: {
        fontSize: 16,
        color: "#333",
        marginLeft: 10,
    },
});
