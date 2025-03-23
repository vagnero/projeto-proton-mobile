import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter, useSegments } from "expo-router"; // Importação do router para controle de navegação

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const segments: string[] = ['home', 'login', 'otherPage']; // exemplo de valor
    const [menuVisible, setMenuVisible] = useState(false);

    const currentYear = new Date().getFullYear();


    const isHomeOrLogin = segments.includes("home") || segments.includes("login");


    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        header: {
            minHeight: 50,
            paddingTop: 0,
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
        iconButton: {
            padding: 8,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
        },
        menuContainer: {
            position: "absolute",
            right: 10,
            top: 40,
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 10,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
        },
        menuItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            paddingHorizontal: 15,
        },
        menuText: {
            marginLeft: 10,
            fontSize: 16,
            color: "#333",
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

    interface ProfileMenuProps {
        visible: boolean;
        onClose: () => void;
    }

    const ProfileMenu: React.FC<ProfileMenuProps> = ({ visible, onClose }) => {
        return (
            <Modal transparent={true} visible={visible} animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} onPress={onClose} />
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Ver Perfil")}>
                        <Icon name="person" size={24} color="#333" />
                        <Text style={styles.menuText}>Ver Perfil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
                        <Icon name="brightness-6" size={24} color="#333" />
                        <Text style={styles.menuText}>Mudar Tema</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Configurações")}>
                        <Icon name="settings" size={24} color="#333" />
                        <Text style={styles.menuText}>Configurações</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Sair")}>
                        <Icon name="exit-to-app" size={24} color="red" />
                        <Text style={[styles.menuText, { color: "red" }]}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconButton}
                        onPress={() => console.log("Menu aberto")}
                    >
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

                    <TouchableOpacity style={styles.iconButton}
                        onPress={() => setMenuVisible(true)}
                    >
                        <Icon name="account-circle" size={28} color={theme.secondary} />
                    </TouchableOpacity>
                    <ProfileMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
                </View>
            </View>


            <View style={styles.content}>
                {children}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>© {currentYear} Proto-On</Text>
            </View>
        </View>
    );
};

export default Layout;
