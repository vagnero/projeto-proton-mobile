import React from "react";
import { useTheme } from "../context/ThemeContext";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter, useSegments } from "expo-router"; // Importação do router para controle de navegação

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { theme } = useTheme();
    const router = useRouter();
    const segments = useSegments(); // Obtém a rota atual

    const isHomeOrLogin = segments.includes("home") || segments.includes("login");

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        header: {
            height: 30,
            paddingTop: 20,
            backgroundColor: theme.primary,
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
        backButton: {
            width: 30,  // Aumenta a área de toque da seta
            alignItems: "center",
            paddingVertical: 5,
        },
        backContainer: {
            position: "absolute",
            top: 3,
            left: 80,
            backgroundColor: "transparent",
            minHeight: 45, // Garante que o espaço sempre exista
            justifyContent: "center",
        },
        content: {
            flex: 1,
            paddingTop: 20,
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
            <View>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => console.log("Menu aberto")}>
                        <Icon name="menu" size={28} color={theme.secondary} />
                    </TouchableOpacity>

                    {!isHomeOrLogin && (
                        <View style={styles.backContainer}>
                            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                                <Icon name="arrow-back" size={28} color={theme.secondary} />
                            </TouchableOpacity>
                        </View>
                    )}
                    <Text style={styles.headerText}>Proto-On</Text>

                    <TouchableOpacity style={styles.iconButton} onPress={() => console.log("Perfil aberto")}>
                        <Icon name="account-circle" size={28} color={theme.secondary} />
                    </TouchableOpacity>
                </View>
            </View>


            <View style={styles.content}>
                {children}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>© 2024 Proto-On</Text>
            </View>
        </View>
    );
};

export default Layout;
