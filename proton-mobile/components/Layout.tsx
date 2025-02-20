import React from "react";
import { useTheme } from "../context/ThemeContext";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        header: {
            height: 60,
            backgroundColor: "#2D9596",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
        },
        headerText: {
            color: theme.secondary,
            fontSize: 18,
            fontWeight: "bold",
        },
        iconButton: {
            padding: 8,
        },
        content: {
            flex: 1,
            padding: 0,
        },
        footer: {
            height: 50,
            backgroundColor: theme.primary,
            justifyContent: "center",
            alignItems: "center",
        },
        footerText: {
            color: theme.secondary,
            fontSize: 14,
        },
    });

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={() => console.log("Menu aberto")}>
                    <Icon name="menu" size={28} color="#FFFFFF" />
                </TouchableOpacity>

                <Text style={styles.headerText}>Proto-On</Text>

                <TouchableOpacity style={styles.iconButton} onPress={() => console.log("Perfil aberto")}>
                    <Icon name="account-circle" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Conteúdo das telas */}
            <View style={styles.content}>{children}</View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>© 2024 Proto-On</Text>
            </View>
        </View>
    );
};

export default Layout;
