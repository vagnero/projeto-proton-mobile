import { useTheme } from "../context/ThemeContext";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const Reclamacoes = () => {
    const router = useRouter();
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.background,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        text: {
            fontSize: 30,
            marginVertical: 50,
            color: theme.text,
        },
        button: {
            backgroundColor: theme.primary,
            minWidth: 150,
            paddingVertical: 12,
            paddingHorizontal: 20,
            marginVertical: 10,
            borderRadius: 10,
            alignItems: "center",
        },
        buttonText: {
            fontSize: 20,
            color: theme.secondary,
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Tela de Reclamações</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.replace("/home")}
            >
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Reclamacoes;
