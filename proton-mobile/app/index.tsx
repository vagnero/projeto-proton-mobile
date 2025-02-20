import { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";

export default function SplashScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/login"); // Redireciona para login
    }, 2000);
  }, []);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 30,
      color: theme.primary,
      marginVertical:30,
    },
    text: {
      fontSize: 20,
      color: theme.primary,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem Vindo</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}


