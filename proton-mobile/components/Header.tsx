import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ProfileMenu = ({ visible, onClose }) => {
    return (
        <Modal transparent={true} visible={visible} animationType="fade">
            <TouchableOpacity style={styles.modalOverlay} onPress={onClose} />
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Ver Perfil")}>
                    <Icon name="person" size={24} color="#333" />
                    <Text style={styles.menuText}>Ver Perfil</Text>
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

export default function Header() {
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <View style={styles.header}>
            {/* Ícone de perfil */}
            <TouchableOpacity style={styles.iconButton} onPress={() => setMenuVisible(true)}>
                <Icon name="account-circle" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Menu de perfil */}
            <ProfileMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: "#6200ea",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingHorizontal: 16,
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
        right: 20,
        top: 60,
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
});
