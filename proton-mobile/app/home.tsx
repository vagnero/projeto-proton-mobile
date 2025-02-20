import { useTheme } from "../context/ThemeContext";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const HomeScreen = () => {
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
      fontSize: 20,
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
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/reclamacoes")}
      >
        <Text style={[styles.text, { color: theme.secondary }]}>Abrir uma Reclamação</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/consultar")} 
      >
        <Text style={[styles.text, { color: theme.secondary }]}>Consultar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/login")}
      >
        <Text style={[styles.text, { color: theme.secondary }]}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
